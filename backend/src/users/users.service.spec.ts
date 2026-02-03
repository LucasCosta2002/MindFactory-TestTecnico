jest.mock("@nestjs/typeorm", () => ({
    InjectRepository: () => () => undefined,
    getRepositoryToken: (entity: any) => entity,
}));

jest.mock("typeorm", () => ({
    Entity: () => () => undefined,
    PrimaryGeneratedColumn: () => () => undefined,
    Column: () => () => undefined,
    ManyToOne: () => () => undefined,
    OneToMany: () => () => undefined,
    JoinColumn: () => () => undefined,
    CreateDateColumn: () => () => undefined,
    RelationId: () => () => undefined,
    Unique: () => () => undefined,
    Brackets: class {
        constructor(public whereFactory?: any) { }
    },
    Repository: class { },
}));

import { UsersService } from "./users.service";
import { ConflictException, NotFoundException } from "@nestjs/common";

jest.mock("fs", () => ({
    promises: {
        unlink: jest.fn().mockResolvedValue(undefined),
    },
}));

describe("UsersService", () => {
    let service: UsersService;

    // Mocks
    const userRepository = {
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        save: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const likesRepository = {
        createQueryBuilder: jest.fn(),
    };

    const postsRepository = {
        createQueryBuilder: jest.fn(),
    };

    const createQueryBuilderMock = (raw: any[], entities: any[]) => {
        const qb = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            getRawAndEntities: jest.fn().mockResolvedValue({ raw, entities }),
            getMany: jest.fn().mockResolvedValue(entities),
        };
        return qb;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        service = new UsersService(
            userRepository as any,
            likesRepository as any,
            postsRepository as any
        );
    });

    it("findOneById lanza error si no existe", async () => {
        userRepository.findOne.mockResolvedValue(null);

        await expect(service.findOneById("1")).rejects.toBeInstanceOf(NotFoundException);
    });

    it("findOneById retorna usuario con posts y likedPosts", async () => {
        userRepository.findOne.mockResolvedValue({
            id: "1",
            name: "Lucas",
            username: "lucas",
            email: "test@mail.com",
            bio: null,
            profileImage: null,
            createdAt: new Date(),
        });

        // crea mocks para posts y likedPosts
        postsRepository.createQueryBuilder.mockReturnValue(
            createQueryBuilderMock(
                [{ likesCount: 2, likedByMe: 1 }],
                [
                    {
                        id: "p1",
                        title: "Post",
                        content: "content",
                        images: [],
                        createdAt: new Date(),
                        userId: "1",
                        user: { id: "1", name: "Lucas" },
                    },
                ]
            )
        );

        likesRepository.createQueryBuilder.mockReturnValue(
            createQueryBuilderMock(
                [{ likesCount: 1, likedByMe: 1 }],
                [
                    {
                        id: "l1",
                        createdAt: new Date(),
                        post: {
                            id: "p2",
                            title: "Post 2",
                            content: "content",
                            images: [],
                            createdAt: new Date(),
                            userId: "2",
                            user: { id: "2", name: "Other" },
                        },
                    },
                ]
            )
        );

        const result = await service.findOneById("1", "1");

        expect(result?.posts?.length).toBe(1);
        expect(result?.likedPosts?.length).toBe(1);
        expect(result?.posts?.[0].likedByMe).toBe(true);
    });

    it("update lanza error si no existe", async () => {
        userRepository.findOneBy.mockResolvedValue(null);

        await expect(service.update("1", {} as any)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("update lanza error si email ya existe", async () => {
        userRepository.findOneBy
            .mockResolvedValueOnce({ id: "1", email: "a@mail.com" })
            .mockResolvedValueOnce({ id: "2", email: "b@mail.com" });

        await expect(
            service.update("1", { email: "b@mail.com" } as any)
        ).rejects.toBeInstanceOf(ConflictException);
    });

    it("update retorna mensaje de re-login si cambia email", async () => {
        const user = { id: "1", email: "a@mail.com" } as any;

        userRepository.findOneBy
            .mockResolvedValueOnce(user)
            .mockResolvedValueOnce(null);

        userRepository.save.mockResolvedValue({
            ...user,
            email: "b@mail.com",
            name: "Lucas",
            username: "lucas",
            bio: null,
            profileImage: null,
            createdAt: new Date(),
        });

        const result = await service.update("1", { email: "b@mail.com" } as any);

        expect(result.message).toContain("Usuario actualizado. Por favor, vuelve a iniciar sesión.");
    });

    it("update retorna mensaje sin re-login si no cambia email", async () => {
        const user = { id: "1", email: "a@mail.com", name: "Old" } as any;

        userRepository.findOneBy.mockResolvedValueOnce(user);

        userRepository.save.mockResolvedValue({
            ...user,
            name: "New",
            username: "newuser",
            bio: "bio",
            profileImage: null,
            createdAt: new Date(),
        });

        const result = await service.update(
            "1",
            { name: "New", username: "newuser", bio: "bio" } as any
        );

        expect(result.message).toContain("Usuario actualizado correctamente");
        expect(result.user.name).toBe("New");
    });

    it("updateProfileImage retorna mensaje si no hay imagen", async () => {
        const user = { id: "1", name: "Lucas" } as any;
        userRepository.findOneBy.mockResolvedValue(user);

        const result = await service.updateProfileImage("1", undefined);
        expect(result.message).toContain("No se envió imagen");
    });

    it("updateProfileImage lanza error si no existe", async () => {
        userRepository.findOneBy.mockResolvedValue(null);

        await expect(service.updateProfileImage("1", undefined)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("updateProfileImage actualiza imagen y elimina anterior", async () => {
        const user = {
            id: "1",
            name: "Lucas",
            profileImage: "/uploads/users/old.jpg",
        } as any;

        userRepository.findOneBy.mockResolvedValue(user);

        userRepository.save.mockResolvedValue({
            ...user,
            profileImage: "/uploads/users/new.jpg",
            username: "lucas",
            email: "test@mail.com",
            bio: null,
            createdAt: new Date(),
        });

        const result = await service.updateProfileImage("1", { filename: "new.jpg" } as any);

        expect(result.message).toContain("Imagen de perfil actualizada correctamente");
        expect(userRepository.save).toHaveBeenCalled();
    });

    it("updateProfileImage no elimina si la ruta previa no coincide", async () => {
        const user = {
            id: "1",
            name: "Lucas",
            profileImage: "http://external/image.jpg",
        } as any;

        userRepository.findOneBy.mockResolvedValue(user);

        userRepository.save.mockResolvedValue({
            ...user,
            profileImage: "/uploads/users/new.jpg",
            username: "lucas",
            email: "test@mail.com",
            bio: null,
            createdAt: new Date(),
        });

        const result = await service.updateProfileImage("1", { filename: "new.jpg" } as any);

        expect(result.message).toContain("Imagen de perfil actualizada correctamente");
    });

    it("searchUsers retorna vacío si query es inválida", async () => {
        const result = await service.searchUsers(" ");

        expect(result).toEqual([]);
    });

    it("searchUsers retorna usuarios", async () => {
        const qb = createQueryBuilderMock([], [
            {
                id: "1",
                name: "Lucas",
                username: "lucas",
                email: "test@mail.com",
                bio: null,
                profileImage: null,
                createdAt: new Date(),
            },
        ]);

        userRepository.createQueryBuilder.mockReturnValue(qb);

        const result = await service.searchUsers("luc");
        expect(result.length).toBe(1);
    });
});
