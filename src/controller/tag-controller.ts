import {CreateTagRequest, TagResponse, UpdateTagRequest} from "../model/tag-model";
import {Response, NextFunction} from "express";
import {TagService} from "../service/tag-service";
import {UserRequest} from "../type/user-request";

export class TagController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateTagRequest = req.body as CreateTagRequest;
            const response = await TagService.create(req.user!, request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateTagRequest = req.body as UpdateTagRequest;
            request.id = req.params.tagId;
            const response: TagResponse = await TagService.update(req.user!, request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
}