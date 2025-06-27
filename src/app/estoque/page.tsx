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

interface Produto {
  id: string
  nome: string
  unidadeMedida: {
    id: string
    simbolo: string
  }
}

export default function EstoquePage() {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>('entrada')

  useEffect(() => {
    fetchMovimentacoes()
    fetchProdutos()
  }, [])

  const fetchMovimentacoes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/estoque')
      if (!response.ok) throw new Error('Failed to fetch movimentações')
      const data = await response.json()
      setMovimentacoes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchProdutos = async () => {
    try {
      const response = await fetch('/api/produtos')
      if (!response.ok) throw new Error('Failed to fetch produtos')
      const data = await response.json()
      setProdutos(data)
    } catch (err) {
      console.error('Error fetching produtos:', err)
    }
  }

  const handleCreateMovimentacao = async (formData: FormData) => {
    try {
      const produtoSelecionado = produtos.find(p => p.id === formData.get('produto'))
      const response = await fetch('/api/estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insumoId: formData.get('produto'),
          tipo: tipoMovimentacao,
          quantidade: formData.get('quantidade'),
          unidadeMedidaId: produtoSelecionado?.unidadeMedida.id,
          observacao: formData.get('motivo'),
          valorUnitario: formData.get('valorUnitario'),
          userId: 'default-user-id'
        })
      })
      
      if (!response.ok) throw new Error('Failed to create movimentação')
      
      await fetchMovimentacoes()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create movimentação')
    }
  }

  const filteredMovimentacoes = movimentacoes.filter(mov =>
    mov.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalEstoque = movimentacoes.length
  const entradasHoje = movimentacoes.filter(m => m.tipo === 'entrada' && m.data === new Date().toISOString().split('T')[0]).length
  const saidasHoje = movimentacoes.filter(m => m.tipo === 'saida' && m.data === new Date().toISOString().split('T')[0]).length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando movimentações...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Erro: {error}</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Controle de Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie entradas e saídas de insumos
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
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleCreateMovimentacao(formData)
              }}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="produto">Produto</Label>
                    <select
                      id="produto"
                      name="produto"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Selecione um produto</option>
                      {produtos.map((produto) => (
                        <option key={produto.id} value={produto.id}>
                          {produto.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input id="quantidade" name="quantidade" type="number" step="0.01" placeholder="0" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorUnitario">Valor Unitário</Label>
                      <Input id="valorUnitario" name="valorUnitario" type="number" step="0.01" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motivo">Motivo</Label>
                    <Input 
                      id="motivo" 
                      name="motivo"
                      placeholder={
                        tipoMovimentacao === 'entrada' 
                          ? "Ex: Compra - Fornecedor XYZ" 
                          : "Ex: Produção - Nome da Receita"
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Registrar {tipoMovimentacao === 'entrada' ? 'Entrada' : 'Saída'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Movimentações
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEstoque}</div>
            <p className="text-xs text-muted-foreground">
              Movimentações registradas
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
            <div className="text-2xl font-bold">{entradasHoje}</div>
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
            <div className="text-2xl font-bold">{saidasHoje}</div>
            <p className="text-xs text-muted-foreground">
              Movimentações de saída
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Cadastrados
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produtos.length}</div>
            <p className="text-xs text-muted-foreground">
              Insumos disponíveis
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
