import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailTemplate {
  subject: string;
  greeting: string;
  mainMessage: string;
  updateTitle: string;
  updates: string[];
  closingMessage: string;
  ctaText: string;
}

interface ReminderRequest {
  daysOld?: number;
  maxReminders?: number;
  template?: EmailTemplate;
}

const defaultTemplate: EmailTemplate = {
  subject: "🌟 Update Averroes - Kabar Terbaru untuk Kamu!",
  greeting: "Hai {{name}}! 👋",
  mainMessage: "Sudah {{days}} hari sejak kamu bergabung di waitlist Averroes! Kami ingin memberikan update terbaru tentang perkembangan kami.",
  updateTitle: "🔥 Update Terbaru",
  updates: [
    "Tim kami terus mengembangkan fitur screener syariah",
    "Kalkulator zakat crypto sedang dalam tahap akhir",
    "Konten edukasi fiqh muamalah akan segera hadir",
  ],
  closingMessage: "Kami sangat menghargai kesabaranmu! Sebagai early adopter, kamu akan mendapat akses prioritas dan benefit eksklusif saat Averroes resmi diluncurkan.",
  ctaText: "📤 Ajak Teman Gabung",
};

const generateEmailHtml = (template: EmailTemplate, displayName: string, daysSinceSignup: number): string => {
  const greeting = template.greeting.replace("{{name}}", displayName).replace("{{days}}", String(daysSinceSignup));
  const mainMessage = template.mainMessage.replace("{{name}}", displayName).replace("{{days}}", String(daysSinceSignup));

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
          
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>${template.updateTitle}</strong>
            </p>
            <ul style="margin: 12px 0 0; padding-left: 20px; color: #b45309; font-size: 14px; line-height: 1.8;">
              ${updatesHtml}
            </ul>
          </div>
          
          <p style="margin: 0 0 16px; color: #4b5563; line-height: 1.6;">
            ${template.closingMessage}
          </p>
          
          <!-- Share Button -->
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://wa.me/?text=Masih%20nunggu%20Averroes%20-%20aplikasi%20crypto%20syariah%20%26%20keuangan%20Islami!%20Sudah%20daftar%20belum%3F%20https%3A%2F%2Faverroes.app" 
               style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
              ${template.ctaText}
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 24px;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
              Tetap semangat, tim Averroes terus bekerja untuk kamu! 💚
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
    const { daysOld = 7, maxReminders = 3, template }: ReminderRequest = await req.json().catch(() => ({}));
    const emailTemplate = template || defaultTemplate;

    console.log(`Sending reminders to users who signed up ${daysOld}+ days ago`);

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysOld);

    const { data: eligibleUsers, error: fetchError } = await supabase
      .from("waitlist")
      .select("*")
      .lt("created_at", thresholdDate.toISOString())
      .or(`last_reminder_at.is.null,last_reminder_at.lt.${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`)
      .lt("reminder_count", maxReminders)
      .order("created_at", { ascending: true });

    if (fetchError) {
      console.error("Error fetching eligible users:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${eligibleUsers?.length || 0} eligible users for reminder`);

    if (!eligibleUsers || eligibleUsers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No eligible users for reminder" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const user of eligibleUsers) {
      const displayName = user.name || "Sahabat";
      const daysSinceSignup = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));

      const emailHtml = generateEmailHtml(emailTemplate, displayName, daysSinceSignup);
      const subject = emailTemplate.subject.replace("{{name}}", displayName).replace("{{days}}", String(daysSinceSignup));

      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Averroes <onboarding@resend.dev>",
            to: [user.email],
            subject: subject,
            html: emailHtml,
          }),
        });

        if (!emailRes.ok) {
          const errorData = await emailRes.text();
          console.error(`Failed to send reminder to ${user.email}:`, errorData);
          errors.push(`${user.email}: ${errorData}`);
          continue;
        }

        const { error: updateError } = await supabase
          .from("waitlist")
          .update({
            last_reminder_at: new Date().toISOString(),
            reminder_count: (user.reminder_count || 0) + 1,
          })
          .eq("id", user.id);

        if (updateError) {
          console.error(`Failed to update reminder tracking for ${user.email}:`, updateError);
        }

        sentCount++;
        console.log(`Sent reminder to ${user.email} (reminder #${(user.reminder_count || 0) + 1})`);
      } catch (emailError: any) {
        console.error(`Error sending to ${user.email}:`, emailError);
        errors.push(`${user.email}: ${emailError.message}`);
      }
    }

    console.log(`Reminder emails sent: ${sentCount}/${eligibleUsers.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount, 
        total: eligibleUsers.length,
        errors: errors.length > 0 ? errors : undefined 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-waitlist-reminder:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
