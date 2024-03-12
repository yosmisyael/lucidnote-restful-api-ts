import {prismaClient} from "../src/app/database";
import bcrypt from "bcrypt";
import {Session} from "@prisma/client";
import {ResponseError} from "../src/error/response-error";

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
}

export class TagTest {
    static async deleteAll() {
        await prismaClient.tag.deleteMany();
    }
}