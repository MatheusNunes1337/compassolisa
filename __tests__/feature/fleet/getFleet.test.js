const request = require('supertest');
const { RentalDataFaker, CarDataFaker, UserDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let id_carro = '';
let id_locadora = '';
const idMock = '';
let fleetMock = {};
let token = null;

beforeEach(async () => {
  let response;
  const userMock = UserDataFaker();

  await request(app).post('/api/v1/people/').send(userMock);

  response = await request(app).post('/api/v1/authenticate/').send({ email: userMock.email, senha: userMock.senha });

  const { body } = response;
  token = body.token;

  const carMock = CarDataFaker();
  const rentalMock = RentalDataFaker();
  rentalMock.endereco[0].cep = '96020-971';
  rentalMock.endereco.pop();

  response = await request(app)
    .post('/api/v1/car/')
    .send(carMock)
    .set('Authorization', `Bearer ${token}`)
    .send(carMock);

  const car = JSON.parse(response.text);
  id_carro = car._id;

  response = await request(app).post('/api/v1/rental/').send(rentalMock);
  const rental = JSON.parse(response.text);
  id_locadora = rental._id;

  fleetMock = {
    id_carro,
    status: 'disponível',
    valor_diaria: 250,
    placa: 'BRA1782'
  };
});

describe('Get all fleet', () => {
  it('should return status code 200', async () => {
    await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { status } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet`);

    expect(status).toBe(200);
  });

  it('should return an array of fleets with same properties of mock plus _id and locadora_id', async () => {
    await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { body } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet`);

    const { frota } = body;

    expect(frota[0]).toHaveProperty('_id');
    expect(frota[0].id_carro).toBe(fleetMock.id_carro);
    expect(frota[0].status).toBe(fleetMock.status);
    expect(frota[0].valor_diaria).toBe(fleetMock.valor_diaria);
    expect(frota[0].id_locadora).toBe(id_locadora);
    expect(frota[0].placa).toBe(fleetMock.placa);
  });

  it('should return an array of rental objects with values type string, number an object', async () => {
    await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { body } = await request(app).get(`/api/v1/rental/${id_locadora}/fleet`);
    console.log('body', body);

    const { frota } = body;

    expect(frota[0]).toEqual({
      _id: expect.any(String),
      id_carro: expect.any(String),
      status: expect.any(String),
      valor_diaria: expect.any(Number),
      id_locadora: expect.any(String),
      placa: expect.any(String)
    });
  });
});
