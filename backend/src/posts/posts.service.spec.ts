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

import { PostsService } from "./posts.service";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

jest.mock("fs", () => ({
    promises: {
        unlink: jest.fn().mockResolvedValue(undefined),
    },
}));

describe("PostsService", () => {
    let service: PostsService;

    const postsRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const likesRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        count: jest.fn(),
    };

    const createQueryBuilderMock = (raw: any[], entities: any[]) => {
        const qb = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getRawAndEntities: jest.fn().mockResolvedValue({ raw, entities }),
        };
        return qb;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        service = new PostsService(postsRepository as any, likesRepository as any);
    });

    it("create crea post con imágenes", async () => {
        postsRepository.create.mockReturnValue({ id: "1" });

        postsRepository.save.mockResolvedValue({
            id: "1",
            title: "t",
            content: "c",
            images: ["/uploads/posts/a.jpg"],
            createdAt: new Date(),
            userId: "u1",
        });

        const result = await service.create(
            { title: "t", content: "c" } as any,
            "u1",
            [{ filename: "a.jpg" } as any]
        );

        expect(result.post.images?.length).toBe(1);
    });

    it("findAll retorna items y nextCursor", async () => {
        const entities = [
            { id: "1", createdAt: new Date("2024-01-02"), user: { id: "u1" } },
            { id: "2", createdAt: new Date("2024-01-01"), user: { id: "u1" } },
        ];

        const raw = [{ likesCount: 1, likedByMe: 1 }, { likesCount: 0, likedByMe: 0 }];

        const qb = createQueryBuilderMock(raw, entities);
        postsRepository.createQueryBuilder.mockReturnValue(qb);

        const result = await service.findAll(1, undefined, "test", "u1");

        expect(result.posts.length).toBe(1);
        expect(result.nextCursor).toBeTruthy();
        expect(qb.andWhere).toHaveBeenCalled();
    });

    it("findAll sin search ni cursor no agrega filtros", async () => {
        const entities = [{ id: "1", createdAt: new Date(), user: { id: "u1" } }];
        const raw = [{ likesCount: 0, likedByMe: 0 }];

        const qb = createQueryBuilderMock(raw, entities);

        postsRepository.createQueryBuilder.mockReturnValue(qb);

        const result = await service.findAll(10, undefined, undefined, "u1");

        expect(result.posts.length).toBe(1);
        expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it("findAll ignora search vacío", async () => {
        const entities = [{ id: "1", createdAt: new Date(), user: { id: "u1" } }];
        const raw = [{ likesCount: 0, likedByMe: 0 }];

        const qb = createQueryBuilderMock(raw, entities);
        postsRepository.createQueryBuilder.mockReturnValue(qb);

        await service.findAll(10, undefined, "   ", "u1");
        expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it("findAll aplica cursor", async () => {
        const entities = [{ id: "1", createdAt: new Date(), user: { id: "u1" } }];
        const raw = [{ likesCount: 0, likedByMe: 0 }];

        const qb = createQueryBuilderMock(raw, entities);
        postsRepository.createQueryBuilder.mockReturnValue(qb);

        await service.findAll(10, new Date().toISOString(), undefined, "u1");
        expect(qb.andWhere).toHaveBeenCalledWith(
            "post.createdAt < :cursor",
            expect.objectContaining({ cursor: expect.any(Date) })
        );
    });

    it("findAll retorna nextCursor null cuando no hay más", async () => {
        const entities = [{ id: "1", createdAt: new Date(), user: { id: "u1" } }];
        const raw = [{ likesCount: 0, likedByMe: 0 }];

        const qb = createQueryBuilderMock(raw, entities);

        postsRepository.createQueryBuilder.mockReturnValue(qb);

        const result = await service.findAll(10, undefined, undefined, "u1");

        expect(result.nextCursor).toBeNull();
    });

    it("findOne lanza error si no existe", async () => {
        postsRepository.createQueryBuilder.mockReturnValue(createQueryBuilderMock([], []));

        await expect(service.findOne("1", "u1")).rejects.toBeInstanceOf(NotFoundException);
    });

    it("findOne retorna post con likes", async () => {
        const entities = [
            { id: "1", title: "t", content: "c", createdAt: new Date(), user: { id: "u1" } },
        ];

        const raw = [{ likesCount: 3, likedByMe: 0 }];

        postsRepository.createQueryBuilder.mockReturnValue(createQueryBuilderMock(raw, entities));

        const result = await service.findOne("1", "u1");

        expect(result.likesCount).toBe(3);
        expect(result.likedByMe).toBe(false);
    });

    it("findOne retorna likedByMe true", async () => {
        const entities = [
            { id: "1", title: "t", content: "c", createdAt: new Date(), user: { id: "u1" } },
        ];
        const raw = [{ likesCount: 1, likedByMe: 1 }];

        postsRepository.createQueryBuilder.mockReturnValue(createQueryBuilderMock(raw, entities));

        const result = await service.findOne("1", "u1");

        expect(result.likedByMe).toBe(true);
    });

    it("update lanza error si no existe", async () => {
        postsRepository.findOne.mockResolvedValue(null);

        await expect(service.update("1", {} as any, "u1")).rejects.toBeInstanceOf(NotFoundException);
    });

    it("update lanza error si no es el dueño", async () => {
        postsRepository.findOne.mockResolvedValue({ id: "1", userId: "u2" });

        await expect(service.update("1", {} as any, "u1")).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("update actualiza imágenes", async () => {
        postsRepository.findOne.mockResolvedValue({ id: "1", userId: "u1", images: ["/old.jpg"] });

        postsRepository.save.mockResolvedValue({ id: "1" });

        likesRepository.count.mockResolvedValue(2);

        const result = await service.update(
            "1",
            { removeImages: ["/old.jpg"] } as any,
            "u1",
            [{ filename: "new.jpg" } as any]
        );

        expect(result.post.likesCount).toBe(2);
    });

    it("update limpia imágenes cuando quedan vacías", async () => {
        const post = { id: "1", userId: "u1", images: ["/old.jpg"] } as any;

        postsRepository.findOne.mockResolvedValue(post);

        postsRepository.save.mockResolvedValue(post);

        likesRepository.count.mockResolvedValue(0);

        const result = await service.update("1", { removeImages: ["/old.jpg"] } as any, "u1");

        expect(result.post.images).toBeUndefined();
    });

    it("update sin cambios mantiene imágenes", async () => {
        const post = { id: "1", userId: "u1", images: ["/old.jpg"] } as any;

        postsRepository.findOne.mockResolvedValue(post);

        postsRepository.save.mockResolvedValue(post);

        likesRepository.count.mockResolvedValue(1);

        const result = await service.update("1", { title: "t" } as any, "u1");

        expect(result.post.images).toEqual(["/old.jpg"]);
    });

    it("update agrega imágenes nuevas sin remover", async () => {
        const post = { id: "1", userId: "u1", images: ["/old.jpg"] } as any;

        postsRepository.findOne.mockResolvedValue(post);

        postsRepository.save.mockResolvedValue(post);

        likesRepository.count.mockResolvedValue(1);

        const result = await service.update(
            "1",
            { title: "t" } as any,
            "u1",
            [{ filename: "new.jpg" } as any]
        );

        expect(result.post.images).toContain("/uploads/posts/new.jpg");
    });

    it("like retorna mensaje si ya existe", async () => {
        postsRepository.findOne.mockResolvedValue({ id: "1" });

        likesRepository.findOne.mockResolvedValue({ id: "l1" });

        const result = await service.like("1", "u1");

        expect(result.liked).toBe(true);
    });

    it("like lanza error si post no existe", async () => {
        postsRepository.findOne.mockResolvedValue(null);

        await expect(service.like("1", "u1")).rejects.toBeInstanceOf(NotFoundException);
    });

    it("like crea si no existe", async () => {
        postsRepository.findOne.mockResolvedValue({ id: "1" });

        likesRepository.findOne.mockResolvedValue(null);

        likesRepository.create.mockReturnValue({ id: "l1" });

        likesRepository.save.mockResolvedValue({ id: "l1" });

        const result = await service.like("1", "u1");
        expect(result.liked).toBe(true);
    });

    it("unlike retorna mensaje si no existe", async () => {
        likesRepository.findOne.mockResolvedValue(null);

        const result = await service.unlike("1", "u1");

        expect(result.liked).toBe(false);
    });

    it("unlike elimina si existe", async () => {
        likesRepository.findOne.mockResolvedValue({ id: "l1" });

        likesRepository.remove.mockResolvedValue({});

        const result = await service.unlike("1", "u1");

        expect(result.liked).toBe(false);
    });

    it("remove elimina post y archivos", async () => {
        postsRepository.findOne.mockResolvedValue({ id: "1", userId: "u1", images: ["/uploads/posts/a.jpg"] });

        postsRepository.remove.mockResolvedValue({});

        const result = await service.remove("1", "u1");
        expect(result.message).toContain("eliminada");
    });

    it("remove elimina post sin imágenes", async () => {
        postsRepository.findOne.mockResolvedValue({ id: "1", userId: "u1", images: null });

        postsRepository.remove.mockResolvedValue({});

        const result = await service.remove("1", "u1");

        expect(result.message).toContain("eliminada");
    });

    it("remove lanza error si no existe", async () => {
        postsRepository.findOne.mockResolvedValue(null);

        await expect(service.remove("1", "u1")).rejects.toBeInstanceOf(NotFoundException);
    });

    it("remove lanza error si no es el dueño", async () => {
        postsRepository.findOne.mockResolvedValue({ id: "1", userId: "u2" });

        await expect(service.remove("1", "u1")).rejects.toBeInstanceOf(ForbiddenException);
    });
});
