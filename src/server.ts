import app from "./app.js";
import { env } from "./config/env.js"; 
import initializeFirebaseAdmin from "./config/firebase.js";
import { prismaConnect } from "./config/prisma.js";
import { initializeGlobalCategories } from "./services/globalCategories.service.js";

const PORT = env.PORT;

initializeFirebaseAdmin();

const startServer = async () => {
  try {
    console.log("1 - Iniciando conexão com Prisma...");
    await prismaConnect();
    console.log("2 - Prisma conectado!");

    console.log("3 - Inicializando categorias...");
    await initializeGlobalCategories();
    console.log("4 - Categorias inicializadas!");

    console.log("5 - Iniciando servidor...");
    await app.listen({ port: PORT });
    console.log(`Servidor rodando na porta ${PORT}`);
  } catch (err) {
    console.error("ERRO AO INICIAR SERVIDOR:", err);
  }
};

startServer();