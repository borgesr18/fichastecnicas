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
  Search,
  Edit,
  Trash2,
  Printer,
  FileText
} from 'lucide-react'

interface FichaTecnica {
  id: string
  nome: string
  categoria: string
  rendimento: number
  custoTotal: number
  custoPorcao: number
  tempoPreparo: number
  ingredientes: number
}

interface CategoriaReceita {
  id: string
  nome: string
}

export default function FichasTecnicasPage() {
  const [fichas, setFichas] = useState<FichaTecnica[]>([])
  const [categorias, setCategorias] = useState<CategoriaReceita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showIngredientDialog, setShowIngredientDialog] = useState(false)

  useEffect(() => {
    fetchFichas()
    fetchCategorias()
  }, [])

  const fetchFichas = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/fichas-tecnicas')
      if (!response.ok) throw new Error('Failed to fetch fichas técnicas')
      const data = await response.json()
      setFichas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias-receitas')
      if (!response.ok) throw new Error('Failed to fetch categorias')
      const data = await response.json()
      setCategorias(data)
    } catch (err) {
      console.error('Error fetching categorias:', err)
    }
  }

  const handleCreateFicha = async (formData: FormData) => {
    try {
      const userData = localStorage.getItem('user-data')
      let userId = 'cmcf4w2yj0003qhzr8vt0gz9l' // Default to existing user in database
      
      if (userData) {
        try {
          const user = JSON.parse(userData)
          userId = user.id === '1' ? 'cmcf4w2yj0003qhzr8vt0gz9l' : user.id
        } catch {
          userId = 'cmcf4w2yj0003qhzr8vt0gz9l'
        }
      }
      
      const response = await fetch('/api/fichas-tecnicas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.get('nome'),
          categoriaReceitaId: formData.get('categoria'),
          rendimentoTotal: formData.get('rendimento'),
          unidadeRendimento: formData.get('unidadeRendimento'),
          modoPreparo: formData.get('modoPreparo'),
          tempoPreparoMin: formData.get('tempoPreparo'),
          userId: userId
        })
      })
      
      if (!response.ok) throw new Error('Failed to create ficha técnica')
      
      await fetchFichas()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ficha técnica')
    }
  }

  const handleDeleteFicha = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta ficha técnica?')) return
    
    try {
      const response = await fetch(`/api/fichas-tecnicas/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete ficha técnica')
      
      await fetchFichas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ficha técnica')
    }
  }

  const filteredFichas = fichas.filter(ficha =>
    ficha.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ficha.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando fichas técnicas...</div>
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
          <h1 className="text-2xl font-bold tracking-tight">Fichas Técnicas</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e fichas técnicas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ficha Técnica
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Ficha Técnica</DialogTitle>
              <DialogDescription>
                Crie uma nova ficha técnica para suas receitas
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleCreateFicha(formData)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Receita</Label>
                    <Input id="nome" name="nome" placeholder="Ex: Bolo de Chocolate" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <select
                      id="categoria"
                      name="categoria"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rendimento">Rendimento</Label>
                    <Input id="rendimento" name="rendimento" type="number" placeholder="12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempoPreparo">Tempo (min)</Label>
                    <Input id="tempoPreparo" name="tempoPreparo" type="number" placeholder="60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidadeRendimento">Unidade</Label>
                    <Input id="unidadeRendimento" name="unidadeRendimento" placeholder="porções" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modoPreparo">Modo de Preparo</Label>
                  <textarea
                    id="modoPreparo"
                    name="modoPreparo"
                    placeholder="Descreva o modo de preparo"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Ingredientes</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowIngredientDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Ingrediente
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Adicione ingredientes após criar a ficha técnica
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Criar Ficha Técnica
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
              Encontre rapidamente suas fichas técnicas
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
            <CardTitle>Fichas Técnicas ({filteredFichas.length})</CardTitle>
            <CardDescription>
              Lista de todas as fichas técnicas cadastradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Rendimento</TableHead>
                  <TableHead>Custo Total</TableHead>
                  <TableHead>Custo/Porção</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Ingredientes</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFichas.map((ficha) => (
                  <TableRow key={ficha.id}>
                    <TableCell className="font-medium">{ficha.nome}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ficha.categoria}</Badge>
                    </TableCell>
                    <TableCell>{ficha.rendimento} porções</TableCell>
                    <TableCell>R$ {ficha.custoTotal.toFixed(2)}</TableCell>
                    <TableCell>R$ {ficha.custoPorcao.toFixed(2)}</TableCell>
                    <TableCell>{ficha.tempoPreparo} min</TableCell>
                    <TableCell>{ficha.ingredientes} itens</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => window.open(`/fichas-tecnicas/${ficha.id}/ingredientes`, '_blank')}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.print()}>
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => alert(`Editar ficha técnica: ${ficha.nome}\nID: ${ficha.id}\nCategoria: ${ficha.categoria}\nRendimento: ${ficha.rendimento} porções`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteFicha(ficha.id)}>
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
