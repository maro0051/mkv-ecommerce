import { supabase } from './supabase'

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `MKV-${timestamp}-${random}`
}

export const placeOrder = async (orderData) => {
  try {
    const orderNumber = generateOrderNumber()

    const { data: order, error } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
        customer_city: orderData.customer_city,
        customer_state: orderData.customer_state,
        customer_zip: orderData.customer_zip,
        customer_country: orderData.customer_country || 'US',
        total: orderData.total,
        items: orderData.items,
        status: 'pending',
        payment_method: 'interac',
        payment_status: 'pending',
        notes: orderData.notes || ''
      }])
      .select()
      .single()

    if (error) throw error
    return order
  } catch (error) {
    console.error('placeOrder error:', error)
    throw error
  }
}

export const getPaymentInstructions = () => {
  return {
    adminEmail: 'manassekilembi@gmail.com',
    adminName: 'Manasse Kilembi',
    adminPhone: '+1 (555) 123-4567',
    businessName: 'M.K.V Store',
    businessHours: 'Monday - Saturday, 9:00 AM - 8:00 PM',
    responseTime: 'within 2-4 hours during business hours',
    instructions: [
      {
        step: 1,
        title: 'Open Your Banking App',
        description: 'Log into your online banking or mobile banking app that supports Interac e-Transfer.',
        icon: '📱'
      },
      {
        step: 2,
        title: 'Send Interac e-Transfer',
        description: 'Navigate to Interac e-Transfer and send the payment.',
        icon: '💸'
      },
      {
        step: 3,
        title: 'Enter Recipient Details',
        description: 'Use the admin email address shown below as the recipient.',
        icon: '📧'
      },
      {
        step: 4,
        title: 'Enter Amount',
        description: 'Enter the exact order total amount shown on your order.',
        icon: '💰'
      },
      {
        step: 5,
        title: 'Add Order Number as Reference',
        description: 'In the message/memo field, put your order number (e.g., MKV-XXXX-XXXX). This is VERY IMPORTANT so we can match your payment to your order.',
        icon: '🔢'
      },
      {
        step: 6,
        title: 'Confirm & Send',
        description: 'Review the details and confirm the transfer. Your order will be processed once payment is received.',
        icon: '✅'
      }
    ],
    importantNotes: [
      '⚠️ Always include your order number in the transfer message',
      '⚠️ Send the exact order total amount',
      '⚠️ Your order will be confirmed within 24 hours of payment receipt',
      '⚠️ Keep your order confirmation for your records',
      '⚠️ Contact us if you have any questions before sending payment'
    ],
    securityNote: '🔒 Your payment information is secure. We never store your banking details.'
  }
}

