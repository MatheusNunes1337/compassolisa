const request = require('supertest');
const { UserDataFaker, CarDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let token = null;

beforeAll(async () => {
  const userMock = UserDataFaker();

  await request(app).post('/api/v1/people/').send(userMock);

  const response = await request(app)
    .post('/api/v1/authenticate/')
    .send({ email: userMock.email, senha: userMock.senha });

  const { body } = response;
  token = body.token;
});

let carMock = {};
let carMock02 = {};
let idMock = '';

describe('Get all cars', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();
    carMock02 = CarDataFaker();
  });

  it('should return status code 200', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock02);

    const { status } = await request(app).get('/api/v1/car/').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
  });

  it('should return an array of car objects', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock02);

    const { body } = await request(app).get('/api/v1/car/').set('Authorization', `Bearer ${token}`);

    const { veiculos } = body;

    expect(veiculos[0]).toHaveProperty('_id');
    expect(veiculos[0].modelo).toBe(carMock.modelo);
    expect(veiculos[0].cor).toBe(carMock.cor);
    expect(veiculos[0].ano).toBe(carMock.ano);
    expect(veiculos[0].acessorios[0].descricao).toBe(carMock.acessorios[0].descricao);
    expect(veiculos[0].quantidadePassageiros).toBe(carMock.quantidadePassageiros);

    expect(veiculos[1]).toHaveProperty('_id');
    expect(veiculos[1].modelo).toBe(carMock02.modelo);
    expect(veiculos[1].cor).toBe(carMock02.cor);
    expect(veiculos[1].ano).toBe(carMock02.ano);
    expect(veiculos[1].acessorios[0].descricao).toBe(carMock02.acessorios[0].descricao);
    expect(veiculos[1].quantidadePassageiros).toBe(carMock02.quantidadePassageiros);
  });

  it('should return an array of car objects with values type string, number an object', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock02);

    const { body } = await request(app).get('/api/v1/car/').set('Authorization', `Bearer ${token}`);

    const { veiculos } = body;

    expect(veiculos[0]).toEqual({
      _id: expect.any(String),
      modelo: expect.any(String),
      cor: expect.any(String),
      ano: expect.any(Number),
      acessorios: expect.any(Object),
      quantidadePassageiros: expect.any(Number)
    });

    expect(veiculos[1]).toEqual({
      _id: expect.any(String),
      modelo: expect.any(String),
      cor: expect.any(String),
      ano: expect.any(Number),
      acessorios: expect.any(Object),
      quantidadePassageiros: expect.any(Number)
    });
  });
});

describe('Do not get cars with invalid limit value', () => {
  it('should return status code 400', async () => {
    const { status } = await request(app).get('/api/v1/car/?limit=-100').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(400);
  });

  it('should return an object with name and description error properties', async () => {
    const { body } = await request(app).get('/api/v1/car/?limit=-100').set('Authorization', `Bearer ${token}`);

    expect(body[0].name).toBe('"limit" must be greater than or equal to 0');
    expect(body[0].description).toBe('limit');
  });

  it('should return an object with values type string', async () => {
    const { body } = await request(app).get('/api/v1/car/?limit=-100').set('Authorization', `Bearer ${token}`);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Filter cars by modelo', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();
    carMock02 = CarDataFaker();
  });

  it('should return status code 200', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock02);

    const { status } = await request(app)
      .get(`/api/v1/car/?modelo=${carMock.modelo}`)
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
  });

  it('should return an array with one object only', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock02);

    const { body } = await request(app)
      .get(`/api/v1/car/?modelo=${carMock.modelo}`)
      .set('Authorization', `Bearer ${token}`);

    const { veiculos } = body;

    expect(veiculos[0]).toHaveProperty('_id');
    expect(veiculos[0].modelo).toBe(carMock.modelo);
    expect(veiculos[0].cor).toBe(carMock.cor);
    expect(veiculos[0].ano).toBe(carMock.ano);
    expect(veiculos[0].acessorios[0].descricao).toBe(carMock.acessorios[0].descricao);
    expect(veiculos[0].quantidadePassageiros).toBe(carMock.quantidadePassageiros);
  });

  it('should return an array with one car onlly with values type string, number an object', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock02);

    const { body } = await request(app)
      .get(`/api/v1/car/?modelo=${carMock.modelo}`)
      .set('Authorization', `Bearer ${token}`);

    const { veiculos } = body;

    expect(veiculos[0]).toEqual({
      _id: expect.any(String),
      modelo: expect.any(String),
      cor: expect.any(String),
      ano: expect.any(Number),
      acessorios: expect.any(Object),
      quantidadePassageiros: expect.any(Number)
    });
  });
});

