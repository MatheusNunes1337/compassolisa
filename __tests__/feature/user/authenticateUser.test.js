const request = require('supertest');
const { UserDataFaker } = require('../../support/datafaker');

const app = require('../../../src/index');

let userMock = {};
let userMock02 = {};
let credentialsMock;

beforeEach(async () => {
  userMock = UserDataFaker();
  await request(app).post('/api/v1/people/').send(userMock);
});

describe('authenticate a user with valid credentials', () => {
  beforeEach(() => {
    credentialsMock = {
      email: userMock.email,
      senha: userMock.senha
    };
  });
  it('should return status code 200', async () => {
    const { status } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(status).toBe(200);
  });

  it('should return a body with token property', async () => {
    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body).toHaveProperty('token');
  });

  it('should return a body with a string token', async () => {
    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body).toEqual({
      token: expect.any(String)
    });
  });
});

describe('Do not authenticate a user with invalid email', () => {
  beforeEach(() => {
    userMock02 = UserDataFaker();
    credentialsMock = {
      email: userMock02.email,
      senha: userMock.senha
    };
  });
  it('should return status code 200', async () => {
    const { status } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body.token).toBeUndefined();
    expect(body.name).toBe('This email does not exist in database');
    expect(body.description).toBe('Invalid credentials');
  });

  it('should return a body with a string token undefined and name and description type string', async () => {
    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not authenticate a user with invalid email format', () => {
  beforeEach(() => {
    credentialsMock = {
      email: 'james1900',
      senha: userMock.senha
    };
  });
  it('should return status code 200', async () => {
    const { status } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body[0].name).toBe('"email" must be a valid email');
    expect(body[0].description).toBe('email');
  });

  it('should return a body with a string token undefined and name and description type string', async () => {
    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not authenticate a user with invalid password', () => {
  beforeEach(() => {
    userMock02 = UserDataFaker();
    credentialsMock = {
      email: userMock.email,
      senha: userMock02.senha
    };
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body.token).toBeUndefined();
    expect(body.name).toBe('The password is incorrect. Try again');
    expect(body.description).toBe('Invalid credentials');
  });

  it('should return a body with a string token undefined and name and description type string', async () => {
    const { body } = await request(app).post('/api/v1/authenticate/').send(credentialsMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
