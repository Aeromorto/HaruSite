/** Carrega o .env da raiz sem propagar flags --env-file aos workers internos do Next. */
const path=require('node:path');
try {process.loadEnvFile(path.join(__dirname,'../.env'));}
catch(error){if(error.code!=='ENOENT')throw error;}
require('next/dist/bin/next');
