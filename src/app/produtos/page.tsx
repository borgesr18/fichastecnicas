'use client'

import React, { useState, useEffect } from 'react'
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
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Loader2
} from 'lucide-react'

interface Categoria {
  id: string
  nome: string
}

interface Unidade {
  id: string
  nome: string
  simbolo: string
}

interface Produto {
  id: string
  nome: string
  categoriaInsumo: Categoria
  unidadeMedida: Unidade
  custoUnitario: number
  estoqueAtual: number
  estoqueMinimo: number
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    categoriaId: '',
    unidadeId: '',
    custoUnitario: '',
    estoqueMinimo: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [produtosRes, categoriasRes, unidadesRes] = await Promise.all([
        fetch('/api/produtos'),
        fetch('/api/categorias-insumos'),
        fetch('/api/unidades')
      ])

      if (!produtosRes.ok || !categoriasRes.ok || !unidadesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [produtosData, categoriasData, unidadesData] = await Promise.all([
        produtosRes.json(),
        categoriasRes.json(),
        unidadesRes.json()
      ])

      setProdutos(produtosData)
      setCategorias(categoriasData)
      setUnidades(unidadesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduto = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to create produto')
      
      await fetchData()
      setIsDialogOpen(false)
      setFormData({
        nome: '',
        categoriaId: '',
        unidadeId: '',
        custoUnitario: '',
        estoqueMinimo: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create produto')
    }
  }

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoriaInsumo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (produto: Produto) => {
    if (produto.estoqueAtual <= produto.estoqueMinimo) return 'destructive'
    return 'default'
  }

  const getStatusText = (produto: Produto) => {
    if (produto.estoqueAtual <= produto.estoqueMinimo) return 'Estoque Baixo'
    return 'Ativo'
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
            <form onSubmit={handleCreateProduto} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Insumo</Label>
                  <Input 
                    id="nome" 
                    placeholder="Ex: Farinha de Trigo"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formData.categoriaId} onValueChange={(value) => setFormData({...formData, categoriaId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select value={formData.unidadeId} onValueChange={(value) => setFormData({...formData, unidadeId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((unidade) => (
                        <SelectItem key={unidade.id} value={unidade.id}>
                          {unidade.nome} ({unidade.simbolo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custo">Custo Unitário</Label>
                  <Input 
                    id="custo" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00"
                    value={formData.custoUnitario}
                    onChange={(e) => setFormData({...formData, custoUnitario: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimo">Estoque Mínimo</Label>
                  <Input 
                    id="minimo" 
                    type="number" 
                    placeholder="5"
                    value={formData.estoqueMinimo}
                    onChange={(e) => setFormData({...formData, estoqueMinimo: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Cadastrar Insumo
                </Button>
              </div>
            </form>
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
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Carregando insumos...</span>
              </div>
            ) : (
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
                  {filteredProdutos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nenhum insumo encontrado. Cadastre o primeiro insumo clicando em &quot;Novo Insumo&quot;.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProdutos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">{produto.nome}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{produto.categoriaInsumo.nome}</Badge>
                        </TableCell>
                        <TableCell>{produto.unidadeMedida.simbolo}</TableCell>
                        <TableCell>R$ {Number(produto.custoUnitario).toFixed(2)}</TableCell>
                        <TableCell>{produto.estoqueAtual} {produto.unidadeMedida.simbolo}</TableCell>
                        <TableCell>{produto.estoqueMinimo} {produto.unidadeMedida.simbolo}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
