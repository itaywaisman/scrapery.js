import { IScraper, IScraperOptions } from "./scrapper.interface";
import { Entry } from "../models/entry";

export class KomoScraper implements IScraper {
    
    
    async fetch(options: IScraperOptions): Promise<Entry[]> {
        console.log(options);
        return [];
    }

}