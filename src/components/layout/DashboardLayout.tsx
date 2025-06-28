'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">SistemaChef - Seu sistema de fichas técnicas.</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-3 lg:p-4 w-full">
          <div className="flex flex-col gap-3 lg:gap-4 w-full max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
