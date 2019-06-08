
import * as winston from 'winston';
import { FlowSerializer } from './flowSerializer';
import { FlowRunner } from './flowRunner';

async function main() : Promise<void> {
    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console()
        ]
        });


    let flowSerializer = new FlowSerializer(logger);
    let flow = flowSerializer.deserialize({
        options: {
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
        scrapers: [
            {type: 'yad2'}
        ],
        transformers: [
            { type: 'moovit' }, 
            { type: 'google' }
        ],
        exporters: [
            {
                type: 'excel',
                options: {
                    fileName: 'C:\\Users\\Itay\\Google Drive\\rentals.xlsx',
                    unique: true
                }
            }
        ]
    })
    
    let flowRunner = new FlowRunner();
    flowRunner.runFlow(flow);
}

main().catch(console.error);


