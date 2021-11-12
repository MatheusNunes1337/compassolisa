const request = require('supertest');

const app = require('../../src/index');
const CarModel = require('../../src/app/models/CarModel');
const UserModel = require('../../src/app/models/UserModel');

let token = null;

beforeAll(async () => {
  await CarModel.deleteMany();
  await UserModel.deleteMany();

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

beforeEach(async () => {
  await CarModel.deleteMany();
});

describe('create a new car', () => {
  it('should return status code 201', async () => {
    const carMock = {
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

    const response = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    const { status } = response;
    expect(status).toBe(201);
  });

  it('should return a body with _id and the same properties from carMock plus _id', async () => {
    const carMock = {
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

    const response = await request(app)
      .post('/api/v1/car/')
      .set('Authorization', `Bearer ${token}`)
      .send(carMock)
      .send(carMock);
    const { body } = response;

    expect(body).toHaveProperty('_id');
    expect(body.modelo).toBe(carMock.modelo);
    expect(body.cor).toBe(carMock.cor);
    expect(body.ano).toBe(carMock.ano);
    expect(body.acessorios[0].descricao).toBe(carMock.acessorios[0].descricao);
    expect(body.quantidadePassageiros).toBe(carMock.quantidadePassageiros);
  });

  it('should return a body with values of type string, number and object', async () => {
    const carMock = {
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

    const response = await request(app)
      .post('/api/v1/car/')
      .set('Authorization', `Bearer ${token}`)
      .send(carMock)
      .send(carMock);

    const { body } = response;

    expect(typeof body).toBe('object');
    expect(typeof body._id).toBe('string');
    expect(typeof body.modelo).toBe('string');
    expect(typeof body.cor).toBe('string');
    expect(typeof body.ano).toBe('number');
    expect(typeof body.acessorios).toBe('object');
    expect(typeof body.quantidadePassageiros).toBe('number');
  });
});
