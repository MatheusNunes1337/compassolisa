const request = require('supertest');
const { RentalDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let rentalMock = {};
let idMock = '';

describe('delete a rental', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-760';
    rentalMock.endereco.pop();
  });

  it('should return status code 204', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).delete(`/api/v1/rental/${_id.toString()}`);

    expect(status).toBe(204);
  });

  it('should return a empty object', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).delete(`/api/v1/rental/${_id.toString()}`);

    expect(body.nome).toBeUndefined();
    expect(body.cnpj).toBeUndefined();
    expect(body.atividades).toBeUndefined();
    expect(body.endereco).toBeUndefined();
  });

  it('should return no object', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).delete(`/api/v1/rental/${_id.toString()}`);

    expect(body).toEqual({});
  });
});

describe('Do not delete a rental that no exists', () => {
  beforeEach(async () => {
    idMock = generateObjectId();
  });

  it('should return status code 404', async () => {
    const { status } = await request(app).delete(`/api/v1/rental/${idMock}`);

    expect(status).toBe(404);
  });

  it('should return an object with name and description error properties', async () => {
    const { body } = await request(app).delete(`/api/v1/rental/${idMock}`);

    expect(body.name).toBe('Rental not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a object with properties type string', async () => {
    const { body } = await request(app).delete(`/api/v1/rental/${idMock}`);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
