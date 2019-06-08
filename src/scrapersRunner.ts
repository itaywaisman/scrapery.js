import { IScraper, IScraperOptions } from "./interfaces/scrapper.interface";
import { Entry } from "./interfaces/entry";

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