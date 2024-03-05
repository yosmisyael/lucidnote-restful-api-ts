import {prismaClient} from "../src/app/database";
import bcrypt from "bcrypt";
import {UserService} from "../src/service/user-service";
import {Session, User} from "@prisma/client";

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany();
    }

    static async deleteSession() {
        const result = await prismaClient.session.deleteMany({
            where: {
                token: "test"
            }
        });
    }

    static async create() {
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