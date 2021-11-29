const request = require('supertest');
const { RentalDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let rentalMock = {};
let idMock = '';

describe('get rentals by cep', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-760';
    rentalMock.endereco.pop();
  });

  it('should return status code 200', async () => {
    await request(app).post('/api/v1/rental/').send(rentalMock);

    const { status } = await request(app).get(`/api/v1/rental/?cep=${rentalMock.endereco[0].cep}`);

    expect(status).toBe(200);
  });

  it('should return an array of rentals with same properties of mocks plus _id and full address', async () => {
    await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = await request(app).get(`/api/v1/rental/?cep=${rentalMock.endereco[0].cep}`);

    const { locadoras } = body;

    expect(locadoras).toHaveLength(1);

    expect(locadoras[0]).toHaveProperty('_id');
    expect(locadoras[0].nome).toBe(rentalMock.nome);
    expect(locadoras[0].cnpj).toBe(rentalMock.cnpj);
    expect(locadoras[0].atividades).toBe(rentalMock.atividades);
    expect(locadoras[0].endereco[0].cep).toBe(rentalMock.endereco[0].cep);
    expect(locadoras[0].endereco[0].number).toBe(rentalMock.endereco[0].number);
    expect(locadoras[0].endereco[0].complemento).toBe(rentalMock.endereco[0].complemento);
    expect(locadoras[0].endereco[0].isFilial).toBeUndefined();
  });

  it('should return an array of rental objects with values type string, number an object', async () => {
    await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = await request(app).get(`/api/v1/rental/?cep=${rentalMock.endereco[0].cep}`);

    const { locadoras } = body;

    expect(locadoras[0]).toEqual({
      _id: expect.any(String),
      nome: expect.any(String),
      cnpj: expect.any(String),
      atividades: expect.any(String),
      endereco: expect.any(Object)
    });

    expect(locadoras[0].endereco[0]).toEqual({
      cep: expect.any(String),
      logradouro: expect.any(String),
      complemento: expect.any(String),
      bairro: expect.any(String),
      number: expect.any(Number),
      localidade: expect.any(String),
      uf: expect.any(String)
    });
  });
});

describe('Do not get rentals when offset has an invalid value', () => {
  it('should return status code 400', async () => {
    const { status } = await request(app).get('/api/v1/rental/?offset=-500');

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).get('/api/v1/rental/?offset=-500');

    expect(body[0].description).toBe('offset');
    expect(body[0].name).toBe('"offset" must be greater than or equal to 0');
  });

  it('should return an error object with values type string', async () => {
    const { body } = await request(app).get('/api/v1/rental/offset=-500');

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('get rental by id', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-760';
    rentalMock.endereco.pop();
  });

  it('should return status code 200', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).get(`/api/v1/rental/${_id.toString()}`);

    expect(status).toBe(200);
  });

  it('should return a body with _id and the same properties of rentalMock', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).get(`/api/v1/rental/${_id.toString()}`);

    expect(body).toHaveProperty('_id');
    expect(body.nome).toBe(rentalMock.nome);
    expect(body.cnpj).toBe(rentalMock.cnpj);
    expect(body.atividades).toBe(rentalMock.atividades);
    expect(body.endereco[0].cep).toBe(rentalMock.endereco[0].cep);
    expect(body.endereco[0].number).toBe(rentalMock.endereco[0].number);
    expect(body.endereco[0].complemento).toBe(rentalMock.endereco[0].complemento);
    expect(body.endereco[0].isFilial).toBeUndefined();
  });

  it('should return a object with values type string', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).get(`/api/v1/rental/${_id.toString()}`);

    expect(body).toEqual({
      _id: expect.any(String),
      nome: expect.any(String),
      cnpj: expect.any(String),
      atividades: expect.any(String),
      endereco: expect.any(Object)
    });

    expect(body.endereco[0]).toEqual({
      cep: expect.any(String),
      logradouro: expect.any(String),
      complemento: expect.any(String),
      bairro: expect.any(String),
      number: expect.any(Number),
      localidade: expect.any(String),
      uf: expect.any(String)
    });
  });
});

describe('get no rental by id', () => {
  beforeEach(async () => {
    idMock = generateObjectId();
  });
  it('should return status code 204', async () => {
    const { status } = await request(app).get(`/api/v1/rental/${idMock}`);
    expect(status).toBe(204);
  });

  it('should return a body with empty object', async () => {
    const { body } = await request(app).get(`/api/v1/rental/${idMock}`);

    expect(body._id).toBeUndefined();
    expect(body.nome).toBeUndefined();
    expect(body.cnpj).toBeUndefined();
    expect(body.atividades).toBeUndefined();
    expect(body.endereco).toBeUndefined();
  });

  it('should return a body with any property', async () => {
    const { body } = await request(app).get(`/api/v1/rental/${idMock}`);

    expect(body).toEqual({});
  });
});
