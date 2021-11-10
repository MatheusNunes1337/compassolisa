const request = require('supertest');

const app = require('../../src/index');
const UserModel = require('../../src/app/models/UserModel');

beforeAll(async () => {
    await UserModel.deleteMany();
  });
  
  beforeEach(async () => {
    await UserModel.deleteMany();
  });


describe('user', () => {
    it('should create a new user', async() => {
        const userMock = {
            nome: "Marina",
            cpf: "081.163.313-15",
            data_nascimento: "29/10/2002",
            email: "marina2022@outlook.com",
            senha: "123456",
            habilitado: "sim"
        }

        const response = await request(app)
        .post('/api/v1/people/')
        .send(userMock)

        const {body, status} = response
        expect(status).toBe(201)

        expect(body).toHaveProperty('_id')
        expect(body.nome).toBe(userMock.nome)
        expect(body.cpf).toBe(userMock.cpf)
        expect(body.data_nascimento).toBe(userMock.data_nascimento)
        expect(body.email).toBe(userMock.email)
        expect(body.habilitado).toBe(userMock.habilitado)

    })

    it('should not create a user with a existing cpf', async() => {
      await UserModel.create({
          nome: "Travis",
          cpf: "081.163.313-15",
          data_nascimento: "18/04/1996",
          email: "travis09@outlook.com",
          senha: "123456",
          habilitado: "não"
      })

      const userMock = {
          nome: "John Doe",
          cpf: "081.163.313-15",
          data_nascimento: "18/04/1995",
          email: "johndoe@outlook.com",
          senha: "123456",
          habilitado: "sim"
      }

      const response = await request(app)
      .post('/api/v1/people/')
      .send(userMock)

      const {body, status} = response
      expect(status).toBe(400)

      expect(body.description).toBe('Conflict')
      expect(body.name).toBe(`CPF ${userMock.cpf} already in use`)
      
  })

  it('should not create a user with a existing email', async() => {
    await UserModel.create({
        nome: "Joana Maria",
        cpf: "013.650.291-03",
        data_nascimento: "12/09/1991",
        email: "joana@outlook.com",
        senha: "123456",
        habilitado: "não"
    })

    const userMock = {
        nome: "Joana Fernandes",
        cpf: "031.904.514-04",
        data_nascimento: "11/11/1997",
        email: "joana@outlook.com",
        senha: "1234567",
        habilitado: "sim"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {body, status} = response
    expect(status).toBe(400)

    expect(body.description).toBe('Conflict')
    expect(body.name).toBe(`Email ${userMock.email} already in use`)
    
  })

  it('should not create a user under 18', async() => {

    const userMock = {
        nome: "Júlia Riter",
        cpf: "091.123.896-01",
        data_nascimento: "14/12/2004",
        email: "juliariter@outlook.com",
        senha: "123456",
        habilitado: "sim"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {body, status} = response
    expect(status).toBe(400)

    expect(body.description).toBe('data_nascimento')
    expect(body.name).toBe('You must be over 18')
    
  })

  it('should not create a user with invalid email format', async() => {

    const userMock = {
        nome: "Matheus Cardoso",
        cpf: "104.018.561-04",
        data_nascimento: "14/12/1998",
        email: "matheus",
        senha: "123456",
        habilitado: "sim"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {body, status} = response
    expect(status).toBe(400)

    expect(body.description).toBe('email')
    expect(body.name).toBe('\"email\" must be a valid email')
    
  })

  it('should not create a user with blank field', async() => {

    const userMock = {
        nome: "",
        cpf: "104.018.561-04",
        data_nascimento: "14/11/1997",
        email: "jorge@gmail.com",
        senha: "123456",
        habilitado: "sim"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {body, status} = response
    expect(status).toBe(400)

    expect(body.description).toBe('nome')
    expect(body.name).toBe('\"nome\" is not allowed to be empty')
    
  })

  it('should get all users', async() => {
    const userMock = {
      nome: "Cristiano Ronaldo",
      cpf: "111.209.345-01",
      data_nascimento: "12/05/1981",
      email: "cristiano7@gmail.com",
      senha: "123456",
      habilitado: "sim"
    }

    await UserModel.create(userMock)

    const response = await request(app)
    .get('/api/v1/people/')

    const {body, status} = response
    const {pessoas} = body
    expect(status).toBe(200)

    expect(pessoas).toHaveLength(1)
    expect(pessoas[0].nome).toBe(userMock.nome)
    expect(pessoas[0].cpf).toBe(userMock.cpf)
    expect(pessoas[0].data_nascimento).toBe(userMock.data_nascimento)
    expect(pessoas[0].email).toBe(userMock.email)
    expect(pessoas[0].habilitado).toBe(userMock.habilitado)
    
  })

  it('should get users by their names', async() => {
    const userMock01 = {
      nome: "Regina",
      cpf: "111.209.345-01",
      data_nascimento: "12/05/1981",
      email: "reginamagalhaes@gmail.com",
      senha: "123456",
      habilitado: "sim"
    }

    const userMock02 = {
      nome: "Regina",
      cpf: "192.239.111-07",
      data_nascimento: "09/08/2000",
      email: "regina005@gmail.com",
      senha: "123456",
      habilitado: "não"
    }

    const user1 = await UserModel.create(userMock01)
    const user2 = await UserModel.create(userMock02)

    const response = await request(app)
    .get('/api/v1/people?nome=Regina')

    const {body, status} = response
    const {pessoas} = body

    expect(status).toBe(200)

    expect(pessoas).toHaveLength(2)
    expect(pessoas[0]._id).toBe(user1._id.toString())
    expect(pessoas[0].nome).toBe(userMock01.nome)
    expect(pessoas[0].cpf).toBe(userMock01.cpf)
    expect(pessoas[0].data_nascimento).toBe(userMock01.data_nascimento)
    expect(pessoas[0].email).toBe(userMock01.email)
    expect(pessoas[0].habilitado).toBe(userMock01.habilitado)

    expect(pessoas[1]._id).toBe(user2._id.toString())
    expect(pessoas[1].nome).toBe(userMock02.nome)
    expect(pessoas[1].cpf).toBe(userMock02.cpf)
    expect(pessoas[1].data_nascimento).toBe(userMock02.data_nascimento)
    expect(pessoas[1].email).toBe(userMock02.email)
    expect(pessoas[1].habilitado).toBe(userMock02.habilitado)
    
  })

  it('should get a user by id', async() => {
    const userMock = {
      nome: "Cristiano Ronaldo",
      cpf: "111.209.345-01",
      data_nascimento: "12/05/1981",
      email: "cristiano7@gmail.com",
      senha: "123456",
      habilitado: "sim"
    }

    let {_id} = await UserModel.create(userMock)
   
    const response = await request(app)
    .get(`/api/v1/people/${_id.toString()}`)

    const {body, status} = response
    expect(status).toBe(200)

    expect(body._id).toBe(_id.toString())
    expect(body.nome).toBe(userMock.nome)
    expect(body.cpf).toBe(userMock.cpf)
    expect(body.data_nascimento).toBe(userMock.data_nascimento)
    expect(body.email).toBe(userMock.email)
    expect(body.habilitado).toBe(userMock.habilitado)
  })

  it('should delete a user', async() => {
    const userMock = {
      nome: "Neymar",
      cpf: "111.209.345-01",
      data_nascimento: "17/12/1990",
      email: "neymarjr10@gmail.com",
      senha: "123456",
      habilitado: "não"
    }

    let {_id} = await UserModel.create(userMock)
   
    const response = await request(app)
    .delete(`/api/v1/people/${_id.toString()}`)

    const {body, status} = response
  
    expect(status).toBe(204)
    expect(body).toEqual({})
  })
    
})