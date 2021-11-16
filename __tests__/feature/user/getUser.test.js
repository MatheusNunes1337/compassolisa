const request = require('supertest');

const app = require('../../../src/index');
const UserModel = require('../../../src/app/models/UserModel');

beforeAll(async () => {
  await UserModel.deleteMany();
});

beforeEach(async () => {
  await UserModel.deleteMany();
});

let userMock = {};

describe('get all users', () => {
  beforeEach(() => {
    userMock = {
      nome: 'Thomas',
      cpf: '192.168.010-02',
      data_nascimento: '18/11/1997',
      email: 'thomasgermano@outlook.com',
      senha: '123456',
      habilitado: 'sim'
    };
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

describe('get users by their names', () => {
  beforeEach(() => {
    userMock = {
      nome: 'Pedro',
      cpf: '183.103.187-04',
      data_nascimento: '20/11/2001',
      email: 'pedrooo@outlook.com',
      senha: 'onlined134',
      habilitado: 'não'
    };
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

describe('get users by their id', () => {
  beforeEach(() => {
    userMock = {
      nome: 'Lucas Morais',
      cpf: '467.127.189-07',
      data_nascimento: '20/03/2001',
      email: 'lucasmorais2001@outlook.com',
      senha: 'engix1923',
      habilitado: 'sim'
    };
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