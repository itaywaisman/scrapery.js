import { Entry } from "../interfaces/entry";
import { Logger } from "winston";
import { IStep } from "../interfaces/step.interface";

export class KomoScraper implements IStep {

constructor(private _logger : Logger) {}

    init(options?: any): void {
        this._logger.debug(options);
    }

    async execute(data: void): Promise<Entry[]> {
        return [];
    }


}