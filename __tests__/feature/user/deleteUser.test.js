const request = require('supertest');
const { UserDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let userMock = {};
let idMock = '';

describe('delete a user', () => {
  beforeEach(() => {
    userMock = UserDataFaker();
  });
  it('should return status code 204', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).delete(`/api/v1/people/${_id.toString()}`);

    expect(status).toBe(204);
  });

  it('should return a empty object', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).delete(`/api/v1/people/${_id.toString()}`);

    expect(body.nome).toBeUndefined();
    expect(body.cpf).toBeUndefined();
    expect(body.data_nascimento).toBeUndefined();
    expect(body.email).toBeUndefined();
    expect(body.habilitado).toBeUndefined();
  });

  it('should return a body type object', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).delete(`/api/v1/people/${_id.toString()}`);

    expect(body).toEqual({});
  });
});

describe('Do not delete a user that not exists', () => {
  beforeEach(() => {
    idMock = generateObjectId();
  });

  it('should return status code 404', async () => {
    const { status } = await request(app).delete(`/api/v1/people/${idMock}`);

    expect(status).toBe(404);
  });

  it('should return an object with name and description properties', async () => {
    const { body } = await request(app).delete(`/api/v1/people/${idMock}`);

    expect(body.name).toBe('User not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a object with properties type string', async () => {
    const { body } = await request(app).delete(`/api/v1/people/${idMock}`);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not delete a user with invalid id format', () => {
  beforeEach(() => {
    idMock = '4edd40c86762e0fb120000';
  });
  it('should return status code 404', async () => {
    const { status } = await request(app).delete(`/api/v1/people/${idMock}`);

    expect(status).toBe(400);
  });

  it('should return an object with name and description properties', async () => {
    const { body } = await request(app).delete(`/api/v1/people/${idMock}`);

    expect(body[0].name).toBe('id must have 24 hexadecimal characters');
    expect(body[0].description).toBe('id');
  });

  it('should return a object with properties type string', async () => {
    const { body } = await request(app).delete(`/api/v1/people/${idMock}`);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
