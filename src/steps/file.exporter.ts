import * as fs from 'fs';
import { Logger } from "winston";
import { IStep } from '../interfaces/step.interface';

export class FileExporter implements IStep {

    private fileName: string = "";

    constructor(private logger: Logger) {
    }

    init(options?: any): void {
        this.fileName = options.fileName;
    }

    async execute(data: Buffer): Promise<void> {
        try {
            if (fs.existsSync(this.fileName)) {
                fs.unlinkSync(this.fileName);
            }
            fs.writeFileSync(this.fileName, data);
        } catch(err) {
            this.logger.error(err)
        }    
    }


}