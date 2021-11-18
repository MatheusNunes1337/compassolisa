const request = require('supertest');

const app = require('../../../src/index');

let rentalMock = {};
let rentalMock02 = {};

describe('create a new rental', () => {
  beforeEach(async () => {
    rentalMock = {
      nome: 'Locadora do mock',
      cnpj: '16.760.085/0920-10',
      atividades: 'Alugel de carros e gestão de frotas',
      endereco: [
        {
          cep: '96055-740',
          number: 201,
          complemento: 'ao lado da havan',
          isFilial: false
        }
      ]
    };
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
    rentalMock = {
      nome: 'Locadora do mock',
      cnpj: '16.760.085/0920-10',
      atividades: 'Alugel de carros e gestão de frotas',
      endereco: [
        {
          cep: '12455-000',
          number: 201,
          complemento: 'ao lado da havan',
          isFilial: false
        }
      ]
    };
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
    rentalMock = {
      nome: 'Compassolisa',
      cnpj: '18.172.927/0920-15',
      atividades: 'Alugel de carros',
      endereco: [
        {
          cep: '12455-000',
          number: 201,
          complemento: 'ao lado da havan',
          isFilial: true
        }
      ]
    };
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
    rentalMock = {
      nome: 'Locadora 01',
      cnpj: '16.123.213/7291-19',
      atividades: 'Aluguel de carros de luxo',
      endereco: [
        {
          cep: '96055-740',
          number: 745,
          complemento: 'ao lado da havan',
          isFilial: true
        },
        {
          cep: '96055-740',
          number: 745,
          complemento: 'ao lado da havan',
          isFilial: false
        }
      ]
    };
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
    rentalMock = {
      nome: true,
      cnpj: '16.097.156/6751-12',
      atividades: 'Aluguel de carros de luxo',
      endereco: [
        {
          cep: '96055-740',
          number: 278,
          complemento: 'ao lado da havan',
          isFilial: false
        }
      ]
    };
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
    rentalMock = {
      nome: 'Locadora Y',
      cnpj: '12.076.192/8651-11',
      atividades: 'Aluguel de carros de luxo',
      endereco: [
        {
          cep: '38181-787',
          number: 451,
          complemento: 'ao lado da galeria central',
          isFilial: false
        },
        {
          cep: '96055-740',
          number: 745,
          complemento: 'ao lado da havan',
          isFilial: false
        }
      ]
    };
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
    rentalMock = {
      nome: 'Locadora Y',
      cnpj: '12.076.192/8651-11',
      atividades: 'Aluguel de carros de luxo',
      endereco: [
        {
          cep: '38181-787',
          number: 451,
          complemento: 'ao lado da galeria central',
          isFilial: false
        }
      ]
    };

    rentalMock02 = {
      nome: 'Locadora X',
      cnpj: '12.076.192/8651-11',
      atividades: 'Alugel de carros e gestão de frotas',
      endereco: [
        {
          cep: '96055-740',
          number: 201,
          complemento: 'ao lado da havan',
          isFilial: false
        }
      ]
    };
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
