# Bitcoin Core Exercise

An exercise into deploying the Bitcoin Core block chain, with a REST API service that issues JSON-RPC commands into bitcoind and a web UI that demonstrates a little bit how the block chain works.

## Implementation

A [Bitcoin Core](https://bitcoin.org/en/bitcoin-core/) full node running in regtest mode provides the block chain and wallet implementation and serves as the data store.

A [NodeJS](https://nodejs.org/en/) HTTP server provides a REST API, querying into the Bitcoin Core's [JSON-RPC interface](https://developer.bitcoin.org/reference/rpc/index.html).

The web client is an SPA built on [React](https://reactjs.org/). [MobX](https://mobx.js.org/) provides an observable state with transparent reactivity. CSS-in-JS component scoping is provided by [styled-components](https://styled-components.com/). "[Create React App](https://create-react-app.dev/)" provides the front end build setup and serves the UI for the purposes of this exercise.

The server and client are written with and transpiled with [TypeScript](https://www.typescriptlang.org/). All services are containerised with [Docker](https://www.docker.com/), with the run configuration defined with [Docker Compose](https://docs.docker.com/compose/).

The API service tests are functional integration tests, issuing HTTP requests against a running instance (black box). These use [Jest](https://jestjs.io/) as the runner with native NodeJS assertions.

## Fire it up!

`$ docker-compose up --force-recreate --renew-anon-volumes`

Navigate to [http://localhost:3000](http://localhost:3000) once the logs display "You can now view bitcoin-core-exercise in the browser".

We're using force recreate and renewing volumes to ensure containers are recreated for a fresh block chain each start.

- Requirements

  - [Docker Desktop](https://docs.docker.com/desktop) is installed with minimum version 3.0.0 (Engine >20, Compose >1.29).

## Development

- Requirements

  - [NodeJS](https://nodejs.org/en/) >16.0.0
  - [Yarn](https://yarnpkg.com/getting-started/install) installed locally:

    `$ npm install -g yarn`

The server can be run with [nodemon](https://www.npmjs.com/package/nodemon) watch and reload:

`$ cd server`

`$ yarn dev`

Similarly, Create React App will hot reload the client in dev mode, also:

`$ cd client`

`$ yarn dev`

Docker containers will need to be rebuilt after code change:

`$ docker-compose build server` or `$ docker-compose up --build`

## Testing

Ensuring the services have been started in a fresh state with `docker-compose`, the tests can be run with:

`$ cd testing`

`$ yarn install`

`$ yarn test`

Alternatively, build container and run with Docker:

`$ cd testing`

`$ docker build -t testing .`

`$ docker run --env API_SERVICE_HOST=host.docker.internal:8000 testing`

Tests can also be run in watch mode while being worked on:

`$ yarn watch`

## Some things to consider for production

- Serve over TLS
- Build and distribute client over CDN (currently just serving in dev mode)
- Dotenv file would not be committed to the repository
- [OpenAPI](https://swagger.io/specification/)/Swagger schema definition
- Validate requests against schema and generated documentation ([ReDoc](https://github.com/Redocly/redoc))
- Authentication and authorisation for wallets owned by identity
- Secure wallets with key pairs
- Scalable API service, perhaps a [Kubernetes](https://kubernetes.io/) cluster with replicas and load balancer.
- Responsive UI
- UI acceptance testing (e.g. [Cypress](https://www.cypress.io/))
- Test coverage reporting ([Instanbul](https://istanbul.js.org/))
- Monitoring output (e.g. [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/))
- Log aggregation (e.g. [ELK Stack](https://www.elastic.co/what-is/elk-stack))
