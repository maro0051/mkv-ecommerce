// ============================================
// EMAIL SERVICE - Brevo API
// Complete notification system for customers & admin
// ============================================

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'Mkvisionbusiness@gmail.com'
const STORE_NAME = 'MK Vision Services'
const STORE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://mkholding.group'

/**
 * Base send email function
 */
const sendEmail = async ({ to, toName, subject, htmlContent, replyTo }) => {
  if (!BREVO_API_KEY) {
    console.warn('⚠️ Brevo API key not configured. Email not sent.')
    console.log('Would send:', { to, subject })
    return { success: false, error: 'API key not configured' }
  }

  try {
    console.log('📧 Sending email:', to, '|', subject)

    const body = {
      sender: { name: STORE_NAME, email: ADMIN_EMAIL },
      to: [{ email: to, name: toName || to }],
      subject: subject,
      htmlContent: htmlContent
    }

    if (replyTo) body.replyTo = { email: replyTo }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Email sent! ID:', data.messageId)
      return { success: true, messageId: data.messageId }
    } else {
      console.error('❌ Brevo error:', data)
      return { success: false, error: data.message }
    }
  } catch (error) {
    console.error('❌ Email failed:', error.message)
    return { success: false, error: error.message }
  }
}

// ============================================
// BASE HTML TEMPLATE
// ============================================
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8f9fa;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    
    <!-- Header -->
    <div style="background:#0F172A;padding:30px;border-radius:16px 16px 0 0;text-align:center;">
      <div style="display:inline-block;background:#D4AF37;padding:10px 20px;border-radius:8px;margin-bottom:12px;">
        <span style="color:#0F172A;font-size:26px;font-weight:bold;">M.K.V</span>
      </div>
      <p style="color:#94a3b8;font-size:12px;margin:0;letter-spacing:3px;">LUXURY COLLECTION</p>
    </div>
    
    <!-- Content -->
    ${content}
    
    <!-- Footer -->
    <div style="text-align:center;padding:25px 20px;">
      <p style="color:#64748b;font-size:13px;margin:0 0 5px;font-weight:bold;">${STORE_NAME}</p>
      <p style="color:#94a3b8;font-size:11px;margin:0 0 3px;">251 Windmill, Halifax, NS B3A 4P2, Canada</p>
      <p style="color:#94a3b8;font-size:11px;margin:0 0 3px;">📞 +1 418 490 1884 • 📧 ${ADMIN_EMAIL}</p>
      <div style="margin-top:15px;">
        <a href="${STORE_URL}" style="color:#D4AF37;text-decoration:none;font-size:11px;">Visit our store</a>
      </div>
      <p style="color:#cbd5e1;font-size:10px;margin:15px 0 0;">© ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`

// ============================================
// ORDER SUMMARY TABLE COMPONENT
// ============================================
const orderItemsTable = (items) => {
  const rows = items.map(i => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:14px;">${i.name}</td>
      <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;color:#334155;font-size:14px;">${i.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;color:#334155;font-size:14px;">C$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <table style="width:100%;border-collapse:collapse;margin:15px 0;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="padding:10px;text-align:left;color:#0F172A;font-size:12px;text-transform:uppercase;">Item</th>
          <th style="padding:10px;text-align:center;color:#0F172A;font-size:12px;text-transform:uppercase;">Qty</th>
          <th style="padding:10px;text-align:right;color:#0F172A;font-size:12px;text-transform:uppercase;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `
}

const orderSummaryBox = (order) => `
  <div style="text-align:center;padding:16px;background:#f8fafc;border-radius:10px;margin:20px 0;">
    <p style="color:#64748b;font-size:11px;margin:0 0 4px;letter-spacing:1px;text-transform:uppercase;">Order Number</p>
    <p style="color:#D4AF37;font-size:22px;font-weight:bold;margin:0;letter-spacing:2px;">${order.order_number}</p>
    <p style="color:#0F172A;font-size:20px;font-weight:bold;margin:12px 0 0;">C$${Number(order.total).toFixed(2)}</p>
  </div>
`

