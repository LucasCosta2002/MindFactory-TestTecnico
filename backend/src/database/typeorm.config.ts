import { ConfigService } from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { join } from "path"

export const typeOrmConfig = (configService : ConfigService) : TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get("DATABASE_HOST"),
    port: configService.get("DATABASE_PORT"),
    username: configService.get("DATABASE_USER"),
    password: configService.get("DATABASE_PASS"),
    database: configService.get("DATABASE_NAME"),
    ssl: configService.get("DATABASE_SSL") !== 'false',
    //log de query realizadas
    logging: false,
    //escuchar entidades
    entities: [join(__dirname + "../../**/*.entity.{ts,js}")],
    //sincronizar base de datos, no usar en produccion
    synchronize: false
})