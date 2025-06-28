'use client'

import React, { useState } from 'react'
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
  X
} from 'lucide-react'

// Mock data for demo
const mockCategorias = [
  { id: '1', nome: 'Bolos' },
  { id: '2', nome: 'Tortas' },
  { id: '3', nome: 'Sobremesas' }
]

const mockInsumos = [
  { id: '1', nome: 'Farinha de Trigo', custoUnitario: 0.005, unidadeMedida: { id: '1', simbolo: 'g' } },
  { id: '2', nome: 'Açúcar', custoUnitario: 0.004, unidadeMedida: { id: '2', simbolo: 'g' } },
  { id: '3', nome: 'Ovos', custoUnitario: 0.50, unidadeMedida: { id: '3', simbolo: 'un' } },
  { id: '4', nome: 'Manteiga', custoUnitario: 0.015, unidadeMedida: { id: '4', simbolo: 'g' } },
  { id: '5', nome: 'Leite', custoUnitario: 0.003, unidadeMedida: { id: '5', simbolo: 'ml' } }
]

interface IngredienteSelecionado {
  insumoId: string
  nome: string
  quantidade: string
  unidadeMedidaId: string
  unidadeMedida: string
  custoUnitario: number
  custoTotal: number
}

export default function FichasTecnicasDemo() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState<IngredienteSelecionado[]>([])
  const [insumoSelecionado, setInsumoSelecionado] = useState('')
  const [quantidadeIngrediente, setQuantidadeIngrediente] = useState('')
  const [rendimento, setRendimento] = useState(1)

  const adicionarIngrediente = () => {
    if (!insumoSelecionado || !quantidadeIngrediente) return
    
    const insumo = mockInsumos.find(i => i.id === insumoSelecionado)
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fichas Técnicas - Demo</h1>
          <p className="text-muted-foreground">
            Demonstração do novo layout em duas colunas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ficha Técnica
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Nova Ficha Técnica</DialogTitle>
              <DialogDescription>
                Crie uma nova ficha técnica para suas receitas
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              alert('Demo: Ficha técnica criada com sucesso!')
              resetForm()
            }}>
              <div className="grid grid-cols-2 gap-6 py-4">
                {/* Coluna da Esquerda - Campos Principais */}
                <div className="space-y-4">
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
                        {mockCategorias.map((categoria) => (
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="modoPreparo">Modo de Preparo</Label>
                    <textarea
                      id="modoPreparo"
                      name="modoPreparo"
                      placeholder="Descreva o modo de preparo"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
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
                </div>

                {/* Coluna da Direita - Ingredientes */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Ingredientes</Label>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="insumo">Insumo</Label>
                        <select
                          id="insumo"
                          value={insumoSelecionado}
                          onChange={(e) => setInsumoSelecionado(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Selecione um insumo</option>
                          {mockInsumos.map((insumo) => (
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
                      <div className="border rounded-md">
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
              
              {/* Footer com botões sempre visível */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>
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

      <Card>
        <CardHeader>
          <CardTitle>Demonstração do Novo Layout</CardTitle>
          <CardDescription>
            Clique no botão "Nova Ficha Técnica" para ver o modal reestruturado em duas colunas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            O modal agora é 2x mais largo com layout em duas colunas:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Coluna esquerda: campos principais (nome, categoria, rendimento, tempo, modo de preparo)</li>
            <li>Coluna direita: ingredientes com rolagem própria (max-h-[70vh])</li>
            <li>Rodapé com botões sempre visível</li>
            <li>Melhoria na usabilidade para receitas com muitos ingredientes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}