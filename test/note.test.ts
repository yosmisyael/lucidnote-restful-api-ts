import {NoteTest, UserTest} from "./test-util";
import supertest = require("supertest");
import {server} from "../src/app/server";
import {logger} from "../src/app/logging";

describe("POST /api/notes", () => {
    beforeEach(async () => {
        await UserTest.createAndLogin();
    });

    afterEach(async () => {
        await NoteTest.deleteAll();
        await UserTest.deleteSession();
        await UserTest.delete();
    });

   it("should allow the user to create new note", async () => {
       const response = await supertest(server)
           .post("/api/notes")
           .set("X-API-TOKEN", "test")
           .send({
               title: "Example Note",
               body: ""
           });

       logger.debug(response.body);
       expect(response.status).toBe(200);
       expect(response.body.data.id).toBeDefined();
       expect(response.body.data.title).toBeDefined();
       expect(response.body.data.body).toBeDefined();
       expect(response.body.data.createdAt).toBeDefined();
       expect(response.body.data.updatedAt).toBeDefined();
   });

    it("should deny the user to create note if the data is invalid", async () => {
        const response = await supertest(server)
            .post("/api/notes")
            .set("X-API-TOKEN", "test")
            .send({
                title: "",
                body: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

});