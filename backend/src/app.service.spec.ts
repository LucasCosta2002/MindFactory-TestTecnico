import { AppService } from "./app.service";

describe("AppService", () => {
  it("getHello retorna Hello World", () => {
    const service = new AppService();
    expect(service.getHello()).toBe("Hello World!");
  });
});
