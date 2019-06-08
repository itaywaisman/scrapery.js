import { Entry } from "../interfaces/entry";
import { IStep } from "../interfaces/step.interface";

export class GoogleMapsTransformer implements IStep {
    
    init(): void {
    }

    async execute(data: Entry[]): Promise<Entry[]> {
        return data.map((entry: Entry) => {
            if(!entry.address || !entry.coordinates) return entry;
            return {
                ...entry,
                googleMapsLink: `https://maps.google.com/?ll=${entry.coordinates.longitude},${entry.coordinates.latitude}`
            }
        })
    }
}