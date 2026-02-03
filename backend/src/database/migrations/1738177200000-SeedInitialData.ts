import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class SeedInitialData1738177200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Hash de la contraseña "password123"
        const hashedPassword = await bcrypt.hash("password123", 10);

        // Insertar usuario inicial
        await queryRunner.query(`
            INSERT INTO "user" (id, name, username, email, bio, "profileImage", password, confirmed, token, "createdAt")
            VALUES (
                'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                'Lucas Demo',
                'lucasdemo',
                'lucasdemo@demo.com',
                'bio de prueba',
                null,
                '${hashedPassword}',
                true,
                null,
                NOW()
            )
        `);

        // Insertar post inicial del usuario
        await queryRunner.query(`
            INSERT INTO "post" (id, title, content, images, "userId", "createdAt")
            VALUES (
                'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                'Mi primera publicacion',
                'Este es el contenido de mi primera publicacion en la plataforma. Bienvenidos!',
                null,
                'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                NOW()
            )
        `);

        // Insertar un segundo post con imágenes de ejemplo
        await queryRunner.query(`
            INSERT INTO "post" (id, title, content, images, "userId", "createdAt")
            VALUES (
                'c3d4e5f6-a7b8-9012-cdef-123456789012',
                'Post con imagenes',
                'Edita este post y demuestra como se almacenan las imagenes en la base de datos.',
                null,
                'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                NOW()
            )
        `);

        // Insertar likes iniciales
        await queryRunner.query(`
            INSERT INTO "like" (id, "userId", "postId", "createdAt")
            VALUES
                ('d4e5f6a7-b8c9-0123-def4-234567890123', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', NOW()),
                ('e5f6a7b8-c901-2345-ef67-345678901234', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c3d4e5f6-a7b8-9012-cdef-123456789012', NOW())
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar posts primero (por la foreign key)
        await queryRunner.query(`
            DELETE FROM "post" WHERE id IN (
                'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                'c3d4e5f6-a7b8-9012-cdef-123456789012'
            )
        `);

        await queryRunner.query(`
            DELETE FROM "like" WHERE id IN (
                'd4e5f6a7-b8c9-0123-def4-234567890123',
                'e5f6a7b8-c901-2345-ef67-345678901234'
            )
        `);

        // Eliminar usuario
        await queryRunner.query(`
            DELETE FROM "user" WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        `);
    }
}
