import { Injectable } from '@nestjs/common';
import mjml2html from 'mjml';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import path from 'path';
import { User } from 'src/users/entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ActivateService {
  private transporter;
  private config;
  constructor(private emailConfigService: ConfigService) {
    this.config = this.emailConfigService.get('email');
    this.transporter = nodemailer.createTransport({
      service: this.config.service,
      port: this.config.smtp.port,
      auth: {
        user: this.config.smtp.user,
        pass: this.config.smtp.pass,
      },
    });
  }

  async sendActivationEmail(user: User, token: string) {
    try {
      const activationLink = this.config.activateUrL(token);

      const mailOptions = {
        from: this.config.smtp.user,
        to: user.email,
        subject: 'GraphicsUtils - Account Activation',
        text: `Click the following link to activate your account: ${activationLink}`,
        html: this.generateActivationEmailHtml(activationLink),
      };
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
    }
  }

  private getMjmlTemplate() {
    const templatePath = path.join(
      process.cwd(),
      this.config.templatePaths.activate,
    );
    return fs.readFileSync(templatePath, 'utf8');
  }
  private generateActivationEmailHtml(activationLink: string) {
    const mjmlTemplate = this.getMjmlTemplate();
    const replacedTemplate = mjmlTemplate.replace(
      /\${activationLink}/g,
      activationLink,
    );

    return mjml2html(replacedTemplate).html;
  }
}
