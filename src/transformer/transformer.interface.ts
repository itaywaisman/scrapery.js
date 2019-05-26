import { Entry } from "../models/entry";

export interface ITransformer<T> {
    transform(entries: Entry[]) : T;
}