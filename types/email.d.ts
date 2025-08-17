declare module 'nodemailer' {
  export interface MailAddress {
    name?: string
    address: string
  }

  export interface SendMailOptions {
    from?: string | MailAddress
    to?: string | MailAddress | Array<string | MailAddress>
    subject?: string
    text?: string
    html?: string
    attachments?: Array<{
      filename?: string
      content?: string | Buffer
      path?: string
      contentType?: string
    }>
  }

  export interface SentMessageInfo {
    messageId: string
    envelope: {
      from: string
      to: string[]
    }
    accepted: string[]
    rejected: string[]
    pending: string[]
    response: string
  }

  export interface Transport {
    sendMail(mailOptions: SendMailOptions): Promise<SentMessageInfo>
    verify(): Promise<boolean>
  }

  export interface Transporter {
    sendMail(mailOptions: SendMailOptions): Promise<SentMessageInfo>
    verify(): Promise<boolean>
  }

  export function createTransport(options: any): Transporter
}

declare module 'nodemailer/lib/mailer' {
  export interface MailAddress {
    name?: string
    address: string
  }

  export interface SendMailOptions {
    from?: string | MailAddress
    to?: string | MailAddress | Array<string | MailAddress>
    subject?: string
    text?: string
    html?: string
    attachments?: Array<{
      filename?: string
      content?: string | Buffer
      path?: string
      contentType?: string
    }>
  }

  export interface SentMessageInfo {
    messageId: string
    envelope: {
      from: string
      to: string[]
    }
    accepted: string[]
    rejected: string[]
    pending: string[]
    response: string
  }

  export interface Transporter {
    sendMail(mailOptions: SendMailOptions): Promise<SentMessageInfo>
    verify(): Promise<boolean>
  }

  export default class Mailer implements Transporter {
    constructor(options: any)
    sendMail(mailOptions: SendMailOptions): Promise<SentMessageInfo>
    verify(): Promise<boolean>
  }
}

declare module 'nodemailer/lib/smtp-transport' {
  export interface SMTPTransportOptions {
    host?: string
    port?: number
    secure?: boolean
    auth?: {
      user: string
      pass: string
    }
    tls?: {
      rejectUnauthorized?: boolean
    }
  }

  export default class SMTPTransport {
    constructor(options: SMTPTransportOptions)
  }
}

