import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import type { Product } from "@haru/contracts";

// Nove mantém a regra da v5.5 enquanto o estoque comercial não foi informado.
// Quando stock for preenchido, a API limita pelo saldo (com teto operacional 99).
export const PRODUCT_SELECT = `SELECT p.id, p.slug, p.name, p.image, v.sku,
 v.price_cents AS "priceCents", v.stock,
 LEAST(COALESCE(v.stock,9),99)::integer AS "maxQuantity"
 FROM products p JOIN variants v ON v.product_id=p.id WHERE p.active=true`;
@Injectable()
export class CatalogService {
  constructor(private readonly db: DatabaseService) {}
  async list(): Promise<Product[]> {
    return (
      await this.db.pool.query<Product>(
        PRODUCT_SELECT + " ORDER BY p.id, v.sku",
      )
    ).rows;
  }
  async bySlug(slug: string): Promise<Product> {
    const item = (
      await this.db.pool.query<Product>(PRODUCT_SELECT + " AND p.slug=$1", [
        slug,
      ])
    ).rows[0];
    if (!item) throw new NotFoundException("Produto não encontrado");
    return item;
  }
}
