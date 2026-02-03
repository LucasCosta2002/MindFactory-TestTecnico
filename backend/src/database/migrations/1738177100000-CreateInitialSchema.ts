import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1738177100000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" varchar(60) NOT NULL,
                "username" varchar(60) NOT NULL,
                "email" varchar(60) NOT NULL,
                "password" varchar(60) NOT NULL,
                "bio" varchar(200),
                "profileImage" varchar(200),
                "confirmed" boolean NOT NULL DEFAULT false,
                "token" varchar,
                "createdAt" timestamptz(3) NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_user_email" UNIQUE ("email")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "post" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" varchar(120) NOT NULL,
                "content" text,
                "images" text,
                "userId" uuid NOT NULL,
                "createdAt" timestamptz(3) NOT NULL DEFAULT now(),
                CONSTRAINT "PK_post_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_post_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "like" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "postId" uuid NOT NULL,
                "createdAt" timestamptz(3) NOT NULL DEFAULT now(),
                CONSTRAINT "PK_like_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_like_user_post" UNIQUE ("userId", "postId"),
                CONSTRAINT "FK_like_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_like_post" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "post"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "like"`);
    }
}
