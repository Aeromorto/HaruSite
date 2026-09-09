-- Migração inicial: preços herdados da v5.5. NULL é estoque desconhecido, não infinito.
CREATE TABLE products (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  image text NOT NULL,
  active boolean NOT NULL DEFAULT true
);
CREATE TABLE variants (
  sku text PRIMARY KEY,
  product_id text NOT NULL REFERENCES products(id),
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  stock integer CHECK (stock >= 0)
);
CREATE TABLE carts (
  token_hash text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '30 days'
);
CREATE TABLE cart_items (
  cart_id text NOT NULL REFERENCES carts(token_hash) ON DELETE CASCADE,
  sku text NOT NULL REFERENCES variants(sku),
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 99),
  PRIMARY KEY (cart_id, sku)
);
CREATE INDEX carts_expiry_idx ON carts(expires_at);
INSERT INTO products(id,slug,name,image) VALUES
 ('p1','escova','Escova de bambu','/images/product-escova.jpg'),
 ('p2','kit','Kit de duas','/images/product-kit.jpg'),
 ('p3','suporte','Suporte de pedra','/images/product-suporte.jpg');
INSERT INTO variants(sku,product_id,price_cents,stock) VALUES
 ('HARU-ESCOVA','p1',4800,NULL),('HARU-KIT','p2',8600,NULL),('HARU-SUPORTE','p3',6200,NULL);
