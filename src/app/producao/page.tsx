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
  Plus,
  Search,
  Factory,
  Clock,
  CheckCircle
} from 'lucide-react'

interface Producao {
  id: string
  fichaTecnica: string
  quantidade: number
  dataProducao: string
  status: 'planejada' | 'em_andamento' | 'concluida'
  custoTotal: number
  responsavel: string
}

export default function ProducaoPage() {
  const [producoes] = useState<Producao[]>([
    {
      id: '1',
      fichaTecnica: 'Bolo de Chocolate',
      quantidade: 2,
      dataProducao: '2024-06-27',
      status: 'concluida',
      custoTotal: 51.00,
      responsavel: 'admin@sistemachef.com'
    },
    {
      id: '2',
      fichaTecnica: 'Lasanha Bolonhesa',
      quantidade: 1,
      dataProducao: '2024-06-27',
      status: 'em_andamento',
      custoTotal: 45.80,
      responsavel: 'admin@sistemachef.com'
    }
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredProducoes = producoes.filter(producao =>
    producao.fichaTecnica.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planejada': return 'secondary'
      case 'em_andamento': return 'default'
      case 'concluida': return 'default'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planejada': return 'Planejada'
      case 'em_andamento': return 'Em Andamento'
      case 'concluida': return 'Concluída'
      default: return status
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Controle de Produção</h1>
          <p className="text-muted-foreground">
            Gerencie a produção de receitas e controle de estoque
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Produção
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Produção</DialogTitle>
              <DialogDescription>
                Registre uma nova produção de receita
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ficha">Ficha Técnica</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma ficha técnica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bolo-chocolate">Bolo de Chocolate</SelectItem>
                    <SelectItem value="lasanha-bolonhesa">Lasanha Bolonhesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade de Lotes</Label>
                  <Input id="quantidade" type="number" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data de Produção</Label>
                  <Input id="data" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input id="observacoes" placeholder="Observações sobre a produção" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Iniciar Produção
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
              Produções Hoje
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Produções registradas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Andamento
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Produções em andamento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Concluídas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Produções concluídas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Custo Total
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 96,80</div>
            <p className="text-xs text-muted-foreground">
              Custo total das produções
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Encontre rapidamente as produções
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ficha técnica..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produções ({filteredProducoes.length})</CardTitle>
            <CardDescription>
              Lista de todas as produções registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Ficha Técnica</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Custo Total</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducoes.map((producao) => (
                  <TableRow key={producao.id}>
                    <TableCell>{new Date(producao.dataProducao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-medium">{producao.fichaTecnica}</TableCell>
                    <TableCell>{producao.quantidade} lotes</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(producao.status)}>
                        {getStatusText(producao.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>R$ {producao.custoTotal.toFixed(2)}</TableCell>
                    <TableCell>{producao.responsavel}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {producao.status === 'em_andamento' && (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Factory className="h-4 w-4" />
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
