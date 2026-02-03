import { JwtService } from "./jwt.service";
import { ConfigService } from "@nestjs/config";

// Mock de ConfigService
const configService = {
    get: jest.fn(),
} as unknown as ConfigService;

describe("JwtService", () => {

    it("genera y verifica JWT", () => {
        configService.get = jest.fn().mockReturnValue("secret");

        const service = new JwtService(configService);

        const token = service.generateJWT({
            id: "1",
            name: "Lucas",
            username: "lucas",
            email: "test@mail.com",
        } as any);

        const payload = service.verifyJWT(token) as any;

        expect(payload.payload.email).toBe("test@mail.com");
    });
});
