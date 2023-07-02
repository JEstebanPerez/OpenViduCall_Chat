# OpenViduCall_Chat

This project is a develop from OpenVidu Call with a developed chat with all functions that are need. The project is fully developed using Angular for frontend and NestJS for the backend
with a MongoDB database.

## Prerequisites

Requirements for deploy the aplication:
- [Docker]

## Installing

A step by step series of instructions that will allow you to install the project and deploy the aplication.
For this instructions you have to be on the docker-compose file.

First you have to create the docker's containers:

    docker-compose build

And then, you cant deploy the aplication:

    docker-compose up

If you want to develop for next versions you have to do this instruction before you build the containers:

    docker-compose down

## Running the tests

There are two types of test so to execute them, we nned to execute this two commands

First you have to be on the frontend directory and then

To execute the unitary tests:

    ng test

and before to execute the E2E tests, you have to had the application running and then execute this command:

    npx playwright test

## Built With

  - [Angular](https://angular.io/) - Used to the Frontend framework
  - [NestJS](https://nestjs.com/) - Used to the Backend framework
  - [MongoDB](https://www.mongodb.com/) - Database
  - [Docker](https://www.docker.com/) - For deployment in containers 

## Authors

  - Jorge Esteban Pérez - Full Development -
    [JEstebanPerez](https://github.com/JEstebanPerez)

I hope it's useful for developers ☺
