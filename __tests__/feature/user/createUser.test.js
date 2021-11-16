const request = require('supertest');

const app = require('../../../src/index');

let userMock = {};
let userMock02 = {};

describe('create a new user', () => {
  beforeEach(() => {
    userMock = {
      nome: 'James winston',
      cpf: '182.931.371-08',
      data_nascimento: '17/12/1945',
      email: 'james1945@outlook.com',
      senha: 'mynae13',
      habilitado: 'não'
    };
  });

  it('should return status code 201', async () => {
    const { status } = await request(app).post('/api/v1/people/').send(userMock);
    expect(status).toBe(201);
  });

  it('should return a body with _id and the same properties from userMock expect password', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body).toHaveProperty('_id');
    expect(body.nome).toBe(userMock.nome);
    expect(body.cpf).toBe(userMock.cpf);
    expect(body.data_nascimento).toBe(userMock.data_nascimento);
    expect(body.email).toBe(userMock.email);
    expect(body.habilitado).toBe(userMock.habilitado);
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body).toEqual({
      _id: expect.any(String),
      nome: expect.any(String),
      cpf: expect.any(String),
      data_nascimento: expect.any(String),
      email: expect.any(String),
      habilitado: expect.any(String)
    });
  });
});

describe('Do not create a user with a existing email', () => {
  beforeEach(() => {
    userMock = {
      nome: 'Bruna Garcia',
      cpf: '391.385.123-05',
      data_nascimento: '11/10/1978',
      email: 'bruna@outlook.com',
      senha: '123456',
      habilitado: 'não'
    };

    userMock02 = {
      nome: 'Bruna Bustamante',
      cpf: '982.123.281-07',
      data_nascimento: '12/12/2000',
      email: 'bruna@outlook.com',
      senha: 'mm84na9',
      habilitado: 'sim'
    };
  });
  it('should return status code 400', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { status } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(body.description).toBe('Conflict');
    expect(body.name).toBe(`Email ${userMock02.email} already in use`);
  });

  it('should return a body with values type string', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not not create a user with a existing cpf', () => {
  beforeEach(() => {
    userMock = {
      nome: 'Cristina',
      cpf: '391.382.102-01',
      data_nascimento: '13/12/1987',
      email: 'cristina083@outlook.com',
      senha: '123bga',
      habilitado: 'não'
    };

    userMock02 = {
      nome: 'Bruno Henrique',
      cpf: '391.382.102-01',
      data_nascimento: '12/12/1999',
      email: 'brunohenrique@outlook.com',
      senha: 'mm84na9',
      habilitado: 'sim'
    };
  });

  it('should return status code 400', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { status } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(body.description).toBe('Conflict');
    expect(body.name).toBe(`CPF ${userMock.cpf} already in use`);
  });

  it('should return a body with values type string', async () => {
    await request(app).post('/api/v1/people/').send(userMock);

    const { body } = await request(app).post('/api/v1/people/').send(userMock02);

    expect(body).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a user with invalid email format', () => {
  beforeEach(() => {
    userMock = {
      nome: 'Roger Guedes',
      cpf: '347.189.193-07',
      data_nascimento: '27/10/1978',
      email: 'roguerg',
      senha: 'lavista6381',
      habilitado: 'sim'
    };
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/people/').send(userMock);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0].description).toBe('email');
    expect(body[0].name).toBe('"email" must be a valid email');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a user with blank field', () => {
  beforeEach(() => {
    userMock = {
      nome: '',
      cpf: '892.182.109-02',
      data_nascimento: '29/10/2002',
      email: 'marina2022@outlook.com',
      senha: '123456',
      habilitado: 'sim'
    };
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/people/').send(userMock);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0].description).toBe('nome');
    expect(body[0].name).toBe('"nome" is not allowed to be empty');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a user with invalid cpf format', () => {
  beforeEach(() => {
    userMock = {
      nome: 'Joongwoo',
      cpf: '1838172.112-09',
      data_nascimento: '09/12/2000',
      email: 'joongwoonct@gmail.com',
      senha: 'nctdream021',
      habilitado: 'não'
    };
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/people/').send(userMock);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0].description).toBe('cpf');
    expect(body[0].name).toBe('cpf must have the xxx.xxx.xxx-xx format');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});

describe('Do not create a user with invalid habilitado field value', () => {
  beforeEach(() => {
    userMock = {
      nome: 'Serena',
      cpf: '290.481.187-01',
      data_nascimento: '12/12/1998',
      email: 'serenadias@outlook.com',
      senha: 'serena123456',
      habilitado: 'serena'
    };
  });

  it('should return status code 400', async () => {
    const { status } = await request(app).post('/api/v1/people/').send(userMock);

    expect(status).toBe(400);
  });

  it('should return a body with description and name properties', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0].description).toBe('habilitado');
    expect(body[0].name).toBe('"habilitado" must be one of [sim, não]');
  });

  it('should return a body with values type string', async () => {
    const { body } = await request(app).post('/api/v1/people/').send(userMock);

    expect(body[0]).toEqual({
      description: expect.any(String),
      name: expect.any(String)
    });
  });
});
