import { test,expect } from '@playwright/test';

test('páginas, imagens e layout sem rolagem horizontal',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const path of ['/','/escova','/kit','/suporte','/uso','/microplasticos','/privacidade','/termos']){
  await page.goto(path);await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#cartToggle')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const broken=await page.locator('img').evaluateAll(nodes=>nodes.filter(n=>(n as HTMLImageElement).complete&&!(n as HTMLImageElement).naturalWidth).map(n=>(n as HTMLImageElement).src));expect(broken).toEqual([]);
 }
 expect(errors).toEqual([]);
 await page.goto('/');await expect(page.locator('.card')).toHaveCount(3);
 await page.screenshot({path:`test-results/home-${info.project.name}.png`,fullPage:true});
});
test('filtro, sacola persistente, teclado e aviso honesto de checkout',async({page})=>{
 await page.goto('/');await expect(page.locator('.card')).toHaveCount(3);
 await page.getByLabel('Preço máximo (R$)').fill('50');await expect(page.locator('.card')).toHaveCount(1);
 await page.getByRole('link',{name:'Ver produto',exact:true}).click();
 const add=page.getByRole('button',{name:'Adicionar à sacola',exact:true});await expect(add).toBeEnabled();await add.click();
 const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog).toContainText('R$ 48,00');
 await dialog.getByRole('button',{name:'Aumentar quantidade: Escova de bambu',exact:true}).click();await expect(dialog).toContainText('R$ 96,00');
 await dialog.getByRole('button',{name:'Continuar',exact:true}).click();await expect(dialog).toContainText('Nenhum pedido foi enviado');
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
 await page.reload();await page.locator('#cartToggle').click();await expect(dialog).toContainText('R$ 96,00');
 await dialog.getByRole('button',{name:'Tirar: Escova de bambu',exact:true}).click();await expect(dialog).toContainText('Ainda vazia');
});
test('idioma e tema persistem, CEP ignora resposta antiga, email pode ser apagado',async({page})=>{
 await page.goto('/');await page.locator('#themeToggle').click();await expect(page.locator('html')).toHaveAttribute('data-theme','kraft');
 await page.locator('#langToggle').click();await expect(page.locator('html')).toHaveAttribute('lang','en');await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','en');
 await page.locator('#langToggle').click();
 await page.locator('#letter-email').fill('teste@example.com');await page.getByRole('button',{name:'Salvar neste aparelho',exact:true}).click();await expect(page.locator('.letter__note')).toContainText('Guardamos');
 await page.getByRole('button',{name:'Apagar e-mail deste aparelho'}).click();expect(await page.evaluate(()=>localStorage.getItem('haru-migration-letter'))).toBeNull();
 await page.goto('/escova');
 await page.route('**/api/postal/74000000',async route=>{await new Promise(r=>setTimeout(r,300));await route.fulfill({json:{cep:'74000000',city:'Goiânia',state:'GO',shippingAvailable:false}});});
 await page.getByLabel('CEP',{exact:true}).fill('74000000');await page.getByRole('button',{name:'Consultar',exact:true}).click();await page.getByLabel('CEP',{exact:true}).fill('01001000');await page.waitForTimeout(500);await expect(page.locator('.ship')).not.toContainText('Goiânia');
});
test('falha de API permite tentar novamente sem preço ou sucesso inventado',async({page})=>{
 await page.route('**/api/products',route=>route.fulfill({status:503,json:{message:'offline'}}));
 await page.goto('/');await expect(page.getByRole('button',{name:'Tentar novamente',exact:true})).toBeVisible();
 await page.unroute('**/api/products');await page.getByRole('button',{name:'Tentar novamente',exact:true}).click();await expect(page.locator('.card')).toHaveCount(3);
});
