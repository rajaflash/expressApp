
import { JSONSchemaType } from "ajv"
import { PostAnimeRequest } from "../model/animeAPI/animeApiRequest"


export const schema: JSONSchemaType<PostAnimeRequest> = {
    type: "object",
    properties: {
        animeDetails: {
            type: "object",
            properties: {
                animeName: { type: "string", minLength: 1 },
                startDate: { type: "string", format: "date", errorMessage: "Provide a valid date in YYYY-MM-DD format" },
                endDate: { type: "string", minLength: 1, format: "date", errorMessage: "Provide a valid date in YYYY-MM-DD format" },
                engTitle: { type: "string", minLength: 1 },
                episodeCount: { type: "string", minLength: 1 },
                relatedAnime: {
                    oneOf: [
                        { type: "string", minLength: 1 },
                        {
                            type: "object",
                            properties: {
                                animeName: { type: "string", minLength: 1 },
                                relation: { type: "string", minLength: 1 }
                            },
                            required: ["animeName", "relation"],
                            additionalProperties: false
                        },
                    ],
                },
                similarAnime: {
                    oneOf: [
                        { type: "string", minLength: 1 },
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    animeId: { type: "string", minLength: 1 },
                                    animeName: { type: "string", minLength: 1 },
                                    episodeCount: { type: "string", minLength: 1 }
                                },
                                required: ["animeId", "animeName", "episodeCount"]
                            }
                        },
                        {
                            type: "object",
                            properties: {
                                animeId: { type: "string", minLength: 1 },
                                animeName: { type: "string", minLength: 1 },
                                episodeCount: { type: "string", minLength: 1 }
                            },
                            required: ["animeId", "animeName", "episodeCount"]
                        }
                    ]
                }
            },
            required: ["animeName", "endDate", "engTitle", "episodeCount", "relatedAnime", "similarAnime", "startDate"],
            additionalProperties: false
        },
        customerDetails: {
            type: "object",
            properties: {
                animeGenrePreference: {
                    type: "array",
                    items: { type: "string" },
                    nullable: true
                },
                firstName: { type: "string", minLength: 1 },
                lastName: { type: "string", minLength: 1 },
                mobileNumber: { type: "string", minLength: 1, maxLength: 10 }
            },
            additionalProperties: false,
            required: ["firstName", "lastName", "mobileNumber"],
            nullable: true,
            //AJV doesn't differentiate between undefined and null. If optional/undefined, then have to provide nullable true
            not: { type: "null" },
            errorMessage: "The customerDetails must have the required properties"
        },
        customerId: { type: "string", minLength: 1 }
    },
    required: ["animeDetails", "customerId"],
    additionalProperties: false
}