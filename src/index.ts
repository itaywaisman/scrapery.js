
import * as winston from 'winston';
import { FlowRunner } from './flowRunner';
import { Yad2Scraper } from './steps/yad2.scraper';
import { MoovitTransformer } from './steps/moovit.transformers';
import { ExcelTransformer } from './steps/excel.transformer';
import { FileExporter } from './steps/file.exporter';

async function main() : Promise<void> {
    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console()
        ]
        });

    // let flow = flowSerializer.deserialize({
    //     options: {
    //         cities: ["herzeliya","ranana","glil-yam","ramat-hasharon", "givataim", "ramat-gan"],
    //         rooms: {
    //             from: 2,
    //             to: 3
    //         },
    //         price: {
    //             from: 3000,
    //             to: 5000
    //         },
    //         entryDate: '1-8-2019'
    //     },
    //     scrapers: [
    //         {type: 'yad2'}
    //     ],
    //     transformers: [
    //         { type: 'moovit' }, 
    //         { type: 'google' }
    //     ],
    //     exporters: [
    //         {
    //             type: 'excel',
    //             options: {
    //                 fileName: 'C:\\Users\\Itay\\Google Drive\\rentals.xlsx',
    //                 unique: true
    //             }
    //         }
    //     ]
    // })
    
    let flowRunner = new FlowRunner();
    logger.info("starting flow", flowRunner);
    flowRunner.runFlow({
        steps: {
            "yad2": {
                step: new Yad2Scraper(logger),
                parameters: {
                    cities: ["herzeliya","ranana","glil-yam","ramat-hasharon", "givataim", "ramat-gan"],
                    rooms: {
                        from: 2,
                        to: 3
                    },
                    price: {
                        from: 3000,
                        to: 5000
                    },
                    entryDate: '1-8-2019'
                },
            },
            "moovit": {
                step : new MoovitTransformer(logger)
            },
            "excel" : {
                step: new ExcelTransformer(logger),
            },
            "file" : {
                step: new FileExporter(logger),
                parameters: {
                    fileName: 'C:\\Users\\Itay\\Google Drive\\rentals.xlsx',
                    unique: true
                }
            }
        },
        edges: [
            {fromId: "yad2", toId: "moovit"},
            {fromId: "moovit", toId: "excel"},
            {fromId: "excel", toId: "file"}
        ]
    });
}

main().catch(console.error);


