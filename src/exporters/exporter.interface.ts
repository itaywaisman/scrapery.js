import { Entry } from "../models/entry";

export interface IExporter {
    export(entries:Entry[]) : Promise<void>;
}