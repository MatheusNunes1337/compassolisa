const request = require('supertest');
const { RentalDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let rentalMock = {};
let rentalMock02 = {};
let idMock = '';
let payload = {};

describe('Do not update a rental that no exists', () => {
  beforeEach(async () => {
    idMock = generateObjectId();
    payload = {
      nome: 'Locadora do David'
    };
  });

  it('should return status code 404', async () => {
    const { status } = await request(app).put(`/api/v1/rental/${idMock}`).send(payload);

    expect(status).toBe(404);
  });

  it('should return an object with name and description error properties', async () => {
    const { body } = await request(app).put(`/api/v1/rental/${idMock}`).send(payload);

    expect(body.name).toBe('Rental not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a object with properties type string', async () => {
    const { body } = await request(app).put(`/api/v1/rental/${idMock}`).send(payload);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not update a rental address with a cep that not exists', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-760';
    rentalMock.endereco.pop();
    rentalMock02 = RentalDataFaker();

    payload = {
      endereco: [rentalMock02.endereco[0]]
    };
    payload.endereco[0].cep = '12455-000';
  });

  it('should return status code 400', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).put(`/api/v1/rental/${_id.toString()}`).send(payload);

    expect(status).toBe(400);
  });

  it('should return an object with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${_id.toString()}`).send(payload);

    expect(body.name).toBe(`The cep ${payload.endereco[0].cep} does not exist`);
    expect(body.description).toBe('Bad Request');
  });

  it('should return a object with properties type string', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${_id.toString()}`).send(payload);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not update a rental with invalid field value', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-760';
    rentalMock.endereco.pop();

    payload = {
      nome: true
    };
  });

  it('should return status code 400', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).put(`/api/v1/rental/${_id.toString()}`).send(payload);

    expect(status).toBe(400);
  });

  it('should return an object with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${_id.toString()}`).send(payload);

    expect(body[0].name).toBe('"nome" must be a string');
    expect(body[0].description).toBe('nome');
  });

  it('should return a object with properties type string', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${_id.toString()}`).send(payload);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
