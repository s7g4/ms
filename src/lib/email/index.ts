import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_temp123456789012345678901234");

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  from?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  id?: string;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  from = `Stack Your Scoops <noreply@${process.env.EMAIL_DOMAIN ?? "stackyourscoops.com"}>`,
  replyTo,
}: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      console.error("[sendEmail] Resend error:", error);
      return { error: error.message };
    }

    return { id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[sendEmail] Unexpected error:", message);
    return { error: message };
  }
}
