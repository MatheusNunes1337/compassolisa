const request = require('supertest');

const app = require('../../../src/index');

beforeEach(async () => {
  const userMock = {
    nome: 'James winston',
    cpf: '182.931.371-08',
    data_nascimento: '17/12/1945',
    email: 'james1945@outlook.com',
    senha: 'paradise003',
    habilitado: 'não'
  };

  await request(app).post('/api/v1/people/').send(userMock);
});

describe('authenticate a user with valid credentials', () => {
  it('should return status code 200', async () => {
    const credentialsMock = {
      email: 'james1945@outlook.com',
      senha: 'paradise003'
    };

    const { status } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(status).toBe(200);
  });

  it('should return a body with token property', async () => {
    const credentialsMock = {
      email: 'james1945@outlook.com',
      senha: 'paradise003'
    };

    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body).toHaveProperty('token');
  });

  it('should return a body with a string token', async () => {
    const credentialsMock = {
      email: 'james1945@outlook.com',
      senha: 'paradise003'
    };

    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body).toEqual({
      token: expect.any(String)
    });
  });
});

describe('Do not authenticate a user with invalid email', () => {
  it('should return status code 200', async () => {
    const credentialsMock = {
      email: 'james1900@outlook.com',
      senha: 'paradise003'
    };

    const { status } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const credentialsMock = {
      email: 'james1900@outlook.com',
      senha: 'paradise003'
    };

    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body.token).toBeUndefined();
    expect(body.name).toBe('This email does not exist in database');
    expect(body.description).toBe('Invalid credentials');
  });

  it('should return a body with a string token undefined and name and description type string', async () => {
    const credentialsMock = {
      email: 'james1900@outlook.com',
      senha: 'paradise003'
    };

    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not authenticate a user with invalid email format', () => {
  it('should return status code 200', async () => {
    const credentialsMock = {
      email: 'james1900',
      senha: 'paradise003'
    };

    const { status } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const credentialsMock = {
      email: 'james1900',
      senha: 'paradise003'
    };

    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body[0].name).toBe('"email" must be a valid email');
    expect(body[0].description).toBe('email');
  });

  it('should return a body with a string token undefined and name and description type string', async () => {
    const credentialsMock = {
      email: 'james1900',
      senha: 'paradise003'
    };

    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not authenticate a user with invalid password', () => {
  it('should return status code 200', async () => {
    const credentialsMock = {
      email: 'james1945@outlook.com',
      senha: 'paradise'
    };

    const { status } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const credentialsMock = {
      email: 'james1945@outlook.com',
      senha: 'paradise'
    };

    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body.token).toBeUndefined();
    expect(body.name).toBe('The password is incorrect. Try again');
    expect(body.description).toBe('Invalid credentials');
  });

  it('should return a body with a string token undefined and name and description type string', async () => {
    const credentialsMock = {
      email: 'james1945@outlook.com',
      senha: 'paradise'
    };

    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
