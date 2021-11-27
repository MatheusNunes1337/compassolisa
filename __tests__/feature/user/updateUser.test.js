const request = require('supertest');
const { UserDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let userMock = {};
let userMock02 = {};
let idMock = '';
let payload = {};
let senha = '';

describe('update user', () => {
  beforeEach(() => {
    userMock = UserDataFaker();
    userMock02 = UserDataFaker();

    payload = {
      cpf: userMock02.cpf,
      email: userMock02.email,
      senha: userMock02.senha
    };
  });

  it('should return status code 200', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const response = await request(app).put(`/api/v1/people/${_id.toString()}`).send(payload);

    const { status } = response;
    expect(status).toBe(200);
  });

  it('should return a object without the password', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const response = await request(app).put(`/api/v1/people/${_id.toString()}`).send(payload);

    const { body } = response;

    expect(body._id).toBe(_id);
    expect(body.nome).toBe(userMock.nome);
    expect(body.cpf).toBe(payload.cpf);
    expect(body.data_nascimento).toBe(userMock.data_nascimento);
    expect(body.email).toBe(payload.email);
    expect(body.senha).toBeUndefined();
    expect(body.habilitado).toBe(userMock.habilitado);
  });

  it('should return a body with properties values type string', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const response = await request(app).put(`/api/v1/people/${_id.toString()}`).send(payload);

    const { body } = response;

    expect(body).toEqual({
      _id: expect.any(String),
      nome: expect.any(String),
      cpf: expect.any(String),
      data_nascimento: expect.any(String),
      email: expect.any(String),
      habilitado: expect.any(String)
    });
  });
});

describe('Do not update a password of a user that not exists', () => {
  beforeEach(() => {
    idMock = generateObjectId();
  });
  it('should return status code 404', async () => {
    const response = await request(app).put(`/api/v1/people/${idMock}`);

    const { status } = response;
    expect(status).toBe(404);
  });

  it('should return an object with name and description properties', async () => {
    const response = await request(app).put(`/api/v1/people/${idMock}`);

    const { body } = response;

    expect(body.name).toBe('User not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a object with properties type string', async () => {
    const response = await request(app).put(`/api/v1/people/${idMock}`);

    const { body } = response;

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe("Do not update a user's password that have less than 6 characteres", () => {
  beforeEach(() => {
    userMock = UserDataFaker();
    senha = '123';
  });

  it('should return status code 400', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const response = await request(app).put(`/api/v1/people/${_id.toString()}`).send({ senha });

    const { status } = response;
    expect(status).toBe(400);
  });

  it('should return a object with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/people/${_id.toString()}`).send({ senha });

    expect(body[0].name).toBe('"senha" length must be at least 6 characters long');
    expect(body[0].description).toBe('senha');
  });

  it('should return a body with properties values type string', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/people/${_id.toString()}`).send({ senha });

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
