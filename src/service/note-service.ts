import {CreateNoteRequest, NoteResponse, toNoteResponse, UpdateNoteRequest} from "../model/note-model";
import {Validation} from "../validation/validation";
import {NoteValidation} from "../validation/note-validation";
import {Note, User} from "@prisma/client";
import {prismaClient} from "../app/database";
import {ResponseError} from "../error/response-error";

export class NoteService {

    static async verifyNote(userId: string, noteId: string): Promise<Note> {
        const note = await prismaClient.note.findUnique({
            where: {
                id: noteId,
                userId: userId
            }
        });

        if (!note) {
            throw new ResponseError(404, "Note does not exist.");
        }

        return note;
    }

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
        const note = await this.verifyNote(user.id, id);
        return toNoteResponse(note);
    }

    static async update(user: User, request: UpdateNoteRequest): Promise<NoteResponse> {
        const updateRequest: UpdateNoteRequest = Validation.validate(NoteValidation.UPDATE, request);
        await this.verifyNote(user.id, updateRequest.id);

        const note = await prismaClient.note.update({
            where: {
                id: updateRequest.id,
                userId: user.id
            },
            data: updateRequest
        });

        return toNoteResponse(note);
    }

    static async remove(user: User, noteId: string): Promise<NoteResponse> {
        await this.verifyNote(user.id, noteId);
        const note = await prismaClient.note.delete({
            where: {
                userId: user.id,
                id: noteId
            }
        });

        return toNoteResponse(note);
    }

}