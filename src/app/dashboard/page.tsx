'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  FileText, 
  Package, 
  Factory, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const atividadesRecentes = [
    {
      id: '1',
      tipo: 'producao',
      descricao: 'Produção de Bolo de Chocolate concluída',
      tempo: '2 horas atrás',
      usuario: 'admin@sistemachef.com'
    },
    {
      id: '2',
      tipo: 'estoque',
      descricao: 'Entrada de Farinha de Trigo - 10kg',
      tempo: '4 horas atrás',
      usuario: 'admin@sistemachef.com'
    },
    {
      id: '3',
      tipo: 'ficha',
      descricao: 'Nova ficha técnica: Lasanha Bolonhesa',
      tempo: '1 dia atrás',
      usuario: 'admin@sistemachef.com'
    }
  ]

  const insumosBaixoEstoque = [
    {
      id: '1',
      nome: 'Chocolate em Pó',
      estoque: 3,
      minimo: 5,
      unidade: 'kg'
    },
    {
      id: '2',
      nome: 'Açúcar Cristal',
      estoque: 8,
      minimo: 10,
      unidade: 'kg'
    }
  ]

  const fichasMaisProducidas = [
    {
      id: '1',
      nome: 'Bolo de Chocolate',
      producoes: 5,
      ultimaProducao: '2024-06-27'
    },
    {
      id: '2',
      nome: 'Lasanha Bolonhesa',
      producoes: 3,
      ultimaProducao: '2024-06-26'
    }
  ]

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do seu sistema de gestão culinária
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/fichas-tecnicas">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ficha Técnica
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fichas Técnicas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Total de receitas cadastradas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Insumos em Estoque
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Insumos disponíveis
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produções Hoje
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Receitas produzidas hoje
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.245,80</div>
            <p className="text-xs text-muted-foreground">
              Valor total em estoque
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas movimentações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atividadesRecentes.map((atividade) => (
                <div key={atividade.id} className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {atividade.tipo === 'producao' && <Factory className="h-4 w-4" />}
                    {atividade.tipo === 'estoque' && <Package className="h-4 w-4" />}
                    {atividade.tipo === 'ficha' && <FileText className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {atividade.descricao}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {atividade.tempo} • {atividade.usuario}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/relatorios">
                  <Button variant="outline" size="sm">
                    Ver todos os relatórios
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
            <CardDescription>
              Itens que precisam de atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Estoque Baixo
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {insumosBaixoEstoque.length} itens com estoque baixo
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {insumosBaixoEstoque.map((produto) => (
                  <div key={produto.id} className="flex items-center justify-between text-sm">
                    <span>{produto.nome}</span>
                    <Badge variant="destructive">
                      {produto.estoque} {produto.unidade}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="pt-2">
                <Link href="/estoque">
                  <Button variant="outline" size="sm">
                    Gerenciar estoque
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fichas Mais Produzidas</CardTitle>
            <CardDescription>
              Receitas com maior volume de produção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receita</TableHead>
                  <TableHead>Produções</TableHead>
                  <TableHead>Última Produção</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fichasMaisProducidas.map((ficha) => (
                  <TableRow key={ficha.id}>
                    <TableCell className="font-medium">{ficha.nome}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ficha.producoes}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(ficha.ultimaProducao).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="pt-4">
              <Link href="/producao">
                <Button variant="outline" size="sm">
                  Ver todas as produções
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>
              Análise de custos e receitas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Custo Total de Produção</span>
                <span className="text-sm">R$ 264,90</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Receita Estimada</span>
                <span className="text-sm">R$ 749,40</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Margem de Lucro</span>
                <Badge variant="default">64.6%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Valor em Estoque</span>
                <span className="text-sm font-bold">R$ 1.245,80</span>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/precos">
                <Button variant="outline" size="sm">
                  Gerenciar preços
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
