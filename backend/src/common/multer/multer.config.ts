import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { IUser } from 'src/common/types';

export const multerConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = './uploads/posts';
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
            return cb(
                new BadRequestException('Solo se permiten archivos de imagen (jpg, jpeg, png, webp)'),
                false,
            );
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
};

export const profileImageMulterConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = './uploads/users';
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        const currentUser = req.user as IUser | undefined;
        const targetUserId = req.params?.id as string | undefined;

        if (! currentUser) {
            return cb(new ForbiddenException('No puedes editar este usuario'), false);
        }

        if (currentUser.id !== targetUserId) {
            return cb(new ForbiddenException('No puedes editar este usuario'), false);
        }

        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
            return cb(
                new BadRequestException('Solo se permiten archivos de imagen (jpg, jpeg, png, webp)'),
                false,
            );
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
};
