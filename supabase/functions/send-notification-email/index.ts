import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationTemplate {
  subject: string;
  greeting: string;
  mainMessage: string;
  updateTitle: string;
  updates: string[];
  closingMessage: string;
  ctaText: string;
  ctaUrl: string;
}

interface NotificationRequest {
  template: NotificationTemplate;
  recipientIds: string[];
}

const generateEmailHtml = (template: NotificationTemplate, displayName: string): string => {
  const greeting = template.greeting.replace("{{name}}", displayName);
  const mainMessage = template.mainMessage.replace("{{name}}", displayName);

  const updatesHtml = template.updates
    .map((update) => `<li>${update}</li>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8faf9;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #34d399 100%); border-radius: 16px; line-height: 60px; font-size: 28px; font-weight: bold; color: white;">
            A
          </div>
          <h1 style="margin: 16px 0 0; color: #1a1a1a; font-size: 24px;">Averroes</h1>
          <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">Crypto Syariah & Keuangan Islami</p>
        </div>
        
        <!-- Main Card -->
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 20px;">
            ${greeting}
          </h2>
          
          <p style="margin: 0 0 16px; color: #4b5563; line-height: 1.6;">
            ${mainMessage}
          </p>
          
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #065f46; font-size: 14px;">
              <strong>${template.updateTitle}</strong>
            </p>
            <ul style="margin: 12px 0 0; padding-left: 20px; color: #047857; font-size: 14px; line-height: 1.8;">
              ${updatesHtml}
            </ul>
          </div>
          
          <p style="margin: 0 0 16px; color: #4b5563; line-height: 1.6;">
            ${template.closingMessage}
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 24px 0;">
            <a href="${template.ctaUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
              ${template.ctaText}
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 24px;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
              Terima kasih sudah menjadi bagian dari komunitas Averroes! 💚
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">© 2024 Averroes. Crypto Syariah & Keuangan Islami.</p>
          <p style="margin: 8px 0 0;">
            Kamu menerima email ini karena terdaftar di waitlist Averroes
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { template, recipientIds }: NotificationRequest = await req.json();

    if (!template || !recipientIds || recipientIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "Template and recipientIds are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending notification emails to ${recipientIds.length} recipients`);

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch recipients from waitlist
    const { data: recipients, error: fetchError } = await supabase
      .from("waitlist")
      .select("id, email, name")
      .in("id", recipientIds);

    if (fetchError) {
      console.error("Error fetching recipients:", fetchError);
      throw fetchError;
    }

    if (!recipients || recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No recipients found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${recipients.length} recipients`);

    let sentCount = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      const displayName = recipient.name || "Sahabat";
      const emailHtml = generateEmailHtml(template, displayName);
      const subject = template.subject.replace("{{name}}", displayName);

      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Averroes <onboarding@resend.dev>",
            to: [recipient.email],
            subject: subject,
            html: emailHtml,
          }),
        });

        if (!emailRes.ok) {
          const errorData = await emailRes.text();
          console.error(`Failed to send notification to ${recipient.email}:`, errorData);
          errors.push(`${recipient.email}: ${errorData}`);
          continue;
        }

        sentCount++;
        console.log(`Sent notification to ${recipient.email}`);
      } catch (emailError: any) {
        console.error(`Error sending to ${recipient.email}:`, emailError);
        errors.push(`${recipient.email}: ${emailError.message}`);
      }
    }

    console.log(`Notification emails sent: ${sentCount}/${recipients.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount, 
        total: recipients.length,
        errors: errors.length > 0 ? errors : undefined 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-notification-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
