import * as express from "express";

export default (handler: (request: express.Request) => object) =>
  async (request: express.Request, response: express.Response) => {
    try {
      const result = await handler(request);
      response.json(result);
    } catch (error) {
      response.status(error.status).send({
        message: error.message,
      });
    }
  };
