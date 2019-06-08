import { Entry } from "../interfaces/entry";
import { IStep } from "../interfaces/step.interface";

const idcAdress = `המרכז הבינתחומי`;

export class MoovitTransformer implements IStep {
    
    init(): void {
    }

    async execute(data: Entry[], parameters: void): Promise<Entry[]> {
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