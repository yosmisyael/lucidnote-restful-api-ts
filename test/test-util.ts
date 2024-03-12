import {prismaClient} from "../src/app/database";
import bcrypt from "bcrypt";
import {UserService} from "../src/service/user-service";
import {Session, User} from "@prisma/client";

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany();
    }

    static async deleteSession() {
        const result = await prismaClient.session.deleteMany();
    }

    static async create() {
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

    static async getToken(): Promise<Session>{
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

    static async deleteAll() {
        await prismaClient.note.deleteMany()
    }
}