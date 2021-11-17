const request = require('supertest');

const app = require('../../../src/index');

let token = null;

beforeAll(async () => {
  const userMock = {
    nome: 'James winston',
    cpf: '182.931.371-08',
    data_nascimento: '17/12/1945',
    email: 'james1945@outlook.com',
    senha: 'mynae13',
    habilitado: 'não'
  };

  await request(app).post('/api/v1/people/').send(userMock);

  const response = await request(app)
    .post('/api/v1/authenticate/')
    .send({ email: userMock.email, senha: userMock.senha });

  const { body } = response;
  token = body.token;
});

let carMock = {};

describe('create a new car', () => {
  beforeEach(async () => {
    carMock = {
      modelo: 'Modelo 01',
      cor: 'vermelho',
      ano: 2019,
      acessorios: [
        {
          descricao: 'Ar-condicionado'
        }
      ],
      quantidadePassageiros: 5
    };
  });

  it('should return status code 201', async () => {
    const { status } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    expect(status).toBe(201);
  });

  it('should return a body with _id and the same properties from carMock plus _id', async () => {
    const { body } = await request(app)
      .post('/api/v1/car/')
      .set('Authorization', `Bearer ${token}`)
      .send(carMock)
      .send(carMock);

    expect(body).toHaveProperty('_id');
    expect(body.modelo).toBe(carMock.modelo);
    expect(body.cor).toBe(carMock.cor);
    expect(body.ano).toBe(carMock.ano);
    expect(body.acessorios[0].descricao).toBe(carMock.acessorios[0].descricao);
    expect(body.quantidadePassageiros).toBe(carMock.quantidadePassageiros);
  });

  it('should return a body with values of type string, number and object', async () => {
    const { body } = await request(app)
      .post('/api/v1/car/')
      .set('Authorization', `Bearer ${token}`)
      .send(carMock)
      .send(carMock);

    expect(body).toEqual({
      _id: expect.any(String),
      modelo: expect.any(String),
      cor: expect.any(String),
      ano: expect.any(Number),
      acessorios: expect.any(Object),
      quantidadePassageiros: expect.any(Number)
    });
  });
});

describe('Do not create a car with accessory field blank', () => {
  beforeEach(async () => {
    carMock = {
      modelo: '',
      cor: 'vermelho',
      ano: 2019,
      acessorios: [
        {
          descricao: 'Ar-condicionado'
        }
      ],
      quantidadePassageiros: 5
    };
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    expect(status).toBe(400);
  });

  it('should return a body with describe and name properties', async () => {
    const { body } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    expect(body[0].name).toBe('"modelo" is not allowed to be empty');
    expect(body[0].description).toBe('modelo');
  });

  it('should return a body with values of type string, number and object', async () => {
    const { body } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
