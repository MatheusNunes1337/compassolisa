const request = require('supertest');
const { RentalDataFaker, CarDataFaker, UserDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let id_carro = '';
let id_locadora = '';
let payload = {};
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

describe('Update fleet license plate', () => {
  beforeEach(() => {
    payload = { placa: 'BNY9016' };
  });

  it('should return status code 200', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${_id}`).send(payload);

    expect(status).toBe(200);
  });

  it('should return the updated fleet object plus _id and locadora_id', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${_id}`).send(payload);

    expect(body).toHaveProperty('_id');
    expect(body.id_carro).toBe(fleetMock.id_carro);
    expect(body.status).toBe(fleetMock.status);
    expect(body.valor_diaria).toBe(fleetMock.valor_diaria);
    expect(body.id_locadora).toBe(id_locadora);
    expect(body.placa).toBe(payload.placa);
  });

  it('should return an array of rental objects with values type string, number an object', async () => {
    const { body } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

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

describe('Do not update a fleet car when it does not exists', () => {
  beforeEach(() => {
    payload = { id_carro: generateObjectId() };
  });

  it('should return status code 404', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${_id}`).send(payload);

    expect(status).toBe(404);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${_id}`).send(payload);

    expect(body.description).toBe('Not Found');
    expect(body.name).toBe('Car not found');
  });

  it('should return a body with values type string', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${_id}`).send(payload);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not update a fleet that not exists', () => {
  beforeEach(() => {
    idMock = generateObjectId();
    payload = { placa: 'NBA8901' };
  });

  it('should return status code 404', async () => {
    const { status } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${idMock}`).send(payload);
    expect(status).toBe(404);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${idMock}`).send(payload);

    expect(body.description).toBe('Not Found');
    expect(body.name).toBe('Fleet not found');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${idMock}`).send(payload);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not update a fleet with invalid field value', () => {
  beforeEach(() => {
    payload = { valor_diaria: true };
  });

  it('should return status code 404', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${_id}`).send(payload);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${_id}`).send(payload);

    expect(body[0].description).toBe('valor_diaria');
    expect(body[0].name).toBe('"valor_diaria" must be a number');
  });

  it('should return a body with values type string', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${id_locadora}/fleet/${_id}`).send(payload);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
