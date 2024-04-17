# Overview

[NestJS](https://github.com/nestjs/nest) based GeoData Management Information System.

## Descriptions

This repository is a GeoData Management Information System that is developed with [NestJS](https://github.com/nestjs/nest) built with following tech stacks and features:

### Tech Stacks

- **NestJS**: Backend Framework
- **Database**: Postgres (with PostGIS Support) and Using ORM, Sequelize
- **Documentation**: Swagger
- **Security**: JWT, RBAC, Helmet (for well known vulnerabilities), Nest Auth Guards
- **Testing**: Jest

### Features

- **GeoJSON File Upload:** Support GeoJson file upload with file type validation, implements Custom Pipe that validate uploaded files. Files will be uploaded into `./uploads` folder
- **DB Seeding:** Seed the project with initial user data, using Sequelize features to ease the process of seeding
- **DB Migration:** Apply databased changes when model/schema changes automatically via DB Migration using Sequelize migration tools
- **User Input Validation:** Validate user inputs are valid geojson formatted files, utilizes NestJS middleware and/or pipes and implements Custom Pipe that validate uploaded file contents
- **GeoJson Data Processing:** Uploaded GeoJson will be stored in uploaded files folder in the backend and store the data in the Database
- **Unit Testing:** Automated unit tests based on Jest for positive and negative cases
- **Documentation:** API Documentation with Swagger
- **Authentication:** To limit only registered user can access GeoData managed in the database, implements JWT
- **Authorization:** Every authenticated users can read/view the data stored in the database, only those who is registered with admin role can create, update, and delete them, implements RBAC. Role information are included in JWT token
- **DB Setup via Docker Compose**: are constructed via Docker Compose, The commands install PostGIS extension and create DB automatically on initial run (see `./db/init.sql` to see the commands).

Only admin can do following actions:
- Creating new users
- Uploading GeoJson data
- Get all registered users

## Installation and Running the Project

Run following commands to install and setup locally (and start development)


```bash
$ cd [project root directory location]
```

```bash
$ docker compose up
```

```bash
$ npm install
```

```bash
$ cp .env.sample .env
```
Ensure that variables defines the correct values

Create tables
```bash
$ npx sequelize-cli db:migrate
```

Initialize data into the tables
```bash
$ npx sequelize-cli db:seed:all
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

Following users created during DB seeding:
1. Username: `admin`, Password: `admin`
1. Username: `user`, Password: `user`

# production mode
$ npm run start:prod
```

Auto generated documentation can be accessed in [this link](http://localhost:3000/docs).

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Iwansyah Putra](https://github.com/iwansyahp)
