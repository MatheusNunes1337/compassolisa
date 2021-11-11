const request = require('supertest');

const app = require('../../src/index');
const UserModel = require('../../src/app/models/UserModel');

beforeAll(async () => {
    await UserModel.deleteMany();
});
  
beforeEach(async () => {
    await UserModel.deleteMany();
});

describe('create a new user', () => {
        
  it('should return status code 201', async() => {
    const userMock = {
      nome: "James winston",
      cpf: "182.931.371-08",
      data_nascimento: "17/12/1945",
      email: "james1945@outlook.com",
      senha: "mynae13",
      habilitado: "não"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {status} = response
    expect(status).toBe(201)
  })

  it('should return a body with _id and the same properties from userMock expect password', async() => {
    const userMock = {
      nome: "James winston",
      cpf: "182.931.371-08",
      data_nascimento: "17/12/1945",
      email: "james1945@outlook.com",
      senha: "mynae13",
      habilitado: "não"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {body} = response

    expect(body).toHaveProperty('_id')
    expect(body.nome).toBe(userMock.nome)
    expect(body.cpf).toBe(userMock.cpf)
    expect(body.data_nascimento).toBe(userMock.data_nascimento)
    expect(body.email).toBe(userMock.email)
    expect(body.habilitado).toBe(userMock.habilitado)
  })

  it('should return a body with values type string', async() => {
    const userMock = {
      nome: "James winston",
      cpf: "182.931.371-08",
      data_nascimento: "17/12/1945",
      email: "james1945@outlook.com",
      senha: "mynae13",
      habilitado: "não"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {body} = response

    expect(typeof body).toBe('object')
    expect(typeof body._id).toBe('string')
    expect(typeof body.nome).toBe('string')
    expect(typeof body.cpf).toBe('string')
    expect(typeof body.data_nascimento).toBe('string')
    expect(typeof body.email).toBe('string')
    expect(typeof body.habilitado).toBe('string')
    
  })
})

describe('Do not create a user with a existing email', () => {
    
  it('should return status code 400', async() => {
    const userMock01 = {
      nome: "Bruna Garcia",
      cpf: "391.385.123-05",
      data_nascimento: "11/10/1978",
      email: "bruna@outlook.com",
      senha: "123456",
      habilitado: "não"
    }

    const userMock02 = {
      nome: "Bruna Bustamante",
      cpf: "982.123.281-07",
      data_nascimento: "12/12/2000",
      email: "bruna@outlook.com",
      senha: "mm84na9",
      habilitado: "sim"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock01)

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock02)

      const {status} = response
      expect(status).toBe(400)
  })

  it('should return a body with description and name properties', async() => {
    const userMock01 = {
      nome: "Bruna Garcia",
      cpf: "391.385.123-05",
      data_nascimento: "11/10/1978",
      email: "bruna@outlook.com",
      senha: "123456",
      habilitado: "não"
    }

    const userMock02 = {
      nome: "Bruna Bustamante",
      cpf: "982.123.281-07",
      data_nascimento: "12/12/2000",
      email: "bruna@outlook.com",
      senha: "mm84na9",
      habilitado: "sim"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock01)

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock02)

    const {body} = response

    expect(body.description).toBe('Conflict')
    expect(body.name).toBe(`Email ${userMock02.email} already in use`)

  })

  it('should return a body with values type string', async() => {
    const userMock01 = {
      nome: "Bruna Garcia",
      cpf: "391.385.123-05",
      data_nascimento: "11/10/1978",
      email: "bruna@outlook.com",
      senha: "123456",
      habilitado: "não"
    }

    const userMock02 = {
      nome: "Bruna Bustamante",
      cpf: "982.123.281-07",
      data_nascimento: "12/12/2000",
      email: "bruna@outlook.com",
      senha: "mm84na9",
      habilitado: "sim"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock01)

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock02)

    const {body} = response

    expect(typeof body.description).toBe('string')
    expect(typeof body.name).toBe('string')

  })
})

