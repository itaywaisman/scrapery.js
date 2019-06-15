
import mongoose from 'mongoose';
import { Entry } from './entry';
import { Document, Schema } from 'mongoose';

type EntryType = Entry & Document;
export const EntryModel = mongoose.model<EntryType>('Entry', new Schema({
    id: {type: String, unique: true, dropDups: true},
    adNumber: Number,
    address: {
        neighborhood: String,
        streetNumber: Number,
        streetName: String
    },
    formattedAddress: String,
    googleMapsLink: String,
    moovitLink: String,
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
    isDeleted: Boolean,
    seeDate: Date,
    comments: String,
}));