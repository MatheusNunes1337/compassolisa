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

describe('delete a car', () => {
  beforeEach(async () => {
    carMock = CarDataFaker();
  });

  it('should return status code 204', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app)
      .delete(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(204);
  });

  it('should return an empty object', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).delete(`/api/v1/car/${_id.toString()}`).set('Authorization', `Bearer ${token}`);

    expect(body.modelo).toBeUndefined();
    expect(body.cor).toBeUndefined();
    expect(body.ano).toBeUndefined();
    expect(body.acessorios).toBeUndefined();
    expect(body.quantidadePassageiros).toBeUndefined();
  });

  it('should return no body', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).delete(`/api/v1/car/${_id.toString()}`).set('Authorization', `Bearer ${token}`);

    expect(body).toEqual({});
  });
});

describe('Do not delete a car that not exists', () => {
  beforeEach(() => {
    idMock = generateObjectId();
  });
  it('should return status code 404', async () => {
    const { status } = await request(app).delete(`/api/v1/car/${idMock}`).set('Authorization', `Bearer ${token}`);

    expect(status).toBe(404);
  });

  it('should return an object error with description and name properties', async () => {
    const { body } = await request(app).delete(`/api/v1/car/${idMock}`).set('Authorization', `Bearer ${token}`);

    expect(body.name).toBe('Car not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a object with values type string', async () => {
    const { body } = await request(app).delete(`/api/v1/car/${idMock}`).set('Authorization', `Bearer ${token}`);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