describe('Do not not create a user with a existing cpf', () => {
        
  it('should return status code 400', async() => {
    const userMock01 = {
      nome: "Cristina",
      cpf: "391.382.102-01",
      data_nascimento: "13/12/1987",
      email: "cristina083@outlook.com",
      senha: "123bga",
      habilitado: "não"
    }

    const userMock02 = {
      nome: "Bruno Henrique",
      cpf: "391.382.102-01",
      data_nascimento: "12/12/1999",
      email: "brunohenrique@outlook.com",
      senha: "mm84na9",
      habilitado: "sim"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock01)
 
    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock02)

      const {status} = response
      expect(status).toBe(400)
  })

  it('should return a body with description and name properties', async() => {
    const userMock01 = {
      nome: "Cristina",
      cpf: "391.382.102-01",
      data_nascimento: "13/12/1987",
      email: "cristina083@outlook.com",
      senha: "123bga",
      habilitado: "não"
    }

    const userMock02 = {
      nome: "Bruno Henrique",
      cpf: "391.382.102-01",
      data_nascimento: "12/12/1999",
      email: "brunohenrique@outlook.com",
      senha: "mm84na9",
      habilitado: "sim"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock01)
  
    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock02)

    const {body} = response

    expect(body.description).toBe('Conflict')
    expect(body.name).toBe(`CPF ${userMock01.cpf} already in use`)

  })

  it('should return a body with values type string', async() => {
    const userMock01 = {
      nome: "Cristina",
      cpf: "391.382.102-01",
      data_nascimento: "13/12/1987",
      email: "cristina083@outlook.com",
      senha: "123bga",
      habilitado: "não"
    }

    const userMock02 = {
      nome: "Bruno Henrique",
      cpf: "391.382.102-01",
      data_nascimento: "12/12/1999",
      email: "brunohenrique@outlook.com",
      senha: "mm84na9",
      habilitado: "sim"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock01)
   
    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock02)

    const {body} = response

    expect(typeof body.description).toBe('string')
    expect(typeof body.name).toBe('string')

  })
})


