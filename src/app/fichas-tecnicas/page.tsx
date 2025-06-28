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
  FileText,
  X
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

interface Insumo {
  id: string
  nome: string
  custoUnitario: number
  unidadeMedida: {
    id: string
    nome: string
    simbolo: string
  }
}

interface IngredienteSelecionado {
  insumoId: string
  nome: string
  quantidade: string
  unidadeMedidaId: string
  unidadeMedida: string
  custoUnitario: number
  custoTotal: number
}

export default function FichasTecnicasPage() {
  const [fichas, setFichas] = useState<FichaTecnica[]>([])
  const [categorias, setCategorias] = useState<CategoriaReceita[]>([])
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState<IngredienteSelecionado[]>([])
  const [insumoSelecionado, setInsumoSelecionado] = useState('')
  const [quantidadeIngrediente, setQuantidadeIngrediente] = useState('')
  const [rendimento, setRendimento] = useState<number>(1)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedFicha, setSelectedFicha] = useState<FichaTecnica | null>(null)
  const [editFormData, setEditFormData] = useState({
    nome: '',
    categoriaReceitaId: '',
    rendimentoTotal: 1,
    unidadeRendimento: '',
    modoPreparo: '',
    tempoPreparoMin: 0
  })

  useEffect(() => {
    fetchFichas()
    fetchCategorias()
    fetchInsumos()
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

  const fetchInsumos = async () => {
    try {
      const response = await fetch('/api/produtos')
      if (!response.ok) throw new Error('Failed to fetch insumos')
      const data = await response.json()
      setInsumos(data)
    } catch (err) {
      console.error('Error fetching insumos:', err)
    }
  }

  const adicionarIngrediente = () => {
    if (!insumoSelecionado || !quantidadeIngrediente) return
    
    const insumo = insumos.find(i => i.id === insumoSelecionado)
    if (!insumo) return
    
    const quantidade = parseFloat(quantidadeIngrediente)
    const custoTotal = quantidade * insumo.custoUnitario
    
    const novoIngrediente: IngredienteSelecionado = {
      insumoId: insumo.id,
      nome: insumo.nome,
      quantidade: quantidadeIngrediente,
      unidadeMedidaId: insumo.unidadeMedida.id,
      unidadeMedida: insumo.unidadeMedida.simbolo,
      custoUnitario: insumo.custoUnitario,
      custoTotal: custoTotal
    }
    
    setIngredientesSelecionados([...ingredientesSelecionados, novoIngrediente])
    setInsumoSelecionado('')
    setQuantidadeIngrediente('')
  }

  const removerIngrediente = (index: number) => {
    setIngredientesSelecionados(ingredientesSelecionados.filter((_, i) => i !== index))
  }

  const calcularCustoTotal = () => {
    return ingredientesSelecionados.reduce((total, ingrediente) => total + ingrediente.custoTotal, 0)
  }

  const calcularCustoPorcao = (rendimento: number) => {
    const custoTotal = calcularCustoTotal()
    return rendimento > 0 ? custoTotal / rendimento : 0
  }

  const resetForm = () => {
    setIngredientesSelecionados([])
    setInsumoSelecionado('')
    setQuantidadeIngrediente('')
    setRendimento(1)
    setIsDialogOpen(false)
  }

  const handleCreateFicha = async (formData: FormData) => {
    try {
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
          userId: 'default-user-id'
        })
      })
      
      if (!response.ok) throw new Error('Failed to create ficha técnica')
      
      await fetchFichas()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ficha técnica')
    }
  }

  const handleViewFicha = (ficha: FichaTecnica) => {
    setSelectedFicha(ficha)
    setIsViewDialogOpen(true)
  }

  const handlePrintFicha = (ficha: FichaTecnica) => {
    alert(`Imprimindo ficha técnica: ${ficha.nome}\nFuncionalidade de impressão será implementada em breve`)
  }

  const handleEditFicha = async (ficha: FichaTecnica) => {
    try {
      // Fetch full ficha data including ingredients
      const response = await fetch(`/api/fichas-tecnicas/${ficha.id}`)
      if (!response.ok) throw new Error('Failed to fetch ficha details')
      
      const fullFicha = await response.json()
      
      setSelectedFicha(ficha)
      setEditFormData({
        nome: fullFicha.nome,
        categoriaReceitaId: fullFicha.categoriaReceita.id,
        rendimentoTotal: fullFicha.rendimentoTotal,
        unidadeRendimento: fullFicha.unidadeRendimento || '',
        modoPreparo: fullFicha.modoPreparo || '',
        tempoPreparoMin: fullFicha.tempoPreparoMin || 0
      })
      setIsEditDialogOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ficha for editing')
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFicha) return

    try {
      const response = await fetch(`/api/fichas-tecnicas/${selectedFicha.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      })
      
      if (!response.ok) throw new Error('Failed to update ficha técnica')
      
      await fetchFichas()
      setIsEditDialogOpen(false)
      setSelectedFicha(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ficha técnica')
    }
  }

  const handleDeleteFicha = async (fichaId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta ficha técnica?')) return
    
    try {
      const response = await fetch(`/api/fichas-tecnicas/${fichaId}`, {
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            }} className="flex flex-col max-h-full">
              <div className="flex-1 overflow-y-auto">
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
                      <Input 
                        id="rendimento" 
                        name="rendimento" 
                        type="number" 
                        placeholder="12" 
                        value={rendimento}
                        onChange={(e) => setRendimento(parseFloat(e.target.value) || 1)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tempoPreparo">Tempo (min)</Label>
                      <Input 
                        id="tempoPreparo" 
                        name="tempoPreparo" 
                        type="number" 
                        placeholder="60" 
                      />
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
                  
                  <div className="space-y-4">
                    <Label>Ingredientes</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="insumo">Insumo</Label>
                        <select
                          id="insumo"
                          value={insumoSelecionado}
                          onChange={(e) => setInsumoSelecionado(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Selecione um insumo</option>
                          {insumos.map((insumo) => (
                            <option key={insumo.id} value={insumo.id}>
                              {insumo.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantidade">Quantidade</Label>
                        <Input
                          id="quantidade"
                          type="number"
                          step="0.001"
                          placeholder="0.000"
                          value={quantidadeIngrediente}
                          onChange={(e) => setQuantidadeIngrediente(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>&nbsp;</Label>
                        <Button type="button" onClick={adicionarIngrediente} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                    
                    {ingredientesSelecionados.length > 0 && (
                      <div className="border rounded-md max-h-60 overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ingrediente</TableHead>
                              <TableHead>Quantidade</TableHead>
                              <TableHead>Unidade</TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ingredientesSelecionados.map((ingrediente, index) => (
                              <TableRow key={index}>
                                <TableCell>{ingrediente.nome}</TableCell>
                                <TableCell>{ingrediente.quantidade}</TableCell>
                                <TableCell>{ingrediente.unidadeMedida}</TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removerIngrediente(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t bg-background">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Criar Ficha Técnica
                </Button>
              </div>
            </form>
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
                    <Input 
                      id="rendimento" 
                      name="rendimento" 
                      type="number" 
                      placeholder="12" 
                      value={rendimento}
                      onChange={(e) => setRendimento(parseFloat(e.target.value) || 1)}
                      required 
                    />
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
                
                {ingredientesSelecionados.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-md">
                    <div className="space-y-2">
                      <Label>Custo Total</Label>
                      <div className="text-2xl font-bold text-green-600">
                        R$ {calcularCustoTotal().toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Custo por Porção</Label>
                      <div className="text-2xl font-bold text-blue-600">
                        R$ {calcularCustoPorcao(rendimento).toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="modoPreparo">Modo de Preparo</Label>
                  <textarea
                    id="modoPreparo"
                    name="modoPreparo"
                    placeholder="Descreva o modo de preparo"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Ingredientes</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insumo">Insumo</Label>
                      <select
                        id="insumo"
                        value={insumoSelecionado}
                        onChange={(e) => setInsumoSelecionado(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione um insumo</option>
                        {insumos.map((insumo) => (
                          <option key={insumo.id} value={insumo.id}>
                            {insumo.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        step="0.001"
                        placeholder="0.000"
                        value={quantidadeIngrediente}
                        onChange={(e) => setQuantidadeIngrediente(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button type="button" onClick={adicionarIngrediente} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                  
                  {ingredientesSelecionados.length > 0 && (
                    <div className="border rounded-md max-h-60 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ingrediente</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Unidade</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ingredientesSelecionados.map((ingrediente, index) => (
                            <TableRow key={index}>
                              <TableCell>{ingrediente.nome}</TableCell>
                              <TableCell>{ingrediente.quantidade}</TableCell>
                              <TableCell>{ingrediente.unidadeMedida}</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removerIngrediente(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
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
                        <Button variant="outline" size="sm" onClick={() => handleViewFicha(ficha)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handlePrintFicha(ficha)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditFicha(ficha)}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Ficha Técnica</DialogTitle>
            <DialogDescription>
              Atualize as informações da ficha técnica
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nome">Nome da Receita</Label>
                  <Input 
                    id="edit-nome" 
                    value={editFormData.nome}
                    onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                    placeholder="Ex: Bolo de Chocolate" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-categoria">Categoria</Label>
                  <select
                    id="edit-categoria"
                    value={editFormData.categoriaReceitaId}
                    onChange={(e) => setEditFormData({ ...editFormData, categoriaReceitaId: e.target.value })}
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
                  <Label htmlFor="edit-rendimento">Rendimento</Label>
                  <Input 
                    id="edit-rendimento" 
                    type="number" 
                    value={editFormData.rendimentoTotal}
                    onChange={(e) => setEditFormData({ ...editFormData, rendimentoTotal: parseFloat(e.target.value) || 1 })}
                    placeholder="12" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tempoPreparo">Tempo (min)</Label>
                  <Input 
                    id="edit-tempoPreparo" 
                    type="number" 
                    value={editFormData.tempoPreparoMin}
                    onChange={(e) => setEditFormData({ ...editFormData, tempoPreparoMin: parseInt(e.target.value) || 0 })}
                    placeholder="60" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unidadeRendimento">Unidade</Label>
                  <Input 
                    id="edit-unidadeRendimento" 
                    value={editFormData.unidadeRendimento}
                    onChange={(e) => setEditFormData({ ...editFormData, unidadeRendimento: e.target.value })}
                    placeholder="porções" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-modoPreparo">Modo de Preparo</Label>
                <textarea
                  id="edit-modoPreparo"
                  value={editFormData.modoPreparo}
                  onChange={(e) => setEditFormData({ ...editFormData, modoPreparo: e.target.value })}
                  placeholder="Descreva o modo de preparo"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Atualizar Ficha Técnica
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visualizar Ficha Técnica</DialogTitle>
            <DialogDescription>
              Detalhes completos da ficha técnica
            </DialogDescription>
          </DialogHeader>
          {selectedFicha && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                  <p className="text-lg font-semibold">{selectedFicha.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Categoria</Label>
                  <p className="text-lg"><Badge variant="secondary">{selectedFicha.categoria}</Badge></p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Rendimento</Label>
                  <p className="text-lg font-semibold">{selectedFicha.rendimento} porções</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tempo de Preparo</Label>
                  <p className="text-lg font-semibold">{selectedFicha.tempoPreparo} min</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ingredientes</Label>
                  <p className="text-lg font-semibold">{selectedFicha.ingredientes} itens</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-md">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Custo Total</Label>
                  <p className="text-2xl font-bold text-green-600">R$ {selectedFicha.custoTotal.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Custo por Porção</Label>
                  <p className="text-2xl font-bold text-blue-600">R$ {selectedFicha.custoPorcao.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  )
}
