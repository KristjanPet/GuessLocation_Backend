import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import express from 'express'
import Logging from 'library/Logging'

import { AppModule } from './modules/app.module'

const initSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Guess the location')
    .setDescription('Guess the location API')
    .setVersion('1.0')
    // .addTag('Guess Location')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
}

const initValidation = (app: INestApplication) =>
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  app.enableCors({
    origin: 'https://geotagger.onrender.com',
    credentials: true,
  })
  app.use(cookieParser())

  initSwagger(app)
  initValidation(app)

  app.use('/files', express.static('files'))

  const PORT = process.env.PORT || 8080
  await app.listen(PORT)

  Logging.log(`App is listening on: ${await app.getUrl()}`)
}
bootstrap()
