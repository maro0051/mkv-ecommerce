// Supabase Edge Function for sending emails via Resend

// @ts-ignore: Deno remote module import may not be resolved by TypeScript in some editors
import { serve } from "https://deno.land/std@0.203.0/http/server.ts"

declare const Deno: {
  env: {
    get(key: string): string | undefined
  }
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || ""
const ADMIN_EMAIL = "manassekilembi@gmail.com"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { type, to, data } = body

    console.log(`📧 Processing email type: ${type}`)
    console.log(`📧 Sending to: ${to}`)

    let subject = ''
    let html = ''

    // Choose template based on email type
    switch (type) {
      case 'welcome':
        subject = '✨ Welcome to M.K.V - Your Exclusive Offer Inside!'
        html = welcomeTemplate()
        break
      
      case 'contact':
        subject = `📬 New Contact: ${data?.name || 'Unknown'}`
        html = contactTemplate(data)
        break
      
      case 'order_confirmation':
        subject = `🎉 Order Confirmed - #${data?.orderNumber || 'N/A'}`
        html = orderConfirmationTemplate(data)
        break
      
      case 'admin_order':
        subject = `💰 New Order #${data?.orderNumber || 'N/A'} - $${data?.total || '0'}`
        html = adminOrderTemplate(data)
        break
      
      default:
        throw new Error(`Unknown email type: ${type}`)
    }

    // Send via Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'M.K.V Store <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    const responseData = await res.json()

    if (!res.ok) {
      console.error('Resend API error:', responseData)
      throw new Error(responseData.message || 'Failed to send email')
    }

    console.log('✅ Email sent successfully!')
    console.log('Email ID:', responseData.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: responseData.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error'

    console.error('❌ Error:', errorMessage)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// ===== EMAIL TEMPLATES =====

function welcomeTemplate() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0F172A, #1e293b); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="display: inline-block; background: #D4AF37; padding: 10px 20px; border-radius: 8px; margin-bottom: 20px;">
        <span style="color: #0F172A; font-size: 28px; font-weight: bold; letter-spacing: 2px;">M.K.V</span>
      </div>
      <h1 style="color: #ffffff; margin: 20px 0 10px; font-size: 28px; font-family: Georgia, serif;">Welcome to the Family!</h1>
      <p style="color: #94a3b8; font-size: 16px; margin: 0;">You're now part of our exclusive community</p>
    </div>
    
    <!-- Body -->
    <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e2e8f0; border-radius: 0 0 16px 16px; text-align: center;">
      
      <p style="font-size: 48px; margin: 0 0 20px;">🎁</p>
      
      <h2 style="color: #0F172A; font-size: 24px; margin: 0 0 10px; font-family: Georgia, serif;">
        Here's 10% Off Your First Order!
      </h2>
      
      <p style="color: #64748b; font-size: 16px; margin: 0 0 20px; line-height: 1.6;">
        As a welcome gift, enjoy 10% off on your first purchase.
        <br>Use the code below at checkout:
      </p>
      
      <!-- Discount Code Box -->
      <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 2px dashed #D4AF37; display: inline-block; margin: 10px 0 20px;">
        <span style="font-size: 32px; color: #D4AF37; font-weight: bold; letter-spacing: 4px; font-family: monospace;">WELCOME10</span>
      </div>
      
      <p style="color: #94a3b8; font-size: 13px; margin: 0 0 30px;">
        Valid for 30 days on your first purchase • Cannot be combined with other offers
      </p>
      
      <!-- CTA Button -->
      <a href="#" style="display: inline-block; background: #D4AF37; color: #0F172A; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">
        Start Shopping Now →
      </a>
      
      <!-- Categories -->
      <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px; margin: 0 0 15px;">Explore our collections:</p>
        <table style="width: 100%;">
          <tr>
            <td style="text-align: center; padding: 5px;">
              <span style="color: #0F172A; font-size: 14px;">⌚ Watches</span>
            </td>
            <td style="text-align: center; padding: 5px;">
              <span style="color: #0F172A; font-size: 14px;">👕 Sportswear</span>
            </td>
            <td style="text-align: center; padding: 5px;">
              <span style="color: #0F172A; font-size: 14px;">👜 Bags</span>
            </td>
            <td style="text-align: center; padding: 5px;">
              <span style="color: #0F172A; font-size: 14px;">💎 Perfumes</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px;">
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        M.K.V Store • 123 Luxury Lane, Fashion District
        <br>
        <a href="#" style="color: #64748b;">Unsubscribe</a> • 
        <a href="#" style="color: #64748b;">Privacy Policy</a>
      </p>
      <p style="color: #cbd5e1; font-size: 11px; margin: 10px 0 0;">
        © 2024 M.K.V. All rights reserved.
      </p>
    </div>
    
  </div>
</body>
</html>
  `
}

function contactTemplate(data: any) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: #0F172A; padding: 30px; border-radius: 16px 16px 0 0;">
      <div style="display: inline-block; background: #D4AF37; padding: 8px 16px; border-radius: 6px; margin-bottom: 15px;">
        <span style="color: #0F172A; font-weight: bold; font-size: 14px;">M.K.V</span>
      </div>
      <h2 style="color: #ffffff; margin: 0; font-family: Georgia, serif;">📬 New Contact Form Submission</h2>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 14px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0F172A; width: 100px;">Name</td>
          <td style="padding: 14px; border-bottom: 1px solid #e2e8f0; color: #334155;">${data?.name || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 14px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0F172A;">Email</td>
          <td style="padding: 14px; border-bottom: 1px solid #e2e8f0; color: #334155;">
            <a href="mailto:${data?.email}" style="color: #D4AF37; text-decoration: none;">${data?.email || 'N/A'}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0F172A;">Date</td>
          <td style="padding: 14px; border-bottom: 1px solid #e2e8f0; color: #334155;">${new Date().toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 14px; font-weight: bold; color: #0F172A; vertical-align: top;">Message</td>
          <td style="padding: 14px; color: #334155; line-height: 1.6;">${data?.message || 'No message'}</td>
        </tr>
      </table>
    </div>
    
  </div>
</body>
</html>
  `
}

function orderConfirmationTemplate(data: any) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: #0F172A; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: #D4AF37; margin: 0; font-family: Georgia, serif;">Thank You!</h1>
      <p style="color: #94a3b8; margin: 10px 0 0;">Order #${data?.orderNumber || 'N/A'}</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
      <h2 style="color: #0F172A; margin: 0 0 20px;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background: #f8fafc;">
          <th style="padding: 12px; text-align: left; color: #0F172A; font-size: 14px;">Item</th>
          <th style="padding: 12px; text-align: center; color: #0F172A; font-size: 14px;">Qty</th>
          <th style="padding: 12px; text-align: right; color: #0F172A; font-size: 14px;">Price</th>
        </tr>
        ${data?.items?.map((item: any) => `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px; color: #334155;">${item.name}</td>
            <td style="padding: 12px; text-align: center; color: #334155;">${item.quantity}</td>
            <td style="padding: 12px; text-align: right; color: #334155;">$${item.price}</td>
          </tr>
        `).join('') || ''}
      </table>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: right;">
        <span style="font-size: 20px; font-weight: bold; color: #D4AF37;">Total: $${data?.total || '0'}</span>
      </div>
    </div>
    
  </div>
</body>
</html>
  `
}

function adminOrderTemplate(data: any) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: #D4AF37; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: #0F172A; margin: 0; font-family: Georgia, serif;">💰 New Order!</h1>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 14px; font-weight: bold; color: #0F172A;">Order Number</td>
          <td style="padding: 14px; color: #D4AF37; font-weight: bold;">#${data?.orderNumber || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 14px; font-weight: bold; color: #0F172A;">Customer</td>
          <td style="padding: 14px; color: #334155;">${data?.customerName || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 14px; font-weight: bold; color: #0F172A;">Total</td>
          <td style="padding: 14px; color: #D4AF37; font-size: 18px; font-weight: bold;">$${data?.total || '0'}</td>
        </tr>
        <tr>
          <td style="padding: 14px; font-weight: bold; color: #0F172A;">Items</td>
          <td style="padding: 14px; color: #334155;">${data?.itemCount || 0} items</td>
        </tr>
      </table>
    </div>
    
  </div>
</body>
</html>
  `
}