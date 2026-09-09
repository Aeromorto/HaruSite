const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const request=require('supertest');
const {Pool}=require('pg');
let app,pool,server;
before(async()=>{
 const url=process.env.TEST_DATABASE_URL;
 if(!url||!new URL(url).pathname.endsWith('_test'))throw new Error('TEST_DATABASE_URL deve apontar para banco com sufixo _test.');
 process.env.DATABASE_URL=url;
 const migration=spawnSync(process.execPath,['scripts/migrate.cjs'],{env:process.env,encoding:'utf8'});
 assert.equal(migration.status,0,migration.stderr);
 pool=new Pool({connectionString:url});
 const {createApp}=require('../dist/bootstrap');app=await createApp();await app.init();server=app.getHttpServer();
});
after(async()=>{await app?.close();await pool?.end();});
const mutate=(agent,body)=>agent.put('/api/cart/items').set('X-Haru-Request','1').send(body);
test('catálogo real mantém preços em centavos e retorna 404 para produto inexistente',async()=>{
 const r=await request(server).get('/api/products').expect(200);assert.equal(r.body.length,3);assert.equal(r.body[0].priceCents,4800);
 await request(server).get('/api/products/desconhecido').expect(404);
});
test('sacola persiste, isola sessões e calcula subtotal no servidor',async()=>{
 const first=request.agent(server),second=request.agent(server);
 const initial=await first.get('/api/cart').expect(200);
 assert.match(initial.headers['set-cookie'][0],/HttpOnly/);
 await mutate(first,{sku:'HARU-ESCOVA',quantity:2}).expect(200);
 const saved=await first.get('/api/cart').expect(200);assert.equal(saved.body.subtotalCents,9600);assert.equal(saved.body.checkoutAvailable,false);
 assert.equal((await second.get('/api/cart').expect(200)).body.quantity,0);
 await mutate(first,{sku:'HARU-ESCOVA',quantity:0}).expect(200);
 assert.equal((await first.get('/api/cart')).body.quantity,0);
});
test('API rejeita adulteração de preço, frações, excesso e CSRF simples',async()=>{
 const agent=request.agent(server);await agent.get('/api/cart');
 for(const body of [{sku:'HARU-ESCOVA',quantity:1,priceCents:1},{sku:'HARU-ESCOVA',quantity:1.5},{sku:'HARU-ESCOVA',quantity:-1},{sku:'HARU-ESCOVA',quantity:10},{sku:'UNKNOWN',quantity:1}])await mutate(agent,body).expect(400);
 await agent.put('/api/cart/items').send({sku:'HARU-ESCOVA',quantity:1}).expect(403);
 await mutate(agent,{sku:'HARU-ESCOVA',quantity:1}).set('Origin','https://evil.example').expect(403);
});
test('saldo confirmado limita quantidade; remoção continua possível com estoque zero',async()=>{
 const agent=request.agent(server);await agent.get('/api/cart');
 try {
  await pool.query("UPDATE variants SET stock=2 WHERE sku='HARU-ESCOVA'");
  await mutate(agent,{sku:'HARU-ESCOVA',quantity:3}).expect(400);
  await mutate(agent,{sku:'HARU-ESCOVA',quantity:2}).expect(200);
  await pool.query("UPDATE variants SET stock=0 WHERE sku='HARU-ESCOVA'");
  await mutate(agent,{sku:'HARU-ESCOVA',quantity:0}).expect(200);
 }finally{await pool.query("UPDATE variants SET stock=NULL WHERE sku='HARU-ESCOVA'");}
});
test('consultas de CEP validam formato e tratam sucesso, inexistência e falha externa',async()=>{
 const {PostalService}=require('../dist/postal.service');const svc=new PostalService();const original=global.fetch;
 await assert.rejects(()=>svc.lookup('abc'),{status:400});
 try{
  global.fetch=async()=>({ok:true,json:async()=>({localidade:'Goiânia',uf:'GO'})});assert.equal((await svc.lookup('74000000')).shippingAvailable,false);
  global.fetch=async()=>({ok:true,json:async()=>({erro:true})});await assert.rejects(()=>svc.lookup('00000000'),{status:404});
  global.fetch=async()=>{throw new Error('timeout');};await assert.rejects(()=>svc.lookup('74000000'),{status:503});
 }finally{global.fetch=original;}
});
