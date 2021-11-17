const request = require('supertest');

const app = require('../../../src/index');

let rentalMock = {};
let idMock = '';

describe('delete a rental', () => {
  beforeEach(async () => {
    rentalMock = {
      nome: 'Moonlight',
      cnpj: '12.567.124/1039-11',
      atividades: 'Aluguel de ferraris',
      endereco: [
        {
          cep: '20050-000',
          number: 201,
          complemento: '',
          isFilial: false
        },
        {
          cep: '20050-000',
          number: 467,
          complemento: 'Na frente da padaria do Jorge',
          isFilial: true
        }
      ]
    };
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

describe('delete a rental', () => {
  beforeEach(async () => {
    idMock = '5afd40c86762e0fb12142f23';
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
