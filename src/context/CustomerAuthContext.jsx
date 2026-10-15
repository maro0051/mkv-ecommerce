import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const CustomerAuthContext = createContext()

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdminUser, setIsAdminUser] = useState(false)

  useEffect(() => {
    checkSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      
      if (user?.email === 'manassekilembi@gmail.com') {
        setIsAdminUser(true)
        setCustomer(null)
        setProfile(null)
        setLoading(false)
        return
      }
      
      setIsAdminUser(false)
      setCustomer(user)
      if (user) {
        loadProfile(user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user ?? null
      
      if (user?.email === 'manassekilembi@gmail.com') {
        setIsAdminUser(true)
        setCustomer(null)
        setProfile(null)
        setLoading(false)
        return
      }
      
      setIsAdminUser(false)
      setCustomer(user)
      if (user) {
        await loadProfile(user.id)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Session error:', error)
      setLoading(false)
    }
  }

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: userData } = await supabase.auth.getUser()
          if (userData?.user) {
            const { data: newProfile } = await supabase
              .from('customer_profiles')
              .insert([{
                id: userId,
                email: userData.user.email,
                full_name: userData.user.user_metadata?.full_name || ''
              }])
              .select()
              .single()
            
            if (newProfile) setProfile(newProfile)
          }
          setLoading(false)
          return
        }
        setLoading(false)
        return
      }
      
      setProfile(data)
    } catch (error) {
      console.error('Profile error:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, fullName) => {
    if (email === 'manassekilembi@gmail.com') {
      toast.error('This email is reserved')
      throw new Error('Email not available')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin + '/customer/login'
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('An account with this email already exists.')
      } else {
        toast.error(error.message)
      }
      throw error
    }

    if (data?.user && data?.session) {
      setCustomer(data.user)
      toast.success('Account created! Welcome! 🎉')
    } else {
      toast.success('Account created! You can now sign in.')
    }
    
    return data
  }

  const signIn = async (email, password) => {
    if (email === 'manassekilembi@gmail.com') {
      toast.error('Please use the admin login page')
      throw new Error('Use admin login')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password.')
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please confirm your email first.')
      } else {
        toast.error(error.message)
      }
      throw error
    }

    if (data.user) {
      const { data: existingProfile } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!existingProfile) {
        await supabase.from('customer_profiles').insert([{
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || ''
        }])
      }
    }

    toast.success('Welcome back! 👋')
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setCustomer(null)
    setProfile(null)
    toast.success('See you soon! 👋')
    
    // Redirect to home page
    window.location.href = '/'
  }

  const updateProfile = async (updates) => {
    if (!customer || isAdminUser) return
    
    const { data, error } = await supabase
      .from('customer_profiles')
      .upsert({
        id: customer.id,
        email: customer.email,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    setProfile(data)
    toast.success('Profile updated!')
    return data
  }

  return (
    <CustomerAuthContext.Provider value={{
      customer,
      profile,
      loading,
      isAdminUser,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext)
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider')
  }
  return context
}

