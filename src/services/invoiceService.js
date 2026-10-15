import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const CURRENCY_SYMBOL = 'C$'

export const generateInvoicePDF = (order, customerInfo, items) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  const navyColor = [15, 23, 42]
  const goldColor = [212, 175, 55]
  const grayColor = [100, 100, 100]
  const lightGray = [245, 245, 245]

  // HEADER
  doc.setFillColor(...navyColor)
  doc.rect(0, 0, pageWidth, 45, 'F')
  
  doc.setFillColor(...goldColor)
  doc.roundedRect(14, 10, 20, 20, 4, 4, 'F')
  doc.setTextColor(...navyColor)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('M', 21, 24, { align: 'center' })
  
  doc.setTextColor(...goldColor)
  doc.setFontSize(22)
  doc.text('M.K.V', 40, 22)
  doc.setFontSize(8)
  doc.setTextColor(200, 200, 200)
  doc.text('LUXURY COLLECTION', 40, 28)
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.text('INVOICE', pageWidth - 14, 22, { align: 'right' })
  doc.setFontSize(8)
  doc.text(`Invoice #: ${order.order_number}`, pageWidth - 14, 28, { align: 'right' })
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - 14, 33, { align: 'right' })

  // COMPANY & CUSTOMER
  let yPos = 58
  
  doc.setFontSize(9)
  doc.setTextColor(...navyColor)
  doc.setFont('helvetica', 'bold')
  doc.text('From:', 14, yPos)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  doc.text('MK Vision Services', 14, yPos + 5)
  doc.text('251 Windmill, Halifax', 14, yPos + 10)
  doc.text('Nova Scotia, B3A 4P2, Canada', 14, yPos + 15)
  doc.text('Mkvisionbusiness@gmail.com', 14, yPos + 20)
  doc.text('+1 418 490 1884', 14, yPos + 25)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...navyColor)
  doc.text('Bill To:', pageWidth / 2 + 10, yPos)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  doc.text(customerInfo.customer_name || 'Customer', pageWidth / 2 + 10, yPos + 5)
  doc.text(customerInfo.customer_address || '', pageWidth / 2 + 10, yPos + 10)
  doc.text(`${customerInfo.customer_city || ''} ${customerInfo.customer_state || ''} ${customerInfo.customer_zip || ''}`, pageWidth / 2 + 10, yPos + 15)
  doc.text(customerInfo.customer_email || '', pageWidth / 2 + 10, yPos + 20)
  if (customerInfo.customer_phone) {
    doc.text(customerInfo.customer_phone, pageWidth / 2 + 10, yPos + 25)
  }

  // TABLE
  yPos = 115
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...navyColor)
  doc.text('Order Details', 14, yPos)
  
  const tableData = items.map((item, index) => [
    index + 1,
    item.name,
    item.quantity,
    `${CURRENCY_SYMBOL}${Number(item.price).toFixed(2)}`,
    `${CURRENCY_SYMBOL}${(Number(item.price) * item.quantity).toFixed(2)}`
  ])

  autoTable(doc, {
    startY: yPos + 5,
    head: [['#', 'Product', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    headStyles: { fillColor: navyColor, textColor: goldColor, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
    alternateRowStyles: { fillColor: lightGray },
    styles: { cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
  })

  // TOTALS
  const finalY = doc.lastAutoTable.finalY + 10
  
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
  const shipping = subtotal >= 100 ? 0 : 15
  const tax = subtotal * 0.15
  const total = subtotal + shipping + tax

  const totalsX = pageWidth - 85
  
  doc.setDrawColor(...navyColor)
  doc.setLineWidth(0.5)
  doc.line(totalsX, finalY, pageWidth - 14, finalY)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  doc.text('Subtotal:', totalsX, finalY + 8)
  doc.text(`${CURRENCY_SYMBOL}${subtotal.toFixed(2)}`, pageWidth - 14, finalY + 8, { align: 'right' })
  
  doc.text('Shipping:', totalsX, finalY + 16)
  doc.text(shipping === 0 ? 'FREE' : `${CURRENCY_SYMBOL}${shipping.toFixed(2)}`, pageWidth - 14, finalY + 16, { align: 'right' })
  
  doc.text('HST (15%):', totalsX, finalY + 24)
  doc.text(`${CURRENCY_SYMBOL}${tax.toFixed(2)}`, pageWidth - 14, finalY + 24, { align: 'right' })
  
  doc.setDrawColor(...navyColor)
  doc.line(totalsX, finalY + 30, pageWidth - 14, finalY + 30)
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...navyColor)
  doc.text('TOTAL:', totalsX, finalY + 40)
  doc.setTextColor(...goldColor)
  doc.text(`${CURRENCY_SYMBOL}${total.toFixed(2)}`, pageWidth - 14, finalY + 40, { align: 'right' })

  // PAYMENT
  const paymentY = finalY + 55
  
  doc.setFillColor(...navyColor)
  doc.roundedRect(14, paymentY, pageWidth - 28, 40, 5, 5, 'F')
  
  doc.setTextColor(...goldColor)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('PAYMENT INSTRUCTIONS', pageWidth / 2, paymentY + 10, { align: 'center' })
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.text('Send Interac e-Transfer to: Mkvisionbusiness@gmail.com', pageWidth / 2, paymentY + 20, { align: 'center' })
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(8)
  doc.text(`Reference: ${order.order_number} | Amount: ${CURRENCY_SYMBOL}${total.toFixed(2)}`, pageWidth / 2, paymentY + 28, { align: 'center' })
  doc.text('Order will be processed once payment is received.', pageWidth / 2, paymentY + 35, { align: 'center' })

  // FOOTER
  const footerY = paymentY + 55
  doc.setFontSize(7)
  doc.setTextColor(...grayColor)
  doc.text('Thank you for shopping with M.K.V!', pageWidth / 2, footerY, { align: 'center' })
  doc.text('For questions, contact Mkvisionbusiness@gmail.com | +1 418 490 1884', pageWidth / 2, footerY + 5, { align: 'center' })
  doc.text(`© ${new Date().getFullYear()} MK Vision Services. All rights reserved.`, pageWidth / 2, footerY + 10, { align: 'center' })

  doc.text('Return Policy: Items can be returned within 30 days of delivery. Items must be unused and in original packaging.', 14, footerY + 20)
  doc.text('Non-returnable items: Opened perfumes, worn clothing. Sale items are final sale.', 14, footerY + 26)

  return doc
}

export const downloadInvoice = (order, customerInfo, items) => {
  const doc = generateInvoicePDF(order, customerInfo, items)
  doc.save(`M.K.V_Invoice_${order.order_number}.pdf`)
}

export const getInvoiceBlob = (order, customerInfo, items) => {
  const doc = generateInvoicePDF(order, customerInfo, items)
  return doc.output('blob')
}

export const getInvoiceBase64 = (order, customerInfo, items) => {
  const doc = generateInvoicePDF(order, customerInfo, items)
  return doc.output('datauristring')
}

