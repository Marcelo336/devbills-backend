import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import { createTransactionSchema } from "../../schemas/transaction.schema";

const createTransaction = async (
  request: FastifyRequest, 
  reply: FastifyReply,
  ):Promise<void> => {
    const userId = request.userId;

    if (!userId) {
      return reply.status(401).send({ error: "Usuário não autenticado" });
    }

    request.log.info({ body: request.body }, "DEBUG: Corpo da requisição recebido para criar transação"); 

    const result = createTransactionSchema.safeParse(request.body);

    if (!result.success) {

      request.log.error({ errors: result.error.issues }, "DEBUG: Erro de validação Zod ao criar transação"); 
      
      const errorMessage = result.error.issues[0]?.message || 'Erro de validação';

      return reply.status(400).send({ error: errorMessage });
    }

    const transaction = result.data;

    try {
      const category = await prisma.category.findFirst({
        where: {
          id: transaction.categoryId,
          type: transaction.type,
        },
      });

      if (!category) {
        return reply.status(400).send({ error: "Categoria inválida" });
      }

      const parsedDate = new Date(transaction.date);

      const newTransaction = await prisma.transaction.create({
        data: {
          ...transaction,
          userId,
          date: parsedDate,
        },
        include: {
          category: true,
        }
      });

      return reply.status(201).send(newTransaction);
    } catch (error) {
      request.log.error("Erro ao criar transação");
      return reply.status(500).send({ error: "Erro interno do servidor"});
    }
}; 

export default createTransaction;   