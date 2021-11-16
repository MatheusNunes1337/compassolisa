const request = require('supertest');

const app = require('../../../src/index');

let userMock = {};
let payload = {};

describe('update user', () => {
  beforeEach(() => {
    userMock = {
      nome: 'Mariana',
      cpf: '098.163.024-05',
      data_nascimento: '03/12/1996',
      email: 'marianagomes@gmail.com',
      senha: '123456',
      habilitado: 'não'
    };

    payload = {
      cpf: '098.163.024-12',
      email: 'marianagomes@outlook.com'
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
  it('should return status code 404', async () => {
    const idMock = '4edd40c86762e0fb12000003';

    const response = await request(app).put(`/api/v1/people/${idMock}`);

    const { status } = response;
    expect(status).toBe(404);
  });

  it('should return an object with name and description properties', async () => {
    const idMock = '4edd40c86762e0fb12000003';

    const response = await request(app).put(`/api/v1/people/${idMock}`);

    const { body } = response;

    expect(body.name).toBe('User not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a object with properties type string', async () => {
    const idMock = '4edd40c86762e0fb12000003';

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
    userMock = {
      nome: 'Bianca',
      cpf: '019.348.118-07',
      data_nascimento: '01/01/1998',
      email: 'bianca@gmail.com',
      senha: '123456',
      habilitado: 'sim'
    };
  });

  it('should return status code 400', async () => {
    const senha = {
      senha: '123'
    };

    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const response = await request(app).put(`/api/v1/people/${_id.toString()}`).send(senha);

    const { status } = response;
    expect(status).toBe(400);
  });

  it('should return a object with name and description error properties', async () => {
    const senha = {
      senha: '123'
    };

    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/people/${_id.toString()}`).send(senha);

    expect(body[0].name).toBe('"senha" length must be at least 6 characters long');
    expect(body[0].description).toBe('senha');
  });

  it('should return a body with properties values type string', async () => {
    const senha = {
      senha: '123'
    };

    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/people/${_id.toString()}`).send(senha);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
