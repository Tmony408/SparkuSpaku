import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { env } from "./env";

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

function createTransporter() {
  const port = Number(env.SMTP_PORT || 587);
  const secure = String(env.SMTP_SECURE || "false") === "true";

  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new Error("Missing SMTP env vars: SMTP_HOST, SMTP_USER, SMTP_PASS");
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });
}

async function sendmail(data: EmailData): Promise<void> {
  try {
    const transporter = createTransporter();

    const from = `Eve <${env.EMAIL_FROM}>`;
    if (!env.EMAIL_FROM) throw new Error("EMAIL_FROM is missing");

    const info = await transporter.sendMail({
      from,
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text || "Hello from Eve"
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(
      `Error sending email: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function sendEmail(
  context: any,
  email: string,
  subject: string,
  templateName: string
): Promise<void> {
  try {
    const templatePath = path.join(__dirname, `../hbs/${templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templatePath}`);
    }

    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);
    const html = template(context);

    const emailData: EmailData = {
      to: email,
      subject,
      text: "Hello from Eve",
      html
    };

    await sendmail(emailData);
  } catch (error) {
    console.error("Error in sendEmail:", error);
    throw new Error(error instanceof Error ? error.message : "Error sending email");
  }
}