# Overview

[Nest](https://github.com/nestjs/nest) based GeoData Management Information System.

## Descriptions

This repository is a GeoData Management Information System that is developed with [Nest](https://github.com/nestjs/nest) built with following tech stacks and features:

### Tech Stacks

- NestJS: Backend Framework
- Database: Postgres (with PostGIS Support) and Using ORM, Sequelize
- Documentation: Swagger
- Security: JWT, RBAC, Helmet (for well known vulnerabilities)
- Testing: Jest

### Features

- GeoJSON File Upload: Support GeoJson file upload with file format and contains validation
- DB Seeding: Seed the project with initial user data
- DB Migration: Apply databased changes when model/schema chages automatically via DB Migration
- User Input Validation: Validate user input that utilize NestJS middleware and/or pipes
- GeoJson Data Processing: Uploaded GeoJson will be stored in uploaded files folder in the backend and store the data in the Database
- Unit Testing: Automated unit tests based on Jest for positive and negative cases
- Documentation: API Documentation with Swagger
- Authentication: To limit only registered user can access GeoData managed in the database
- Authorization: Every authenticated users can read/view the data stored in the database, only those who is registered with admin role can create, update, and delete them
- DB are constructed via Docker Compose, database will created automatically on initial run (see `./db/init.sql` to see the commands)

## Installation

```bash
$ docker compose up
```

```bash
$ npm install
```

```bash
$ npx sequelize-cli db:migrate
```

```bash
$ npx sequelize-cli db:seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

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
