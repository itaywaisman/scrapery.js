import { IExporter } from "./exporter.interface";

import * as nodemailer from 'nodemailer';
import {authData} from './gmail.keys';
import { Entry } from "../models/entry";
import { ExcelTransformer } from "../transformer/excel.transformer";

export class MailExporter implements IExporter {


    
    public async export(entries: Entry[]): Promise<void> {

        let excelTransformer = new ExcelTransformer();
        let excel = excelTransformer.transform(entries);

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: authData.user, // generated ethereal user
              pass: authData.pass // generated ethereal password
            }
          });
        
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"Itay Waisman" <itay.waisman@gmail.com>', // sender address
            to: "itay.waisman@gmail.com, shanishalom10@gmail.com", // list of receivers
            subject: `דו"ח יומי - דירות להשכרה`, // Subject line
            text: "קיבלתם מודעות חדשות מרחבי האינטרנט. מצורף קובץ א", // plain text body
            html: `<p>קיבלתם מודעות חדשות מרחבי האינטרנט! מצורף קובץ אקסל.</p>`, // html body,
            attachments: [
              {
                  filename: 'report.xlsx',
                  content: excel
              }
            ]
          });
        
          console.log("Message sent: %s", info.messageId);
    }
    
}