'use client'

import React, { useState, useEffect } from 'react'
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
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalFichasTecnicas: 0,
    totalInsumos: 0,
    producaoHoje: 0,
    custoMedio: 0
  })
  const [movimentacoes, setMovimentacoes] = useState<{
    id: string
    tipo: string
    produto: string
    quantidade: number
    unidade: string
    data: string
    usuario: string
  }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    fetchMovimentacoes()
  }, [])

  const fetchMetrics = async () => {
    try {
      const [fichasRes, insumosRes, producaoRes] = await Promise.all([
        fetch('/api/fichas-tecnicas'),
        fetch('/api/produtos'),
        fetch('/api/producao')
      ])

      const fichas = await fichasRes.json()
      const insumos = await insumosRes.json()
      const producoes = await producaoRes.json()

      const hoje = new Date().toISOString().split('T')[0]
      const producaoHoje = producoes.filter((p: { createdAt?: string }) => 
        p.createdAt?.split('T')[0] === hoje
      ).length

      const custoMedio = fichas.length > 0 
        ? fichas.reduce((acc: number, f: { custoPorcao: number }) => acc + f.custoPorcao, 0) / fichas.length
        : 0

      setMetrics({
        totalFichasTecnicas: fichas.length,
        totalInsumos: insumos.length,
        producaoHoje,
        custoMedio
      })
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMovimentacoes = async () => {
    try {
      const response = await fetch('/api/estoque')
      if (response.ok) {
        const data = await response.json()
        setMovimentacoes(data.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching movimentações:', error)
    }
  }

  const { totalFichasTecnicas, totalInsumos, producaoHoje, custoMedio } = metrics

  const atividadesRecentes = movimentacoes.map((mov, index) => ({
    id: mov.id || index.toString(),
    tipo: mov.tipo === 'entrada' ? 'estoque' : 'estoque',
    descricao: `${mov.tipo === 'entrada' ? 'Entrada' : 'Saída'} de ${mov.produto} - ${mov.quantidade} ${mov.unidade}`,
    tempo: new Date(mov.data).toLocaleDateString('pt-BR'),
    usuario: mov.usuario
  }))

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando dashboard...</div>
        </div>
      </DashboardLayout>
    )
  }

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
            <div className="text-2xl font-bold">{totalFichasTecnicas}</div>
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
            <div className="text-2xl font-bold">{totalInsumos}</div>
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
            <div className="text-2xl font-bold">{producaoHoje}</div>
            <p className="text-xs text-muted-foreground">
              Receitas produzidas hoje
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Custo Médio
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {custoMedio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Custo médio por porção
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
                    2 itens com estoque baixo
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Chocolate em Pó</span>
                  <Badge variant="destructive">3 kg</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Açúcar Cristal</span>
                  <Badge variant="destructive">8 kg</Badge>
                </div>
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
                <TableRow>
                  <TableCell className="font-medium">Bolo de Chocolate</TableCell>
                  <TableCell>
                    <Badge variant="secondary">5</Badge>
                  </TableCell>
                  <TableCell>27/06/2024</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lasanha Bolonhesa</TableCell>
                  <TableCell>
                    <Badge variant="secondary">3</Badge>
                  </TableCell>
                  <TableCell>26/06/2024</TableCell>
                </TableRow>
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
