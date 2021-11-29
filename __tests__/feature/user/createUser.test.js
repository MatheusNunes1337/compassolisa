const request = require('supertest');
const { UserDataFaker } = require('../../support/datafaker');

const app = require('../../../src/index');

let userMock = {};
let userMock02 = {};

describe('create a new user', () => {
  beforeEach(() => {
    userMock = UserDataFaker();
  });

  it('should return status code 201', async () => {
    const { status } = await request(app).post('/api/v1/people/').send(userMock);
    expect(status).toBe(201);
  });

  it('should return a body with _id and the same properties from userMock expect password', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body).toHaveProperty('_id');
    expect(body.nome).toBe(userMock.nome);
    expect(body.cpf).toBe(userMock.cpf);
    expect(body.data_nascimento).toBe(userMock.data_nascimento);
    expect(body.email).toBe(userMock.email);
    expect(body.habilitado).toBe(userMock.habilitado);
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

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

describe('Do not create a user with a existing email', () => {
  beforeEach(() => {
    userMock = UserDataFaker();

    userMock02 = UserDataFaker();
    userMock02.email = userMock.email;
  });
  it('should return status code 400', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { status } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(body.description).toBe('Conflict');
    expect(body.name).toBe(`Email ${userMock02.email} already in use`);
  });

  it('should return a body with values type string', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not not create a user with a existing cpf', () => {
  beforeEach(() => {
    userMock = UserDataFaker();

    userMock02 = UserDataFaker();
    userMock02.cpf = userMock.cpf;
  });

  it('should return status code 400', async () => {
    await request(app).post('/api/v1/people/').send(userMock);
    const { status } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(body.description).toBe('Conflict');
    expect(body.name).toBe(`CPF ${userMock.cpf} already in use`);
  });

  it('should return a body with values type string', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a user with invalid email format', () => {
  beforeEach(() => {
    userMock = UserDataFaker();
    userMock.email = 'roguerg';
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/people/').send(userMock);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0].description).toBe('email');
    expect(body[0].name).toBe('"email" must be a valid email');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a user with blank field', () => {
  beforeEach(() => {
    userMock = UserDataFaker();
    userMock.nome = '';
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/people/').send(userMock);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0].description).toBe('nome');
    expect(body[0].name).toBe('"nome" is not allowed to be empty');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a user with invalid cpf format', () => {
  beforeEach(() => {
    userMock = UserDataFaker();
    userMock.cpf = '017726.560-09';
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/people/').send(userMock);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0].description).toBe('cpf');
    expect(body[0].name).toBe('cpf must have the xxx.xxx.xxx-xx format');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a user with invalid habilitado field value', () => {
  beforeEach(() => {
    userMock = UserDataFaker();
    userMock.habilitado = 'okay';
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/people/').send(userMock);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0].description).toBe('habilitado');
    expect(body[0].name).toBe('"habilitado" must be one of [sim, não]');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
