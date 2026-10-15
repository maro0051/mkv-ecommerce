import { useState } from 'react'
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiMessageSquare, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'
import { submitContact } from '../services/supabase'
import { sendContactNotification, sendContactConfirmation } from '../services/emailService'
import toast from 'react-hot-toast'
import BackButton from '../components/BackButton'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name', { icon: '⚠️' })
      return
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email', { icon: '⚠️' })
      return
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message', { icon: '⚠️' })
      return
    }

    setSubmitting(true)

    try {
      // Save to Supabase
      await submitContact({
        name: formData.name,
        email: formData.email,
        message: `${formData.subject ? `Subject: ${formData.subject}\n\n` : ''}${formData.message}`
      })
      
      const contactData = {
        name: formData.name,
        email: formData.email,
        message: `${formData.subject ? `Subject: ${formData.subject}\n\n` : ''}${formData.message}`
      }

      // 📧 Send notification to admin
      sendContactNotification(contactData)
        .then(() => console.log('📧 Admin notification sent'))
        .catch(err => console.log('Admin email failed (non-critical):', err.message))

      // 📧 Send confirmation to customer
      sendContactConfirmation(contactData)
        .then(() => console.log('📧 Customer confirmation sent'))
        .catch(err => console.log('Customer email failed (non-critical):', err.message))
      
      toast.success('Message sent! Check your email for confirmation. 📧', {
        icon: '✅',
        duration: 4000,
      })
      
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to send message. Please try again or email us directly.', {
        icon: '❌',
        duration: 4000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: <FiPhone className="w-5 h-5" />,
      title: 'Call Us',
      details: '+1 418 490 1884',
      subtext: 'Mon-Sat, 9am - 8pm',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      action: 'tel:+14184901884',
    },
    {
      icon: <FiMail className="w-5 h-5" />,
      title: 'Email Us',
      details: 'Mkvisionbusiness@gmail.com',
      subtext: 'We reply within 24 hours',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      action: 'mailto:Mkvisionbusiness@gmail.com',
    },
    {
      icon: <FiMapPin className="w-5 h-5" />,
      title: 'Visit Us',
      details: '251 Windmill',
      subtext: 'Halifax, NS B3A 4P2, Canada',
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-100 dark:bg-purple-800',
      iconColor: 'text-purple-600 dark:text-purple-400',
      action: '#map',
    },
    {
      icon: <FiClock className="w-5 h-5" />,
      title: 'Business Hours',
      details: 'Mon - Sat: 9AM - 8PM',
      subtext: 'Sunday: Closed',
      color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      iconBg: 'bg-orange-100 dark:bg-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400',
      action: null,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy">
      
      {/* HERO HEADER */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center space-x-2 bg-gold/10 text-gold text-xs font-semibold px-4 py-2 rounded-full mb-4 tracking-wider uppercase">
              <FiMessageSquare className="w-4 h-4" />
              <span>Get in Touch</span>
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy dark:text-white mb-4">
              Contact <span className="text-gold">CAN</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or just want to say hello? 
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12 md:py-16">
        
        {/* CONTACT INFO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {contactInfo.map((info, idx) => (
            <div key={idx}>
              {info.action ? (
                <a 
                  href={info.action}
                  className={`group block p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${info.color}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${info.iconBg} ${info.iconColor}`}>
                    {info.icon}
                  </div>
                  <h3 className="text-sm font-bold text-navy dark:text-white mb-1">
                    {info.title}
                  </h3>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    {info.details}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {info.subtext}
                  </p>
                </a>
              ) : (
                <div className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${info.color}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${info.iconBg} ${info.iconColor}`}>
                    {info.icon}
                  </div>
                  <h3 className="text-sm font-bold text-navy dark:text-white mb-1">
                    {info.title}
                  </h3>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    {info.details}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {info.subtext}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <FiSend className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy dark:text-white">
                    Send Us a Message
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fill out the form below and we'll get back to you shortly
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                    Subject <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    maxLength="1000"
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm resize-none"
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      {formData.message.length}/1000 characters
                    </p>
                    {formData.message.length > 900 && (
                      <p className="text-xs text-orange-500">Approaching character limit</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 bg-gold text-navy px-6 py-4 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  You'll receive a confirmation email once we get your message.
                </p>
              </form>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            
            {/* Quick Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
                <span>💬</span>
                <span>Quick Contact</span>
              </h3>
              <div className="space-y-4">
                <a 
                  href="tel:+14184901884" 
                  className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gold/10 dark:hover:bg-gold/20 transition-all group"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-all">
                    <FiPhone className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy dark:text-white">+1 418 490 1884</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tap to call</p>
                  </div>
                </a>

                <a 
                  href="mailto:Mkvisionbusiness@gmail.com" 
                  className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gold/10 dark:hover:bg-gold/20 transition-all group"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-all">
                    <FiMail className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy dark:text-white break-all">Mkvisionbusiness@gmail.com</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Send email directly</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
                <span>🌟</span>
                <span>Follow Us</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <FiInstagram className="w-5 h-5" />, label: 'Instagram', color: 'hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500 hover:border-pink-300', href: 'https://www.instagram.com/m.k.v_holdings/' },
                  { icon: <FiFacebook className="w-5 h-5" />, label: 'Facebook', color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 hover:border-blue-300', href: '#' },
                  { icon: <FiTwitter className="w-5 h-5" />, label: 'Twitter', color: 'hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-500 hover:border-sky-300', href: '#' },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent transition-all ${social.color}`}
                    title={social.label}
                  >
                    {social.icon}
                    <span className="text-xs font-medium">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div id="map" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <FiMapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Google Maps</p>
                  <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-navy dark:text-white">Our Location</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  251 Windmill, Halifax, NS B3A 4P2, Canada
                </p>
                <a 
                  href="https://maps.google.com/?q=251+Windmill+Halifax+NS+B3A+4P2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs font-semibold text-gold hover:text-yellow-600 transition-colors"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 dark:from-gold/20 dark:to-gold/5 rounded-2xl p-6 border border-gold/20">
              <div className="text-center">
                <span className="text-3xl mb-3 block">⚡</span>
                <h3 className="text-sm font-bold text-navy dark:text-white mb-1">
                  Fast Response Time
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We typically respond within 2-4 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="flex justify-center mt-12">
          <BackButton to="/" text="🏠 Back to Home" variant="cute" />
        </div>
      </div>
    </div>
  )
}

