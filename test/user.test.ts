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

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.deleteSession();
        await UserTest.delete();
    })

    it('login user success', async () => {
        const response = await supertest(server)
            .post('/api/users/login')
            .send({
                username: "test",
                password: "test"
            });

        logger.debug(response);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
        expect(response.body.data.token).toBeDefined();
    })

    it('deny login if username is wrong', async () => {
        const response = await supertest(server)
            .post('/api/users/login')
            .send({
                username: "wrong",
                password: "test"
            });

        logger.debug(response);
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Username or password is wrong.");
    })

    it('deny login if password is wrong', async () => {
        const response = await supertest(server)
            .post('/api/users/login')
            .send({
                username: "wrong",
                password: "test"
            });

        logger.debug(response);
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Username or password is wrong.");
    })
})

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.deleteSession();
        await UserTest.delete();
    })

    it('get user data success', async () => {
        const response = await supertest(server)
            .get('/api/users/current')
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    })

    it('deny get user data if token is invalid', async () => {
        const response = await supertest(server)
            .get('/api/users/current')
            .set("X-API-TOKEN", "wrong");

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized.");
    })
})

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.deleteSession();
        await UserTest.delete();
    })

    it('update user success', async () => {
        const response = await supertest(server)
            .patch('/api/users/current')
            .set('X-API-TOKEN', 'test')
            .send({
                username: "user",
                name: "user"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("user");
        expect(response.body.data.username).toBe("user");
    })

    it('deny update user if request is invalid', async () => {
        const response = await supertest(server)
            .patch('/api/users/current')
            .set('X-API-TOKEN', 'test')
            .send({
                username: "",
                name: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    })

    it('deny update user if token is invalid', async () => {
        const response = await supertest(server)
            .patch('/api/users/current')
            .set('X-API-TOKEN', 'wrong')
            .send({
                username: "user",
                name: "user"
            });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized.");
    })
})