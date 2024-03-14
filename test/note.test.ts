import {NoteTest, TagTest, UserTest} from "./test-util";
import supertest = require("supertest");
import {server} from "../src/app/server";
import {logger} from "../src/app/logging";
import {Note} from "@prisma/client";

describe("POST /api/notes", () => {
    beforeEach(async () => {
        await UserTest.createAndLogin();
    });

    afterEach(async () => {
        await TagTest.deleteAll();
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
               body: "",
               tags: []
           });

       logger.debug(response.body);
       expect(response.status).toBe(200);
       expect(response.body.data.id).toBeDefined();
       expect(response.body.data.title).toBeDefined();
       expect(response.body.data.body).toBeDefined();
       expect(response.body.data.createdAt).toBeDefined();
       expect(response.body.data.updatedAt).toBeDefined();
   });

    it("should allow the user to create new note and attach it to existing tag", async () => {
        const tag = await TagTest.create();
        const response = await supertest(server)
            .post("/api/notes")
            .set("X-API-TOKEN", "test")
            .send({
                title: "Example Note",
                body: "",
                tags: [
                    {
                        id: tag.id
                    }
                ]
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.title).toBeDefined();
        expect(response.body.data.body).toBeDefined();
        expect(response.body.data.createdAt).toBeDefined();
        expect(response.body.data.updatedAt).toBeDefined();
    });

    it("should deny the user request to create new note with tag attachment if request tag is invalid", async () => {
        const response = await supertest(server)
            .post("/api/notes")
            .set("X-API-TOKEN", "test")
            .send({
                title: "Example Note",
                body: "",
                tags: [
                    {
                        id: "wrong"
                    }
                ]
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
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
});

describe("PATCH /api/notes/:noteId", () => {
    beforeEach(async () => {
        await UserTest.createAndLogin();
        await NoteTest.create();
    });

    afterEach(async () => {
        await TagTest.deleteAll();
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
                body: "updated example note",
                tags: []
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(note.id);
        expect(response.body.data.title).toBe("updated example note");
        expect(response.body.data.body).toBe("updated example note");
        expect(response.body.data.createdAt).toBeDefined();
        expect(response.body.data.updatedAt).toBeDefined();
    });

    it("should allow the user to update tag association", async() => {
        const sample: Note = await NoteTest.createWithAttachTag();
        const note = await NoteTest.getById(sample.id);

        expect(note!.tags.length).toBe(1);
        expect(note!.tags[0].name).toBe("test attach tag");

        const tag = await TagTest.create();

        const response = await supertest(server)
            .patch(`/api/notes/${note!.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                title: "updated example note",
                body: "updated example note",
                tags: [
                    {
                        id: tag.id
                    }
                ]
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(note!.id);
        expect(response.body.data.title).toBe("updated example note");
        expect(response.body.data.body).toBe("updated example note");
        expect(response.body.data.createdAt).toBeDefined();
        expect(response.body.data.updatedAt).toBeDefined();
        expect(response.body.data.tags.length).toBe(1);
        expect(response.body.data.tags[0].name).toBe(tag.name);
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
});

describe("DELETE /api/notes/:noteId", () => {
    beforeEach(async () => {
        await UserTest.createAndLogin();
        await NoteTest.create();
    });

    afterEach(async () => {
        await NoteTest.deleteAll();
        await UserTest.deleteSession();
        await UserTest.delete();
    });

    it("should allow the user to delete the note", async () => {
       const note = await NoteTest.get();
       const response = await supertest(server)
           .delete(`/api/notes/${note.id}`)
           .set("X-API-TOKEN", "test");

       logger.debug(response.body);
       expect(response.status).toBe(200);
       expect(response.body.data).toBe("OK");
    });

    it("should deny the user request to delete note if it does not exist", async () => {
        const response = await supertest(server)
            .delete("/api/notes/wrong")
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.error).toBeDefined();
    });
});

describe("GET /api/notes", () => {
    beforeEach(async () => {
        await UserTest.createAndLogin();
        await NoteTest.create();
    });

    afterEach(async () => {
        await TagTest.deleteAll();
        await NoteTest.deleteAll();
        await UserTest.deleteSession();
        await UserTest.delete();
    });

    it("should be able to get all the notes", async () => {
       const response = await supertest(server)
           .get("/api/notes")
           .set("X-API-TOKEN", "test");

       logger.debug(response.body);
       expect(response.status).toBe(200);
       expect(response.body.data.length).toBe(1);
       expect(response.body.paging.currentPage).toBe(1);
       expect(response.body.paging.totalPage).toBe(1);
       expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search for notes using title", async () => {
        const response = await supertest(server)
            .get("/api/notes")
            .set("X-API-TOKEN", "test")
            .query({
                title: "example"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.currentPage).toBe(1);
        expect(response.body.paging.totalPage).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search non-existent notes", async () => {
        const response = await supertest(server)
            .get("/api/notes")
            .set("X-API-TOKEN", "test")
            .query({
                title: "wrong",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.currentPage).toBe(1);
        expect(response.body.paging.totalPage).toBe(0);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search notes with paging", async () => {
        const response = await supertest(server)
            .get("/api/notes")
            .set("X-API-TOKEN", "test")
            .query({
                title: "exa",
                page: 2,
                size: 1
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.currentPage).toBe(2);
        expect(response.body.paging.totalPage).toBe(1);
        expect(response.body.paging.size).toBe(1);
    });

    it("should be able to filter notes by tags", async () => {
        await NoteTest.createWithAttachTag();
        await TagTest.create();
        const firstTag = await TagTest.get();
        const secondTag = await TagTest.getByName("test attach tag");
        const response = await supertest(server)
            .get("/api/notes")
            .set("X-API-TOKEN", "test")
            .query({
                tags: [
                    firstTag.id,
                    secondTag.id
                ]
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.currentPage).toBe(1);
        expect(response.body.paging.totalPage).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });
});