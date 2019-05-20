export interface IScraperOptions {
    city: string,
    rooms: {
        from: number,
        to: number
    },
    price: {
        from: number,
        to: number
    },
    entryDate: string
}

export interface IScraper {
    fetch(options: IScraperOptions) : Promise<Entry[]>;
}


export interface Entry {
    id: string,
    adNumber: number,
    address?: {
        neighborhood?: string,
        streetNumber?: number,
        streetName: string
    },
    formattedAddress: string,
    price: number,
    tax: number,
    houseComitee: number,
    totalAfterBills?: number,
    floor?: number,
    url: string,
    images?: string[],
    dateOfEntry?: string,
    squareMeters?: number,
    furnitureInfo?: string,
    contactName?: string,
    contactPhone?: string,
    formattedContact?: string,
}