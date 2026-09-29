import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction  from "../controllers/transactions/createTransaction.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller";
import { getHistoricalTransactions } from "../controllers/transactions/getHistoricalTransactions.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { 
  createTransactionSchema, 
  getTransactionsSchema,
  getTransactionsSummarySchema,
  getHistoricalTransactionsSchema,  
  deleteTransactionSchema,
} from "../schemas/transaction.schema";


const transactionRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", authMiddleware);
  
  //Criação
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: (zodToJsonSchema as any)(createTransactionSchema),
    },
    handler: createTransaction, 
  });
  //Buscar com filtros
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
    querystring: (zodToJsonSchema as any)(getTransactionsSchema),
    },
    handler: getTransactions, 
  });
  
  //Buscar Resumos
  fastify.route({
    method: "GET",
    url: "/summary",
    schema: {
    querystring: (zodToJsonSchema as any)(getTransactionsSummarySchema),
    },
    handler: getTransactionsSummary, 
  });

  //Histórico de transações
  fastify.route({
    method: "GET",
    url: "/historical",
    schema: {
    querystring: (zodToJsonSchema as any)(getHistoricalTransactionsSchema),
    },
    handler: getHistoricalTransactions, 
  });


  //Deletar Transações
  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: {
      params: (zodToJsonSchema as any)(deleteTransactionSchema),
    },
    handler: deleteTransaction, 
  });
         
};

export default transactionRoutes;