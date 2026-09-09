import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Pool } from "pg";

/** Pool único por processo; credenciais nunca aparecem nas respostas HTTP. */
@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly pool: Pool;
  constructor() {
    if (!process.env.DATABASE_URL)
      throw new Error("DATABASE_URL não configurada");
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      connectionTimeoutMillis: 5000,
      statement_timeout: 5000,
    });
    this.pool.on("error", () =>
      console.error("Conexão ociosa com PostgreSQL interrompida."),
    );
  }
  async onModuleDestroy() {
    await this.pool.end();
  }
}
