export interface AnimeApiResponse {
  readonly animeName: string;
  readonly episodeCount: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly engTitle: string;
  readonly similarAnime: Array<similarAnime>;
  readonly relatedAnime: relatedAnime | string;
}

interface similarAnime {
  readonly animeName: string;
  readonly animeId: string;
  readonly episodeCount: string;
}

interface relatedAnime {
  readonly animeName: string;
  readonly relation: string;
}

export interface postAnimeResponse {
  readonly customerId: string;
  readonly message: string;
  readonly animeId: Array<string>;
}
