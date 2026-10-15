import { useEffect, useState } from 'react'
import { FiMail, FiTrash2, FiUser, FiClock, FiMessageSquare } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { getContacts } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const data = await getContacts()
      setMessages(data)
    } catch (error) {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy dark:text-white">
          Messages
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Customer inquiries and contact form submissions ({messages.length} total)
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading messages...</div>
      ) : messages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Message List */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-navy dark:text-white">Inbox</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
              {messages.map(message => (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-gold/5 border-l-4 border-gold' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-navy dark:text-white text-sm truncate">
                        {message.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{message.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-gold">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy dark:text-white">
                        {selectedMessage.name}
                      </h3>
                      <a 
                        href={`mailto:${selectedMessage.email}`}
                        className="text-sm text-gold hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <FiClock className="w-4 h-4" />
                    <span>{formatDate(selectedMessage.created_at)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="mt-6 flex space-x-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your message to M.K.V`}
                    className="flex items-center space-x-2 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-yellow-600 transition-all"
                  >
                    <FiMail className="w-5 h-5" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 flex flex-col items-center justify-center text-center">
                <FiMessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
                  Select a Message
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Click on a message from the list to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiMail className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">No Messages</h3>
          <p className="text-gray-500">No customer messages yet.</p>
        </div>
      )}
    </AdminLayout>
  )
}

