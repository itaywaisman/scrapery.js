import { Entry } from "../interfaces/entry";
import { IStep } from "../interfaces/step.interface";
import { Logger } from "winston";

const excel = require('node-excel-export');


const styles = {
    headerDark: {
        fill: {
        fgColor: {
            rgb: 'FF000000'
        }
        },
        font: {
        color: {
            rgb: 'FFFFFFFF'
        },
        sz: 14,
        bold: true,
        underline: true
        }
    },
    cellPink: {
        fill: {
        fgColor: {
            rgb: 'FFFFCCFF'
        }
        }
    },
    cellGreen: {
        fill: {
            fgColor: {
                rgb: 'FF00FF00'
            }
        }
    }
};

export class ExcelTransformer implements IStep{
    
    public constructor( private _logger : Logger) {

    }

    init(): void {

    }

    async execute(data: Entry[]): Promise<Buffer> {
        this._logger.info("transforming to excel");
        const specification = {
            adNumber: {
                displayName: 'מספר מודעה',
                headerStyle: styles.headerDark, 
                width: '5' 
            },
            url: {
                displayName: 'קישור',
                headerStyle: styles.headerDark, 
                width: '20' 
            },
            formattedAddress: {
                displayName: 'כתובת',
                headerStyle: styles.headerDark, 
                width: '30' 
            },
            city: {
                displayName: 'עיר',
                headerStyle: styles.headerDark, 
                width: '8' 
            },
            moovitLink : {
                displayName: 'מסלול לבינתחומי',
                headerStyle: styles.headerDark, 
                width: '30' 
            },
            price: {
                displayName: 'מחיר',
                headerStyle: styles.headerDark, 
                width: '5' 
            },
            tax: {
                displayName: 'ארנונה',
                headerStyle: styles.headerDark, 
                width: '5' 
            },
            houseComitee: {
                displayName: 'ועד בית',
                headerStyle: styles.headerDark, 
                width: '5' 
            },
            floor: {
                displayName: 'קומה',
                headerStyle: styles.headerDark, 
                width: '2' 
            },
            dateOfEntry: {
                displayName: 'תאריך כניסה',
                headerStyle: styles.headerDark, 
                width: '10' 
            },
            squareMeters: {
                displayName: 'גודל',
                headerStyle: styles.headerDark, 
                width: '5' 
            },
            furnitureInfo: {
                displayName: 'ריהוט',
                headerStyle: styles.headerDark, 
                width: '30' 
            },
            formattedContact: {
                displayName: 'איש קשר',
                headerStyle: styles.headerDark, 
                width: '30' 
            }
          }
                      
          const report : Buffer = excel.buildExport(
            [
              {
                merges: [],
                specification: specification,
                data: data 
              }
            ]
          );
           
          return report;
    }

}