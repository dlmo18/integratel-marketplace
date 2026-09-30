import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // El frontend público (Next.js) corre en 3000; permitimos su origen.
  const origins = (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim());
  app.enableCors({ origin: origins });

  app.setGlobalPrefix("api");

  const port = Number(process.env.PORT || 3002);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend IA escuchando en http://localhost:${port}/api`);
}

bootstrap();
