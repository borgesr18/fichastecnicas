'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Package, 
  Warehouse,
  Factory, 
  DollarSign,
  BarChart,
  Settings
} from 'lucide-react'
import Link from 'next/link'

// CardModulo component for each module
interface CardModuloProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href: string
}

function CardModulo({ icon: Icon, title, description, href }: CardModuloProps) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}

export default function DashboardPage() {
  const modules = [
    {
      icon: FileText,
      title: "Fichas Técnicas",
      description: "Gerencie receitas e fichas técnicas de produtos",
      href: "/fichas-tecnicas"
    },
    {
      icon: Package,
      title: "Insumos",
      description: "Cadastre e controle insumos e matérias-primas",
      href: "/produtos"
    },
    {
      icon: Warehouse,
      title: "Estoque",
      description: "Controle de entrada e saída de produtos",
      href: "/estoque"
    },
    {
      icon: Factory,
      title: "Produção",
      description: "Registre e acompanhe a produção de receitas",
      href: "/producao"
    },
    {
      icon: DollarSign,
      title: "Preços",
      description: "Gerencie preços e custos de produtos",
      href: "/precos"
    },
    {
      icon: BarChart,
      title: "Relatórios",
      description: "Visualize relatórios e análises do sistema",
      href: "/relatorios"
    },
    {
      icon: Settings,
      title: "Configurações",
      description: "Configure categorias, unidades e usuários",
      href: "/configuracoes"
    }
  ]

  return (
    <DashboardLayout>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Acesse os módulos principais do sistema de gestão culinária
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {modules.map((module, index) => (
          <CardModulo
            key={index}
            icon={module.icon}
            title={module.title}
            description={module.description}
            href={module.href}
          />
        ))}
      </div>
    </DashboardLayout>
  )
}
