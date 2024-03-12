import {CreateTagRequest, TagResponse, toTagResponse, UpdateTagRequest} from "../model/tag-model";
import {Tag, User} from "@prisma/client";
import {Validation} from "../validation/validation";
import {TagValidation} from "../validation/tag-validation";
import {prismaClient} from "../app/database";
import {ResponseError} from "../error/response-error";

export class TagService {

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

        const checkTag: number = await prismaClient.tag.count({
            where: {
                userId: user.id,
                name: createRequest.name
            }
        });

        if (checkTag !== 0) {
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

        const checkTag: number = await prismaClient.tag.count({
            where: {
                userId: user.id,
                name: updateRequest.name
            }
        });

        if (checkTag > 1) {
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

}