import {CreateTagRequest, TagResponse, toTagResponse, UpdateTagRequest} from "../model/tag-model";
import {Prisma, Tag, User} from "@prisma/client";
import {Validation} from "../validation/validation";
import {TagValidation} from "../validation/tag-validation";
import {prismaClient} from "../app/database";
import {ResponseError} from "../error/response-error";

export class TagService {

    static async verifyUniqueness(userId: string, name: string, tagId?: string): Promise<boolean> {
        const whereClause: Prisma.TagWhereInput = {
            userId,
            name
        };

        if (tagId) {
            whereClause.NOT = { id: tagId };
        }

        const countTags = await prismaClient.tag.count({
            where: whereClause
        });

        return countTags === 0;
    }

    static async verifyTag(userId: string, tagId: string): Promise<Tag> {
        const tag = await prismaClient.tag.findUnique({
            where: {
                id: tagId,
                userId: userId
            }
        });

        if (!tag) {
            throw new ResponseError(404, "Tag does not exist.");
        }

        return tag;
    }

    static async create(user: User, request: CreateTagRequest): Promise<TagResponse> {
        const createRequest: CreateTagRequest = Validation.validate(TagValidation.CREATE, request);
        const isAvailable: boolean = await this.verifyUniqueness(user.id, createRequest.name);

        if (!isAvailable) {
            throw new ResponseError(400, "Tag name is already taken.");
        }

        const preparedData = {
            ...createRequest,
            ...{userId: user.id}
        }

        const tag = await prismaClient.tag.create({
            data: preparedData
        });

        return toTagResponse(tag);
    }

    static async update(user: User, request: UpdateTagRequest): Promise<TagResponse> {
        const updateRequest: UpdateTagRequest = Validation.validate(TagValidation.UPDATE, request);
        const isAvailable: boolean = await this.verifyUniqueness(user.id, updateRequest.name, updateRequest.id);

        if (!isAvailable) {
            throw new ResponseError(400, "Tag name is already taken.");
        }

        await this.verifyTag(user.id, updateRequest.id);

        const tag = await prismaClient.tag.update({
            where: {
                id: updateRequest.id,
                userId: user.id
            },
            data: updateRequest
        });

        return toTagResponse(tag);
    }

    static async remove(user: User, tagId: string): Promise<TagResponse> {
        await this.verifyTag(user.id, tagId);
        const tag = await prismaClient.tag.delete({
            where: {
                userId: user.id,
                id: tagId
            }
        });

        return toTagResponse(tag);
    }

    static async getAll(user: User): Promise<{id: string, name: string}[]> {
        return prismaClient.tag.findMany({
            where: {
                userId: user.id
            },
            select: {
                id: true,
                name: true,
            }
        });
    }
}