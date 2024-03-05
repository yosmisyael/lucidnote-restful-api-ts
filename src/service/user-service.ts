import {LoginUserRequest, RegisterUserRequest, toUserResponse, UserResponse} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../app/database";
import {ResponseError} from "../error/response-error";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

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
}