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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col h-screen md:ml-[220px] lg:ml-[280px]">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 fixed top-0 right-0 left-0 md:left-[220px] lg:left-[280px] z-10">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">SistemaChef</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 mt-14 lg:mt-[60px]">
          <div className="flex flex-col gap-4 lg:gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
