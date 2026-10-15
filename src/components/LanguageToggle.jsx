import { useEffect, useState } from 'react'

export default function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState('en')

  useEffect(() => {
    // Check Google Translate cookie
    const cookie = document.cookie.match(/googtrans=\/(en|fr)\/(en|fr)/)
    if (cookie) {
      setCurrentLang(cookie[2])
    }
  }, [])

  const switchLanguage = (lang) => {
    setCurrentLang(lang)
    
    // Set Google Translate cookie
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`
    
    // Reload to apply translation
    window.location.reload()
  }

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          currentLang === 'en'
            ? 'bg-gold text-navy shadow-md'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300'
        }`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => switchLanguage('fr')}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          currentLang === 'fr'
            ? 'bg-gold text-navy shadow-md'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300'
        }`}
      >
        🇫🇷 FR
      </button>
    </div>
  )
}

