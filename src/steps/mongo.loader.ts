import mongoose from 'mongoose';
import { Logger } from 'winston';
import { IStep } from '../interfaces/step.interface';
import { EntryModel } from '../interfaces/EntryModel';


export class MongoLoader implements IStep {


    private connectionString: string = "";

    constructor(private _logger : Logger) {}

    init(options?: any): void {
        this.connectionString = options.connectionString
        mongoose.connect(this.connectionString, {useNewUrlParser: true});
    }    
    
    async execute(): Promise<any> {
        try {
            return await EntryModel.find();   
        } catch (error) {
            this._logger.error("Error exporting to mongodb", error);
        }
    }


}