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

describe("GET /api/notes/:noteId", () => {
    beforeEach(async () => {
        await UserTest.createAndLogin();
        await NoteTest.create();
    });

    afterEach(async () => {
        await NoteTest.deleteAll();
        await UserTest.deleteSession();
        await UserTest.delete();
    });

    it("should be able to get note", async () => {
        const note = await NoteTest.get()
        const response = await supertest(server)
            .get(`/api/notes/${note.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(note.id);
        expect(response.body.data.title).toBe(note.title);
        expect(response.body.data.body).toBe(note.body);
        expect(response.body.data.createdAt).toBeDefined();
        expect(response.body.data.updatedAt).toBeDefined();
    });

    it("should reject get note request if note does not exist", async () => {
        const response = await supertest(server)
            .get(`/api/notes/wrong`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
    });
})

describe("PATCH /api/notes/:noteId", () => {
    beforeEach(async () => {
        await UserTest.createAndLogin();
        await NoteTest.create();
    });

    afterEach(async () => {
        await NoteTest.deleteAll();
        await UserTest.deleteSession();
        await UserTest.delete();
    });

    it("should allow the user to update the note", async () => {
        const note = await NoteTest.get();
        const response = await supertest(server)
            .patch(`/api/notes/${note.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                title: "updated example note",
                body: "updated example note"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(note.id);
        expect(response.body.data.title).toBe("updated example note");
        expect(response.body.data.body).toBe("updated example note");
        expect(response.body.data.createdAt).toBeDefined();
        expect(response.body.data.updatedAt).toBeDefined();
    });

    it("should deny the user to update the note if request is invalid", async () => {
        const note = await NoteTest.get();
        const response = await supertest(server)
            .patch(`/api/notes/${note.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                title: "",
                body: "updated example note"
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
})