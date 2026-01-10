import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WaitlistEmailRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WaitlistEmailRequest = await req.json();

    if (!email) {
      console.error("Missing email in request");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending waitlist confirmation to: ${email}`);

    const displayName = name || "Sahabat";

    const emailHtml = `
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
              Assalamu'alaikum, ${displayName}! 👋
            </h2>
            
            <p style="margin: 0 0 16px; color: #4b5563; line-height: 1.6;">
              Alhamdulillah, kamu sudah resmi masuk waitlist <strong>Averroes</strong>! Kami sangat senang kamu tertarik dengan perjalanan investasi crypto yang sesuai syariah.
            </p>
            
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                <strong>🚀 Apa yang akan kamu dapatkan?</strong>
              </p>
              <ul style="margin: 12px 0 0; padding-left: 20px; color: #047857; font-size: 14px; line-height: 1.8;">
                <li>Akses pertama ke beta Averroes</li>
                <li>Screener syariah untuk crypto</li>
                <li>Kalkulator zakat otomatis</li>
                <li>Edukasi fiqh muamalah</li>
              </ul>
            </div>
            
            <p style="margin: 0 0 16px; color: #4b5563; line-height: 1.6;">
              Kami akan menghubungi kamu segera setelah Averroes siap diluncurkan. Sambil menunggu, jangan lupa bagikan kabar baik ini ke teman-temanmu!
            </p>
            
            <!-- Share Button -->
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://wa.me/?text=Aku%20baru%20daftar%20waitlist%20Averroes%20-%20aplikasi%20crypto%20syariah%20%26%20keuangan%20Islami!%20Yuk%20daftar%20juga%3A%20https%3A%2F%2Faverroes.app" 
                 style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                📤 Bagikan ke Teman
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© 2024 Averroes. Crypto Syariah & Keuangan Islami.</p>
            <p style="margin: 8px 0 0;">
              Email ini dikirim karena kamu mendaftar waitlist di averroes.app
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend REST API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Averroes <onboarding@resend.dev>",
        to: [email],
        subject: "✅ Kamu Sudah Masuk Waitlist Averroes!",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending waitlist email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
