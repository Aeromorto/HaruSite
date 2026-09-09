/** Ferramenta usada uma vez na migração: transforma HTML próprio em JSX legível.
 * Os componentes gerados podem ser editados à mão. Não reexecute após editá-los.
 * Nenhum HTML ou script do legado é injetado em runtime.
 */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom');
const base=path.join(__dirname,'..');
if(fs.existsSync(path.join(base,'apps/web/src/content/index.tsx')) && !process.argv.includes('--overwrite')) throw new Error('Componentes já existem. Edite-os à mão; --overwrite substitui alterações humanas.');
const main=fs.readFileSync(path.join(base,'v5.5/js/main.js'),'utf8');
const object=main.slice(main.indexOf('const I18N =')+12,main.indexOf('\n  const root')).trim().replace(/;$/,'');
const translations=vm.runInNewContext('('+object+')',{}, {timeout:1000});
const updates={
 pt:{'product.order':'Ver sacola','product.ship':'Consultar CEP','product.cepGo':'Consultar','privacy.p2':'As compras online ainda não estão disponíveis. A sacola é armazenada no servidor, associada a um cookie anônimo. O formulário de cartas guarda o e-mail apenas neste aparelho, sem assinatura ou envio.','privacy.p3':'Um cookie essencial identifica sua sacola por até 30 dias. Tema, idioma e e-mail salvo ficam no navegador, em chaves exclusivas deste ambiente. Os dados das versões anteriores não são importados.','privacy.p4':'A API consulta o CEP no ViaCEP para mostrar cidade e estado. Não há cotação real de frete, pagamento ou envio de newsletter nesta entrega.'},
 en:{'product.order':'View bag','product.ship':'Postal code lookup','product.cepGo':'Look up','privacy.p2':'Online purchases are not available yet. Your bag is stored on the server using an anonymous cookie. The letters form saves your email on this device only, without subscribing or sending messages.','privacy.p3':'An essential cookie identifies your bag for up to 30 days. Theme, language and saved email stay in your browser under keys exclusive to this environment. Earlier versions are not imported.','privacy.p4':'The API looks up postal codes with ViaCEP to display city and state. Live shipping quotes, payments and newsletter delivery are not available in this release.'}
};
for(const lang of ['pt','en'])Object.assign(translations[lang],updates[lang]);
fs.writeFileSync(path.join(base,'apps/web/src/content/translations.json'),JSON.stringify(translations,null,2)+'\n');
for(const folder of ['images','fonts'])fs.cpSync(path.join(base,'v5.5',folder),path.join(base,'apps/web/public',folder),{recursive:true});
for(const file of ['fonts','styles','pages','web']) {
 const css=fs.readFileSync(path.join(base,'v5.5/css',file+'.css'),'utf8').replaceAll('../fonts/','/fonts/').replaceAll('../images/','/images/');
 fs.writeFileSync(path.join(base,'apps/web/src/styles',file+'.css'),css);
}
const attrs={class:'className',for:'htmlFor',tabindex:'tabIndex',novalidate:'noValidate',autocomplete:'autoComplete',inputmode:'inputMode',maxlength:'maxLength',fetchpriority:'fetchPriority','stroke-width':'strokeWidth','stroke-linecap':'strokeLinecap','stroke-linejoin':'strokeLinejoin','font-family':'fontFamily','font-size':'fontSize','font-weight':'fontWeight',viewbox:'viewBox'};
const voids=new Set(['img','input','br','hr','meta','link','source','wbr']);
function jsx(n){
 if(n.nodeType===3)return n.textContent.trim()?'{'+JSON.stringify(n.textContent.replace(/\s+/g,' '))+'}':'';
 if(n.nodeType!==1)return '';
 const tag=n.tagName.toLowerCase(),cls=n.className||'';
 if(tag==='script'||tag==='noscript'||n.id==='letterNote')return '';
 if(n.id==='letterForm')return '<Newsletter />';
 if(n.id==='cepForm')return '<Shipping />';
 if(cls==='products__grid')return '<Catalog />';
 if(cls==='product__actions')return '<ProductActions id="'+n.querySelector('[data-add-cart]').getAttribute('data-add-cart')+'" />';
 if(cls==='product__price')return '<ProductPrice id="'+n.ownerDocument.body.dataset.product+'" />';
 const out=[];
 for(const a of n.attributes){
  if(a.name.startsWith('data-i18n'))continue;
  if(a.name==='href'&&a.value==='changes/index.html') {out.push('href="/migracao"');continue;}
  let val=a.value;
  if(['src','href'].includes(a.name)) {
   val=val.replace(/^images\//,'/images/').replace(/^index\.html/,'/').replace(/^([a-z]+)\.html/,'/$1');
  }
  const translated={'alt':'data-i18n-alt','aria-label':'data-i18n-aria','placeholder':'data-i18n-placeholder'}[a.name];
  if(translated&&n.hasAttribute(translated))out.push(`${attrs[a.name]||a.name}={t(${JSON.stringify(n.getAttribute(translated))})}`);
  else if(['hidden','disabled','required','novalidate'].includes(a.name))out.push(attrs[a.name]||a.name);
  else if(a.name==='style') {
   const style={};for(const part of val.split(';')) {const idx=part.indexOf(':');if(idx<0)continue;style[part.slice(0,idx).trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=part.slice(idx+1).trim();}out.push('style={'+JSON.stringify(style)+'}');
  }else out.push(`${attrs[a.name]||a.name}=${JSON.stringify(val)}`);
 }
 const open='<'+tag+' '+out.join(' ');
 if(voids.has(tag))return open+' />';
 const content=n.hasAttribute('data-i18n')?'{t('+JSON.stringify(n.getAttribute('data-i18n'))+')}':Array.from(n.childNodes).map(jsx).join('\n');
 return open+'>'+content+'</'+tag+'>';
}
const pages=['index','escova','kit','suporte','microplasticos','uso','privacidade','termos'];
const meta={};
for(const name of pages){
 const doc=new JSDOM(fs.readFileSync(path.join(base,'v5.5',name+'.html'),'utf8')).window.document;
 const content=Array.from(doc.body.children).filter(n=>n.tagName==='MAIN'||n.classList.contains('hero')).map(jsx).join('\n');
 const comp=name[0].toUpperCase()+name.slice(1)+'Content';
 const code=`'use client';\n// Conteúdo editorial migrado da v5.5. Interações ficam nos componentes compartilhados.\nimport { useStore } from '@/components/store-provider';\nimport { Catalog, ProductActions, ProductPrice, Shipping, Newsletter } from '@/components/commerce';\nexport default function ${comp}(){ const {t}=useStore(); return <>${content}</>; }\n`;
 fs.writeFileSync(path.join(base,'apps/web/src/content',name+'.tsx'),code);
 const dir=path.join(base,'apps/web/src/app',name==='index'?'':name);fs.mkdirSync(dir,{recursive:true});
 const title=doc.title,description=doc.querySelector('meta[name="description"]')?.content||'';
 fs.writeFileSync(path.join(dir,'page.tsx'),`import type { Metadata } from 'next';\nimport Content from '@/content/${name}';\nexport const metadata:Metadata=${JSON.stringify({title,description})};\nexport default function Page(){return <Content />;}\n`);
 meta[name]={title,description};
}
// O cabeçalho e o rodapé passam a ser únicos; preservamos seus desenhos SVG.
const doc=new JSDOM(fs.readFileSync(path.join(base,'v5.5/index.html'),'utf8')).window.document;
for(const [name,selector] of [['header','.nav'],['footer','.footer']]){
 const el=doc.querySelector(selector);
 el.querySelectorAll('a[href^="#"]').forEach(n=>n.setAttribute('href','/'+n.getAttribute('href')));
 let code=jsx(el);
 if(name==='header'){
  code=code.replace('id="themeToggle"','id="themeToggle" onClick={toggleTheme}').replace('aria-pressed="false"','aria-pressed={theme === "kraft"}');
  code=code.replace('id="cartToggle"','id="cartToggle" onClick={() => setCartOpen(true)}').replace('aria-expanded="false"','aria-expanded={cartOpen}');
  code=code.replace('id="navMenu"','id="navMenu" onClick={() => setMenu(!menu)}').replace('aria-expanded="false"','aria-expanded={menu}');
  code=code.replace(/<span className="cart-toggle__count"[^>]*>.*?<\/span>/s,'<span className="cart-toggle__count" hidden={!cart?.quantity}>{cart?.quantity || 0}</span>');
 }
 else code=code.replace('id="langToggle"','id="langToggle" onClick={toggleLang}');
 fs.writeFileSync(path.join(base,'apps/web/src/content',name+'-markup.txt'),code);
}
