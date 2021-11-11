const request = require('supertest');

const app = require('../../src/index');
const RentalModel = require('../../src/app/models/RentalModel');

beforeAll(async () => {
    await RentalModel.deleteMany();
});
  
beforeEach(async () => {
    await RentalModel.deleteMany();
});

describe('create a new rental', () => {
        
  it('should return status code 201', async() => {
    const rentalMock = {
        nome: "Locadora do mock",
        cnpj: "16.760.085/0920-10",
        atividades: "Alugel de carros e gestão de frotas",
        endereco: [
            {
                cep: "96055-740",
                number: 201,
                complemento: "ao lado da havan",
                isFilial: false
            },
        ]
    }

    const response = await request(app)
    .post('/api/v1/rental/')
    .send(rentalMock)

    const {status} = response
    expect(status).toBe(201)
  })

  it('should return a body with _id and the same properties from rentalMock with full address except isFilial', async() => {
    const rentalMock = {
        nome: "Locadora do mock",
        cnpj: "16.760.085/0920-10",
        atividades: "Alugel de carros e gestão de frotas",
        endereco: [
            {
                cep: "96055-740",
                number: 201,
                complemento: "ao lado da havan",
                isFilial: false
            },
        ]
    }

    const response = await request(app)
    .post('/api/v1/rental/')
    .send(rentalMock)

    const {body} = response

    expect(body).toHaveProperty('_id')
    expect(body.nome).toBe(rentalMock.nome)
    expect(body.cnpj).toBe(rentalMock.cnpj)
    expect(body.atividades).toBe(rentalMock.atividades)
    expect(body.endereco[0].cep).toBe(rentalMock.endereco[0].cep)
    expect(body.endereco[0].number).toBe(rentalMock.endereco[0].number)
    expect(body.endereco[0].complemento).toBe(rentalMock.endereco[0].complemento)
    expect(body.endereco[0].logradouro).toBeDefined()
    expect(body.endereco[0].bairro).toBeDefined()
    expect(body.endereco[0].localidade).toBeDefined()
    expect(body.endereco[0].uf).toBeDefined()
    expect(body.endereco[0].isFilial).toBeUndefined()
  })

  it('should return a body with values type string, except number(number) and isFilial(undefined)', async() => {
    const rentalMock = {
        nome: "Locadora do mock",
        cnpj: "16.760.085/0920-10",
        atividades: "Alugel de carros e gestão de frotas",
        endereco: [
            {
                cep: "96055-740",
                number: 201,
                complemento: "ao lado da havan",
                isFilial: false
            },
        ]
    }

    const response = await request(app)
    .post('/api/v1/rental/')
    .send(rentalMock)

    const {body} = response

    expect(typeof body).toBe('object')
    expect(typeof body.nome).toBe('string')
    expect(typeof body.cnpj).toBe('string')
    expect(typeof body.atividades).toBe('string')
    expect(typeof body.endereco).toBe('object')
    expect(typeof body.endereco[0].cep).toBe('string')
    expect(typeof body.endereco[0].number).toBe('number')
    expect(typeof body.endereco[0].complemento).toBe('string')
    expect(typeof body.endereco[0].isFilial).toBe('undefined')
    
  })
})