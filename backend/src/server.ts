import express from "express";
import cors from "cors";
import helmet from "helmet";
import httpStatus from "http-status";
import config from "./config/base.config";
import logger from "./utils/logger";
import morgan from "morgan";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);
import authRouter from "./routers/v1/auth.router";
import { globalErrorHandler, notFoundHandler } from "./middlewares/error.middleware";
import docsRouter from "./routers/v1/docs.router";
import clubRouter from "./routers/v1/club.router";
import cafeteriaRouter from "./routers/v1/cafeteria.router";
// import emergenccyRouter from "./routers/v1/emergency.router";
import { serve } from "swagger-ui-express";

const server = express();

/*-------------------MIDDLEWARES-------------------*/
server.use(helmet());
server.use(cors({ origin: "*" }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
if (config.ENV === "development") {
  // server.use(morgan("combined", { stream: logger.stream }));
}

/*-------------------ROUTERS-------------------*/
server.use("/api/v1/auth", authRouter);
server.use("/docs", docsRouter);
server.use("/api/v1/clubs", clubRouter);
server.use("/api/v1/cafeteria", cafeteriaRouter);
// server.use("/api/v1/emergency", emergenccyRouter);

server.get("/", (req, res) => {
  return res.status(httpStatus.OK).send({ message: "The Server is running successfully!" });
});

/*-------------------ERROR HANDLING-------------------*/
server.use(notFoundHandler);
server.use(globalErrorHandler);

export { server };
