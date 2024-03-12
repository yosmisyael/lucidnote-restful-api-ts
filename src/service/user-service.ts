import {
    LoginUserRequest,
    RegisterUserRequest,
    toUserResponse,
    UserResponse,
    UpdateUserRequest
} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../app/database";
import {ResponseError} from "../error/response-error";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import {Prisma, User} from "@prisma/client";

export class UserService {

    static async verifyUniqueUsername(username: string, userId?: string): Promise<boolean> {
        const whereClause: Prisma.UserWhereInput = {
            username
        }

        if (userId) {
            whereClause.NOT = { id: userId }
        }

        const countUsernames = await prismaClient.user.count({
            where: whereClause
        });

        return countUsernames === 0;
    }

    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        const isAvailable: boolean = await this.verifyUniqueUsername(registerRequest.username);

        if (!isAvailable) {
            throw new ResponseError(400, "Username is already taken.");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prismaClient.user.create({
            data: registerRequest
        });

        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        const user = await prismaClient.user.findUnique({
            where: {
                username: loginRequest.username
            }
        });

        if (!user) {
            throw new ResponseError(401, "Username or password is wrong.");
        }

        const passwordValidation = await bcrypt.compare(loginRequest.password, user.password);

        if (!passwordValidation) {
            throw new ResponseError(401, "Username or password is wrong.");
        }

        const token = uuid();

        const session = await prismaClient.session.create({
            data: {
                userId: user.id,
                token
            }
        });

        const response = toUserResponse(user);
        response.token = session.token;
        return response;
    }

    static async get(user: User): Promise<UserResponse> {
        return toUserResponse(user);
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);

        if (updateRequest.name) {
            user.name = updateRequest.name;
        }

        if (updateRequest.username) {
            const isAvailable: boolean = await this.verifyUniqueUsername(updateRequest.username, user.id);

            if (!isAvailable) {
                throw new ResponseError(400, "Username is already taken.");
            }

            user.username = updateRequest.username;
        }

        if (updateRequest.password) {
            user.password = await bcrypt.hash(updateRequest.password, 10);
        }

        const result = await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: user
        });

        return toUserResponse(result);
    }

    static async logout(token: string): Promise<Boolean> {
        const result = await prismaClient.session.deleteMany({
            where: {
                token
            }
        })

        if (result.count !== 1) {
            throw new ResponseError(500, "An error occurred when processing logout.");
        }

        return true
    }
}