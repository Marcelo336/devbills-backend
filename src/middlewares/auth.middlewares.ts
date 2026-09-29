// src/middlewares/auth.middleware.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { firebaseAuthService } from '../config/firebase';

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const authMiddleware = async(
  request:FastifyRequest, 
  reply: FastifyReply
):Promise<void> => {

  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    reply.code(401).send({ error: "Token de autorização não fornecido"});
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  // --- NOVO: LOGS DE DIAGNÓSTICO CRÍTICOS PARA O TOKEN ---
  request.log.info({ 
    authHeader: authHeader,
    tokenExtraido: token,
    tokenLength: token.length,
    tokenFirst5: token.substring(0, 5), // Primeiros 5 caracteres
    tokenLast5: token.substring(token.length - 5) // Últimos 5 caracteres
  }, "DEBUG: Token recebido no middleware");
  // --- FIM DOS LOGS DE DIAGNÓSTICO ---

  try {
    const decodedToken = await firebaseAuthService.verifyIdToken(token);

    request.userId = decodedToken.uid;
  } catch (err: unknown) {
    if (err instanceof Error) {
        request.log.error({ message: err.message, stack: err.stack, receivedToken: token }, "Erro ao verificar token");
    } else {
        request.log.error({ err, receivedToken: token }, "Erro desconhecido ao verificar token");
    }
    reply.code(401).send({error: "Token inválido"}); 
  }
};