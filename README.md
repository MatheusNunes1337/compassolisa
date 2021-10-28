
# Compassolisa 🚗🔑💰

This API refers to a luxury and semi luxury car rental system


## ✨ Features

- People CRUD
- Cars CRUD
- Filter people or cars by their attributes
- Offset-based pagination
- User authentication


## 💻 Technologies

- Node.Js v.16.8.0
- Express.Js v.4.17.1
- MongoDB v.4.4.9
- Mongoose v.6.0.11
- Joi validator v.17.4.2


## Run Locally

Clone the project

```bash
  git clone https://github.com/MatheusNunes1337/compassolisa
```

Go to the project directory

```bash
  cd compassolisa
```

 📦 Install dependencies

```bash
  npm install
```
```bash
  yarn install
```

Start the server

```bash
  npm run dev
```
```bash
  yarn dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`MONGO_URL`

`API_SECRET`


## API Reference

#### Get people

```http
  GET /api/v1/people?offset=0&limit=100
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `limit` | `number` | **Required**. Limit of results |
| `offset` | `number` | **Required**. Offset |


#### Filter people

```http
  GET /api/v1/people?offset=0&limit=100&nome=John Doe
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `limit` | `number` | **Required**. Limit of results |
| `offset` | `number` | **Required**. Offset |
| `filters` | `string` | **Required**. Filter must be any of people's attributes.  |

#### Find a person

```http
  GET /api/v1/people/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ObjectId` | **Required**. Id of person to fetch |

#### Create a new person

```http
  POST /api/v1/people/
```

#### Update a person

```http
  PUT /api/v1/people/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ObjectId` | **Required**. Id of person to update |

#### Delete a person

```http
  DELETE /api/v1/people/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ObjectId` | **Required**. Id of person to delete |


#### Get cars

```http
  GET /api/v1/car?offset=0&limit=100
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `limit` | `number` | **Required**. Limit of results |
| `offset` | `number` | **Required**. Offset |


#### Filter cars

```http
  GET /api/v1/car?offset=0&limit=100&ano=1965
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `limit` | `number` | **Required**. Limit of results |
| `offset` | `number` | **Required**. Offset |
| `filters` | `string` | **Required**. Filter must be any of car attributes.  |

#### Find a car

```http
  GET /api/v1/people/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ObjectId` | **Required**. Id of car to fetch |

#### Create a new car

```http
  POST /api/v1/car/
```

#### Update a car

```http
  PUT /api/v1/car/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ObjectId` | **Required**. Id of car to update |

#### Delete a car

```http
  DELETE /api/v1/car/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ObjectId` | **Required**. Id of car to delete |



## Authors

- [@MatheusNunes1337](https://github.com/MatheusNunes1337)

