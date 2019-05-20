import { IScraper, Entry, IScraperOptions } from "./scrapper.interface";

export class KomoScraper implements IScraper {
    
    
    async fetch(options: IScraperOptions): Promise<Entry[]> {
        console.log(options);
        return [];
    }

}