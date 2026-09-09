/** Ambiente local exclusivo. Não usa o serviço PostgreSQL do sistema nem bancos de outros projetos. */
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const {Client}=require('pg');
const root=path.resolve(__dirname,'..'),local=path.join(root,'.local'),data=path.join(local,'postgres');
const versions=fs.existsSync('/usr/lib/postgresql')?fs.readdirSync('/usr/lib/postgresql').sort((a,b)=>Number(b)-Number(a)):[];
const bin=versions.map(v=>`/usr/lib/postgresql/${v}/bin`).find(p=>fs.existsSync(path.join(p,'initdb')));
if(!bin)throw new Error('PostgreSQL local não encontrado. Use docker compose up -d db.');
fs.mkdirSync(path.join(local,'socket'),{recursive:true});
function run(name,args){const r=spawnSync(path.join(bin,name),args,{stdio:'inherit'});if(r.status!==0)throw new Error(`${name} falhou`);}
if(!fs.existsSync(path.join(data,'PG_VERSION')))run('initdb',['-D',data,'--auth=trust','--username=haru']);
if(spawnSync(path.join(bin,'pg_ctl'),['-D',data,'status'],{stdio:'ignore'}).status!==0)run('pg_ctl',['-D',data,'-l',path.join(local,'postgres.log'),'-o',`-p 55439 -h 127.0.0.1 -k ${path.join(local,'socket')}`,'start']);
async function setup(){
 const c=new Client({connectionString:'postgresql://haru:haru_dev@127.0.0.1:55439/postgres'});await c.connect();
 try {for(const name of ['haru','haru_test']){if(!(await c.query('SELECT 1 FROM pg_database WHERE datname=$1',[name])).rowCount)await c.query('CREATE DATABASE '+name);}}
 finally{await c.end();}
 console.log('Bancos Haru prontos na porta 55439. Autenticação trust só para desenvolvimento local.');
}
setup().catch(e=>{console.error(e.message);process.exitCode=1;});
