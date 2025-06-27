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
  Plus,
  Minus,
  Search,
  TrendingUp,
  TrendingDown,
  Package
} from 'lucide-react'

interface MovimentacaoEstoque {
  id: string
  produto: string
  tipo: 'entrada' | 'saida'
  quantidade: number
  unidade: string
  motivo: string
  data: string
  usuario: string
}

export default function EstoquePage() {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([
    {
      id: '1',
      produto: 'Farinha de Trigo',
      tipo: 'entrada',
      quantidade: 10,
      unidade: 'kg',
      motivo: 'Compra - Fornecedor ABC',
      data: '2024-06-27',
      usuario: 'admin@sistemachef.com'
    },
    {
      id: '2',
      produto: 'Açúcar Cristal',
      tipo: 'saida',
      quantidade: 2,
      unidade: 'kg',
      motivo: 'Produção - Bolo de Chocolate',
      data: '2024-06-27',
      usuario: 'admin@sistemachef.com'
    }
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>('entrada')

  const filteredMovimentacoes = movimentacoes.filter(mov =>
    mov.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Controle de Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie entradas e saídas de produtos
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setTipoMovimentacao('entrada')}>
                <Plus className="mr-2 h-4 w-4" />
                Entrada
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setTipoMovimentacao('saida')}>
                <Minus className="mr-2 h-4 w-4" />
                Saída
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {tipoMovimentacao === 'entrada' ? 'Entrada de Estoque' : 'Saída de Estoque'}
                </DialogTitle>
                <DialogDescription>
                  Registre uma {tipoMovimentacao} de produto no estoque
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="produto">Produto</Label>
                  <Input id="produto" placeholder="Selecione o produto" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input id="quantidade" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade</Label>
                    <Input id="unidade" placeholder="kg, L, un" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo</Label>
                  <Input 
                    id="motivo" 
                    placeholder={
                      tipoMovimentacao === 'entrada' 
                        ? "Ex: Compra - Fornecedor XYZ" 
                        : "Ex: Produção - Nome da Receita"
                    } 
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Registrar {tipoMovimentacao === 'entrada' ? 'Entrada' : 'Saída'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Produtos cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entradas Hoje
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Movimentações de entrada
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saídas Hoje
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Movimentações de saída
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Total
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.245,80</div>
            <p className="text-xs text-muted-foreground">
              Valor total em estoque
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Encontre rapidamente as movimentações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por produto ou motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentações Recentes ({filteredMovimentacoes.length})</CardTitle>
            <CardDescription>
              Histórico de entradas e saídas de estoque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Usuário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovimentacoes.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>{new Date(mov.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-medium">{mov.produto}</TableCell>
                    <TableCell>
                      <Badge variant={mov.tipo === 'entrada' ? 'default' : 'secondary'}>
                        {mov.tipo === 'entrada' ? (
                          <><TrendingUp className="mr-1 h-3 w-3" /> Entrada</>
                        ) : (
                          <><TrendingDown className="mr-1 h-3 w-3" /> Saída</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{mov.quantidade} {mov.unidade}</TableCell>
                    <TableCell>{mov.motivo}</TableCell>
                    <TableCell>{mov.usuario}</TableCell>
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
