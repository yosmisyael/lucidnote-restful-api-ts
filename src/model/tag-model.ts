import {Tag} from "@prisma/client";

export type TagResponse = {
    id: string;
    name: string;
}

export type CreateTagRequest = {
    name: string;
}

export type UpdateTagRequest = {
    id: string;
    name: string;
}

export function toTagResponse(tag: Tag): TagResponse {
    return {
        id: tag.id,
        name: tag.name
    }
}