import {Note} from "@prisma/client";

export type NoteResponse = {
    id: string;
    title: string | null;
    body: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export type CreateNoteRequest = {
    title: string;
    body: string | null;
}

export type UpdateNoteRequest = {
    id: string;
    title: string;
    body: string | null;
}

export type SearchNoteRequest = {
    title?: string;
    page: number;
    size: number;
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
