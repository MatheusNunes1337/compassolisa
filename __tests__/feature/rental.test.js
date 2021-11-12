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
  it('should return status code 201', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { status } = response;
    expect(status).toBe(201);
  });

  it('should return a body with _id and the same properties from rentalMock with full address except isFilial', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = response;

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
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = response;

    expect(typeof body).toBe('object');
    expect(typeof body.nome).toBe('string');
    expect(typeof body.cnpj).toBe('string');
    expect(typeof body.atividades).toBe('string');
    expect(typeof body.endereco).toBe('object');
    expect(typeof body.endereco[0].cep).toBe('string');
    expect(typeof body.endereco[0].number).toBe('number');
    expect(typeof body.endereco[0].complemento).toBe('string');
    expect(typeof body.endereco[0].isFilial).toBe('undefined');
  });
});

describe('Do not create a rental with cep that not exists', () => {
  it('should return status code 400', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { status } = response;
    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = response;

    expect(body.name).toBe(`The cep ${rentalMock.endereco[0].cep} does not exist`);
    expect(body.description).toBe('Bad Request');
  });

  it('should return a body with values type string', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = response;

    expect(typeof body).toBe('object');
    expect(typeof body.name).toBe('string');
    expect(typeof body.description).toBe('string');
  });
});

describe('Do not create a rental with cep that not exists', () => {
  it('should return status code 400', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { status } = response;
    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = response;

    expect(body.name).toBe(`The cep ${rentalMock.endereco[0].cep} does not exist`);
    expect(body.description).toBe('Bad Request');
  });

  it('should return a body with values type string', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = response;

    expect(typeof body).toBe('object');
    expect(typeof body.name).toBe('string');
    expect(typeof body.description).toBe('string');
  });
});

describe('Do not create a rental with no head office', () => {
  it('should return status code 400', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { status } = response;
    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = response;

    expect(body.name).toBe('A rental must have a head office');
    expect(body.description).toBe('Bad Request');
  });

  it('should return a body with values type string', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = response;

    expect(typeof body).toBe('object');
    expect(typeof body.name).toBe('string');
    expect(typeof body.description).toBe('string');
  });
});

describe('Do not create a rental with duplicated adresses', () => {
  it('should return status code 400', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { status } = response;
    expect(status).toBe(400);
  });

  it('should return a body with name and description error properties', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = response;

    expect(body.name).toBe(
      `It seems you trying to register duplicated adresses with cep ${rentalMock.endereco[0].cep} and number ${rentalMock.endereco[0].number}`
    );
    expect(body.description).toBe('Conflict');
  });

  it('should return a body with values type string', async () => {
    const rentalMock = {
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

    const response = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { body } = response;

    expect(typeof body).toBe('object');
    expect(typeof body.name).toBe('string');
    expect(typeof body.description).toBe('string');
  });
});

describe('delete a rental', () => {
  it('should return status code 204', async () => {
    const rentalMock = {
      nome: 'Moonlight',
      cnpj: '12.567.124/1039-11',
      atividades: 'Aluguel de ferraris',
      endereco: [
        {
          cep: '20050-000',
          number: 201,
          complemento: '',
          isFilial: false
        },
        {
          cep: '20050-000',
          number: 467,
          complemento: 'Na frente da padaria do Jorge',
          isFilial: true
        }
      ]
    };

    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);
    console.log('text', text);

    const { _id } = JSON.parse(text);
    console.log('id', _id);

    const response = await request(app).delete(`/api/v1/rental/${_id.toString()}`);

    const { status } = response;
    expect(status).toBe(204);
  });

  it('should return a empty object', async () => {
    const rentalMock = {
      nome: 'Moonlight',
      cnpj: '12.567.124/1039-11',
      atividades: 'Aluguel de ferraris',
      endereco: [
        {
          cep: '20050-000',
          number: 201,
          complemento: '',
          isFilial: false
        },
        {
          cep: '20050-000',
          number: 467,
          complemento: 'Na frente da padaria do Jorge',
          isFilial: true
        }
      ]
    };

    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const response = await request(app).delete(`/api/v1/rental/${_id.toString()}`);

    const { body } = response;

    expect(body.nome).toBeUndefined();
    expect(body.cnpj).toBeUndefined();
    expect(body.atividades).toBeUndefined();
    expect(body.endereco).toBeUndefined();
  });

  it('should return a body type object', async () => {
    const rentalMock = {
      nome: 'Moonlight',
      cnpj: '12.567.124/1039-11',
      atividades: 'Aluguel de ferraris',
      endereco: [
        {
          cep: '20050-000',
          number: 201,
          complemento: '',
          isFilial: false
        },
        {
          cep: '20050-000',
          number: 467,
          complemento: 'Na frente da padaria do Jorge',
          isFilial: true
        }
      ]
    };

    const { text } = await request(app).post('/api/v1/rental/').send(rentalMock);

    const { _id } = JSON.parse(text);

    const response = await request(app).delete(`/api/v1/rental/${_id.toString()}`);

    const { body } = response;

    expect(typeof body).toBe('object');
  });
});
