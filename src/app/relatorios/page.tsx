'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  BarChart3,
  Download,
  TrendingUp,
  Package,
  Factory,
  DollarSign
} from 'lucide-react'

export default function RelatoriosPage() {
  const [tipoRelatorio, setTipoRelatorio] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const relatoriosProducao = [
    {
      id: '1',
      produto: 'Bolo de Chocolate',
      quantidade: 5,
      data: '2024-06-27',
      custo: 127.50,
      receita: 319.50
    },
    {
      id: '2',
      produto: 'Lasanha Bolonhesa',
      quantidade: 3,
      data: '2024-06-26',
      custo: 137.40,
      receita: 429.90
    }
  ]

  const relatoriosConsumo = [
    {
      id: '1',
      ingrediente: 'Farinha de Trigo',
      consumido: 8.5,
      unidade: 'kg',
      custo: 38.25,
      periodo: 'Últimos 7 dias'
    },
    {
      id: '2',
      ingrediente: 'Açúcar Cristal',
      consumido: 6.2,
      unidade: 'kg',
      custo: 19.84,
      periodo: 'Últimos 7 dias'
    }
  ]

  const relatoriosMovimentacao = [
    {
      id: '1',
      produto: 'Chocolate em Pó',
      entradas: 5,
      saidas: 2.5,
      saldoAtual: 5.5,
      unidade: 'kg'
    },
    {
      id: '2',
      produto: 'Queijo Mussarela',
      entradas: 3,
      saidas: 1.8,
      saldoAtual: 3.2,
      unidade: 'kg'
    }
  ]

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises e relatórios do sistema
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produções (7 dias)
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação à semana anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consumo de Insumos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 264,90</div>
            <p className="text-xs text-muted-foreground">
              Valor consumido nos últimos 7 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Gerada
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 749,40</div>
            <p className="text-xs text-muted-foreground">
              Receita estimada das produções
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Margem de Lucro
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64.6%</div>
            <p className="text-xs text-muted-foreground">
              Margem média do período
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Relatório</CardTitle>
          <CardDescription>
            Configure os parâmetros para gerar relatórios personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Relatório</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="producao">Relatório de Produção</SelectItem>
                  <SelectItem value="consumo">Consumo de Insumos</SelectItem>
                  <SelectItem value="movimentacao">Movimentação de Estoque</SelectItem>
                  <SelectItem value="financeiro">Relatório Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-inicio">Data Início</Label>
              <Input 
                id="data-inicio" 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-fim">Data Fim</Label>
              <Input 
                id="data-fim" 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Produção</CardTitle>
            <CardDescription>
              Produções realizadas no período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatoriosProducao.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.produto}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>R$ {item.custo.toFixed(2)}</TableCell>
                    <TableCell>R$ {item.receita.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumo de Insumos</CardTitle>
            <CardDescription>
              Ingredientes mais consumidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead>Consumido</TableHead>
                  <TableHead>Custo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatoriosConsumo.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.ingrediente}</TableCell>
                    <TableCell>{item.consumido} {item.unidade}</TableCell>
                    <TableCell>R$ {item.custo.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentação de Estoque</CardTitle>
            <CardDescription>
              Entradas e saídas do período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Entradas</TableHead>
                  <TableHead>Saídas</TableHead>
                  <TableHead>Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatoriosMovimentacao.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.produto}</TableCell>
                    <TableCell>{item.entradas} {item.unidade}</TableCell>
                    <TableCell>{item.saidas} {item.unidade}</TableCell>
                    <TableCell>
                      <Badge variant={item.saldoAtual > 5 ? 'default' : 'destructive'}>
                        {item.saldoAtual} {item.unidade}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