describe('Do not get cars without authentication token', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();
  });

  it('should return status code 401', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { status } = await request(app).get('/api/v1/car/');

    expect(status).toBe(401);
  });

  it('should return an object with name and description error properties', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock02);

    const { body } = await request(app).get('/api/v1/car/');

    expect(body.name).toBe('Token not provided');
    expect(body.description).toBe('Authentication');
  });

  it('should return an object with values type string', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { body } = await request(app).get('/api/v1/car/');

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not get cars with malformated token', () => {
  it('should return status code 401', async () => {
    const { status } = await request(app).get('/api/v1/car/').set('Authorization', token);

    expect(status).toBe(401);
  });

  it('should return an array with one object only', async () => {
    const { body } = await request(app).get('/api/v1/car/').set('Authorization', token);

    expect(body.name).toBe('The token has an invalid format');
    expect(body.description).toBe('Authentication');
  });

  it('should return an array with one car onlly with values type string, number an object', async () => {
    const { body } = await request(app).get('/api/v1/car/').set('Authorization', token);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Get car by ID', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();
  });

  it('should return status code 200', async () => {
    const { text } = await request(app).post('/api/v1/car/').send(carMock).set('Authorization', `Bearer ${token}`);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).get(`/api/v1/car/${_id.toString()}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
  });

  it('should return a car object plus _id field', async () => {
    const { text } = await request(app).post('/api/v1/car/').send(carMock).set('Authorization', `Bearer ${token}`);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).get(`/api/v1/car/${_id.toString()}`).set('Authorization', `Bearer ${token}`);

    expect(body).toHaveProperty('_id');
    expect(body.modelo).toBe(carMock.modelo);
    expect(body.cor).toBe(carMock.cor);
    expect(body.ano).toBe(carMock.ano);
    expect(body.acessorios[0].descricao).toBe(carMock.acessorios[0].descricao);
    expect(body.quantidadePassageiros).toBe(carMock.quantidadePassageiros);
  });

  it('should return a object with values type string, number and object', async () => {
    const { text } = await request(app).post('/api/v1/car/').send(carMock).set('Authorization', `Bearer ${token}`);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).get(`/api/v1/car/${_id.toString()}`).set('Authorization', `Bearer ${token}`);

    expect(body).toEqual({
      _id: expect.any(String),
      modelo: expect.any(String),
      cor: expect.any(String),
      ano: expect.any(Number),
      acessorios: expect.any(Object),
      quantidadePassageiros: expect.any(Number)
    });
  });
});

describe('Get no car by ID', () => {
  beforeEach(() => {
    idMock = generateObjectId();
  });
  it('should return status code 204', async () => {
    const { status } = await request(app).get(`/api/v1/car/${idMock}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(204);
  });

  it('should return a car object plus _id field', async () => {
    const { body } = await request(app).get(`/api/v1/car/${idMock}`).set('Authorization', `Bearer ${token}`);

    expect(body.modelo).toBeUndefined();
    expect(body.cor).toBeUndefined();
    expect(body.ano).toBeUndefined();
    expect(body.acessorios).toBeUndefined();
    expect(body.quantidadePassageiros).toBeUndefined();
  });

  it('should return a object with values type string, number and object', async () => {
    const { body } = await request(app).get(`/api/v1/car/${idMock}`).set('Authorization', `Bearer ${token}`);

    expect(body).toEqual({});
  });
});