describe('Do not create a user with invalid email format', () => {
        
  it('should return status code 400', async() => {
    const userMock = {
      nome: "Travis ",
      cpf: "391.382.102-01",
      data_nascimento: "14/05/1997",
      email: "travis",
      senha: "stargazing",
      habilitado: "sim"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

      const {status} = response
      expect(status).toBe(400)
  })

  it('should return a body with description and name properties', async() => {
    const userMock = {
      nome: "Travis ",
      cpf: "391.382.102-01",
      data_nascimento: "14/05/1997",
      email: "travis",
      senha: "stargazing",
      habilitado: "sim"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {body} = response

    expect(body.description).toBe('email')
    expect(body.name).toBe('\"email\" must be a valid email')

  })

  it('should return a body with values type string', async() => {
    const userMock = {
      nome: "Travis ",
      cpf: "391.382.102-01",
      data_nascimento: "14/05/1997",
      email: "travis",
      senha: "stargazing",
      habilitado: "sim"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {body} = response

    expect(typeof body.description).toBe('string')
    expect(typeof body.name).toBe('string')

  })
})


describe('Do not create a user with blank field', () => {
        
  it('should return status code 400', async() => {
    const userMock = {
      nome: "",
      cpf: "892.182.109-02",
      data_nascimento: "29/10/2002",
      email: "marina2022@outlook.com",
      senha: "123456",
      habilitado: "sim"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

      const {status} = response
      expect(status).toBe(400)
  })

  it('should return a body with description and name properties', async() => {
    const userMock = {
      nome: "",
      cpf: "892.182.109-02",
      data_nascimento: "29/10/2002",
      email: "marina2022@outlook.com",
      senha: "123456",
      habilitado: "sim"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {body} = response

    expect(body.description).toBe('nome')
    expect(body.name).toBe('\"nome\" is not allowed to be empty')

  })

  it('should return a body with values type string', async() => {
    const userMock = {
      nome: "",
      cpf: "892.182.109-02",
      data_nascimento: "29/10/2002",
      email: "marina2022@outlook.com",
      senha: "123456",
      habilitado: "sim"
    }

    const response = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {body} = response

    expect(typeof body.description).toBe('string')
    expect(typeof body.name).toBe('string')
  })
})

describe('get all users', () => {       
  it('should return status code 200', async() => {
    const userMock = {
      nome: "Matheus",
      cpf: "192.168.010-02",
      data_nascimento: "18/11/1997",
      email: "matheus@outlook.com",
      senha: "123456",
      habilitado: "não"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const response = await request(app)
    .get('/api/v1/people/')

      const {status} = response
      expect(status).toBe(200)
  })

  it('should return a body with _id and the same properties from userMock expect password', async() => {
    const userMock = {
      nome: "Matheus",
      cpf: "192.168.010-02",
      data_nascimento: "18/11/1997",
      email: "matheus@outlook.com",
      senha: "123456",
      habilitado: "não"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock)
    
    const response = await request(app)
    .get('/api/v1/people/')

    const {body} = response
    const {pessoas} = body
  
    expect(pessoas).toHaveLength(1)
    expect(pessoas[0].nome).toBe(userMock.nome)
    expect(pessoas[0].cpf).toBe(userMock.cpf)
    expect(pessoas[0].data_nascimento).toBe(userMock.data_nascimento)
    expect(pessoas[0].email).toBe(userMock.email)
    expect(pessoas[0].habilitado).toBe(userMock.habilitado)

  })

  it('should return a body with values type string', async() => {
    const userMock = {
      nome: "Matheus",
      cpf: "192.168.010-02",
      data_nascimento: "18/11/1997",
      email: "matheus@outlook.com",
      senha: "123456",
      habilitado: "não"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const response = await request(app)
    .get('/api/v1/people/')

    const {body} = response
    const {pessoas} = body
  
    expect(typeof pessoas).toBe('object')
    expect(typeof pessoas[0]._id).toBe('string')
    expect(typeof pessoas[0].nome).toBe('string')
    expect(typeof pessoas[0].cpf).toBe('string')
    expect(typeof pessoas[0].data_nascimento).toBe('string')
    expect(typeof pessoas[0].email).toBe('string')
    expect(typeof pessoas[0].habilitado).toBe('string')
    
  })
})


describe('get users by their names', () => {
        
  it('should return status code 200', async() => {
    const userMock = {
      nome: "Pedro",
      cpf: "183.103.187-04",
      data_nascimento: "20/11/2001",
      email: "pedrooo@outlook.com",
      senha: "onlined134",
      habilitado: "não"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const response = await request(app)
    .get(`/api/v1/people/?nome=${userMock.nome}`)

      const {status} = response
      expect(status).toBe(200)
  })

  it('should return a body with _id and the same properties from userMock expect password', async() => {
    const userMock = {
      nome: "Pedro",
      cpf: "183.103.187-04",
      data_nascimento: "20/11/2001",
      email: "pedrooo@outlook.com",
      senha: "banana123",
      habilitado: "não"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const response = await request(app)
    .get(`/api/v1/people/?nome=${userMock.nome}`)

    const {body} = response
    const {pessoas} = body
  
  
    expect(pessoas).toHaveLength(1)
    expect(pessoas[0].nome).toBe(userMock.nome)
    expect(pessoas[0].cpf).toBe(userMock.cpf)
    expect(pessoas[0].data_nascimento).toBe(userMock.data_nascimento)
    expect(pessoas[0].email).toBe(userMock.email)
    expect(pessoas[0].habilitado).toBe(userMock.habilitado)

  })

  it('should return a body with values type string', async() => {
    const userMock = {
      nome: "Pedro",
      cpf: "183.103.187-04",
      data_nascimento: "20/11/2001",
      email: "pedrooo@outlook.com",
      senha: "banana123",
      habilitado: "não"
    }

    await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const response = await request(app)
    .get(`/api/v1/people/?nome=${userMock.nome}`)

    const {body} = response
    const {pessoas} = body
    
    expect(typeof pessoas).toBe('object')
    expect(typeof pessoas[0]._id).toBe('string')
    expect(typeof pessoas[0].nome).toBe('string')
    expect(typeof pessoas[0].cpf).toBe('string')
    expect(typeof pessoas[0].data_nascimento).toBe('string')
    expect(typeof pessoas[0].email).toBe('string')
    expect(typeof pessoas[0].habilitado).toBe('string')
    
  })
})

describe('get users by their id', () => {
        
  it('should return status code 200', async() => {
    const userMock = {
      nome: "Lucas Morais",
      cpf: "467.127.189-07",
      data_nascimento: "20/03/2001",
      email: "lucasmorais2001@outlook.com",
      senha: "engix1923",
      habilitado: "sim"
    }

    const {text} = await request(app)
    .post('/api/v1/people/')
    .send(userMock)
    
    const {_id} = JSON.parse(text)

    const response = await request(app)
    .get(`/api/v1/people/${_id.toString()}`)

      const {status} = response
      expect(status).toBe(200)
  })

  it('should return a body with _id and the same properties from userMock expect password', async() => {
    const userMock = {
      nome: "Lucas Morais",
      cpf: "467.127.189-07",
      data_nascimento: "20/03/2001",
      email: "lucasmorais2001@outlook.com",
      senha: "engix1923",
      habilitado: "sim"
    }

    const {text} = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {_id} = JSON.parse(text)

    const response = await request(app)
    .get(`/api/v1/people/${_id.toString()}`)

    const {body} = response
  
    expect(body.nome).toBe(userMock.nome)
    expect(body.cpf).toBe(userMock.cpf)
    expect(body.data_nascimento).toBe(userMock.data_nascimento)
    expect(body.email).toBe(userMock.email)
    expect(body.habilitado).toBe(userMock.habilitado)

  })

  it('should return a object with values type string', async() => {
    const userMock = {
      nome: "Lucas Morais",
      cpf: "467.127.189-07",
      data_nascimento: "20/03/2001",
      email: "lucasmorais2001@outlook.com",
      senha: "engix1923",
      habilitado: "sim"
    }

    const {text} = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {_id} = JSON.parse(text)
 
    const response = await request(app)
    .get(`/api/v1/people/${_id.toString()}`)

    const {body} = response
    
    expect(typeof body).toBe('object')
    expect(typeof body._id).toBe('string')
    expect(typeof body.nome).toBe('string')
    expect(typeof body.cpf).toBe('string')
    expect(typeof body.data_nascimento).toBe('string')
    expect(typeof body.email).toBe('string')
    expect(typeof body.habilitado).toBe('string')
    
  })
})

describe('delete a user', () => {
        
  it('should return status code 204', async() => {
    const userMock = {
      nome: "Neymar",
      cpf: "111.209.345-01",
      data_nascimento: "17/12/1990",
      email: "neymarjr10@gmail.com",
      senha: "123456",
      habilitado: "não"
    }

    const {text} = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {_id} = JSON.parse(text)
 
    const response = await request(app)
    .delete(`/api/v1/people/${_id.toString()}`)

    const {status} = response
    expect(status).toBe(204)
  })

  it('should return a empty object', async() => {
    const userMock = {
      nome: "Neymar",
      cpf: "111.209.345-01",
      data_nascimento: "17/12/1990",
      email: "neymarjr10@gmail.com",
      senha: "123456",
      habilitado: "não"
    }

    const {text} = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {_id} = JSON.parse(text)
 
    const response = await request(app)
    .delete(`/api/v1/people/${_id.toString()}`)

    const {body} = response
  
    expect(body.nome).toBeUndefined()
    expect(body.cpf).toBeUndefined()
    expect(body.data_nascimento).toBeUndefined()
    expect(body.email).toBeUndefined()
    expect(body.habilitado).toBeUndefined()

  })

  it('should return a body type object', async() => {
    const userMock = {
      nome: "Neymar",
      cpf: "111.209.345-01",
      data_nascimento: "17/12/1990",
      email: "neymarjr10@gmail.com",
      senha: "123456",
      habilitado: "não"
    }

    const {text} = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {_id} = JSON.parse(text)
 
    const response = await request(app)
    .delete(`/api/v1/people/${_id.toString()}`)

    const {body} = response
    
    expect(typeof body).toBe('object')  
  })
})

describe('Do not delete a user that not exists', () => {
        
  it('should return status code 404', async() => {
    const idMock = '4edd40c86762e0fb12000003'

    const response = await request(app)
    .delete(`/api/v1/people/${idMock}`)

    const {status} = response
    expect(status).toBe(404)
  })

  it('should return an object with name and description properties', async() => {
    const idMock = '4edd40c86762e0fb12000003'

    const response = await request(app)
    .delete(`/api/v1/people/${idMock}`)
 
    const {body} = response
  
    expect(body.name).toBe('User not found')
    expect(body.description).toBe('Not Found')

  })

  it('should return a object with properties type string', async() => {
    const idMock = '4edd40c86762e0fb12000003'

    const response = await request(app)
    .delete(`/api/v1/people/${idMock}`)
 
    const {body} = response
    
    expect(typeof body).toBe('object')
    expect(typeof body.name).toBe('string')
    expect(typeof body.description).toBe('string')  
  })
})

describe("update a user's password", () => {
        
  it('should return status code 200', async() => {
    const userMock = {
      nome: "Mariana",
      cpf: "098.163.024-05",
      data_nascimento: "03/12/1996",
      email: "marianagomes@gmail.com",
      senha: "123456",
      habilitado: "não"
    }

    const senha = {
      senha: 'mariagomes137'
    }

    const {text} = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {_id} = JSON.parse(text)
 
    const response = await request(app)
    .put(`/api/v1/people/${_id.toString()}`)
    .send(senha)

    const {status} = response
    expect(status).toBe(200)
  })

  it('should return a object without the updated password', async() => {
    const userMock = {
      nome: "Mariana",
      cpf: "098.163.024-05",
      data_nascimento: "03/12/1996",
      email: "marianagomes@gmail.com",
      senha: "123456",
      habilitado: "não"
    }

    const senha = {
      senha: 'mariagomes137'
    }

    const {text} = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {_id} = JSON.parse(text)
 
    const response = await request(app)
    .put(`/api/v1/people/${_id.toString()}`)
    .send(senha)

    const {body} = response
  
    expect(body._id).toBe(_id)
    expect(body.nome).toBe(userMock.nome)
    expect(body.cpf).toBe(userMock.cpf)
    expect(body.data_nascimento).toBe(userMock.data_nascimento)
    expect(body.email).toBe(userMock.email)
    expect(body.senha).toBeUndefined()
    expect(body.habilitado).toBe(userMock.habilitado)

  })

  it('should return a body with properties values type string', async() => {
    const userMock = {
      nome: "Mariana",
      cpf: "098.163.024-05",
      data_nascimento: "03/12/1996",
      email: "marianagomes@gmail.com",
      senha: "123456",
      habilitado: "não"
    }

    const senha = {
      senha: 'mariagomes137'
    }

    const {text} = await request(app)
    .post('/api/v1/people/')
    .send(userMock)

    const {_id} = JSON.parse(text)
 
    const response = await request(app)
    .put(`/api/v1/people/${_id.toString()}`)
    .send(senha)

    const {body} = response
    
    expect(typeof body).toBe('object')
    expect(typeof body.nome).toBe('string') 
    expect(typeof body.cpf).toBe('string') 
    expect(typeof body.data_nascimento).toBe('string') 
    expect(typeof body.email).toBe('string') 
    expect(typeof body.habilitado).toBe('string')  
  })
})

describe('Do not update a password of a user that not exists', () => { 
  it('should return status code 404', async() => {
    const idMock = '4edd40c86762e0fb12000003'

    const response = await request(app)
    .put(`/api/v1/people/${idMock}`)

    const {status} = response
    expect(status).toBe(404)
  })

  it('should return an object with name and description properties', async() => {
    const idMock = '4edd40c86762e0fb12000003'

    const response = await request(app)
    .put(`/api/v1/people/${idMock}`)
 
    const {body} = response
  
    expect(body.name).toBe('User not found')
    expect(body.description).toBe('Not Found')

  })

  it('should return a object with properties type string', async() => {
    const idMock = '4edd40c86762e0fb12000003'

    const response = await request(app)
    .put(`/api/v1/people/${idMock}`)
 
    const {body} = response
    
    expect(typeof body).toBe('object')
    expect(typeof body.name).toBe('string')
    expect(typeof body.description).toBe('string')  
  })
})


