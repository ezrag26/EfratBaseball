# Development
In the project's root directory, Use npm to add the dependencies

  ```sh
  npm install
  ```

## Environment

Create a file called `.env` in the root directory to host the relevant environment variables. You can take a look at `example.env` for an example of the variables needed, adding any as you wish

## Running the program

Spin up the docker container running the database with the following command:

  ```sh
  npm run docker-up
  ```

Once the database is connected, in the root directory, start and watch the client and server files with the following commands:

  ```sh
  npm run watch-client
  npm run watch-server
  ```

## Testing