import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initializeApp, cert, getApps, type ServiceAccount } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs/promises';

let firebaseAuthService: Auth;

const initializeFirebaseAdmin = async (): Promise<void> => {
  if (getApps().length > 0) {
    console.log("Firebase Admin SDK já inicializado.");
    if (!firebaseAuthService) {
      firebaseAuthService = getAuth();
    }
    return;
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const serviceAccountFileName = 'firebase-key.json';
  const serviceAccountAbsolutePath = path.resolve(__dirname, serviceAccountFileName);

  console.log("DEBUG: Caminho absoluto para credenciais:", serviceAccountAbsolutePath);

  let rawServiceAccountJson: any;
  try {
    await fs.access(serviceAccountAbsolutePath, fs.constants.F_OK | fs.constants.R_OK);
    console.log("DEBUG: Arquivo de credenciais encontrado e acessível.");

    const fileContent = await fs.readFile(serviceAccountAbsolutePath, { encoding: 'utf-8' });
    rawServiceAccountJson = JSON.parse(fileContent);

  } catch (error: any) {
    console.error("\n--- ERRO CRÍTICO AO CARREGAR/PARCEAR CREDENCIAIS DO FIREBASE ---\n");
    console.error("Caminho do arquivo tentado:", serviceAccountAbsolutePath);
    console.error("Tipo do erro:", error.name);
    console.error("Código do erro:", error.code);
    console.error("Mensagem do erro:", error.message);
    if (error.stack) {
      console.error("Stack Trace:", error.stack);
    }
    console.error("\n------------------------------------------------------------------\n");
    throw new Error("Falha ao iniciar Firebase - Arquivo de credenciais não encontrado, inválido ou sem permissão.");
  }

  console.log("Conteúdo de rawServiceAccountJson após parse:", JSON.stringify(rawServiceAccountJson, null, 2));

  // --- MUDANÇA CRUCIAL AQUI: REMOVER AS PROPRIEDADES EXTRAS ---
  const serviceAccount: ServiceAccount = {
    projectId: rawServiceAccountJson.project_id,
    clientEmail: rawServiceAccountJson.client_email,
    privateKey: rawServiceAccountJson.private_key,
    // REMOVA AS SEGUINTES LINHAS, POIS A INTERFACE ServiceAccount NÃO AS ESPERA:
    // type: rawServiceAccountJson.type,
    // client_id: rawServiceAccountJson.client_id,
    // auth_uri: rawServiceAccountJson.auth_uri,
    // token_uri: rawServiceAccountJson.token_uri,
    // auth_provider_x509_cert_url: rawServiceAccountJson.auth_provider_x509_cert_url,
    // client_x509_cert_url: rawServiceAccountJson.client_x509_cert_url,
    // universe_domain: rawServiceAccountJson.universe_domain
  };

  if (
    !serviceAccount ||
    typeof serviceAccount !== 'object' ||
    typeof serviceAccount.projectId !== 'string' || !serviceAccount.projectId ||
    typeof serviceAccount.clientEmail !== 'string' || !serviceAccount.clientEmail ||
    typeof serviceAccount.privateKey !== 'string' || !serviceAccount.privateKey
  ) {
    console.error("Validação de credenciais falhou. Objeto serviceAccount mapeado:", serviceAccount);
    throw new Error("Falha ao iniciar Firebase - Credenciais incompletas ou arquivo JSON inválido.");
  }

  try {
    const app = initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("Firebase Admin SDK inicializado com sucesso!");
    firebaseAuthService = getAuth(app);
  } catch (err) {
    console.error("Falha ao conectar o Firebase:", err);
    process.exit(1);
  }
};

export default initializeFirebaseAdmin;
export { firebaseAuthService };