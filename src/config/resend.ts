import { Resend } from "resend";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { env } from "./env";

// Initialize Resend client
const resend = new Resend(env.RESEND_API_KEY);

// Email data interface
interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

/**
 * Send email using Resend
 * @param data - Email data including recipient, subject, and HTML content
 */
async function sendmail(data: EmailData): Promise<void> {
  try {
    const result = await resend.emails.send({
      from: `Eve <${env.EMAIL_FROM}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text || "Hello from Eve",
    });

    if (result.error) {
      console.error("Error sending email:", result.error);
      throw new Error(`Failed to send email: ${JSON.stringify(result.error)}`);
    }

    console.log("Message sent successfully. Email ID:", result.data?.id);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error sending email: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Send email using Handlebars template
 * @param context - Template context variables
 * @param email - Recipient email address
 * @param subject - Email subject
 * @param templateName - Name of the template file (without .hbs extension)
 */
export async function sendEmail(
  context: any,
  email: string,
  subject: string,
  templateName: string
): Promise<void> {
  try {
    // Resolve template path
    const templatePath = path.join(
      __dirname,
      `../hbs/${templateName}.hbs`
    );

    // Check if template file exists
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templatePath}`);
    }

    // Read and compile template
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);
    const html = template(context);

    // Prepare email data
    const emailData: EmailData = {
      to: email,
      text: "Hello from Eve",
      subject: subject,
      html,
    };

    // Send email
    await sendmail(emailData);
  } catch (error) {
    console.error("Error in sendEmail:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error sending email"
    );
  }
}
