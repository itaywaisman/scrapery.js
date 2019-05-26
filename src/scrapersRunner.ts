import { IScraper, IScraperOptions } from "./scrappers/scrapper.interface";
import { Entry } from "./models/entry";

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