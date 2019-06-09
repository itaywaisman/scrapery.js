import { Entry } from "../interfaces/entry";
import { IStep } from "../interfaces/step.interface";
import { Logger } from "winston";

const idcAdress = `המרכז הבינתחומי`;

export class MoovitTransformer implements IStep {
    
    constructor(private _logger: Logger) {}

    init(): void {
    }

    async execute(data: any): Promise<Entry[]> {
        this._logger.info("building moovit url");
        return data.map((entry: Entry) => {
            if(!entry.address || !entry.coordinates) return entry;
            const addressString = `${entry.address.streetName} ${entry.address.streetNumber} הרצליה`
            return {
                ...entry,
                moovitLink: `https://moovitapp.com/?from=${encodeURIComponent(addressString)}&to=${encodeURIComponent(idcAdress)}&metroId=1&lang=en`
            }
        })
    }
}