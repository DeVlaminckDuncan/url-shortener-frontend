type VisitData = {
	shortenedUrlId: string;
	date: Date;
};

export default interface ShortenedUrl {
	id: string;
	createdAt: Date;
	name: string;
	shortUrl: string;
	longUrl: string;
	visits: Array<VisitData>;
}
