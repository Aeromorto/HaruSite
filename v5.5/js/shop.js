(() => {
  'use strict';
  // GitHub Pages projects share an origin; keep bags scoped to this directory.
  const KEY = 'haru-cart:' + new URL('.', location.href).pathname;
  const CATALOG = Object.freeze({
    p1: { href: 'escova.html', price: 48, image: 'images/product-escova.jpg', nameKey: 'p1.name' },
    p2: { href: 'kit.html', price: 86, image: 'images/product-kit.jpg', nameKey: 'p2.name' },
    p3: { href: 'suporte.html', price: 62, image: 'images/product-suporte.jpg', nameKey: 'p3.name' },
  });
  const t = (key) => typeof window.haruT === 'function' ? window.haruT(key) : key;
  const money = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  const qs = (id) => document.getElementById(id);
  const validId = (id) => typeof id === 'string' && Object.hasOwn(CATALOG, id);
  const quantity = (value) => {
    if (typeof value !== 'number' && typeof value !== 'string') return 0;
    const n = Number(value);
    return Number.isFinite(n) ? Math.min(9, Math.max(0, Math.floor(n))) : 0;
  };
  const normalize = (value) => {
    const rows = new Map();
    if (Array.isArray(value)) value.forEach((row) => {
      if (!row || !validId(row.id)) return;
      const qty = quantity(row.qty);
      if (qty) rows.set(row.id, Math.min(9, (rows.get(row.id) || 0) + qty));
    });
    return Array.from(rows, ([id, qty]) => ({ id, qty }));
  };
  let cart = [], storageAvailable = true, memoryOnly = false;
  const load = () => {
    if (memoryOnly) return;
    try {
      const raw = localStorage.getItem(KEY);
      cart = normalize(raw ? JSON.parse(raw) : []);
      storageAvailable = true;
    } catch (error) {
      if (error instanceof SyntaxError) cart = [];
      else storageAvailable = false; // Preserve this tab's bag when storage is denied.
    }
  };
  // v5 remains live at the parent URL. Never migrate/delete its origin-wide
  // cart, checkout, cookies or order drafts from this independent version.
  load();
  const persist = () => {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); storageAvailable = true; memoryOnly = false; }
    catch (_) { storageAvailable = false; memoryOnly = true; }
  };
  const total = () => cart.reduce((sum, row) => sum + CATALOG[row.id].price * row.qty, 0);
  const count = () => cart.reduce((sum, row) => sum + row.qty, 0);
  const localHref = (href) => {
    const url = new URL(href, location.href);
    for (const key of ['lang', 'theme']) {
      const value = document.documentElement.getAttribute('data-' + key);
      if (value) url.searchParams.set(key, value);
    }
    return url.pathname + url.search + url.hash;
  };
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="cart-overlay" id="cartOverlay" hidden></div>
    <aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" tabindex="-1" hidden data-lenis-prevent>
      <header class="cart-drawer__head"><h2 id="cartTitle" data-i18n="cart.title">Sacola</h2><button type="button" class="cart-drawer__close" id="cartClose">×</button></header>
      <div class="cart-vacant" id="cartVacant"><p class="cart-empty" data-i18n="cart.empty"></p><p class="cart-vacant__lead" data-i18n="cart.emptyLead"></p><a class="product__cta" id="cartShop" href="index.html#loja" data-i18n="cart.shop"></a></div>
      <ul class="cart-list" id="cartList"></ul>
      <div class="cart-foot" id="cartFoot" hidden><p class="cart-foot__sum"><span data-i18n="cart.subtotal"></span><strong id="cartSum"></strong></p><button type="button" class="product__cta" id="cartGoCheck" data-i18n="cart.checkout"></button></div>
      <p class="ship__note" id="cartStorageNote" role="status" hidden></p>
      <p class="ship__note" id="checkNote" role="status" tabindex="-1" hidden></p>
      <p class="visually-hidden" id="cartStatus" role="status" aria-live="polite" aria-atomic="true"></p>
    </aside>`;
  while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  const drawer = qs('cartDrawer');
  let returnFocus = null, background = [], checkoutNotice = false;
  const isOpen = () => !drawer.hidden;
  const setOpen = (open) => {
    if (open === isOpen()) return;
    document.documentElement.classList.toggle('cart-open', open);
    drawer.hidden = !open;
    qs('cartOverlay').hidden = !open;
    qs('cartToggle')?.setAttribute('aria-expanded', String(open));
    if (open) {
      returnFocus = document.activeElement;
      document.getElementById('navMenu')?.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('nav-open');
      background = Array.from(document.body.children).filter((el) => el !== drawer && el !== qs('cartOverlay') && el.tagName !== 'SCRIPT').map((el) => [el, el.inert]);
      background.forEach(([el]) => { el.inert = true; });
      window.haruLenis?.stop();
      qs('cartClose').focus();
    } else {
      background.forEach(([el, inert]) => { el.inert = inert; });
      background = [];
      window.haruLenis?.start();
      if (returnFocus?.isConnected) returnFocus.focus();
    }
  };
  const refresh = () => {
    const focusKey = document.activeElement?.getAttribute('data-control');
    const list = qs('cartList');
    list.replaceChildren();
    cart.forEach((row) => {
      const item = CATALOG[row.id], li = document.createElement('li');
      li.className = 'cart-line';
      li.innerHTML = `<a class="cart-line__img"><img alt=""></a><div class="cart-line__body"><p class="cart-line__name"></p><p class="cart-line__price"></p><div class="cart-line__qty"><button type="button" data-delta="-1">−</button><span></span><button type="button" data-delta="1">+</button></div></div><button type="button" class="cart-line__remove"></button>`;
      li.querySelector('a').href = localHref(item.href);
      li.querySelector('a').setAttribute('aria-label', t(item.nameKey));
      li.querySelector('img').src = item.image;
      li.querySelector('.cart-line__name').textContent = t(item.nameKey);
      li.querySelector('.cart-line__price').textContent = money(item.price);
      li.querySelector('.cart-line__qty span').textContent = row.qty;
      li.querySelectorAll('[data-delta]').forEach((btn) => {
        const delta = Number(btn.dataset.delta);
        btn.dataset.id = row.id; btn.dataset.control = row.id + ':' + delta;
        btn.setAttribute('aria-label', t(delta < 0 ? 'cart.decrease' : 'cart.increase') + ': ' + t(item.nameKey));
        btn.setAttribute('aria-disabled', String(delta > 0 && row.qty === 9));
      });
      const remove = li.querySelector('.cart-line__remove');
      remove.textContent = t('cart.remove');
      remove.setAttribute('aria-label', t('cart.remove') + ': ' + t(item.nameKey));
      remove.dataset.remove = row.id; remove.dataset.control = row.id + ':remove';
      list.appendChild(li);
    });
    drawer.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    const n = count();
    qs('cartCount').hidden = !n; qs('cartCount').textContent = n;
    qs('cartToggle').setAttribute('aria-label', t('cart.open') + ' (' + n + ')');
    qs('cartClose').setAttribute('aria-label', t('cart.close'));
    qs('cartVacant').hidden = !!n; list.hidden = !n; qs('cartFoot').hidden = !n;
    qs('cartSum').textContent = money(total());
    qs('cartShop').href = localHref('index.html#loja');
    qs('cartStorageNote').hidden = storageAvailable; qs('cartStorageNote').textContent = t('cart.storage');
    qs('checkNote').hidden = !checkoutNotice || !n; qs('checkNote').textContent = t('check.unavailable');
    qs('cartStatus').textContent = n + ' — ' + t('cart.subtotal') + ': ' + money(total());
    if (focusKey && isOpen()) {
      const next = Array.from(list.querySelectorAll('button')).find((btn) => btn.dataset.control === focusKey);
      (next || list.querySelector('button') || qs('cartShop')).focus();
    }
  };
  const addItem = (id, qty = 1) => {
    if (!validId(id) || !quantity(qty)) return;
    load(); cart = normalize([...cart, { id, qty }]); persist(); refresh();
  };
  const openCart = () => { load(); checkoutNotice = false; refresh(); setOpen(true); };
  const openCheck = () => {
    openCart();
    if (!cart.length) return;
    // Static hosting has no authentication, order or payment service.
    checkoutNotice = true; refresh(); qs('checkNote').focus();
  };
  qs('cartToggle')?.addEventListener('click', () => isOpen() ? setOpen(false) : openCart());
  ['cartClose', 'cartOverlay', 'cartShop'].forEach((id) => qs(id).addEventListener('click', () => setOpen(false)));
  qs('cartGoCheck').addEventListener('click', openCheck);
  qs('cartList').addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn || btn.getAttribute('aria-disabled') === 'true') return;
    load();
    const id = btn.dataset.remove || btn.dataset.id;
    cart = normalize(cart.map((row) => row.id !== id ? row : { id, qty: btn.dataset.remove ? 0 : row.qty + Number(btn.dataset.delta) }));
    persist(); refresh();
  });
  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(drawer.querySelectorAll("a[href], button, [tabindex='0']")).filter((el) => !el.disabled && !el.closest('[hidden]'));
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !focusable.includes(document.activeElement))) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-add-cart], [data-buy]');
    if (!btn) return;
    event.preventDefault();
    const id = btn.getAttribute('data-add-cart') || btn.getAttribute('data-buy');
    if (!validId(id)) return;
    load();
    if (btn.hasAttribute('data-add-cart') || !cart.some((row) => row.id === id)) addItem(id);
    if (btn.hasAttribute('data-buy')) openCheck(); else openCart();
  });
  window.addEventListener('storage', (event) => { if (event.key === KEY || event.key === null) { load(); refresh(); } });
  window.addEventListener('pageshow', () => { load(); refresh(); });
  window.haruShopRefresh = refresh;
  window.HaruCart = { add: addItem, open: openCart, checkout: openCheck, getItems: () => cart.map((row) => ({ ...row })) };
  refresh();
})();
