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

export default function FichasTecnicasPage() {
  const [fichas, setFichas] = useState<FichaTecnica[]>([
    {
      id: '1',
      nome: 'Bolo de Chocolate',
      categoria: 'Sobremesas',
      rendimento: 12,
      custoTotal: 25.50,
      custoPorcao: 2.13,
      tempoPreparo: 60,
      ingredientes: 8
    },
    {
      id: '2',
      nome: 'Lasanha Bolonhesa',
      categoria: 'Pratos Principais',
      rendimento: 8,
      custoTotal: 45.80,
      custoPorcao: 5.73,
      tempoPreparo: 90,
      ingredientes: 12
    }
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredFichas = fichas.filter(ficha =>
    ficha.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ficha.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Receita</Label>
                  <Input id="nome" placeholder="Ex: Bolo de Chocolate" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input id="categoria" placeholder="Ex: Sobremesas" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rendimento">Rendimento</Label>
                  <Input id="rendimento" type="number" placeholder="12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempo">Tempo (min)</Label>
                  <Input id="tempo" type="number" placeholder="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="porcoes">Porções</Label>
                  <Input id="porcoes" type="number" placeholder="12" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Criar Ficha Técnica
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
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4" />
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
