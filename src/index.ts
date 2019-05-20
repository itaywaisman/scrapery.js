
import * as winston from 'winston';
import { ScrapersRunner } from "./scrapersRunner";
import { Yad2Scraper } from "./scrappers/yad2.scraper";
// import { MongoExporter } from './exporters/mongo.exporter';
import { Entry } from './scrappers/scrapper.interface';
import { MailExporter } from './exporters/mail.exporter';

async function main() : Promise<void> {
    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console()
        ]
        });


    const scrapperRunner = new ScrapersRunner([
        new Yad2Scraper(logger)
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
        // let mongoExporter = new MongoExporter("mongodb://localhost:27017/rentals", logger);
        // mongoExporter.export(entries);
        let mailExporter = new MailExporter();
        mailExporter.export(entries);
    });

}

main().catch(console.error);
