import { registerAs } from '@nestjs/config';
export default registerAs('email', () => ({
  smtp: { port: 587, user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  service: 'gmail',
  templatePaths: {
    activate: './emailTemplates/activationEmail.mjml',
  },
  activateUrL: (token: string) =>
    `${process.env.FRONTEND_URL}/auth/activate?token=${token}`,
}));
