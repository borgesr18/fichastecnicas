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
  Search,
  Edit,
  Trash2,
  Package
} from 'lucide-react'

interface Produto {
  id: string
  nome: string
  categoria: string
  unidade: string
  custoUnitario: number
  estoque: number
  estoqueMinimo: number
  status: 'ativo' | 'inativo'
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: '1',
      nome: 'Farinha de Trigo',
      categoria: 'Farinhas',
      unidade: 'kg',
      custoUnitario: 4.50,
      estoque: 25,
      estoqueMinimo: 5,
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'Açúcar Cristal',
      categoria: 'Açúcares',
      unidade: 'kg',
      custoUnitario: 3.20,
      estoque: 15,
      estoqueMinimo: 10,
      status: 'ativo'
    },
    {
      id: '3',
      nome: 'Chocolate em Pó',
      categoria: 'Chocolates',
      unidade: 'kg',
      custoUnitario: 12.80,
      estoque: 3,
      estoqueMinimo: 5,
      status: 'ativo'
    }
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (produto: Produto) => {
    if (produto.estoque <= produto.estoqueMinimo) return 'destructive'
    if (produto.status === 'inativo') return 'secondary'
    return 'default'
  }

  const getStatusText = (produto: Produto) => {
    if (produto.estoque <= produto.estoqueMinimo) return 'Estoque Baixo'
    return produto.status === 'ativo' ? 'Ativo' : 'Inativo'
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Insumos</h1>
          <p className="text-muted-foreground">
            Gerencie seus insumos e ingredientes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Insumo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Insumo</DialogTitle>
              <DialogDescription>
                Cadastre um novo insumo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Insumo</Label>
                  <Input id="nome" placeholder="Ex: Farinha de Trigo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input id="categoria" placeholder="Ex: Farinhas" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Input id="unidade" placeholder="kg, L, un" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custo">Custo Unitário</Label>
                  <Input id="custo" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimo">Estoque Mínimo</Label>
                  <Input id="minimo" type="number" placeholder="5" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Cadastrar Insumo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Encontre rapidamente seus insumos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insumos ({filteredProdutos.length})</CardTitle>
            <CardDescription>
              Lista de todos os insumos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Custo Unitário</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Estoque Mínimo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{produto.categoria}</Badge>
                    </TableCell>
                    <TableCell>{produto.unidade}</TableCell>
                    <TableCell>R$ {produto.custoUnitario.toFixed(2)}</TableCell>
                    <TableCell>{produto.estoque} {produto.unidade}</TableCell>
                    <TableCell>{produto.estoqueMinimo} {produto.unidade}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(produto)}>
                        {getStatusText(produto)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Package className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
