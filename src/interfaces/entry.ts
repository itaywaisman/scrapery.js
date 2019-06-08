export interface Entry {
    id: string,
    adNumber: number,
    address?: {
        neighborhood?: string,
        streetNumber?: number,
        streetName: string
    },
    city?: string,
    coordinates?:{
        longitude: string,
        latitude: string
    },
    formattedAddress: string,
    googleMapsLink?: string,
    moovitLink?: string,
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