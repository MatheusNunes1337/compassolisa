const request = require('supertest');
const { RentalDataFaker } = require('../../support/datafaker');

const app = require('../../../src/index');

let rentalMock = {};
let rentalMock02 = {};

describe('create a new rental', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-740';
    rentalMock.endereco.pop();
  });

  it('should return status code 201', async () => {
    const { status } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(status).toBe(201);
  });

  it('should return a body with _id and the same properties from rentalMock with full address except isFilial', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body).toHaveProperty('_id');
    expect(body.nome).toBe(rentalMock.nome);
    expect(body.cnpj).toBe(rentalMock.cnpj);
    expect(body.atividades).toBe(rentalMock.atividades);
    expect(body.endereco[0].cep).toBe(rentalMock.endereco[0].cep);
    expect(body.endereco[0].number).toBe(rentalMock.endereco[0].number);
    expect(body.endereco[0].complemento).toBe(rentalMock.endereco[0].complemento);
    expect(body.endereco[0].logradouro).toBeDefined();
    expect(body.endereco[0].bairro).toBeDefined();
    expect(body.endereco[0].localidade).toBeDefined();
    expect(body.endereco[0].uf).toBeDefined();
    expect(body.endereco[0].isFilial).toBeUndefined();
  });

  it('should return a body with values type string, except number(number) and isFilial(undefined)', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

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

describe('Do not create a rental with cep that not exists', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '12455-000';
    rentalMock.endereco.pop();
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body.name).toBe(`The cep ${rentalMock.endereco[0].cep} does not exist`);
    expect(body.description).toBe('Bad Request');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a rental with no head office', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-740';
    rentalMock.endereco[0].isFilial = true;
    rentalMock.endereco.pop();
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body.name).toBe('A rental must have a head office');
    expect(body.description).toBe('Bad Request');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a rental with duplicated adresses', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-740';

    rentalMock.endereco[1].cep = rentalMock.endereco[0].cep;
    rentalMock.endereco[1].number = rentalMock.endereco[0].number;
    rentalMock.endereco[1].complemento = rentalMock.endereco[0].complemento;
    rentalMock.endereco[1].isFilial = true;
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body.name).toBe(
      `It seems you trying to register duplicated adresses with cep ${rentalMock.endereco[0].cep} and number ${rentalMock.endereco[0].number}`
    );
    expect(body.description).toBe('Conflict');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a rental with invalid field value', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-740';
    rentalMock.nome = true;
    rentalMock.endereco.pop();
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body[0].name).toBe('"nome" must be a string');
    expect(body[0].description).toBe('nome');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a rental with two head offices', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-740';
    rentalMock.endereco[1].cep = '96055-760';
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body.name).toBe('A rental must have only one head office');
    expect(body.description).toBe('Bad Request');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a rental with cnpj already in use', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-740';
    rentalMock.endereco.pop();

    rentalMock02 = RentalDataFaker();
    rentalMock02.endereco[0].cep = '96055-760';
    rentalMock02.cnpj = rentalMock.cnpj;
    rentalMock02.endereco.pop();
  });

  it('should return status code 400', async () => {
    await request(app).post('/api/v1/rental/').send(rentalMock);
    const { status } = await request(app).post('/api/v1/rental/').send(rentalMock02);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    await request(app).post('/api/v1/rental/').send(rentalMock);
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock02);

    expect(body.name).toBe(`Cnpj ${rentalMock02.cnpj} already in use`);
    expect(body.description).toBe('Conflict');
  });

  it('should return a body with values type string', async () => {
    await request(app).post('/api/v1/rental/').send(rentalMock);
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock02);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a rental with address already in use', () => {
  beforeEach(async () => {
    rentalMock = RentalDataFaker();
    rentalMock.endereco[0].cep = '96055-740';
    rentalMock.endereco.pop();

    rentalMock02 = RentalDataFaker();
    rentalMock02.endereco[0].cep = rentalMock.endereco[0].cep;
    rentalMock02.endereco[0].number = rentalMock.endereco[0].number;
    rentalMock02.endereco.pop();
  });

  it('should return status code 400', async () => {
    await request(app).post('/api/v1/rental/').send(rentalMock);
    const { status } = await request(app).post('/api/v1/rental/').send(rentalMock02);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    await request(app).post('/api/v1/rental/').send(rentalMock);
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock02);

    expect(body.name).toBe(
      `The address with cep ${rentalMock02.endereco[0].cep} and number ${rentalMock02.endereco[0].number} already in use`
    );
    expect(body.description).toBe('Conflict');
  });

  it('should return a body with values type string', async () => {
    await request(app).post('/api/v1/rental/').send(rentalMock);
    const { body } = await request(app).post('/api/v1/rental/').send(rentalMock02);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
