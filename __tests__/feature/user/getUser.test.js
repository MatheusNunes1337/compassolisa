const request = require('supertest');
const { UserDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let userMock = {};
let idMock = '';

describe('get all users', () => {
  beforeEach(() => {
    userMock = UserDataFaker();
  });

  it('should return status code 200', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { status } = await request(app).get('/api/v1/people/');

    expect(status).toBe(200);
  });

  it('should return a body with _id and the same properties from userMock expect password', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).get('/api/v1/people/');

    const { pessoas } = body;

    expect(pessoas).toHaveLength(1);
    expect(pessoas[0].nome).toBe(userMock.nome);
    expect(pessoas[0].cpf).toBe(userMock.cpf);
    expect(pessoas[0].data_nascimento).toBe(userMock.data_nascimento);
    expect(pessoas[0].email).toBe(userMock.email);
    expect(pessoas[0].habilitado).toBe(userMock.habilitado);
  });

  it('should return a body with values type string', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).get('/api/v1/people/');

    const { pessoas } = body;

    expect(pessoas[0]).toEqual({
      _id: expect.any(String),
      nome: expect.any(String),
      cpf: expect.any(String),
      data_nascimento: expect.any(String),
      email: expect.any(String),
      habilitado: expect.any(String)
    });
  });
});

describe('Do not get users when limit is invalid', () => {
  it('should return status code 400', async () => {
    const { status } = await request(app).get('/api/v1/people/?limit=-200');

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).get('/api/v1/people/?limit=-200');

    expect(body[0].description).toBe('limit');
    expect(body[0].name).toBe('"limit" must be greater than or equal to 0');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).get('/api/v1/people/?limit=-200');

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('get users by their names', () => {
  beforeEach(() => {
    userMock = UserDataFaker();
  });

  it('should return status code 200', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const response = await request(app).get(`/api/v1/people/?nome=${userMock.nome}`);

    const { status } = response;
    expect(status).toBe(200);
  });

  it('should return a body with _id and the same properties from userMock except password', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).get(`/api/v1/people/?nome=${userMock.nome}`);

    const { pessoas } = body;

    expect(pessoas).toHaveLength(1);
    expect(pessoas[0].nome).toBe(userMock.nome);
    expect(pessoas[0].cpf).toBe(userMock.cpf);
    expect(pessoas[0].data_nascimento).toBe(userMock.data_nascimento);
    expect(pessoas[0].email).toBe(userMock.email);
    expect(pessoas[0].habilitado).toBe(userMock.habilitado);
  });

  it('should return a body with values type string', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).get(`/api/v1/people/?nome=${userMock.nome}`);

    const { pessoas } = body;

    expect(pessoas[0]).toEqual({
      _id: expect.any(String),
      nome: expect.any(String),
      cpf: expect.any(String),
      data_nascimento: expect.any(String),
      email: expect.any(String),
      habilitado: expect.any(String)
    });
  });
});

describe('get users by id', () => {
  beforeEach(() => {
    userMock = UserDataFaker();
  });

  it('should return status code 200', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).get(`/api/v1/people/${_id.toString()}`);

    expect(status).toBe(200);
  });

  it('should return a body with _id and the same properties from userMock expect password', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).get(`/api/v1/people/${_id.toString()}`);

    expect(body.nome).toBe(userMock.nome);
    expect(body.cpf).toBe(userMock.cpf);
    expect(body.data_nascimento).toBe(userMock.data_nascimento);
    expect(body.email).toBe(userMock.email);
    expect(body.habilitado).toBe(userMock.habilitado);
  });

  it('should return a object with values type string', async () => {
    const { text } = await request(app).post('/api/v1/people/').send(userMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).get(`/api/v1/people/${_id.toString()}`);

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

describe('get no user by id', () => {
  beforeEach(() => {
    idMock = generateObjectId();
  });
  it('should return status code 204', async () => {
    const { status } = await request(app).get(`/api/v1/people/${idMock}`);
    expect(status).toBe(204);
  });

  it('should return a body with empty object', async () => {
    const { body } = await request(app).get(`/api/v1/people/${idMock}`);

    expect(body._id).toBeUndefined();
    expect(body.nome).toBeUndefined();
    expect(body.cpf).toBeUndefined();
    expect(body.data_nascimento).toBeUndefined();
    expect(body.email).toBeUndefined();
    expect(body.habilitado).toBeUndefined();
  });

  it('should return a body with any property', async () => {
    const { body } = await request(app).get(`/api/v1/people/${idMock}`);

    expect(body).toEqual({});
  });
});
