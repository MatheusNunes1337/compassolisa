const request = require('supertest');

const app = require('../../../src/index');

let rentalMock = {};

describe('get rentals by cep', () => {
  beforeEach(async () => {
    rentalMock = {
      nome: 'Moonlight',
      cnpj: '12.567.124/1039-11',
      atividades: 'Aluguel de ferraris',
      endereco: [
        {
          cep: '96055-760',
          number: 201,
          complemento: 'Ao lado do shopping',
          isFilial: false
        }
      ]
    };
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
  it('should return status code 200', async () => {
    const { status } = await request(app).get('/api/v1/rental/?offset=-500');

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { body } = await request(app).get('/api/v1/rental/?offset=-500');

    expect(body[0].description).toBe('offset');
    expect(body[0].name).toBe('"offset" must be greater than or equal to 0');
  });

  it('should return an error object with values type string', async () => {
    await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = await request(app).get('/api/v1/rental/offset=-500');

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('get users by id', () => {
  beforeEach(() => {
    rentalMock = {
      nome: 'Locadora do José',
      cnpj: '14.298.076/1278-12',
      atividades: 'Aluguel de fuscas',
      endereco: [
        {
          cep: '96055-740',
          number: 1854,
          complemento: 'Na frente do Jockey Club',
          isFilial: false
        }
      ]
    };
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
  it('should return status code 204', async () => {
    const id = 'd0818ad8cfcc0116aab100a1';

    const { status } = await request(app).get(`/api/v1/rental/${id}`);
    expect(status).toBe(204);
  });

  it('should return a body with empty object', async () => {
    const id = 'd0818ad8cfcc0116aab100a1';

    const { body } = await request(app).get(`/api/v1/rental/${id}`);

    expect(body._id).toBeUndefined();
    expect(body.nome).toBeUndefined();
    expect(body.cnpj).toBeUndefined();
    expect(body.atividades).toBeUndefined();
    expect(body.endereco).toBeUndefined();
  });

  it('should return a body with any property', async () => {
    const id = 'd0818ad8cfcc0116aab100a1';

    const { body } = await request(app).get(`/api/v1/rental/${id}`);

    expect(body).toEqual({});
  });
});
