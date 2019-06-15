import { IStep } from "../interfaces/step.interface";

export class ExcludeTransformer implements IStep {
    
    
    init(): void {
    }    
    
    async execute(data: any, parameters?: any): Promise<any> {
        let excludeInItems = data[parameters.excludeIn];
        let excludeFromItems = data[parameters.excludeFrom];
        let comparator = parameters.comparator;
        let excluded =  excludeInItems.filter((newItem: any) => !excludeFromItems.find((existingItem: any) => {
            return comparator(newItem, existingItem);
        }));
        return excluded;
    }


}