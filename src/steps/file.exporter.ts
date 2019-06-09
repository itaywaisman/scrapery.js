import * as fs from 'fs';
import { Logger } from "winston";
import { IStep } from '../interfaces/step.interface';

export class FileExporter implements IStep {

    constructor(private logger: Logger) {
    }

    init(): void {
    }

    async execute(data: Buffer, parameters?: any): Promise<void> {
        try {
            if (fs.existsSync(parameters.fileName)) {
                fs.unlinkSync(parameters.fileName);
            }
            fs.writeFileSync(parameters.fileName, data);
        } catch(err) {
            this.logger.error(err)
        }    
    }


}