// ============================================
// 1. CUSTOMER - ORDER PLACED
// ============================================
export const sendOrderPlacedEmail = async (customerEmail, customerName, order) => {
  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:56px;margin-bottom:10px;">🎉</div>
        <h1 style="color:#0F172A;font-size:24px;margin:0 0 8px;">Order Received!</h1>
        <p style="color:#64748b;font-size:15px;margin:0;">Thank you, ${customerName}!</p>
      </div>

      ${orderSummaryBox(order)}
      ${orderItemsTable(order.items || [])}

      <div style="background:#fef3c7;padding:20px;border-radius:10px;border-left:4px solid #D4AF37;margin:20px 0;">
        <h3 style="color:#0F172A;font-size:15px;margin:0 0 10px;">💳 Complete Your Payment</h3>
        <p style="color:#334155;font-size:14px;margin:0 0 8px;">
          Send payment to confirm your order:
        </p>
        <p style="color:#0F172A;font-size:15px;margin:5px 0;font-weight:bold;">
          ${order.payment_method === 'paypal' 
            ? '💙 PayPal: manassekilembi@gmail.com' 
            : '🏦 Interac: Mkvisionbusiness@gmail.com'}
        </p>
        <p style="color:#64748b;font-size:13px;margin:8px 0 0;">
          ⚠️ Reference: <strong>${order.order_number}</strong>
        </p>
      </div>

      <p style="color:#64748b;font-size:13px;margin:20px 0 0;text-align:center;">
        We'll notify you once payment is confirmed. 🛍️
      </p>
    </div>
  `

  return sendEmail({
    to: customerEmail,
    toName: customerName,
    subject: `🎉 Order Received #${order.order_number} — C$${Number(order.total).toFixed(2)}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 2. ADMIN - NEW ORDER ALERT
// ============================================
export const sendAdminNewOrderAlert = async (order) => {
  const items = order.items || []
  const itemsList = items.map(i => `• ${i.name} × ${i.quantity} — C$${(i.price * i.quantity).toFixed(2)}`).join('<br>')

  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <div style="background:#D4AF37;padding:20px;border-radius:10px;margin-bottom:20px;text-align:center;">
        <h1 style="color:#0F172A;font-size:22px;margin:0;">💰 NEW ORDER!</h1>
      </div>

      ${orderSummaryBox(order)}

      <h3 style="color:#0F172A;font-size:16px;margin:20px 0 12px;">👤 Customer</h3>
      <div style="background:#f8fafc;padding:15px;border-radius:10px;margin-bottom:20px;">
        <p style="color:#334155;font-size:14px;margin:0 0 6px;"><strong>Name:</strong> ${order.customer_name}</p>
        <p style="color:#334155;font-size:14px;margin:0 0 6px;"><strong>Email:</strong> <a href="mailto:${order.customer_email}" style="color:#D4AF37;">${order.customer_email}</a></p>
        <p style="color:#334155;font-size:14px;margin:0 0 6px;"><strong>Phone:</strong> ${order.customer_phone || 'N/A'}</p>
        <p style="color:#334155;font-size:14px;margin:0;"><strong>Address:</strong> ${order.customer_address}, ${order.customer_city}, ${order.customer_state} ${order.customer_zip}</p>
      </div>

      <h3 style="color:#0F172A;font-size:16px;margin:0 0 12px;">🛍️ Items</h3>
      <div style="background:#f8fafc;padding:15px;border-radius:10px;margin-bottom:20px;">
        <p style="color:#334155;font-size:14px;margin:0;line-height:1.8;">${itemsList}</p>
      </div>

      <div style="background:#e0f2fe;padding:15px;border-radius:10px;margin-bottom:20px;text-align:center;">
        <p style="color:#0369a1;font-size:14px;margin:0;">
          <strong>Payment:</strong> ${order.payment_method === 'paypal' ? '💙 PayPal' : '🏦 Interac e-Transfer'}
        </p>
      </div>

      <div style="text-align:center;">
        <a href="${STORE_URL}/#/admin/orders" style="display:inline-block;background:#0F172A;color:#D4AF37;padding:14px 30px;text-decoration:none;border-radius:10px;font-weight:bold;">
          View in Admin Panel →
        </a>
      </div>
    </div>
  `

  return sendEmail({
    to: ADMIN_EMAIL,
    toName: 'Admin',
    replyTo: order.customer_email,
    subject: `💰 NEW ORDER #${order.order_number} — C$${Number(order.total).toFixed(2)}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 3. CUSTOMER - ORDER CONFIRMED
// ============================================
export const sendOrderConfirmedEmail = async (customerEmail, customerName, order) => {
  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:56px;margin-bottom:10px;">✅</div>
        <h1 style="color:#0F172A;font-size:24px;margin:0 0 8px;">Order Confirmed!</h1>
        <p style="color:#64748b;font-size:15px;margin:0;">Hi ${customerName}, we've received your payment.</p>
      </div>

      <div style="background:#f0fdf4;padding:20px;border-radius:10px;border-left:4px solid #22c55e;margin-bottom:20px;">
        <p style="color:#166534;font-size:14px;margin:0;line-height:1.6;">
          Your order is now confirmed and being prepared. You'll receive a shipping notification soon.
        </p>
      </div>

      ${orderSummaryBox(order)}
      ${orderItemsTable(order.items || [])}

      <p style="color:#64748b;font-size:13px;margin:20px 0 0;text-align:center;">
        Thank you for shopping with M.K.V! 🛍️
      </p>
    </div>
  `

  return sendEmail({
    to: customerEmail,
    toName: customerName,
    subject: `✅ Order Confirmed #${order.order_number}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 4. CUSTOMER - ORDER PROCESSING
// ============================================
export const sendOrderProcessingEmail = async (customerEmail, customerName, order) => {
  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:56px;margin-bottom:10px;">🔄</div>
        <h1 style="color:#0F172A;font-size:24px;margin:0 0 8px;">Order Processing</h1>
        <p style="color:#64748b;font-size:15px;margin:0;">Hi ${customerName}, we're preparing your order.</p>
      </div>

      <div style="background:#eff6ff;padding:20px;border-radius:10px;border-left:4px solid #3b82f6;margin-bottom:20px;">
        <p style="color:#1e40af;font-size:14px;margin:0;line-height:1.6;">
          Your order is being carefully prepared by our team. We'll notify you when it ships!
        </p>
      </div>

      ${orderSummaryBox(order)}

      <p style="color:#64748b;font-size:13px;margin:20px 0 0;text-align:center;">
        Expected shipping within 2-3 business days.
      </p>
    </div>
  `

  return sendEmail({
    to: customerEmail,
    toName: customerName,
    subject: `🔄 Order Processing #${order.order_number}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 5. CUSTOMER - ORDER SHIPPED
// ============================================
export const sendOrderShippedEmail = async (customerEmail, customerName, order) => {
  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:56px;margin-bottom:10px;">🚚</div>
        <h1 style="color:#0F172A;font-size:24px;margin:0 0 8px;">Your Order Has Shipped!</h1>
        <p style="color:#64748b;font-size:15px;margin:0;">Hi ${customerName}, your order is on the way!</p>
      </div>

      <div style="background:#eef2ff;padding:20px;border-radius:10px;border-left:4px solid #6366f1;margin-bottom:20px;">
        <p style="color:#4338ca;font-size:14px;margin:0;line-height:1.6;">
          Your package has been shipped and is heading to you. 
          Delivery usually takes 5-10 business days.
        </p>
      </div>

      <div style="padding:20px;background:#f8fafc;border-radius:10px;margin-bottom:20px;">
        <h3 style="color:#0F172A;font-size:14px;margin:0 0 10px;">📦 Shipping To:</h3>
        <p style="color:#334155;font-size:13px;margin:0;line-height:1.7;">
          ${order.customer_name}<br>
          ${order.customer_address}<br>
          ${order.customer_city}, ${order.customer_state} ${order.customer_zip}
        </p>
      </div>

      ${orderSummaryBox(order)}

      <p style="color:#64748b;font-size:13px;margin:20px 0 0;text-align:center;">
        Track updates at: <a href="${STORE_URL}/#/my-account" style="color:#D4AF37;">My Account</a>
      </p>
    </div>
  `

  return sendEmail({
    to: customerEmail,
    toName: customerName,
    subject: `🚚 Order Shipped #${order.order_number}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 6. CUSTOMER - ORDER DELIVERED
// ============================================
export const sendOrderDeliveredEmail = async (customerEmail, customerName, order) => {
  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:56px;margin-bottom:10px;">📦✨</div>
        <h1 style="color:#0F172A;font-size:24px;margin:0 0 8px;">Order Delivered!</h1>
        <p style="color:#64748b;font-size:15px;margin:0;">Hi ${customerName}, your order has arrived!</p>
      </div>

      <div style="background:#f0fdf4;padding:20px;border-radius:10px;border-left:4px solid #22c55e;margin-bottom:20px;">
        <p style="color:#166534;font-size:14px;margin:0;line-height:1.6;">
          We hope you love your purchase! If you have any questions, 
          just reply to this email.
        </p>
      </div>

      ${orderSummaryBox(order)}

      <div style="text-align:center;padding:18px;background:#fef3c7;border-radius:10px;">
        <p style="color:#92400e;font-size:15px;margin:0 0 10px;">⭐ <strong>Love your order?</strong></p>
        <p style="color:#92400e;font-size:13px;margin:0;">
          Leave us a review and help others discover M.K.V!
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: customerEmail,
    toName: customerName,
    subject: `📦 Order Delivered #${order.order_number}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 7. CUSTOMER - ORDER CANCELLED
// ============================================
export const sendOrderCancelledEmail = async (customerEmail, customerName, order) => {
  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:56px;margin-bottom:10px;">❌</div>
        <h1 style="color:#0F172A;font-size:24px;margin:0 0 8px;">Order Cancelled</h1>
        <p style="color:#64748b;font-size:15px;margin:0;">Hi ${customerName}, your order has been cancelled.</p>
      </div>

      <div style="background:#fef2f2;padding:20px;border-radius:10px;border-left:4px solid #ef4444;margin-bottom:20px;">
        <p style="color:#991b1b;font-size:14px;margin:0;line-height:1.6;">
          Your order <strong>${order.order_number}</strong> has been cancelled. 
          Any payment made will be refunded within 5-10 business days.
        </p>
      </div>

      ${orderSummaryBox(order)}

      <div style="text-align:center;padding:15px;background:#f8fafc;border-radius:10px;">
        <p style="color:#64748b;font-size:13px;margin:0;">
          Questions? Contact us at <a href="mailto:${ADMIN_EMAIL}" style="color:#D4AF37;">${ADMIN_EMAIL}</a>
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: customerEmail,
    toName: customerName,
    subject: `❌ Order Cancelled #${order.order_number}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 8. CUSTOMER - ORDER DECLINED
// ============================================
export const sendOrderDeclinedEmail = async (customerEmail, customerName, order) => {
  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:56px;margin-bottom:10px;">⚠️</div>
        <h1 style="color:#0F172A;font-size:24px;margin:0 0 8px;">Order Declined</h1>
        <p style="color:#64748b;font-size:15px;margin:0;">Hi ${customerName}, we couldn't process your order.</p>
      </div>

      <div style="background:#fef3c7;padding:20px;border-radius:10px;border-left:4px solid #f59e0b;margin-bottom:20px;">
        <p style="color:#92400e;font-size:14px;margin:0;line-height:1.6;">
          Unfortunately, we couldn't process order <strong>${order.order_number}</strong>. 
          This may be due to payment issues or product availability.
        </p>
      </div>

      <div style="text-align:center;padding:15px;background:#f8fafc;border-radius:10px;">
        <p style="color:#64748b;font-size:13px;margin:0 0 10px;">
          Need help? Contact us and we'll assist you.
        </p>
        <a href="mailto:${ADMIN_EMAIL}" style="display:inline-block;background:#D4AF37;color:#0F172A;padding:10px 25px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:13px;">
          Contact Support
        </a>
      </div>
    </div>
  `

  return sendEmail({
    to: customerEmail,
    toName: customerName,
    subject: `⚠️ Order Declined #${order.order_number}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 9. CONTACT FORM - CUSTOMER CONFIRMATION
// ============================================
export const sendContactConfirmation = async (contact) => {
  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:56px;margin-bottom:10px;">📬</div>
        <h1 style="color:#0F172A;font-size:24px;margin:0 0 8px;">Message Received!</h1>
        <p style="color:#64748b;font-size:15px;margin:0;">Thank you, ${contact.name}.</p>
      </div>

      <div style="background:#eff6ff;padding:20px;border-radius:10px;border-left:4px solid #3b82f6;margin-bottom:20px;">
        <p style="color:#1e40af;font-size:14px;margin:0;line-height:1.6;">
          We've received your message and will get back to you within 24 hours 
          during business hours (Mon-Sat, 9AM-8PM).
        </p>
      </div>

      <div style="background:#f8fafc;padding:20px;border-radius:10px;">
        <h3 style="color:#0F172A;font-size:14px;margin:0 0 10px;">Your Message:</h3>
        <p style="color:#334155;font-size:13px;margin:0;line-height:1.7;">${contact.message}</p>
      </div>

      <p style="color:#64748b;font-size:13px;margin:20px 0 0;text-align:center;">
        For urgent matters, call us at <strong>+1 418 490 1884</strong>
      </p>
    </div>
  `

  return sendEmail({
    to: contact.email,
    toName: contact.name,
    subject: '📬 We Received Your Message - M.K.V',
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 10. CONTACT FORM - ADMIN NOTIFICATION
// ============================================
export const sendContactNotification = async (contact) => {
  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <div style="background:#D4AF37;padding:20px;border-radius:10px;margin-bottom:20px;text-align:center;">
        <h1 style="color:#0F172A;font-size:20px;margin:0;">📬 NEW CONTACT MESSAGE</h1>
      </div>

      <div style="padding:20px;background:#f8fafc;border-radius:10px;margin-bottom:20px;">
        <p style="color:#334155;font-size:14px;margin:0 0 10px;"><strong>Name:</strong> ${contact.name}</p>
        <p style="color:#334155;font-size:14px;margin:0 0 10px;"><strong>Email:</strong> <a href="mailto:${contact.email}" style="color:#D4AF37;">${contact.email}</a></p>
        <p style="color:#334155;font-size:14px;margin:0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>

      <div style="background:#f8fafc;padding:20px;border-radius:10px;margin-bottom:20px;">
        <h3 style="color:#0F172A;font-size:14px;margin:0 0 10px;">Message:</h3>
        <p style="color:#334155;font-size:14px;margin:0;line-height:1.7;">${contact.message}</p>
      </div>

      <div style="text-align:center;">
        <a href="mailto:${contact.email}" style="display:inline-block;background:#D4AF37;color:#0F172A;padding:14px 30px;text-decoration:none;border-radius:10px;font-weight:bold;">
          Reply to ${contact.name} →
        </a>
      </div>
    </div>
  `

  return sendEmail({
    to: ADMIN_EMAIL,
    toName: 'Admin',
    replyTo: contact.email,
    subject: `📬 New Contact: ${contact.name}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 11. NEWSLETTER - WELCOME EMAIL
// ============================================
export const sendWelcomeEmail = async (email) => {
  const content = `
    <div style="background:#fff;padding:35px 30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;text-align:center;">
      <div style="font-size:56px;margin-bottom:15px;">🎁</div>
      <h1 style="color:#0F172A;font-size:26px;margin:0 0 10px;">Welcome to M.K.V!</h1>
      <p style="color:#64748b;font-size:15px;margin:0 0 25px;">You're now part of our exclusive community</p>

      <h2 style="color:#0F172A;font-size:18px;margin:0 0 10px;">Here's 10% Off Your First Order!</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 15px;">Use code at checkout:</p>
      
      <div style="background:#f8fafc;padding:20px;border:2px dashed #D4AF37;border-radius:10px;display:inline-block;margin:10px 0;">
        <code style="font-size:28px;color:#D4AF37;font-weight:bold;letter-spacing:4px;">WELCOME10</code>
      </div>
      
      <p style="color:#94a3b8;font-size:13px;margin:15px 0 25px;">Valid for 30 days on your first purchase</p>

      <a href="${STORE_URL}/#/shop" style="display:inline-block;background:#D4AF37;color:#0F172A;padding:15px 40px;text-decoration:none;border-radius:10px;font-weight:bold;font-size:16px;">
        Start Shopping →
      </a>

      <div style="margin-top:30px;padding-top:25px;border-top:1px solid #e2e8f0;">
        <p style="color:#64748b;font-size:13px;margin:0 0 10px;">Explore our collections:</p>
        <p style="color:#0F172A;font-size:14px;margin:0;">
          ⌚ Watches • 👕 Sportswear • 👜 Bags • 💎 Perfumes
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    toName: email.split('@')[0],
    subject: '✨ Welcome to M.K.V — 10% Off Inside!',
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 12. NEWSLETTER - ADMIN NOTIFICATION
// ============================================
export const sendAdminNewsletterAlert = async (email) => {
  const content = `
    <div style="background:#fff;padding:30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;text-align:center;">
      <div style="font-size:48px;margin-bottom:15px;">📧</div>
      <h2 style="color:#0F172A;font-size:20px;margin:0 0 10px;">New Newsletter Subscriber</h2>
      <p style="color:#64748b;font-size:15px;margin:0 0 20px;">Someone just subscribed!</p>
      
      <div style="background:#f8fafc;padding:20px;border-radius:10px;display:inline-block;">
        <p style="color:#334155;font-size:16px;margin:0;font-weight:bold;">${email}</p>
      </div>
      
      <p style="color:#94a3b8;font-size:13px;margin:20px 0 0;">
        Subscribed on ${new Date().toLocaleString()}
      </p>
    </div>
  `

  return sendEmail({
    to: ADMIN_EMAIL,
    toName: 'Admin',
    subject: `📧 New Newsletter Subscriber: ${email}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 13. ADMIN - ORDER STATUS CHANGE
// ============================================
export const sendAdminStatusChange = async (order, newStatus) => {
  const content = `
    <div style="background:#fff;padding:30px;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;text-align:center;">
      <div style="font-size:48px;margin-bottom:15px;">📋</div>
      <h2 style="color:#0F172A;font-size:20px;margin:0 0 10px;">Order Status Updated</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 15px;">Order <strong>${order.order_number}</strong></p>
      <div style="background:#f8fafc;padding:16px;border-radius:10px;display:inline-block;">
        <p style="color:#D4AF37;font-size:22px;font-weight:bold;text-transform:uppercase;margin:0;letter-spacing:2px;">
          ${newStatus}
        </p>
      </div>
      <p style="color:#94a3b8;font-size:12px;margin:20px 0 0;">
        ${new Date().toLocaleString()}
      </p>
    </div>
  `

  return sendEmail({
    to: ADMIN_EMAIL,
    toName: 'Admin',
    subject: `📋 Order #${order.order_number} → ${newStatus.toUpperCase()}`,
    htmlContent: baseTemplate(content)
  })
}

// ============================================
// 14. PASSWORD RESET (Optional)
// ============================================
export const sendPasswordResetEmail = async (email) => {
  // Handled by Supabase Auth automatically
  return { success: true }
}

// ============================================
// EXPORTS
// ============================================
export default {
  sendOrderPlacedEmail,
  sendAdminNewOrderAlert,
  sendOrderConfirmedEmail,
  sendOrderProcessingEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail,
  sendOrderDeclinedEmail,
  sendContactConfirmation,
  sendContactNotification,
  sendWelcomeEmail,
  sendAdminNewsletterAlert,
  sendAdminStatusChange,
  sendPasswordResetEmail
}

// Test in console
if (typeof window !== 'undefined') {
  window.MKV = window.MKV || {}
  window.MKV.testEmail = (email) => sendWelcomeEmail(email)
  console.log('💡 Test email: MKV.testEmail("your@email.com")')
}

