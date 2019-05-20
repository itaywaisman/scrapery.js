import { IScrapper, IScrapperOptions, Entry } from "./scrappers/scrapper.interface";

export class ScrapperRunner {
    constructor(private _scrappers : IScrapper[]) {}

    public async scrape(options: IScrapperOptions) : Promise<Entry[]> {
        let entries : Entry[] = [];

        for (const scrapper of this._scrappers) {
            let fetchedEntries = await scrapper.fetch(options);
            entries = [...entries, ...fetchedEntries]
        }

        return entries;
    }
}