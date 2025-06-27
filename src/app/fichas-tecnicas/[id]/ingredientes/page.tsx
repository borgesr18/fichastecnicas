'use client'

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  ArrowLeft,
  Edit,
  Trash2
} from 'lucide-react'

interface Ingrediente {
  id: string
  insumo: {
    id: string
    nome: string
    unidadeMedida: {
      nome: string
      simbolo: string
    }
  }
  unidadeMedida: {
    nome: string
    simbolo: string
  }
  quantidade: number
  fatorConversao: number
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

interface FichaTecnica {
  id: string
  nome: string
  categoria: {
    nome: string
  }
}

export default function IngredientesFichaTecnicaPage({ params }: { params: Promise<{ id: string }> }) {
  const [ficha, setFicha] = useState<FichaTecnica | null>(null)
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (resolvedParams) {
      fetchFicha()
      fetchIngredientes()
      fetchInsumos()
    }
  }, [resolvedParams])

  const fetchFicha = async () => {
    if (!resolvedParams) return
    try {
      const response = await fetch(`/api/fichas-tecnicas/${resolvedParams.id}`)
      if (!response.ok) throw new Error('Failed to fetch ficha técnica')
      const data = await response.json()
      setFicha(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const fetchIngredientes = async () => {
    if (!resolvedParams) return
    try {
      setLoading(true)
      const response = await fetch(`/api/fichas-tecnicas/${resolvedParams.id}/ingredientes`)
      if (!response.ok) throw new Error('Failed to fetch ingredientes')
      const data = await response.json()
      setIngredientes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
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

  const handleAddIngrediente = async (formData: FormData) => {
    if (!resolvedParams) return
    try {
      const insumoId = formData.get('insumo')
      const quantidade = parseFloat(formData.get('quantidade') as string)
      const fatorConversao = parseFloat(formData.get('fatorConversao') as string) || 1
      const unidadeMedidaId = formData.get('unidadeMedida')
      
      const insumo = insumos.find(p => p.id === insumoId)
      if (!insumo) throw new Error('Insumo não encontrado')
      
      const response = await fetch(`/api/fichas-tecnicas/${resolvedParams.id}/ingredientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insumoId,
          quantidade,
          fatorConversao,
          unidadeMedidaId: unidadeMedidaId || insumo.unidadeMedida.id
        })
      })
      
      if (!response.ok) throw new Error('Failed to add ingrediente')
      
      await fetchIngredientes()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add ingrediente')
    }
  }

  const handleDeleteIngrediente = async (id: string) => {
    if (!resolvedParams) return
    if (!confirm('Tem certeza que deseja remover este ingrediente?')) return
    
    try {
      const response = await fetch(`/api/fichas-tecnicas/${resolvedParams.id}/ingredientes/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete ingrediente')
      
      await fetchIngredientes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ingrediente')
    }
  }

  const custoTotal = ingredientes.reduce((total, ing) => total + (ing.quantidade * ing.fatorConversao), 0)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando ingredientes...</div>
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Ingredientes - {ficha?.nome}
              </h1>
              <p className="text-muted-foreground">
                Categoria: {ficha?.categoriaReceita.nome}
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Ingrediente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Ingrediente</DialogTitle>
                <DialogDescription>
                  Adicione um novo ingrediente à ficha técnica
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleAddIngrediente(formData)
              }}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="insumo">Insumo</Label>
                    <select
                      id="insumo"
                      name="insumo"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Selecione um insumo</option>
                      {insumos.map((insumo) => (
                        <option key={insumo.id} value={insumo.id}>
                          {insumo.nome} - R$ {Number(insumo.custoUnitario).toFixed(2)}/{insumo.unidadeMedida.simbolo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input id="quantidade" name="quantidade" type="number" step="0.01" placeholder="1.5" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatorConversao">Fator Conversão</Label>
                      <Input id="fatorConversao" name="fatorConversao" type="number" step="0.01" placeholder="1.0" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Adicionar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ingredientes ({ingredientes.length})</CardTitle>
            <CardDescription>
              Custo Total: R$ {custoTotal.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Insumo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Fator Conversão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredientes.map((ingrediente) => (
                  <TableRow key={ingrediente.id}>
                    <TableCell className="font-medium">{ingrediente.insumo.nome}</TableCell>
                    <TableCell>{ingrediente.quantidade}</TableCell>
                    <TableCell>{ingrediente.unidadeMedida.simbolo}</TableCell>
                    <TableCell>{ingrediente.fatorConversao}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteIngrediente(ingrediente.id)}>
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
