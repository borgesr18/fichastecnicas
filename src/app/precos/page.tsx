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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Calculator,
  DollarSign,
  TrendingUp,
  Percent
} from 'lucide-react'

interface Preco {
  id: string
  produto: string
  custoProducao: number
  markup: number
  precoVenda: number
  margemLucro: number
  categoria: string
}

export default function PrecosPage() {
  const [precos, setPrecos] = useState<Preco[]>([
    {
      id: '1',
      produto: 'Bolo de Chocolate',
      custoProducao: 2.13,
      markup: 200,
      precoVenda: 6.39,
      margemLucro: 66.7,
      categoria: 'Sobremesas'
    },
    {
      id: '2',
      produto: 'Lasanha Bolonhesa',
      custoProducao: 5.73,
      markup: 150,
      precoVenda: 14.33,
      margemLucro: 60.0,
      categoria: 'Pratos Principais'
    }
  ])
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [custoSimulacao, setCustoSimulacao] = useState('')
  const [markupSimulacao, setMarkupSimulacao] = useState('')

  const calcularPrecoVenda = (custo: number, markup: number) => {
    return custo * (1 + markup / 100)
  }

  const calcularMargemLucro = (custo: number, precoVenda: number) => {
    return ((precoVenda - custo) / precoVenda) * 100
  }

  const precoSimulado = custoSimulacao && markupSimulacao 
    ? calcularPrecoVenda(parseFloat(custoSimulacao), parseFloat(markupSimulacao))
    : 0

  const margemSimulada = custoSimulacao && precoSimulado
    ? calcularMargemLucro(parseFloat(custoSimulacao), precoSimulado)
    : 0

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Preços</h1>
          <p className="text-muted-foreground">
            Calcule preços de venda com base em custos e markup
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calculator className="mr-2 h-4 w-4" />
              Calcular Preço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Calcular Preço de Venda</DialogTitle>
              <DialogDescription>
                Defina o preço de venda baseado no custo e markup
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="produto">Produto/Receita</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bolo-chocolate">Bolo de Chocolate</SelectItem>
                    <SelectItem value="lasanha-bolonhesa">Lasanha Bolonhesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custo">Custo de Produção</Label>
                  <Input id="custo" type="number" step="0.01" placeholder="0.00" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="markup">Markup (%)</Label>
                  <Input id="markup" type="number" placeholder="200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco-calculado">Preço Calculado</Label>
                  <Input id="preco-calculado" placeholder="R$ 0,00" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margem">Margem de Lucro</Label>
                  <Input id="margem" placeholder="0%" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preco-final">Preço de Venda Final</Label>
                <Input id="preco-final" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Salvar Preço
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Insumos Precificados
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{precos.length}</div>
            <p className="text-xs text-muted-foreground">
              Insumos com preço definido
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Markup Médio
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">175%</div>
            <p className="text-xs text-muted-foreground">
              Markup médio aplicado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Margem Média
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">63.4%</div>
            <p className="text-xs text-muted-foreground">
              Margem de lucro média
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ticket Médio
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 10,36</div>
            <p className="text-xs text-muted-foreground">
              Preço médio de venda
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Simulador de Preços</CardTitle>
            <CardDescription>
              Simule diferentes cenários de precificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="custo-sim">Custo de Produção</Label>
                <Input 
                  id="custo-sim" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00"
                  value={custoSimulacao}
                  onChange={(e) => setCustoSimulacao(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="markup-sim">Markup (%)</Label>
                <Input 
                  id="markup-sim" 
                  type="number" 
                  placeholder="200"
                  value={markupSimulacao}
                  onChange={(e) => setMarkupSimulacao(e.target.value)}
                />
              </div>
            </div>
            
            {precoSimulado > 0 && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Preço de Venda</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {precoSimulado.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Margem de Lucro</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {margemSimulada.toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preços Configurados ({precos.length})</CardTitle>
            <CardDescription>
              Lista de insumos com preços definidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Markup</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Margem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {precos.map((preco) => (
                  <TableRow key={preco.id}>
                    <TableCell className="font-medium">{preco.produto}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{preco.categoria}</Badge>
                    </TableCell>
                    <TableCell>R$ {preco.custoProducao.toFixed(2)}</TableCell>
                    <TableCell>{preco.markup}%</TableCell>
                    <TableCell>R$ {preco.precoVenda.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {preco.margemLucro.toFixed(1)}%
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
