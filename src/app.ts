import cors from "@fastify/cors"; 
import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import { env } from "./config/env";
import routes from "./routes/index";

const app: FastifyInstance = Fastify({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",
  },
});

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

app.register(routes, { prefix: "/api" });

export default app;