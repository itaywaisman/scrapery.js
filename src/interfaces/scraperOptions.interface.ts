export interface IScraperOptions {
    cities: string[],
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