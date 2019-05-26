import { Entry } from "../models/entry";

export interface IScraperOptions {
    city: string,
    rooms: {
        from: number,
        to: number
    },
    price: {
        from: number,
        to: number
    },
    entryDate: string
}

export interface IScraper {
    fetch(options: IScraperOptions) : Promise<Entry[]>;
}
