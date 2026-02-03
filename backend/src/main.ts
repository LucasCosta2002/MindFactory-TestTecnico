import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

	const swaggerConfig = new DocumentBuilder()
		.setTitle('MindFactory API')
		.setDescription('Documentación de la API de MindFactory')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
