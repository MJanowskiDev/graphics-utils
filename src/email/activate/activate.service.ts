import { Injectable } from '@nestjs/common';
import mjml2html from 'mjml';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import path from 'path';
import { User } from 'src/users/entity';

@Injectable()
export class ActivateService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendActivationEmail(user: User, token: string) {
    const activationLink = `${process.env.FRONTEND_URL}/activate?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'GraphicsUtils - Account Activation',
      text: `Click the following link to activate your account: ${activationLink}`,
      html: this.generateActivationEmailHtml(activationLink),
    };

    return this.transporter.sendMail(mailOptions);
  }

  private getMjmlTemplate() {
    const templatePath = path.join(
      process.cwd(),
      './emailTemplates/activationEmail.mjml',
    );
    return fs.readFileSync(templatePath, 'utf8');
  }
  private generateActivationEmailHtml(activationLink: string) {
    const mjmlTemplate = this.getMjmlTemplate();
    const replacedTemplate = mjmlTemplate.replace(
      /\${activationLink}/g,
      activationLink,
    );

    const { html } = mjml2html(replacedTemplate, {
      minify: true,
    });

    return html;
  }
}
