import { IExporter } from "./exporter.interface";
import { Entry } from "../scrappers/scrapper.interface";

export class ExcelExporter implements IExporter {
    async export(entries: Entry[]): Promise<void> {
        console.log(entries);
    }

}