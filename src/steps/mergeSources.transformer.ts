import { IStep } from "../interfaces/step.interface";
import { Entry } from "../interfaces/entry";

export class MergeSourcesTransformer implements IStep {
    init(): void {
    }    
    async execute(data: any): Promise<Entry[]> {
        let entries: Entry[] = [];
        for (const sourceName in data) {
          if (data.hasOwnProperty(sourceName)) {
            const sourceEntries = data[sourceName];
            entries.push(...sourceEntries);
          }
        }
        return entries;
    }

    
}