import {Request, Response, NextFunction} from "express";
import {RegisterUserRequest} from "../model/user-model";
import {UserService} from "../service/user-service";

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterUserRequest = req.body as RegisterUserRequest;
            const response = await UserService.register(request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
}