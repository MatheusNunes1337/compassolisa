const request = require('supertest');
const { RentalDataFaker, CarDataFaker, UserDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let id_carro = '';
let id_locadora = '';
let id_user = '';
const idMock = '';
let fleetMock = {};
let reserveMock = {};
let token = null;

beforeEach(async () => {
  let response;
  const userMock = UserDataFaker();

  response = await request(app).post('/api/v1/people/').send(userMock);
  const user = JSON.parse(response.text);
  id_user = user._id;

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

  response = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);
  const fleet = JSON.parse(response.text);
  id_carro = fleet._id;

  reserveMock = {
    data_inicio: '01/12/2021',
    data_fim: '10/12/2021',
    id_carro
  };
});

describe('Get all reserves', () => {
  it('should return status code 200', async () => {
    await request(app)
      .post(`/api/v1/rental/${id_locadora}/reserve`)
      .set('Authorization', `Bearer ${token}`)
      .send(reserveMock);

    const { status } = await request(app)
      .get(`/api/v1/rental/${id_locadora}/reserve`)
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(200);
  });

  it('should return an array of reserves with same properties of mock plus _id, locadora_id and id_user', async () => {
    await request(app)
      .post(`/api/v1/rental/${id_locadora}/reserve`)
      .set('Authorization', `Bearer ${token}`)
      .send(reserveMock);

    const { body } = await request(app)
      .get(`/api/v1/rental/${id_locadora}/reserve`)
      .set('Authorization', `Bearer ${token}`);

    const { reservas } = body;

    expect(reservas[0]).toHaveProperty('_id');
    expect(reservas[0].id_user).toBe(id_user);
    expect(reservas[0].data_inicio).toBe(reserveMock.data_inicio);
    expect(reservas[0].data_fim).toBe(reserveMock.data_fim);
    expect(reservas[0].id_carro).toBe(fleetMock.id_carro);
    expect(reservas[0].id_locadora).toBe(id_locadora);
  });

  it('should return an array of reserves objects with values type string, number and object', async () => {
    await request(app)
      .post(`/api/v1/rental/${id_locadora}/reserve`)
      .set('Authorization', `Bearer ${token}`)
      .send(reserveMock);

    const { body } = await request(app)
      .get(`/api/v1/rental/${id_locadora}/reserve`)
      .set('Authorization', `Bearer ${token}`);

    const { reservas } = body;

    expect(reservas[0]).toEqual({
      _id: expect.any(String),
      id_user: expect.any(String),
      data_inicio: expect.any(String),
      data_fim: expect.any(Number),
      id_carro: expect.any(String),
      id_locadora: expect.any(String),
      valor_final: expect.any(Number)
    });
  });
});
