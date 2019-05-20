
import * as winston from 'winston';
import { ScrapperRunner } from "./scrapperRunner";
import { Yad2Scrapper } from "./scrappers/yad2.scrapper";
import { MongoExporter } from './exportes/mongo.exporter';
import { Entry } from './scrappers/scrapper.interface';

class Application {
    public main() : void {
        const logger = winston.createLogger({
            transports: [
              new winston.transports.Console()
            ]
          });


        const scrapperRunner = new ScrapperRunner([
            new Yad2Scrapper(logger)
        ]);

        scrapperRunner.scrape({
            city: "herzeliya",
            rooms: {
                from: 2,
                to: 3
            },
            price: {
                from: 3000,
                to: 5000
            },
            entryDate: '1-8-2019'
        }).then((entries: Entry[]) => {
            let mongoExporter = new MongoExporter("mongodb://localhost:27017/rentals");
            mongoExporter.export(entries);
        });

    }
}

const application = new Application();
application.main();
