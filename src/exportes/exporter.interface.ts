import { Entry } from "../scrappers/scrapper.interface";

export interface IExporter {
    export(entries:Entry[]) : void;
}