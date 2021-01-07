type VisitData = {
	date: Date;
	visits: number;
};

export default interface ShortenedUrl {
	id: string;
	name: string;
	url: string;
	visits: Array<VisitData>;
}
