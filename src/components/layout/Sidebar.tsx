'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  ChefHat, 
  FileText, 
  Package, 
  Factory, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Menu,
  LogOut,
  Home
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Fichas Técnicas', href: '/fichas-tecnicas', icon: FileText },
  { name: 'Insumos', href: '/produtos', icon: ChefHat },
  { name: 'Estoque', href: '/estoque', icon: Package },
  { name: 'Produção', href: '/producao', icon: Factory },
  { name: 'Preços', href: '/precos', icon: DollarSign },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-semibold">
            <ChefHat className="h-6 w-6" />
            <span>SistemaChef</span>
          </div>
          <span className="text-xs text-muted-foreground leading-tight">
            Seu sistema de controle de fichas técnicas
          </span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  isActive ? 'bg-muted text-primary' : ''
                }`}
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{user?.email}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-background md:block fixed h-screen w-[220px] lg:w-[280px] z-20">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
