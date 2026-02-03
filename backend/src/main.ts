import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.enableCors();

	app.setGlobalPrefix('api');

	// Servir archivos estáticos desde el directorio uploads
	app.useStaticAssets(join(__dirname, '..', 'uploads'), {
		prefix: '/uploads/',
	});

	// limpiar valores que no vengan en los dtos
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true
	}))

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
