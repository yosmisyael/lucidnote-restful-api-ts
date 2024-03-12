import {CreateNoteRequest, NoteResponse, toNoteResponse} from "../model/note-model";
import {Validation} from "../validation/validation";
import {NoteValidation} from "../validation/note-validation";
import {User} from "@prisma/client";
import {prismaClient} from "../app/database";
import {ResponseError} from "../error/response-error";

export class NoteService {
    static async create(user: User, request: CreateNoteRequest): Promise<NoteResponse> {
        const createRequest = Validation.validate(NoteValidation.CREATE, request);

        const preparedData = {
            ...createRequest,
            ...{userId: user.id}
        }

        const note = await prismaClient.note.create({
            data: preparedData,
        });

        return toNoteResponse(note);
    }

    static async get(user: User, id: string): Promise<NoteResponse> {
        const note = await prismaClient.note.findUnique({
            where: {
                id: id,
                userId: user.id
            }
        });

        if (!note) {
            throw new ResponseError(404, "Note does not exist.")
        }

        return toNoteResponse(note);
    }

}