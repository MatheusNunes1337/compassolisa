const request = require('supertest');
const { RentalDataFaker, CarDataFaker, UserDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let id_carro = '';
let id_locadora = '';
let idMock = '';
let fleetMock = {};
let token = null;

beforeEach(async () => {
  let response;
  const userMock = UserDataFaker();

  await request(app).post('/api/v1/people/').send(userMock);

  response = await request(app).post('/api/v1/authenticate/').send({ email: userMock.email, senha: userMock.senha });

  const { body } = response;
  token = body.token;

  const carMock = CarDataFaker();
  const rentalMock = RentalDataFaker();
  rentalMock.endereco[0].cep = '96020-971';
  rentalMock.endereco.pop();

  response = await request(app)
    .post('/api/v1/car/')
    .send(carMock)
    .set('Authorization', `Bearer ${token}`)
    .send(carMock);

  const car = JSON.parse(response.text);
  id_carro = car._id;

  response = await request(app).post('/api/v1/rental/').send(rentalMock);
  const rental = JSON.parse(response.text);
  id_locadora = rental._id;

  fleetMock = {
    id_carro,
    status: 'disponível',
    valor_diaria: 250,
    placa: 'BRA1782'
  };
});

describe('Get all fleet', () => {
  it('should return status code 200', async () => {
    await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { status } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet`);

    expect(status).toBe(200);
  });

  it('should return an array of fleets with same properties of mock plus _id and locadora_id', async () => {
    await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { body } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet`);

    const { frota } = body;

    expect(frota[0]).toHaveProperty('_id');
    expect(frota[0].id_carro).toBe(fleetMock.id_carro);
    expect(frota[0].status).toBe(fleetMock.status);
    expect(frota[0].valor_diaria).toBe(fleetMock.valor_diaria);
    expect(frota[0].id_locadora).toBe(id_locadora);
    expect(frota[0].placa).toBe(fleetMock.placa);
  });

  it('should return an array of rental objects with values type string, number an object', async () => {
    await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { body } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet`);

    const { frota } = body;

    expect(frota[0]).toEqual({
      _id: expect.any(String),
      id_carro: expect.any(String),
      status: expect.any(String),
      valor_diaria: expect.any(Number),
      id_locadora: expect.any(String),
      placa: expect.any(String)
    });
  });
});

describe('Get fleet by id', () => {
  it('should return status code 200', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet/${_id.toString()}`);

    expect(status).toBe(200);
  });

  it('should return a fleet object with same properties of mock plus _id and locadora_id', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet/${_id.toString()}`);

    expect(body).toHaveProperty('_id');
    expect(body.id_carro).toBe(fleetMock.id_carro);
    expect(body.status).toBe(fleetMock.status);
    expect(body.valor_diaria).toBe(fleetMock.valor_diaria);
    expect(body.id_locadora).toBe(id_locadora);
    expect(body.placa).toBe(fleetMock.placa);
  });

  it('should return an array of rental objects with values type string, number an object', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet/${_id.toString()}`);

    expect(body).toEqual({
      _id: expect.any(String),
      id_carro: expect.any(String),
      status: expect.any(String),
      valor_diaria: expect.any(Number),
      id_locadora: expect.any(String),
      placa: expect.any(String)
    });
  });
});

describe('Get no fleet by id', () => {
  beforeEach(() => {
    idMock = generateObjectId();
  });
  it('should return status code 204', async () => {
    const { status } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet/${idMock}`);

    expect(status).toBe(204);
  });

  it('should return a body with empty object', async () => {
    const { body } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet/${idMock}`);

    expect(body._id).toBeUndefined();
    expect(body.id_carro).toBeUndefined();
    expect(body.status).toBeUndefined();
    expect(body.valor_diaria).toBeUndefined();
    expect(body.id_locadora).toBeUndefined();
    expect(body.placa).toBeUndefined();
  });

  it('should return a body with any property', async () => {
    const { body } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet/${idMock}`);

    expect(body).toEqual({});
  });
});

describe('Get no fleet when rental not exists', () => {
  beforeEach(() => {
    idMock = generateObjectId();
  });
  it('should return status code 204', async () => {
    const { status } = await request(app).get(`/api/v1/rental/${idMock}/fleet/`);

    expect(status).toBe(404);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).get(`/api/v1/rental/${idMock}/fleet/`);

    expect(body.description).toBe('Not Found');
    expect(body.name).toBe('Rental not found');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).get(`/api/v1/rental/${idMock}/fleet/`);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
