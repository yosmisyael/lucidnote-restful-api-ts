import {TagTest, UserTest} from "./test-util";
import supertest = require("supertest");
import {server} from "../src/app/server";
import {logger} from "../src/app/logging";

describe("POST /api/tags", () => {
    beforeEach(async () => {
        await UserTest.createAndLogin();
    });

    afterEach(async () => {
        await TagTest.deleteAll();
        await UserTest.deleteSession();
        await UserTest.delete();
    })

    it("should allow the user to create a new tag", async () => {
        const response = await supertest(server)
            .post("/api/tags")
            .set("X-API-TOKEN", "test")
            .send({
                name: "example tag"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("example tag");
    })

    it("should deny the user request to create a new tag if request is invalid", async () => {
        const response = await supertest(server)
            .post("/api/tags")
            .set("X-API-TOKEN", "test")
            .send({
                name: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    })
})

describe("PATCH /api/tags/:tagId", () => {
    beforeEach(async () => {
        await UserTest.createAndLogin();
        await TagTest.create();
    });

    afterEach(async () => {
        await TagTest.deleteAll();
        await UserTest.deleteSession();
        await UserTest.delete();
    })

    it("should allow the user to update the tag", async () => {
        const tag = await TagTest.get();
        const response = await supertest(server)
            .patch(`/api/tags/${tag.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                name: "updated example tag"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200 );
        expect(response.body.data.id).toBe(tag.id);
        expect(response.body.data.name).toBe("updated example tag");
    });

    it("should deny the user request to update the tag if request is invalid", async () => {
        const tag = await TagTest.get();
        const response = await supertest(server)
            .patch(`/api/tags/${tag.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                name: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400 );
        expect(response.body.error).toBeDefined()
    });
})