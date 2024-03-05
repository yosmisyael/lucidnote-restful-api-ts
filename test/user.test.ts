import supertest = require("supertest");
import {server} from "../src/app/server";
import {logger} from "../src/app/logging";
import {UserTest} from "./test-util";

describe('POST /api/users', () => {

    afterEach(async () => {
        await UserTest.delete();
    })

    it('deny user registration if request is invalid', async () => {
        const response = await supertest(server)
            .post("/api/users")
            .send({
                name: "",
                email: "",
                username: "",
                password: ""
            });
        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    it('register user success', async () => {
        const response = await supertest(server)
            .post("/api/users")
            .send({
                name: "test",
                email: "test@example.com",
                username: "test",
                password: "test"
            });
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    })
})