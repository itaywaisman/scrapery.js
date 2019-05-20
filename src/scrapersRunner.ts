import { IScraper, IScraperOptions, Entry } from "./scrappers/scrapper.interface";

export class ScrapersRunner {
    constructor(private _scrapers : IScraper[]) {}

    public async scrape(options: IScraperOptions) : Promise<Entry[]> {
        let entries : Entry[] = [];

        for (const scraper of this._scrapers) {
            let fetchedEntries = await scraper.fetch(options);
            entries = [...entries, ...fetchedEntries]
        }

        return entries;
    }
}