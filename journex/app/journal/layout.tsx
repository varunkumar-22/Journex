import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ReactNode } from 'react'

interface JournalLayoutProps {
  children: ReactNode
}

export default async function JournalLayout({ children }: JournalLayoutProps): Promise<JSX.Element> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <>{children}</>
}
