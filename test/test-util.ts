import {prismaClient} from "../src/app/database";
import bcrypt from "bcrypt";

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: "test"
            }
        });
    }

    static async deleteSession() {
        await prismaClient.session.deleteMany();
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
}