import { BadRequestException, Injectable } from "@nestjs/common";
import { createHash, randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import type { Cart, CartItem } from "@haru/contracts";
import { DatabaseService } from "./database.service";

const COOKIE = "haru_migration_cart";
@Injectable()
export class CartService {
  constructor(private readonly db: DatabaseService) {}
  /** O cookie contém segredo aleatório; no banco só fica o hash. Não é login de cliente. */
  async session(req: Request, res: Response): Promise<string> {
    const token: unknown = req.cookies?.[COOKIE];
    if (typeof token === "string" && /^[a-f0-9]{64}$/.test(token)) {
      const hash = createHash("sha256").update(token).digest("hex");
      if (
        (
          await this.db.pool.query(
            "SELECT 1 FROM carts WHERE token_hash=$1 AND expires_at>now()",
            [hash],
          )
        ).rowCount
      )
        return hash;
    }
    const next = randomBytes(32).toString("hex");
    const hash = createHash("sha256").update(next).digest("hex");
    await this.db.pool.query("INSERT INTO carts(token_hash) VALUES($1)", [
      hash,
    ]);
    res.cookie(COOKIE, next, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.COOKIE_SECURE === "true",
      maxAge: 30 * 86400000,
      path: "/api",
    });
    return hash;
  }
  async read(hash: string): Promise<Cart> {
    const items = (
      await this.db.pool.query<CartItem>(
        `SELECT p.id,p.slug,p.name,p.image,v.sku,v.stock,
      v.price_cents AS "priceCents",LEAST(COALESCE(v.stock,9),99)::integer AS "maxQuantity",
      i.quantity,(i.quantity*v.price_cents)::integer AS "lineTotalCents"
      FROM cart_items i JOIN variants v ON v.sku=i.sku JOIN products p ON p.id=v.product_id
      WHERE i.cart_id=$1 AND p.active=true ORDER BY p.id`,
        [hash],
      )
    ).rows;
    return {
      items,
      quantity: items.reduce((n, i) => n + i.quantity, 0),
      subtotalCents: items.reduce((n, i) => n + i.lineTotalCents, 0),
      checkoutAvailable: false,
    };
  }
  async set(hash: string, sku: string, quantity: number): Promise<Cart> {
    const client = await this.db.pool.connect();
    try {
      await client.query("BEGIN");
      // Uma transação por sacola evita perda de atualizações entre abas/requisições.
      await client.query(
        "SELECT token_hash FROM carts WHERE token_hash=$1 FOR UPDATE",
        [hash],
      );
      if (quantity === 0) {
        await client.query(
          "DELETE FROM cart_items WHERE cart_id=$1 AND sku=$2",
          [hash, sku],
        );
      } else {
        const product = (
          await client.query(
            `SELECT v.stock,p.active FROM variants v JOIN products p ON p.id=v.product_id WHERE v.sku=$1 FOR SHARE OF v,p`,
            [sku],
          )
        ).rows[0];
        if (!product?.active)
          throw new BadRequestException("Produto indisponível");
        if (quantity > Math.min(product.stock ?? 9, 99))
          throw new BadRequestException(
            "Quantidade acima do limite disponível",
          );
        await client.query(
          `INSERT INTO cart_items(cart_id,sku,quantity) VALUES($1,$2,$3)
          ON CONFLICT(cart_id,sku) DO UPDATE SET quantity=EXCLUDED.quantity`,
          [hash, sku, quantity],
        );
      }
      await client.query(
        "UPDATE carts SET updated_at=now() WHERE token_hash=$1",
        [hash],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
    // A sacola não reserva estoque e nunca recebe preços enviados pelo cliente.
    return this.read(hash);
  }
}
