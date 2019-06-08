import mongoose , {Schema, Document} from 'mongoose';
import { Logger } from 'winston';
import { Entry } from '../interfaces/entry';
import { IStep } from '../interfaces/step.interface';

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


export class MongoExporter implements IStep {

    private connectionString: string = "";

    constructor(private _logger : Logger) {
    }

    init(options?: any): void {
        this.connectionString = options.connectionString
        mongoose.connect(this.connectionString, {useNewUrlParser: true});
    }
    async execute(data: Entry[]): Promise<void> {
        try {
            await EntryModel.insertMany(data);   
        } catch (error) {
            this._logger.error("Error exporting to mongodb", error);
        }
    }
}