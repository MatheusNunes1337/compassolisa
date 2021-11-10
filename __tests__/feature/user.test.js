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
        console.log(body)
        expect(status).toBe(201)

        expect(body).toHaveProperty('_id')
        expect(body.nome).toBe(userMock.nome)
        expect(body.cpf).toBe(userMock.cpf)
        expect(body.data_nascimento).toBe(userMock.data_nascimento)
        expect(body.email).toBe(userMock.email)
        expect(body.habilitado).toBe(userMock.habilitado)

    })
    
})