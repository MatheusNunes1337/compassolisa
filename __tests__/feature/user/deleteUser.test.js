const request = require('supertest');

const app = require('../../../src/index');

let userMock = {};

describe('delete a user', () => {
  beforeEach(() => {
    userMock = {
      nome: 'Neymar',
      cpf: '111.209.345-01',
      data_nascimento: '17/12/1990',
      email: 'neymarjr10@gmail.com',
      senha: '123456',
      habilitado: 'não'
    };
  });
  it('should return status code 204', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const response = await request(app).delete(`/api/v1/people/${_id.toString()}`);

    const { status } = response;
    expect(status).toBe(204);
  });

  it('should return a empty object', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const response = await request(app).delete(`/api/v1/people/${_id.toString()}`);

    const { body } = response;

    expect(body.nome).toBeUndefined();
    expect(body.cpf).toBeUndefined();
    expect(body.data_nascimento).toBeUndefined();
    expect(body.email).toBeUndefined();
    expect(body.habilitado).toBeUndefined();
  });

  it('should return a body type object', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const response = await request(app).delete(`/api/v1/people/${_id.toString()}`);

    const { body } = response;

    expect(typeof body).toBe('object');
  });
});

describe('Do not delete a user that not exists', () => {
  it('should return status code 404', async () => {
    const idMock = '4edd40c86762e0fb12000003';

    const response = await request(app).delete(`/api/v1/people/${idMock}`);

    const { status } = response;
    expect(status).toBe(404);
  });

  it('should return an object with name and description properties', async () => {
    const idMock = '4edd40c86762e0fb12000003';

    const response = await request(app).delete(`/api/v1/people/${idMock}`);

    const { body } = response;

    expect(body.name).toBe('User not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a object with properties type string', async () => {
    const idMock = '4edd40c86762e0fb12000003';

    const response = await request(app).delete(`/api/v1/people/${idMock}`);

    const { body } = response;

    expect(typeof body).toBe('object');
    expect(typeof body.name).toBe('string');
    expect(typeof body.description).toBe('string');
  });
});
