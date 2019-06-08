import * as nodemailer from 'nodemailer';
import {authData} from '../config/gmail.keys';
import { Logger } from "winston";
import { IStep } from '../interfaces/step.interface';

export interface IMailParameter {
  recipients: string[],
}

export class MailExporter implements IStep{

  constructor(private _logger: Logger) {  }
  

  init(): void {
  }

  async execute(data: Buffer, parameters: IMailParameter): Promise<void> {
    
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
        to: parameters.recipients.join(","), // list of receivers
        // to: "itay.waisman@gmail.com", // list of receivers
        subject: `דו"ח יומי - דירות להשכרה`, // Subject line
        text: "קיבלתם מודעות חדשות מרחבי האינטרנט. מצורף קובץ א", // plain text body
        html: `<p>קיבלתם מודעות חדשות מרחבי האינטרנט! מצורף קובץ אקסל.</p>`, // html body,
        attachments: [
          {
              filename: 'report.xlsx',
              content: data
          }
        ]
      });
    
      this._logger.info("sent email", info);
  }    
}