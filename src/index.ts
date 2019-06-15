
import * as winston from 'winston';
import { FlowRunner } from './flowRunner';
import { Yad2Scraper } from './steps/yad2.scraper';
import { MoovitTransformer } from './steps/moovit.transformers';
import { MongoLoader } from './steps/mongo.loader';
import { MongoExporter } from './steps/mongo.exporter';
import { GoogleMapsTransformer } from './steps/googleMaps.transformer';
import { ExcludeTransformer } from './steps/exclude.transformer';

async function main() : Promise<void> {
    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console()
        ]
        });
    
    let flowRunner = new FlowRunner({
        "mongo-loader" : {
            connectionString: "mongodb://localhost:27017/rentals"
        },
        "mongo-exporter" : {
            connectionString: "mongodb://localhost:27017/rentals"
        }
    });
    logger.info("starting flow", flowRunner);
    flowRunner.runFlow({
        steps: {
            "mongo-loader" : {
                step: new MongoLoader(logger)
            },
            "yad2": {
                step: new Yad2Scraper(logger),
                parameters: {
                    cities: ["herzeliya","ranana"],
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
            "exclude" :{
                step: new ExcludeTransformer(),
                parameters: {
                    excludeIn: "yad2",
                    excludeFrom: "mongo-loader",
                    comparator: (item1: any, item2: any) => item1.id == item2.id
                }
            },
            "moovit": {
                step : new MoovitTransformer(logger)
            },
            "googleMaps" : {
                step: new GoogleMapsTransformer()
            },
            "mongo-exporter" : {
                step: new MongoExporter(logger)
            }
        },
        edges: [
            {fromId: "mongo-loader", toId: "exclude"},
            {fromId: "yad2", toId: "exclude"},
            {fromId: "exclude", toId: "moovit"},
            {fromId: "moovit", toId: "googleMaps"},
            {fromId: "googleMaps", toId: "mongo-exporter"}
        ]
    });
}

main().catch(console.error);


