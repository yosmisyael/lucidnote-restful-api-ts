import {prismaClient} from "../src/app/database";
import bcrypt from "bcrypt";
import {Note, Session} from "@prisma/client";
import {ResponseError} from "../src/error/response-error";
import {NoteResponse, toNoteResponse} from "../src/model/note-model";

export class UserTest {
    static async delete(): Promise<void> {
        await prismaClient.user.deleteMany();
    }

    static async deleteSession(): Promise<void> {
        await prismaClient.session.deleteMany();
    }

    static async create(): Promise<void> {
        await prismaClient.user.create({
            data: {
                name: "test",
                email: "test@example.com",
                username: "test",
                password: await bcrypt.hash("test", 10)
            }
        })
    }

    static async createAndLogin(): Promise<void> {
        const user = await prismaClient.user.create({
            data: {
                name: "test",
                email: "test@example.com",
                username: "test",
                password: await bcrypt.hash("test", 10)
            }
        })

        await prismaClient.session.create({
            data: {
                userId: user.id,
                token: "test"
            }
        })
    }

    static async getToken(): Promise<Session> {
        const token = await prismaClient.session.findFirst({
            where: {
                token: "test"
            }
        })

        if (!token) {
            throw new Error("Token is not found.");
        }

        return token;
    }
}

export class NoteTest {

    static async deleteAll(): Promise<void> {
        await prismaClient.note.deleteMany()
    }

    static async create(): Promise<void> {
        const user = await prismaClient.user.findUnique({
            where: {
                username: "test"
            }
        });

        if (!user) {
            throw new ResponseError(404, "User is not found.");
        }

        await prismaClient.note.create({
            data: {
                title: "Example Note",
                body: "Example Note",
                userId: user.id
            }
        });
    }

    static async get() {
        const note = await prismaClient.note.findFirst({
            where: {
                title: "Example Note"
            }
        });

        if (!note) {
            throw new ResponseError(404, "Note does not exist.");
        }

        return note;
    }

    static async getById(id: string) {
        return prismaClient.note.findUnique({
            where: {
                id: id
            },
            include: {
                tags: true
            }
        });
    }

    static async createWithAttachTag(): Promise<Note> {
        const user = await prismaClient.user.findUnique({
            where: {
                username: "test"
            }
        });

        if (!user) {
            throw new ResponseError(404, "User is not found.");
        }

        const tag = await prismaClient.tag.create({
            data: {
                userId: user.id,
                name: "test attach tag"
            }
        });

        return prismaClient.note.create({
            data: {
                title: "Example Note",
                body: "Example Note",
                userId: user.id,
                tags: {
                    connect: {
                        id: tag.id
                    }
                },
            }
        });
    }
}

export class TagTest {

    static async create() {
        const user = await prismaClient.user.findUnique({
            where: {
                username: "test"
            }
        });

        if (!user) {
            throw new ResponseError(404, "User is not found.");
        }

        return prismaClient.tag.create({
            data: {
                name: "example tag",
                userId: user.id
            }
        });
    }

    static async get() {
        const tag = await prismaClient.tag.findFirst({
            where: {
                name: "example tag"
            }
        });

        if (!tag) {
            throw new ResponseError(404, "Tag does not exist.");
        }

        return tag;
    }

    static async getByName(name: string) {
        const tag = await prismaClient.tag.findFirst({
            where: {
                name: name
            }
        });

        if (!tag) {
            throw new ResponseError(404, "Tag does not exist.");
        }

        return tag;
    }

    static async deleteAll() {
        await prismaClient.tag.deleteMany();
    }

}