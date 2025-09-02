# RIUFrontendLeonardoMagarinos
Aplicación web SPA en Angular 20 que permite gestionar héroes (crear, leer, actualizar y eliminar). Incluye paginado y filtrado.


## Tecnologías usadas
- Angular 20.2
- TypeScript
- RxJS / Signals
- Angular Material
- Docker

## Features
- CRUD de héroes (alta, baja, edición, listado).
- Paginado del listado de heroes.
- Filtrado en tiempo real por nombre o id.


## Prerequisitos
- Node.js - v20.19.0 or newer
- Text editor - We recommend Visual Studio Code
- Terminal - Required for running Angular CLI commands
- Development Tool - To improve your development workflow, we recommend the Angular Language Service

## Instalacion
Instalar el proyecto usando npm:

```bash
npm i
```

## Ejecutar con Docker
1- Si todavia no se hizo, hacer el build de la imagen de docker, para eso usar el comando:

```bash
npm run docker:build
```

2- Una vez terminado el paso anterior, puedes ejecutarlo con el comando: 

```bash
npm run docker:run
```

3- Para ver el proyecto usando Docker, ir a: `http://localhost:8080/`

## Server de desarrollo
Para iniciar el server de desarrollo local, usar el comando:

```bash
ng serve
```

Con el server andando, se puede acceder desde `http://localhost:4200/`.

## Tests Unitarios
Para este desarrollo se tenia como requisito el tener el test coverage > 80%.

Framework usado: Jasmine/Karma.
Para ejecutar los tests unitarios usando [Karma](https://karma-runner.github.io), use el comando:

```bash
ng test
```