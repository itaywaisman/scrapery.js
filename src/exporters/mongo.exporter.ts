import mongoose , {Schema, Document} from 'mongoose';
import { Logger } from 'winston';

import { IExporter } from "./exporter.interface";
import { Entry } from '../models/entry';

type EntryType = Entry & Document;
const EntryModel = mongoose.model<EntryType>('Entry', new Schema({
    id: {type: String, unique: true, dropDups: true},
    adNumber: Number,
    address: {
        neighborhood: String,
        streetNumber: Number,
        streetName: String
    },
    formattedAddress: String,
    price: Number,
    tax: Number,
    houseComitee: Number,
    totalAfterBills: Number,
    floor: Number,
    url: String,
    images: [String],
    dateOfEntry: String,
    squareMeters: Number,
    furnitureInfo: String,
    contactName: String,
    contactPhone: String,
    formattedContact: String,
}));


export class MongoExporter implements IExporter{

    constructor(connectionString: string, private _logger : Logger) {
        mongoose.connect(connectionString, {useNewUrlParser: true});
    }

    async export(entries: Entry[]): Promise<void> {
        try {
            await EntryModel.insertMany(entries);   
        } catch (error) {
            this._logger.error("Error exporting to mongodb", error);
        }
    }

}