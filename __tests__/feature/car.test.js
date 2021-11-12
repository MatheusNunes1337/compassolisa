const request = require('supertest');

const { Linter } = require('eslint');
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

let carMock = {};
let carMock02 = {};

describe('create a new car', () => {
  beforeEach(async () => {
    await CarModel.deleteMany();
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
    const response = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    const { status } = response;
    expect(status).toBe(201);
  });

  it('should return a body with _id and the same properties from carMock plus _id', async () => {
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

describe('Do not create a car with accessory field blank', () => {
  beforeEach(async () => {
    await CarModel.deleteMany();
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
    const response = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    const { status } = response;
    expect(status).toBe(400);
  });

  it('should return a body with describe and name properties', async () => {
    const response = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { body } = response;

    expect(body[0].name).toBe('"modelo" is not allowed to be empty');
    expect(body[0].description).toBe('modelo');
  });

  it('should return a body with values of type string, number and object', async () => {
    const response = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { body } = response;

    expect(typeof body).toBe('object');
    expect(typeof body[0].name).toBe('string');
    expect(typeof body[0].description).toBe('string');
  });
});

describe('Do not create a car with ano greather than 2022', () => {
  beforeEach(async () => {
    await CarModel.deleteMany();
    carMock = {
      modelo: 'Modelo 02',
      cor: 'Cinza',
      ano: 2025,
      acessorios: [
        {
          descricao: 'Ar-condicionado'
        }
      ],
      quantidadePassageiros: 4
    };
  });

  it('should return status code 400', async () => {
    const response = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    const { status } = response;
    expect(status).toBe(400);
  });

  it('should return a body with describe and name properties', async () => {
    const response = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { body } = response;

    expect(body[0].name).toBe('"ano" must be less than or equal to 2022');
    expect(body[0].description).toBe('ano');
  });

  it('should return a body with values of type string, number and object', async () => {
    const response = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { body } = response;

    expect(typeof body).toBe('object');
    expect(typeof body[0].name).toBe('string');
    expect(typeof body[0].description).toBe('string');
  });
});

describe('Get all cars', () => {
  beforeEach(async () => {
    await CarModel.deleteMany();

    carMock = {
      modelo: 'Modelo 01',
      cor: 'Verde',
      ano: 2021,
      acessorios: [
        {
          descricao: 'Ar-condicionado'
        },
        {
          descricao: 'Air bag'
        }
      ],
      quantidadePassageiros: 4
    };

    carMock02 = {
      modelo: 'Modelo 02',
      cor: 'Preto',
      ano: 2014,
      acessorios: [
        {
          descricao: 'Ar-condicionado'
        }
      ],
      quantidadePassageiros: 5
    };
  });

  it('should return status code 200', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock02);

    const response = await request(app).get('/api/v1/car/').set('Authorization', `Bearer ${token}`);

    const { status } = response;

    expect(status).toBe(200);
  });

  it('should return an array of car objects', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock02);

    const response = await request(app).get('/api/v1/car/').set('Authorization', `Bearer ${token}`);

    const { body } = response;
    const { veiculos } = body;

    expect(veiculos[0]).toHaveProperty('_id');
    expect(veiculos[0].modelo).toBe(carMock.modelo);
    expect(veiculos[0].cor).toBe(carMock.cor);
    expect(veiculos[0].ano).toBe(carMock.ano);
    expect(veiculos[0].acessorios[0].descricao).toBe(carMock.acessorios[0].descricao);
    expect(veiculos[0].quantidadePassageiros).toBe(carMock.quantidadePassageiros);

    expect(veiculos[1]).toHaveProperty('_id');
    expect(veiculos[1].modelo).toBe(carMock02.modelo);
    expect(veiculos[1].cor).toBe(carMock02.cor);
    expect(veiculos[1].ano).toBe(carMock02.ano);
    expect(veiculos[1].acessorios[0].descricao).toBe(carMock02.acessorios[0].descricao);
    expect(veiculos[1].quantidadePassageiros).toBe(carMock02.quantidadePassageiros);
  });

  it('should return an array of car objects with values type string, number an object', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock02);

    const response = await request(app).get('/api/v1/car/').set('Authorization', `Bearer ${token}`);

    const { body } = response;
    const { veiculos } = body;

    expect(typeof veiculos[0]).toBe('object');
    expect(typeof veiculos[0].modelo).toBe('string');
    expect(typeof veiculos[0].cor).toBe('string');
    expect(typeof veiculos[0].ano).toBe('number');
    expect(typeof veiculos[0].acessorios).toBe('object');
    expect(typeof veiculos[0].acessorios[0].descricao).toBe('string');
    expect(typeof veiculos[0].quantidadePassageiros).toBe('number');

    expect(typeof veiculos[1]).toBe('object');
    expect(typeof veiculos[1].modelo).toBe('string');
    expect(typeof veiculos[1].cor).toBe('string');
    expect(typeof veiculos[1].ano).toBe('number');
    expect(typeof veiculos[1].acessorios).toBe('object');
    expect(typeof veiculos[1].acessorios[0].descricao).toBe('string');
    expect(typeof veiculos[1].quantidadePassageiros).toBe('number');
  });
});
