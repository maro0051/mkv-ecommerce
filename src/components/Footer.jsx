import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi'
import { subscribeNewsletter } from '../services/supabase'
import { sendWelcomeEmail, sendAdminNewsletterAlert } from '../services/emailService'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleNewsletter = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }
    setSubscribing(true)
    try {
      // Save to database
      try {
        await subscribeNewsletter(email)
      } catch (dbError) {
        // Ignore duplicates
        if (!dbError.message?.includes('duplicate')) {
          console.log('DB error:', dbError)
        }
      }

      // 📧 Send welcome email to subscriber
      sendWelcomeEmail(email)
        .then(() => console.log('📧 Welcome email sent'))
        .catch(err => console.log('Welcome email failed:', err))

      // 📧 Notify admin of new subscriber
      sendAdminNewsletterAlert(email)
        .then(() => console.log('📧 Admin notification sent'))
        .catch(err => console.log('Admin notification failed:', err))

      toast.success('Subscribed! Check your email for 10% off! 🎁', {
        duration: 5000,
        icon: '✨',
      })
      setEmail('')
    } catch (error) {
      console.error('Newsletter error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  const socialLinks = [
    { icon: <FiFacebook className="w-4 h-4" />, label: 'Facebook', href: '#' },
    { icon: <FiInstagram className="w-4 h-4" />, label: 'Instagram', href: 'https://www.instagram.com/m.k.v_holdings/' },
    { icon: <FiTwitter className="w-4 h-4" />, label: 'Twitter', href: '#' },
    { icon: <FiYoutube className="w-4 h-4" />, label: 'Youtube', href: '#' },
  ]

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Cart', path: '/cart' },
  ]

  const infoLinks = [
    { name: 'Terms & Conditions', path: '/terms-and-conditions' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Shipping Info', path: '/terms-and-conditions#shipping' },
    { name: 'Returns & Refunds', path: '/terms-and-conditions#refunds' },
  ]

  return (
    <footer className="bg-navy text-white">
      <div className="container-custom py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-base font-bold text-navy">M</span>
              </div>
              <span className="text-lg font-serif font-bold">M.K.V</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Elegance at your fingertips. Quality watches, sportswear, bags & perfumes.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 hover:bg-gold hover:text-navy rounded-lg flex items-center justify-center transition-all duration-300" title={social.label}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-1.5">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-gold transition-colors text-xs">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-3">Information</h4>
            <ul className="space-y-1.5">
              {infoLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-gold transition-colors text-xs">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-3">Stay Connected</h4>
            <form onSubmit={handleNewsletter} className="flex mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 text-white text-xs rounded-l-lg focus:outline-none focus:ring-1 focus:ring-gold placeholder-gray-500 border border-gray-700"
                required
                disabled={subscribing}
              />
              <button 
                type="submit"
                disabled={subscribing}
                className="bg-gold text-navy px-3 py-2 rounded-r-lg text-xs font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                {subscribing ? (
                  <div className="w-3 h-3 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiSend className="w-3 h-3" />
                )}
              </button>
            </form>

            <div className="space-y-1.5 text-xs text-gray-400">
              <a href="tel:+14184901884" className="flex items-center space-x-2 hover:text-gold transition-colors">
                <FiPhone className="w-3 h-3 text-gold shrink-0" />
                <span>+1 418 490 1884</span>
              </a>
              <a href="mailto:Mkvisionbusiness@gmail.com" className="flex items-center space-x-2 hover:text-gold transition-colors">
                <FiMail className="w-3 h-3 text-gold flex-shrink-0" />
                <span className="break-all">Mkvisionbusiness@gmail.com</span>
              </a>
              <div className="flex items-start space-x-2">
                <FiMapPin className="w-3 h-3 text-gold flex-shrink-0 mt-0.5" />
                <span>251 Windmill, Halifax, NS B3A 4P2, Canada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-custom py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 text-[10px]">
            © {currentYear} MK Vision Services. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-[10px] text-gray-500">
            <span>We accept:</span>
            <span className="px-2 py-0.5 bg-gray-800 rounded">🏦 Interac</span>
            <span className="px-2 py-0.5 bg-gray-800 rounded">💙 PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

