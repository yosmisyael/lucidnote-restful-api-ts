import {Note} from "@prisma/client";

export type NoteResponse = {
    id: string;
    title?: string | null;
    body?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export type CreateNoteRequest = {
    title: string;
    body?: string;
}

export function toNoteResponse(note: Note): NoteResponse {
    return {
        id: note.id,
        title: note.title,
        body: note.body,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
    }
}
