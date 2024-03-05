import {RegisterUserRequest, toUserResponse, UserResponse} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../app/database";
import {ResponseError} from "../error/response-error";
import bcrypt from "bcrypt";

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        const checkUsername = await prismaClient.user.count({
            where: {
                username: registerRequest.username
            }
        });

        if (checkUsername !== 0) {
            throw new ResponseError(400, "Username is already taken.");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prismaClient.user.create({
            data: registerRequest
        });

        return toUserResponse(user);
    }
}