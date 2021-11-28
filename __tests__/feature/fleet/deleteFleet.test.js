const request = require('supertest');
const { RentalDataFaker, CarDataFaker, UserDataFaker } = require('../../support/datafaker');
const generateObjectId = require('../../support/generateObjectId');

const app = require('../../../src/index');

let id_carro = '';
let id_locadora = '';
let idMock = '';
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

describe('Do not delete a fleet when the rental not exists', () => {
  beforeEach(() => {
    idMock = generateObjectId();
  });
  it('should return status code 404', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { status } = await request(app).delete(`/api/v1/rental/${idMock}/fleet/${_id}`);

    expect(status).toBe(404);
  });

  it('should return a body with name and description error properties', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).delete(`/api/v1/rental/${idMock}/fleet/${_id}`);

    expect(body.description).toBe('Not Found');
    expect(body.name).toBe('Rental not found');
  });

  it('should return a body with values type string', async () => {
    const { text } = await request(app).post(`/api/v1/rental/${id_locadora}/fleet`).send(fleetMock);

    const { _id } = JSON.parse(text);

    const { body } = await request(app).delete(`/api/v1/rental/${idMock}/fleet/${_id}`);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
