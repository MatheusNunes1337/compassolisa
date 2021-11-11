const request = require('supertest');

const app = require('../../src/index');
const UserModel = require('../../src/app/models/UserModel');

beforeAll(async () => {
    await UserModel.deleteMany();

    const userMock = {
        nome: "James winston",
        cpf: "182.931.371-08",
        data_nascimento: "17/12/1945",
        email: "james1945@outlook.com",
        senha: "paradise003",
        habilitado: "não"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock)
});
  
describe('authenticate a user with valid credentials', () => {      
  it('should return status code 200', async() => {
    const credentialsMock = {
      email: "james1945@outlook.com",
      senha: "paradise003",
    }

    const response = await request(app)
    .post('/api/v1/authenticate/')
    .send(credentialsMock)

    const {status} = response
    expect(status).toBe(200)
  })

  it('should return a body with token property', async() => {
    const credentialsMock = {
      email: "james1945@outlook.com",
      senha: "paradise003",
    }

    const response = await request(app)
    .post('/api/v1/authenticate/')
    .send(credentialsMock)

    const {body} = response
    expect(body).toHaveProperty('token')
  })

  it('should return a body with a string token', async() => {
    const credentialsMock = {
        email: "james1945@outlook.com",
        senha: "paradise003",
    }

    const response = await request(app)
    .post('/api/v1/authenticate/')
    .send(credentialsMock)

    const {body} = response
    expect(typeof body.token).toBe('string')
  })
})