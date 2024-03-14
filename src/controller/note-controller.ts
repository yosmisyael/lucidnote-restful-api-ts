import {UserRequest} from "../type/user-request";
import {NextFunction, Response} from "express";
import {CreateNoteRequest, NoteResponse, SearchNoteRequest, UpdateNoteRequest} from "../model/note-model";
import {NoteService} from "../service/note-service";
import {Pageable} from "../model/page-model";

export class NoteController {

    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateNoteRequest = req.body as CreateNoteRequest;
            const response = await NoteService.create(req.user!, request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const noteId = req.params.noteId;
            const response = await NoteService.get(req.user!, noteId);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateNoteRequest = req.body as UpdateNoteRequest;
            request.id = req.params.noteId;
            const response = await NoteService.update(req.user!, request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }


    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const noteId = req.params.noteId;
            await NoteService.remove(req.user!, noteId);
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }

    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: SearchNoteRequest = {
                title: req.query.title as string,
                tags: req.query.tags as Array<string>,
                size: req.query.size ? Number(req.query.size) : 10 as number,
                page: req.query.page ? Number(req.query.page) : 1 as number,
            }
            const response: Pageable<NoteResponse> = await NoteService.search(req.user!, request);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

}