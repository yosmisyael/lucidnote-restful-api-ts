import {Note} from "@prisma/client";

export type Tag = {
    id: string;
    name: string;
}

export type NoteResponse = {
    id: string;
    title: string | null;
    body: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    tags?: Tag[]
}

export type CreateNoteRequest = {
    title: string;
    body: string | null;
    tags: { id: string }[];
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

export function toNoteResponse(note: Note, tags?: Tag[]): NoteResponse {
    const data = {
        id: note.id,
        title: note.title,
        body: note.body,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        tags: tags
    }

    if (tags) data.tags = tags;

    return data;
}
