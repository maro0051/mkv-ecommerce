import { useEffect } from 'react'

export default function GoogleTranslate() {
  useEffect(() => {
    // Hide Google Translate toolbar at top
    const style = document.createElement('style')
    style.textContent = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-gadget { color: transparent !important; }
      .goog-te-gadget .goog-te-combo { 
        padding: 8px 12px; 
        border-radius: 8px; 
        border: 2px solid #D4AF37;
        background: white;
        color: #0F172A;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        cursor: pointer;
      }
      body { top: 0 !important; }
      .skiptranslate iframe { display: none !important; }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div id="google_translate_element" className="flex items-center"></div>
  )
}

