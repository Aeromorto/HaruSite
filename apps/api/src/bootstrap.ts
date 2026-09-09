import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import type { Request, Response, NextFunction } from "express";
import { AppModule } from "./app.module";

/** Compartilhada com testes para exercitar a mesma validação e política HTTP de produção. */
export async function createApp() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"],
    bodyParser: true,
  });
  app.setGlobalPrefix("api");
  app.use(helmet());
  app.use(cookieParser());
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cache-Control", "no-store");
    // O frontend usa proxy same-origin; não habilitamos CORS genérico.
    // Header customizado + JSON impedem submissão cross-site por formulário simples.
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const origin = req.headers.origin;
      const allowed = process.env.WEB_ORIGIN || "http://localhost:3000";
      if (
        req.headers["x-haru-request"] !== "1" ||
        !req.is("application/json") ||
        (origin && origin !== allowed)
      ) {
        res.status(403).json({ message: "Origem ou formato não permitido" });
        return;
      }
    }
    next();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
    }),
  );
  app.enableShutdownHooks();
  return app;
}
