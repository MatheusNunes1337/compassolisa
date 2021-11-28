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
let idMock = '';
let cor = '';
let accessoryMock = {};

describe('Update a car color', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();
    cor = 'vermelho';
  });

  it('should return status code 200', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ cor });

    expect(status).toBe(200);
  });

  it('should return a body with carMock properties e values updated plus _id', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ cor });

    expect(body).toHaveProperty('_id');
    expect(body.modelo).toBe(carMock.modelo);
    expect(body.cor).toBe(cor);
    expect(body.ano).toBe(carMock.ano);
    expect(body.acessorios[0].descricao).toBe(carMock.acessorios[0].descricao);
    expect(body.quantidadePassageiros).toBe(carMock.quantidadePassageiros);
  });

  it('should return a body with values of type string, number and object', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const response = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ cor });

    const { body } = response;

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

describe('Do not update a car when modelo has invalid value', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();
  });

  it('should return status code 400', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ modelo: 2000 });

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ modelo: 2000 });

    expect(body[0].name).toBe('"modelo" must be a string');
    expect(body[0].description).toBe('modelo');
  });

  it('should return a body with values of type string', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ modelo: 2000 });

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not update a car that not exists', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();
    idMock = generateObjectId();
  });

  it('should return status code 404', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { status } = await request(app)
      .put(`/api/v1/car/${idMock}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantidadePassageiros: 4 });

    expect(status).toBe(404);
  });

  it('should return a body with name and description error properties', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { body } = await request(app)
      .put(`/api/v1/car/${idMock}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantidadePassageiros: 4 });

    expect(body.name).toBe('Car not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a body with values of type string', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { body } = await request(app)
      .put(`/api/v1/car/${idMock}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantidadePassageiros: 4 });

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Update a car accessory', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();

    accessoryMock = { descricao: 'Air bag' };
  });

  it('should return status code 200', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { status } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(status).toBe(200);
  });

  it('should return a body with carMock properties e values updated plus _id', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body).toHaveProperty('_id');
    expect(body.modelo).toBe(carMock.modelo);
    expect(body.cor).toBe(carMock.cor);
    expect(body.ano).toBe(carMock.ano);
    expect(body.acessorios[0].descricao).toBe(accessoryMock.descricao);
    expect(body.quantidadePassageiros).toBe(carMock.quantidadePassageiros);
  });

  it('should return a body with values of type string, number and object', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

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

describe('Do not Update a car accessory when it has invalid value', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();

    accessoryMock = { descricao: true };
  });

  it('should return status code 400', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { status } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body[0].name).toBe('Accessory description must be a string');
    expect(body[0].description).toBe('descricao');
  });

  it('should return a body with values of type string', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not Update a car accessory when it already exists invalid value', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();

    accessoryMock = { descricao: carMock.acessorios[1].descricao };
  });

  it('should return status code 400', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { status } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body.name).toBe(`This car already has an accessory called ${accessoryMock.descricao}`);
    expect(body.description).toBe('Conflict');
  });

  it('should return a body with values of type string', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not Update a car accessory of a car that not exists', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();

    accessoryMock = { descricao: 'Ar-bag' };
    idMock = generateObjectId();
  });

  it('should return status code 404', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { status } = await request(app)
      .patch(`/api/v1/car/${idMock}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(status).toBe(404);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${idMock}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body.name).toBe('Car not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a body with values of type string', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${idMock}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not Update an accessory that not exists', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();

    accessoryMock = { descricao: 'Porta luvas' };
    idMock = generateObjectId();
  });

  it('should return status code 404', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${idMock}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(status).toBe(404);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${idMock}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body.name).toBe('Accessory not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a body with values of type string', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${idMock}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
