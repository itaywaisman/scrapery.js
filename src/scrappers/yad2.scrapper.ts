import fetch from 'node-fetch';

import { IScrapper, IScrapperOptions, Entry } from "./scrapper.interface";
import { parsePrice } from '../utils';
import { Logger } from 'winston';

const requestHeaders = {
    "method": "GET",
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "accept-language": "en-US,en;q=0.9,he;q=0.8",
        "cache-control": "max-age=0",
        "upgrade-insecure-requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
    }
};


export const cities: {[city: string]:number} = {
    "herzeliya" : 6400
}


export class Yad2Scrapper implements IScrapper {

    public constructor( private _logger : Logger) {

    }

    public async fetch(options: IScrapperOptions): Promise<Entry[]> {
        this._logger.info('start fetching yad2');
        const url = this.buildUrl(options);
        this._logger.verbose(`built query url: ${url}`);

        const response = await fetch(url, requestHeaders);
        this._logger.verbose(`got response from yad2`);
        const data = await response.json();
        this._logger.verbose(`parsed data into json`);
        const ids = data.feed.feed_items
            .filter((entry: any) => !entry.merchant)
            .filter((entry: any) => entry.type == 'ad')
            .map((entry: any) => entry.id);
        
        let entries : Entry[] = [];
        this._logger.verbose(`requesting more data from yad2 for the ids`);
        for (var i = 0; i< ids.length ; i++) {

            const id = ids[i];
            let fullDataResponse = await fetch(`https://www.yad2.co.il/api/item/${id}`, requestHeaders);

            const fullData = await fullDataResponse.json();
            const newEntry : Entry = {
                id: id,
                adNumber: fullData.ad_number,
                address: {
                    neighborhood: fullData.neighborhood,
                    streetName: fullData.street,
                    streetNumber: fullData.address_home_number
                },
                formattedAddress: `${fullData.neighborhood}, ${fullData.street} ${fullData.address_home_number}`,
                price: parsePrice(fullData.price),
                tax: parsePrice(fullData.property_tax),
                houseComitee: parsePrice(fullData.HouseCommittee),
                dateOfEntry: fullData.date_of_entry,
                squareMeters: parseInt(fullData.square_meters),
                furnitureInfo: fullData.furniture_info,
                url: `https://www.yad2.co.il/s/c/${id}`
            };

            entries.push(newEntry)
        
        }

        this._logger.verbose(`requesting contact info for each entry`);
        for (const entry in entries) {
            if (entries.hasOwnProperty(entry)) {
                const element = entries[entry];
                const contactInfoResponse = await fetch(`https://www.yad2.co.il/api/item/${element.id}/contactinfo?id=${element.id}`, 
                    requestHeaders);
                const contactInfo = await contactInfoResponse.json();
                element.contactName = contactInfo.data.contact_name ? contactInfo.data.contact_name : 'ללא שם';
                element.contactPhone = contactInfo.data.phone_numbers[0].title;
                element.formattedContact = `${element.contactName}  - ${ element.contactPhone}`
            }
        }

        this._logger.info(`finished fetching, got ${entries.length} entries`);
        
        return entries;
    }

    private buildUrl(options: IScrapperOptions) : string {
        const rangeToString = (range:{from:number,to:number}) : string => {
            return `${range.from}-${range.to}`;
        }
        return `https://www.yad2.co.il/api/pre-load/getFeedIndex/realestate/rent?city=${cities[options.city]}&rooms=${rangeToString(options.rooms)}&price=${rangeToString(options.price)}&EnterDate=${options.entryDate}`;
    }
    
    
    
}