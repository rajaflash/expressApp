import { AnimeApiRequest } from "../model/animeAPI/animeApiRequest";

export interface Service 
{

    animeService(req:AnimeApiRequest): Promise<Record<any, any>>;

}