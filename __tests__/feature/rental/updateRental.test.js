const request = require('supertest');

const app = require('../../../src/index');

let rentalMock = {};
let idMock = '';
let payload = {};

describe('update a rental cnpj and address', () => {
  beforeEach(async () => {
    rentalMock = {
      nome: 'Moonlight',
      cnpj: '12.567.124/1039-11',
      atividades: 'Aluguel de ferraris',
      endereco: [
        {
          cep: '20050-000',
          number: 201,
          complemento: 'Ao lado do shopping',
          isFilial: false
        }
      ]
    };
    payload = {
      cnpj: '15.891.124/1039-11',
      endereco: [
        {
          cep: '20050-000',
          number: 267,
          complemento: 'Na frente da cafeteria do Júlia',
          isFilial: false
        }
      ]
    };
  });

  it('should return status code 200', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).put(`/api/v1/rental/${_id.toString()}`).send(payload);

    expect(status).toBe(200);
  });

  it('should return a body with rentalMock properties and nome field updated plus _id', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${_id.toString()}`).send(payload);

    expect(body).toHaveProperty('_id');
    expect(body.nome).toBe(rentalMock.nome);
    expect(body.cnpj).toBe(payload.cnpj);
    expect(body.atividades).toBe(rentalMock.atividades);
    expect(body.endereco[0].cep).toBe(rentalMock.endereco[0].cep);
    expect(body.endereco[0].number).toBe(payload.endereco[0].number);
    expect(body.endereco[0].complemento).toBe(payload.endereco[0].complemento);
    expect(body.endereco[0].isFilial).toBeUndefined();
  });

  it('should return a body with values of type string, number and object', async () => {
    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).put(`/api/v1/rental/${_id.toString()}`).send(payload);

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

describe('Do not update a rental that no exists', () => {
  beforeEach(async () => {
    idMock = '5aad50b86715e0fb02142b23';
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
    rentalMock = {
      nome: 'Moonlight',
      cnpj: '12.567.124/1039-11',
      atividades: 'Aluguel de ferraris',
      endereco: [
        {
          cep: '20050-000',
          number: 201,
          complemento: 'Ao lado do shopping',
          isFilial: false
        }
      ]
    };

    payload = {
      endereco: [
        {
          cep: '10000-000',
          number: 267,
          complemento: 'Na frente da cafeteria do Júlia',
          isFilial: false
        }
      ]
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
    rentalMock = {
      nome: 'Locadora X',
      cnpj: '15.178.075/1267-12',
      atividades: 'Aluguel de carros',
      endereco: [
        {
          cep: '96055-760',
          number: 450,
          complemento: 'Ao lado do shopping',
          isFilial: false
        }
      ]
    };

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
