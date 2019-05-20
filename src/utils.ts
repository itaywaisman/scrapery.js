export const parsePrice = (priceString?: string) : number => {
    if(!priceString) return 0;
    if(priceString == 'לא צוין') return 0;
    const numberString = priceString.replace(',','').replace(' ₪', '');
    return parseInt(numberString);
}