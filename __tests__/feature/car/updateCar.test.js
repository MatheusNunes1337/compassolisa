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
let idMock = '';
const cor = {
  cor: 'vermelho'
};
let accessoryMock = {};

describe('Update a car color', () => {
  beforeEach(async () => {
    carMock = {
      modelo: 'Modelo 02',
      cor: 'Cinza',
      ano: 2020,
      acessorios: [
        {
          descricao: 'Ar-condicionado'
        }
      ],
      quantidadePassageiros: 4
    };
  });

  it('should return status code 200', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(cor);

    expect(status).toBe(200);
  });

  it('should return a body with carMock properties e values updated plus _id', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(cor);

    expect(body).toHaveProperty('_id');
    expect(body.modelo).toBe(carMock.modelo);
    expect(body.cor).toBe(cor.cor);
    expect(body.ano).toBe(carMock.ano);
    expect(body.acessorios[0].descricao).toBe(carMock.acessorios[0].descricao);
    expect(body.quantidadePassageiros).toBe(carMock.quantidadePassageiros);
  });

  it('should return a body with values of type string, number and object', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const response = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(cor);

    const { body } = response;

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

describe('Do not update a car when modelo has invalid value', () => {
  beforeEach(async () => {
    carMock = {
      modelo: 'Modelo 05',
      cor: 'Verde',
      ano: 2017,
      acessorios: [
        {
          descricao: 'Ar-condicionado'
        }
      ],
      quantidadePassageiros: 4
    };
  });

  it('should return status code 400', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ modelo: 2000 });

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ modelo: 2000 });

    expect(body[0].name).toBe('"modelo" must be a string');
    expect(body[0].description).toBe('modelo');
  });

  it('should return a body with values of type string', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app)
      .put(`/api/v1/car/${_id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ modelo: 2000 });

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not update a car that not exists', () => {
  beforeEach(async () => {
    carMock = {
      modelo: 'Modelo 10',
      cor: 'Cinza',
      ano: 2006,
      acessorios: [
        {
          descricao: 'Ar-condicionado'
        }
      ],
      quantidadePassageiros: 5
    };
    idMock = '4eed60c86632e0ac33025313';
  });

  it('should return status code 404', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { status } = await request(app)
      .put(`/api/v1/car/${idMock}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantidadePassageiros: 4 });

    expect(status).toBe(404);
  });

  it('should return a body with name and description error properties', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { body } = await request(app)
      .put(`/api/v1/car/${idMock}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantidadePassageiros: 4 });

    expect(body.name).toBe('Car not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a body with values of type string', async () => {
    await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { body } = await request(app)
      .put(`/api/v1/car/${idMock}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantidadePassageiros: 4 });

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Update a car accessory', () => {
  beforeEach(async () => {
    carMock = {
      modelo: 'Modelo 02',
      cor: 'Cinza',
      ano: 2020,
      acessorios: [
        {
          descricao: 'Ar-condicionado'
        }
      ],
      quantidadePassageiros: 4
    };

    accessoryMock = { descricao: 'Air bag' };
  });

  it('should return status code 200', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { status } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(status).toBe(200);
  });

  it('should return a body with carMock properties e values updated plus _id', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body).toHaveProperty('_id');
    expect(body.modelo).toBe(carMock.modelo);
    expect(body.cor).toBe(carMock.cor);
    expect(body.ano).toBe(carMock.ano);
    expect(body.acessorios[0].descricao).toBe(accessoryMock.descricao);
    expect(body.quantidadePassageiros).toBe(carMock.quantidadePassageiros);
  });

  it('should return a body with values of type string, number and object', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

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

describe('Do not Update a car accessory when it has invalid value', () => {
  beforeEach(async () => {
    carMock = {
      modelo: 'Modelo 00',
      cor: 'Aazul',
      ano: 2018,
      acessorios: [
        {
          descricao: 'Teto solar'
        }
      ],
      quantidadePassageiros: 2
    };

    accessoryMock = { descricao: true };
  });

  it('should return status code 400', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { status } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body[0].name).toBe('Accessory description must be a string');
    expect(body[0].description).toBe('descricao');
  });

  it('should return a body with values of type string', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not Update a car accessory when it has invalid value', () => {
  beforeEach(async () => {
    carMock = {
      modelo: 'Modelo 00',
      cor: 'Aazul',
      ano: 2018,
      acessorios: [
        {
          descricao: 'Teto solar'
        },
        {
          descricao: 'Ar-condicionado'
        }
      ],
      quantidadePassageiros: 2
    };

    accessoryMock = { descricao: 'Ar-condicionado' };
  });

  it('should return status code 400', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { status } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body.name).toBe(`This car already has an accessory called ${accessoryMock.descricao}`);
    expect(body.description).toBe('Conflict');
  });

  it('should return a body with values of type string', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { _id, acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${_id.toString()}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not Update a car accessory of a car that not exists', () => {
  beforeEach(async () => {
    carMock = {
      modelo: 'Modelo 00',
      cor: 'Aazul',
      ano: 2018,
      acessorios: [
        {
          descricao: 'Teto solar'
        },
        {
          descricao: 'Ar-condicionado'
        }
      ],
      quantidadePassageiros: 2
    };

    accessoryMock = { descricao: 'Ar-condicionado' };
    idMock = '4eed60c86632e0ac3b125320';
  });

  it('should return status code 404', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { status } = await request(app)
      .patch(`/api/v1/car/${idMock}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(status).toBe(404);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${idMock}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body.name).toBe('Car not found');
    expect(body.description).toBe('Not Found');
  });

  it('should return a body with values of type string', async () => {
    const { text } = await request(app).post('/api/v1/car/').set('Authorization', `Bearer ${token}`).send(carMock);

    const { acessorios } = JSON.parse(text);
    const accessoryId = acessorios[0]._id;

    const { body } = await request(app)
      .patch(`/api/v1/car/${idMock}/acessorios/${accessoryId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(accessoryMock);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
