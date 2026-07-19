import request from "supertest";
import { app } from "../src/bootstrap/server.js";

describe("Health Endpoint", () => {
    it("should return 200", async () => {
        const res = await request(app).get("/health");

        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual({
            success: true,
            message: "server is running"
        });
    });
});