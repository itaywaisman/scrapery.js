import { IExporter } from "./exporter.interface";
import { Entry } from "../models/entry";

export class ExcelExporter implements IExporter {
    async export(entries: Entry[]): Promise<void> {
        console.log(entries);
    }

}