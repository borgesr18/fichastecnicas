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
    <div className="flex h-screen w-full">
      <div className="fixed left-0 top-0 z-50 h-full w-[220px] border-r bg-muted/40 md:w-[220px] lg:w-[280px]">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full ml-[220px] lg:ml-[280px]">
        <header className="fixed top-0 right-0 z-40 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6" style={{left: '220px', width: 'calc(100% - 220px)'}}>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">SistemaChef</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 mt-14 lg:mt-[60px] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
