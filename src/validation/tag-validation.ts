import {z, ZodType} from "zod";

export class TagValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(255)
    });
}