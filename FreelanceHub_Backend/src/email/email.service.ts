import { Injectable } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class EmailService {
  private readonly client: SibApiV3Sdk.TransactionalEmailsApi;

  constructor() {
    const apiKey = process.env.BREVO_API_KEY;
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;

    this.client = new SibApiV3Sdk.TransactionalEmailsApi();
  }

  async sendVerificationEmail(to: string, link: string) {
    try {
      console.log(`📧 Sending verification email to: ${to}`);
      console.log(`🔗 Link: ${link}`);

      const response = await this.client.sendTransacEmail({
        sender: { name: 'Freelance Hub', email: 'sahar.h.z1987@gmail.com' },
        to: [{ email: to }],
        subject: 'Verify your FreelanceHub account',
        htmlContent: `
            <h2>Welcome to FreelanceHub</h2>
            <p>Click below to verify your email address:</p>
            <a href="${link}">Verify My Email</a>
            `,
      });

      console.log('Email sent', response);
    } catch (error) {
      console.error('Failed to send Email:', error);
    }
  }
}
