'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Para ajustar o tamanho do dashboard em relação ao Sidebar,
// altere os valores abaixo nas classes Tailwind `md:ml-[220px]` e `lg:ml-[280px]`.
// Eles devem ser iguais à largura do Sidebar definida no componente Sidebar.tsx.

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
    <div className="w-full min-h-screen">
      <Sidebar />
      <div
        className="
          flex flex-col min-h-screen min-w-0 transition-all
          md:ml-[220px] lg:ml-[280px]  // <-- AJUSTE AQUI para bater com a largura do sidebar
        "
      >
        <header className="flex h-14 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">SistemaChef - Seu sistema de fichas técnicas.</h1>
          </div>
        </header>
        <main className="flex-1 overflow-x-auto p-3 lg:p-4 w-full max-w-full">
          <div className="flex flex-col gap-3 lg:gap-4 w-full max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
