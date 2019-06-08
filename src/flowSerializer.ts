import { Logger } from "winston";
import { IScraper, IScraperOptions } from "./interfaces/scrapper.interface";
import { Yad2Scraper } from "./steps/yad2.scraper";
import { ITransformer } from "./transformer/transformer.interface";
import { Entry } from "./interfaces/entry";
import { MoovitTransformer } from "./transformer/moovit.transformers";
import { GoogleMapsTransformer } from "./transformer/googleMaps.transformer";
import { MailExporter } from "./steps/mail.exporter";
import { MongoExporter } from "./steps/mongo.exporter";
import { IFlow } from "./flowRunner";
import { ExcelExporter } from "./steps/excel.exporter";

export interface IFlowConfiguration {
    options: IScraperOptions,
    scrapers: {
        type: string,
        options?: any
    }[],
    transformers: { 
        type: string, 
        options?: any 
    }[],
    exporters: {
        type: string,
        options?: any
    }[]
}

export class FlowSerializer {
    constructor(private _logger: Logger) {}

    public deserialize(config: IFlowConfiguration) {
        let scrapers: {[sourceName: string]: IScraper} = {};
        for (const scraperConfig of config.scrapers) {
            switch(scraperConfig.type.toLowerCase()) {
                case "yad2": scrapers[scraperConfig.type.toLowerCase()] = new Yad2Scraper(this._logger); break;
            }
        }

        let transformers: ITransformer<Entry[]>[] = [];
        for (const transformerConfig of config.transformers) {
            switch(transformerConfig.type.toLowerCase()) {
                case "moovit": transformers.push(new MoovitTransformer()); break;
                case "google": transformers.push(new GoogleMapsTransformer()); break;
            }
        }

        let exporters: IExporter[] = [];
        for (const exporterConfig of config.exporters) {
            switch(exporterConfig.type.toLowerCase()) {
                case "mail": exporters.push(new MailExporter(this._logger)); break;
                case "mongo": exporters.push(new MongoExporter(this._logger)); break;
                case "excel": exporters.push(new ExcelExporter(this._logger))
            }
        }

        return <IFlow>{
            options: config.options,
            scrapers: scrapers,
            transformers: transformers,
            exporters: exporters
        }
    }
}