import { Injectable, InternalServerErrorException } from '@nestjs/common';
import mjml2html from 'mjml';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthEmailService {
  private transporter;
  private config;

  constructor(private emailConfigService: ConfigService) {
    this.config = this.emailConfigService.get('email');
    console.log(this.config.activateUrl);
    this.transporter = nodemailer.createTransport({
      service: this.config.service,
      port: this.config.smtp.port,
      auth: {
        user: this.config.smtp.user,
        pass: this.config.smtp.pass,
      },
    });
  }

  async sendActivationEmail(email: string, token: string) {
    try {
      const activationLink = `${this.config.activateUrl}${token}`;

      const html = mjml2html(this.getMjmlTemplate(this.config.templatePaths.activate)).html.replace(/\${activationLink}/g, activationLink);

      return await this.transporter.sendMail({
        from: this.config.smtp.user,
        to: email,
        subject: 'GraphicsUtils - Account Activation',
        text: `Click the following link to activate your account: ${activationLink}`,
        html,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendWelcomeEmail(email: string) {
    try {
      const { html } = mjml2html(this.getMjmlTemplate(this.config.templatePaths.welcome));
      return await this.transporter.sendMail({
        from: this.config.smtp.user,
        to: email,
        subject: 'GraphicsUtils - Account has been activated',
        text:
          `Congratulations! Your account has been successfully activated.` +
          `Welcome to GraphicsUtils! You can now log in and start using our services.`,
        html,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error while sending email. Please try again later');
    }
  }

  async verifyEmailService() {
    try {
      return await this.transporter.verify();
    } catch (error) {
      throw new InternalServerErrorException('Error while sending email. Please try again later');
    }
  }

  private getMjmlTemplate(templatePath: string) {
    const resultPath = path.join(process.cwd(), templatePath);
    return fs.readFileSync(resultPath, 'utf8');
  }
}
