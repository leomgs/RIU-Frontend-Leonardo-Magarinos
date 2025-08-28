# RIUFrontendLeonardoMagarinos

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

## Prerequisites
- Node.js - v20.19.0 or newer
- Text editor - We recommend Visual Studio Code
- Terminal - Required for running Angular CLI commands
- Development Tool - To improve your development workflow, we recommend the Angular Language Service

## Installation
Install the project using npm:

```bash
npm i
```

## Running with docker
1- if you haven't built the docker image, build it with:

```bash
npm run docker:build
```

2- Once you have built the docker image, you can run it with: 

```bash
npm run docker:run
```

3- To see the project running with docker, go to: `http://localhost:8080/`

## Development server
To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
For more information about docker visit the [Docker Containerize Reference](https://docs.docker.com/guides/angular/containerize/)