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
    
})