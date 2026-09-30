import { initializeApp, cert, getApps, type ServiceAccount } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { env } from './env'; 

let firebaseAuthService: Auth;

const initializeFirebaseAdmin = async (): Promise<void> => {
  if (getApps().length > 0) {
    console.log("Firebase Admin SDK já inicializado.");
    if (!firebaseAuthService) {
      firebaseAuthService = getAuth();
    }
    return;
  }

  const serviceAccount: ServiceAccount = {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
  };

  if (
    !serviceAccount.projectId ||
    !serviceAccount.clientEmail ||
    !serviceAccount.privateKey
  ) {
    console.error("Validação de credenciais do Firebase falhou. Variáveis de ambiente incompletas.");
    console.error("FIREBASE_PROJECT_ID:", serviceAccount.projectId ? "OK" : "AUSENTE");
    console.error("FIREBASE_CLIENT_EMAIL:", serviceAccount.clientEmail ? "OK" : "AUSENTE");
    console.error("FIREBASE_PRIVATE_KEY:", serviceAccount.privateKey ? "OK" : "AUSENTE");
    throw new Error("Falha ao iniciar Firebase - Variáveis de ambiente de credenciais incompletas.");
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