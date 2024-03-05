import {Request, Response, NextFunction} from "express";
import {prismaClient} from "../app/database";
import {UserRequest} from "../type/user-request";
import {util} from "zod";
import objectKeys = util.objectKeys;

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction)=> {
    const token = req.get("X-API-TOKEN");

    if (token) {
        const user = await prismaClient.session.findFirst({
            where: {
                token: token
            },
            include: {
                user: true
            }
        })

        if (user) {
            req.user = user.user;
            next();
            return;
        }
    }

    res.status(401).json({
        error: "Unauthorized."
    }).end();
}