import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { MailerService } from "../common/mailer/mailer.service";
import { JwtService } from "../jwt/jwt.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { hashPassword } from "../utils/auth";

describe("AuthService", () => {
    let service: AuthService;

    // Mocks
    const userRepository = {
        findOneBy: jest.fn(),
        save: jest.fn(),
    };
    const mailerService = {
        sendConfirmationEmail: jest.fn(),
        sendForgotPasswordEmail: jest.fn(),
    };
    const jwtService = {
        generateJWT: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(User), useValue: userRepository },
                { provide: MailerService, useValue: mailerService },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it("register lanza error si el email ya existe", async () => {
        userRepository.findOneBy.mockResolvedValue({ id: "1" });

        await expect(
            service.register({
                name: "Lucas",
                email: "test@mail.com",
                username: "lucas",
                password: "12345678",
            })
        ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("register crea usuario y envía email", async () => {
        userRepository.findOneBy.mockResolvedValue(null);
        userRepository.save.mockImplementation(async (user: User) => user);

        const result = await service.register({
            name: "Lucas",
            email: "test@mail.com",
            username: "lucas",
            password: "12345678",
        });

        expect(mailerService.sendConfirmationEmail).toHaveBeenCalled();
        expect(userRepository.save).toHaveBeenCalled();
        expect(result.message).toContain("Usuario creado con exito, revisa tu correo y sigue las instrucciones");
    });

    it("confirmAccount lanza error si token es inválido", async () => {
        userRepository.findOneBy.mockResolvedValue(null);

        await expect(service.confirmAccount("bad"))
            .rejects
            .toBeInstanceOf(NotFoundException);
    });

    it("confirmAccount confirma usuario", async () => {
        const user = { id: "1", confirmed: false, token: "123" } as User;

        userRepository.findOneBy.mockResolvedValue(user);
        userRepository.save.mockResolvedValue(user);

        const result = await service.confirmAccount("123");

        expect(user.confirmed).toBe(true);
        expect(user.token).toBeNull();
        expect(result.message).toContain("Usuario confirmado con exito, ya puedes iniciar sesion");
    });

    it("login falla si usuario no está confirmado", async () => {
        const user = {
            id: "1",
            email: "test@mail.com",
            password: await hashPassword("12345678"),
            confirmed: false,
        } as User;

        userRepository.findOneBy.mockResolvedValue(user);

        await expect(service.login({ email: user.email, password: "12345678" }))
            .rejects
            .toBeInstanceOf(BadRequestException);
    });

    it("login falla con contraseña inválida", async () => {
        const user = {
            id: "1",
            email: "test@mail.com",
            password: await hashPassword("12345678"),
            confirmed: true,
        } as User;

        userRepository.findOneBy.mockResolvedValue(user);

        await expect(service.login({ email: user.email, password: "wrong" }))
            .rejects
            .toBeInstanceOf(BadRequestException);
    });

    it("login retorna token y usuario", async () => {
        const user = {
            id: "1",
            name: "Lucas",
            username: "lucas",
            email: "test@mail.com",
            password: await hashPassword("12345678"),
            confirmed: true,
            bio: null,
            profileImage: null,
            createdAt: new Date(),
        } as User;

        userRepository.findOneBy.mockResolvedValue(user);
        jwtService.generateJWT.mockReturnValue("jwt-token");

        const result = await service.login({ email: user.email, password: "12345678" });

        expect(result.token).toBe("jwt-token");
        expect(result.user.email).toBe(user.email);
    });

    it("forgotPassword genera token y envía email", async () => {
        const user = { id: "1", name: "Lucas", email: "test@mail.com" } as User;

        userRepository.findOneBy.mockResolvedValue(user);
        userRepository.save.mockResolvedValue(user);

        const result = await service.forgotPassword(user.email);

        expect(mailerService.sendForgotPasswordEmail).toHaveBeenCalled();
        expect(userRepository.save).toHaveBeenCalled();
        expect(result.message).toContain("Revisa tu correo");
    });

    it("resetPasswordByToken falla si no existe", async () => {
        userRepository.findOneBy.mockResolvedValue(null);

        await expect(service.resetPasswordByToken({ token: "x", password: "12345678" }))
            .rejects
            .toBeInstanceOf(BadRequestException);
    });

    it("resetPasswordByToken actualiza contraseña", async () => {
        const user = { id: "1", token: "abc", password: "old" } as User;

        userRepository.findOneBy.mockResolvedValue(user);
        userRepository.save.mockResolvedValue(user);

        const result = await service.resetPasswordByToken({ token: "abc", password: "new" });

        expect(user.token).toBeNull();
        expect(result.message).toContain("Contraseña restablecida");
    });

    it("findByEmail falla si no hay email", async () => {
        await expect(service.findByEmail(""))
            .rejects
            .toBeInstanceOf(BadRequestException);
    });

    it("findByEmail falla si no existe", async () => {
        userRepository.findOneBy.mockResolvedValue(null);

        await expect(service.findByEmail("test@mail.com"))
            .rejects
            .toBeInstanceOf(NotFoundException);
    });
});
