import fetch from 'node-fetch';
import { parsePrice } from '../utils';
import { Logger } from 'winston';
import { Entry } from '../interfaces/entry';
import { IStep } from '../interfaces/step.interface';
import { IScraperOptions } from '../interfaces/scraperOptions.interface';

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


export const cities: {[city: string]:string} = {
    "herzeliya" : "6400",
    "ranana" : "8700",
    "glil-yam": "0346",
    "ramat-hasharon": "2650",
    "givataim": "6300",
}


export class Yad2Scraper implements IStep {
    

    public constructor( private _logger : Logger) {

    }

    init(): void {
        
    }

    async execute(data: any , parameters: IScraperOptions): Promise<Entry[]> {
        this._logger.info('start fetching yad2', data);
        let ids :string[]= [];
        for(var i = 0; i<parameters.cities.length; ++i) {
            let cityIds = await this.fetchCityEntries(cities[parameters.cities[i]], parameters);
            ids.push(...cityIds);
        }
        
        let entries : Entry[] = [];
        this._logger.info(`requesting more data from yad2 for the ids`);
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
                city: fullData.city_text,
                coordinates: fullData.navigation_data.coordinates,
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

        this._logger.info(`requesting contact info for each entry`);
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

    private async fetchCityEntries(cityId : string, options: IScraperOptions) : Promise<string[]> {
        
        const url = this.buildUrl(cityId, options);
        this._logger.info(`built query for city: ${cityId}, url: ${url}`);

        const response = await fetch(url, requestHeaders);
        this._logger.info(`got response from yad2 for city ${cityId}`);
        const data = await response.json();
        this._logger.info(`parsed data into json for city ${cityId}`);
        const ids = data.feed.feed_items
            .filter((entry: any) => !entry.merchant)
            .filter((entry: any) => entry.type == 'ad')
            .map((entry: any) => entry.id);
        return ids;
    }

    private buildUrl(cityId: string, options: IScraperOptions) : string {
        const rangeToString = (range:{from:number,to:number}) : string => {
            return `${range.from}-${range.to}`;
        }
        return `https://www.yad2.co.il/api/pre-load/getFeedIndex/realestate/rent?city=${cityId}&rooms=${rangeToString(options.rooms)}&price=${rangeToString(options.price)}&EnterDate=${options.entryDate}`;
    }
}