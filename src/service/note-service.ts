import {CreateNoteRequest, NoteResponse, toNoteResponse, UpdateNoteRequest} from "../model/note-model";
import {Validation} from "../validation/validation";
import {NoteValidation} from "../validation/note-validation";
import {Prisma, User} from "@prisma/client";
import {prismaClient} from "../app/database";
import {ResponseError} from "../error/response-error";
import {SearchNoteRequest} from "../model/note-model";
import {Pageable} from "../model/page-model";

export class NoteService {

    static async verifyTag(userId: string, tags: { id: string }[]): Promise<void> {
        const tagIds = tags.map(({id}) => id);
        const result = await prismaClient.tag.findMany({
            where: {
                id: {
                    in: tagIds
                },
                userId: userId
            }
        });

        if (result.length < tagIds.length) {
            throw new ResponseError(400, "Tags must be valid.")
        }
    }

    static async create(user: User, request: CreateNoteRequest): Promise<NoteResponse> {
        const createRequest: CreateNoteRequest = Validation.validate(NoteValidation.CREATE, request);
        await this.verifyTag(user.id, createRequest.tags);

        const note = await prismaClient.note.create({
            data: {
                title: createRequest.title,
                body: createRequest.body,
                tags: {
                    connect: createRequest.tags
                },
                userId: user.id
            },
            include: {
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return toNoteResponse(note, note.tags);
    }

    static async get(user: User, noteId: string): Promise<NoteResponse> {
        const note = await prismaClient.note.findUnique({
            where: {
                id: noteId,
                userId: user.id
            },
            include: {
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!note) {
            throw new ResponseError(404, "Note does not exist.");
        }

        return toNoteResponse(note, note.tags);
    }

    static async update(user: User, request: UpdateNoteRequest): Promise<NoteResponse> {
        const updateRequest: UpdateNoteRequest = Validation.validate(NoteValidation.UPDATE, request);
        const isNoteAvailable: NoteResponse = await this.get(user, updateRequest.id);

        const existingTagIdsArr = isNoteAvailable.tags!.map(({id}) => id)
        const requestedTagIds: Set<string> = new Set(updateRequest.tags.map(({id}) => id));

        const tagsToDisconnect: { id: string }[] = existingTagIdsArr.filter(id => !requestedTagIds.has(id)).map((id) => ({ id }));

        const note = await prismaClient.note.update({
            where: {
                id: updateRequest.id,
                userId: user.id
            },
            data: {
                title: updateRequest.title,
                body: updateRequest.body,
                tags: {
                    disconnect: tagsToDisconnect,
                    connect: updateRequest.tags,
                }
            },
            include: {
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return toNoteResponse(note, note.tags);
    }

    static async remove(user: User, noteId: string): Promise<NoteResponse> {
        await this.get(user, noteId);
        const note = await prismaClient.note.delete({
            where: {
                userId: user.id,
                id: noteId
            }
        });

        return toNoteResponse(note);
    }

    static async search(user: User, request: SearchNoteRequest): Promise<Pageable<NoteResponse>> {
        const searchRequest: SearchNoteRequest = Validation.validate(NoteValidation.SEARCH, request);
        const skip: number = (searchRequest.page - 1) * searchRequest.size;

        const filters: Prisma.NoteWhereInput[] = [];

        if (searchRequest.title) {
            filters.push({
                OR: [
                    {
                        title: {
                            equals: searchRequest.title
                        }
                    },
                    {
                        title: {
                            contains: searchRequest.title
                        }
                    }
                ]
            });
        }

        if (searchRequest.tags && searchRequest.tags.length > 0) {
            const requestTag = searchRequest.tags.map((id) => ({ id }))
            await this.verifyTag(user.id, requestTag);
            filters.push({
               tags: {
                   some: {
                       id: {
                           in: searchRequest.tags
                       }
                   }
               }
            });
        }

        const notes = await prismaClient.note.findMany({
            where: {
                userId: user.id,
                AND: filters
            },
            take: searchRequest.size,
            skip: skip,
            include: {
                tags: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        const countNotes = await prismaClient.note.count({
            where: {
                userId: user.id,
                AND: filters
            },
        });

        return {
            data: notes.map(note => toNoteResponse(note, note.tags)),
            paging: {
                currentPage: searchRequest.page,
                totalPage: Math.ceil(countNotes / searchRequest.size),
                size: searchRequest.size
            }
        }
    }

}