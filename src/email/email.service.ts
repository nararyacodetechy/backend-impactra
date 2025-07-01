import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    constructor(private configService: ConfigService) {}
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: this.configService.get('EMAIL_USER'),
            pass: this.configService.get('EMAIL_PASS'),
        },
    });

    async sendVerificationEmail(to: string, verifyUrl: string) {
    
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #22c55e;">Welcome to Impactra 🌿</h2>
          <p>Hello,</p>
          <p>Thank you for registering with <strong>Impactra</strong>. Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" 
             style="display: inline-block; padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
             Verify Email
          </a>
          <p style="margin-top: 20px;">Or you can copy and paste this URL into your browser:</p>
          <code style="display: block; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${verifyUrl}</code>
          <hr style="margin-top: 40px;">
          <p style="font-size: 12px; color: #888;">If you did not create an account, please ignore this email.</p>
        </div>
      `;
    
      try {
        await this.transporter.sendMail({
          from: '"Impactra" <impactra.noreply@gmail.com>',
          to,
          subject: 'Verify your Impactra account',
          html: htmlContent,
        });
      } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        throw new InternalServerErrorException({
          status: 'error',
          message: 'Failed to send verification email. Please try again later.',
          debug: error.message, // Hapus di production
        });
      }
    }    

  async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    await transporter.sendMail({
      from: `"Impactra" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
  
}

