const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const source = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const KEY = 'haru-cart:/HaruSite/';
const tick = () => new Promise((resolve) => setImmediate(resolve));
function setup(options = {}) {
  const dom = new JSDOM(source(options.page || 'index.html'), { url: 'https://example.test/HaruSite/' + (options.page || 'index.html') + '?lang=pt', runScripts: 'outside-only' });
  const w = dom.window;
  w.matchMedia = () => ({ matches: false, addEventListener() {}, addListener() {} });
  w.scrollTo = () => {};
  if (options.cart !== undefined) w.localStorage.setItem(KEY, JSON.stringify(options.cart));
  options.before?.(w);
  w.eval(source('js/boot.js'));
  w.eval(source('js/main.js'));
  w.eval(source('js/pay-adapter.js'));
  w.eval(source('js/shop.js'));
  return w;
}
const items = (w) => JSON.parse(JSON.stringify(w.HaruCart.getItems()));
test('forms cannot submit visitor data in URLs when JavaScript is unavailable', () => {
  for (const page of ['index.html', 'escova.html', 'kit.html', 'suporte.html']) {
    const dom = new JSDOM(source(page));
    for (const control of dom.window.document.querySelectorAll('#letterForm input, #letterForm button, #cepForm input, #cepForm button')) assert.equal(control.disabled, true);
    dom.window.close();
    const w = setup({ page });
    for (const control of w.document.querySelectorAll('#letterForm input, #letterForm button, #cepForm input, #cepForm button')) assert.equal(control.disabled, false);
    w.close();
  }
});
test('cart rejects inherited IDs, invalid and fractional quantities; merges duplicates', () => {
  const w = setup({ cart: [{ id:'p1', qty:2.9 }, { id:'p1', qty:'8' }, { id:'constructor', qty:1 }, { id:'__proto__', qty:3 }, { id:'p2', qty:'Infinity' }, { id:'p3', qty:-1 }, null] });
  assert.deepEqual(items(w), [{ id:'p1', qty:9 }]);
  for (const qty of [NaN, Infinity, -1, {}, [], true]) w.HaruCart.add('p2', qty);
  w.HaruCart.add('toString', 1);
  assert.equal(items(w).length, 1);
  const copy = w.HaruCart.getItems(); copy[0].qty = 100;
  assert.equal(items(w)[0].qty, 9);
  w.close();
});
test('corrupt storage recovers; legacy cart migrates while checkout PII is removed', () => {
  const w = setup({ before(w) {
    w.localStorage.setItem('haru-cart', '[{"id":"p2","qty":2}]');
    w.localStorage.setItem('haru-checkout', '{"verified":true,"email":"private@example.test"}');
    w.localStorage.setItem('haru-order-draft', '{}');
    w.document.cookie = 'haru-checkout=secret; path=/';
  } });
  assert.deepEqual(items(w), [{ id:'p2', qty:2 }]);
  assert.equal(w.localStorage.getItem('haru-checkout'), null);
  assert.equal(w.localStorage.getItem('haru-order-draft'), null);
  assert.equal(w.document.cookie.includes('haru-checkout'), false);
  w.localStorage.setItem(KEY, '{broken'); w.HaruCart.open();
  assert.deepEqual(items(w), []);
  w.close();
});
test('bag survives denied storage and write quota failures in the current tab', () => {
  for (const mode of ['denied', 'quota']) {
    const w = setup({ before(w) {
      w.Storage.prototype.setItem = () => { throw new w.DOMException('quota', 'QuotaExceededError'); };
      if (mode === 'denied') w.Storage.prototype.getItem = () => { throw new w.DOMException('denied', 'SecurityError'); };
    } });
    w.HaruCart.add('p1'); w.HaruCart.open(); w.HaruCart.add('p1'); w.HaruCart.open();
    assert.deepEqual(items(w), [{ id:'p1', qty:2 }]);
    assert.equal(w.document.getElementById('cartStorageNote').hidden, false);
    w.close();
  }
});
test('cart edits preserve keyboard focus, enforce limits and remove the last row', () => {
  const w = setup({ cart:[{ id:'p1', qty:8 }] }), d = w.document;
  w.HaruCart.open();
  const plus = d.querySelector('[data-delta="1"]'); plus.focus(); plus.click();
  assert.equal(d.activeElement.dataset.control, 'p1:1');
  d.activeElement.click(); assert.equal(items(w)[0].qty, 9);
  d.querySelector('[data-remove]').focus(); d.activeElement.click();
  assert.equal(d.activeElement.id, 'cartShop');
  assert.equal(d.getElementById('cartFoot').hidden, true);
  w.close();
});
test('drawer traps focus, hides background and restores the opener on Escape', () => {
  const w = setup(), d = w.document, toggle = d.getElementById('cartToggle');
  toggle.focus(); toggle.click();
  assert.equal(d.querySelector('main').inert, true);
  d.getElementById('cartShop').focus();
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key:'Tab', bubbles:true, cancelable:true }));
  assert.equal(d.activeElement.id, 'cartClose');
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key:'Escape', bubbles:true }));
  assert.equal(d.activeElement, toggle);
  assert.ok(!d.querySelector('main').inert);
  w.close();
});
test('checkout does not collect PII or empty the bag; all adapter methods fail closed', async () => {
  const w = setup({ cart:[{ id:'p1', qty:1 }] });
  w.HaruCart.checkout();
  assert.equal(w.document.getElementById('checkNote').hidden, false);
  assert.equal(w.document.getElementById('checkEmail'), null);
  for (const method of [w.HaruAuth.requestCode, w.HaruAuth.verifyCode, w.HaruPay.applyCoupon, w.HaruPay.createPayment]) assert.equal((await method('123456')).ok, false);
  assert.deepEqual(items(w), [{ id:'p1', qty:1 }]);
  assert.equal(w.localStorage.getItem('haru-order-draft'), null);
  w.close();
});
test('storage events refresh the bag and its totals; unrelated storage is ignored', () => {
  const w = setup();
  w.localStorage.setItem(KEY, '[{"id":"p2","qty":2}]');
  w.dispatchEvent(new w.StorageEvent('storage', { key:KEY }));
  assert.match(w.document.getElementById('cartSum').textContent, /172,00/);
  w.localStorage.clear(); w.dispatchEvent(new w.StorageEvent('storage', { key:null }));
  assert.deepEqual(items(w), []);
  w.close();
});
test('language changes translate the open bag and its newly generated links', () => {
  const w = setup({ cart:[{ id:'p1', qty:1 }] });
  w.HaruCart.open(); w.document.getElementById('langToggle').click();
  assert.equal(w.document.querySelector('.cart-line__name').textContent, 'Bamboo brush');
  assert.match(w.document.querySelector('.cart-line__img').href, /lang=en/);
  assert.match(w.document.querySelector('[data-delta="1"]').getAttribute('aria-label'), /Increase quantity/);
  w.close();
});
test('newsletter storage failure never reports a successful save', () => {
  const w = setup();
  w.Storage.prototype.setItem = () => { throw new Error('quota'); };
  w.document.getElementById('letterEmail').value = 'reader@example.test';
  w.document.getElementById('letterForm').dispatchEvent(new w.Event('submit', { cancelable:true }));
  assert.equal(w.document.getElementById('letterNote').dataset.i18n, 'letter.storageErr');
  assert.equal(w.document.getElementById('letterForm').classList.contains('is-done'), false);
  w.close();
});
test('postal requests ignore stale results, reject missing CEPs and clear results on edit', async () => {
  const requests = [];
  const w = setup({ page:'escova.html', before(w) {
    w.fetch = (url, options) => new Promise((resolve) => requests.push({ url, options, resolve }));
  } });
  const input = w.document.getElementById('cepInput'), form = w.document.getElementById('cepForm');
  const submit = (cep) => { input.value = cep; form.dispatchEvent(new w.Event('submit', { cancelable:true })); };
  submit('01001000'); submit('20040002');
  assert.equal(requests[0].options.signal.aborted, true);
  requests[1].resolve({ ok:true, json:async () => ({ uf:'RJ', localidade:'Rio de Janeiro' }) });
  await tick();
  requests[0].resolve({ ok:true, json:async () => ({ uf:'SP', localidade:'São Paulo' }) });
  await tick();
  assert.match(w.document.getElementById('cepPlace').textContent, /Rio de Janeiro/);
  input.dispatchEvent(new w.Event('input'));
  assert.equal(w.document.getElementById('cepPlace').hidden, true);
  submit('99999999'); requests[2].resolve({ ok:true, json:async () => ({ erro:true }) }); await tick();
  assert.equal(w.document.getElementById('cepOpts').hidden, true);
  assert.equal(w.document.getElementById('cepNote').textContent, w.haruT('product.cepMiss'));
  assert.equal(requests.length, 3); // No JSONP retry for a valid not-found response.
  assert.equal(form.hasAttribute('aria-busy'), false);
  w.close();
});
test('postal network errors and malformed responses stay recoverable', async () => {
  for (const response of [null, { ok:false }, { ok:true, json:async () => ({ uf:'XX', localidade:'Unknown' }) }]) {
    const w = setup({ page:'escova.html', before(w) { w.fetch = async () => { if (!response) throw new Error('offline'); return response; }; } });
    w.document.getElementById('cepInput').value = '01001000';
    w.document.getElementById('cepForm').dispatchEvent(new w.Event('submit', { cancelable:true }));
    await tick();
    assert.equal(w.document.getElementById('cepOpts').hidden, true);
    assert.equal(w.document.getElementById('cepNote').hidden, false);
    w.close();
  }
});
test('postal timeout aborts the request and releases the loading state', async () => {
  let timeout;
  const w = setup({ page:'kit.html', before(w) {
    const original = w.setTimeout.bind(w);
    w.setTimeout = (fn, delay) => delay === 8000 ? (timeout = fn, 0) : original(fn, delay);
    w.fetch = (_, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted'))));
  } });
  const form = w.document.getElementById('cepForm');
  w.document.getElementById('cepInput').value = '01001000';
  form.dispatchEvent(new w.Event('submit', { cancelable:true }));
  assert.equal(form.getAttribute('aria-busy'), 'true');
  timeout(); await tick();
  assert.equal(form.hasAttribute('aria-busy'), false);
  assert.equal(w.document.getElementById('cepNote').textContent, w.haruT('product.cepNet'));
  w.close();
});
test('all maintained pages initialize with complete Portuguese and English translations', () => {
  for (const page of fs.readdirSync(root).filter((file) => file.endsWith('.html'))) {
    const w = setup({ page });
    for (let locale = 0; locale < 2; locale++) {
      for (const el of w.document.querySelectorAll('[data-i18n]')) {
        assert.notEqual(w.haruT(el.dataset.i18n), el.dataset.i18n, `${page}: missing ${el.dataset.i18n}`);
      }
      w.document.getElementById('langToggle').click();
    }
    w.close();
  }
});
