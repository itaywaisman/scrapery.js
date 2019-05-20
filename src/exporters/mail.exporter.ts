import { IExporter } from "./exporter.interface";
import { Entry } from "../scrappers/scrapper.interface";

import * as nodemailer from 'nodemailer';
import {authData} from './gmail.keys';

export class MailExporter implements IExporter {


    
    public async export(entries: Entry[]): Promise<void> {

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
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<p>${JSON.stringify(entries)}</p>` // html body
          });
        
          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
    
}