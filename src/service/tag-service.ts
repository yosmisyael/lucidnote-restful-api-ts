import {CreateTagRequest, TagResponse, toTagResponse} from "../model/tag-model";
import {User} from "@prisma/client";
import {Validation} from "../validation/validation";
import {TagValidation} from "../validation/tag-validation";
import {prismaClient} from "../app/database";

export class TagService {

    static async create(user: User, request: CreateTagRequest): Promise<TagResponse> {
        const createRequest: CreateTagRequest = Validation.validate(TagValidation.CREATE, request);
        const preparedData = {
            ...createRequest,
            ...{userId: user.id}
        }

        const tag = await prismaClient.tag.create({
            data: preparedData
        });

        return toTagResponse(tag);
    }
}