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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { 
  Plus,
  Edit,
  Trash2,
  Settings,
  Users,
  Tag,
  Ruler
} from 'lucide-react'

interface Categoria {
  id: string
  nome: string
  descricao: string
  ativa: boolean
}

interface CategoriaInsumo {
  id: string
  nome: string
  descricao: string
  ativa: boolean
}

interface UnidadeMedida {
  id: string
  nome: string
  simbolo: string
  tipo: string
}

interface Usuario {
  id: string
  nome: string
  email: string
  role: string
  ativo: boolean
}

export default function ConfiguracoesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: '1', nome: 'Sobremesas', descricao: 'Doces e sobremesas', ativa: true },
    { id: '2', nome: 'Pratos Principais', descricao: 'Pratos principais', ativa: true },
    { id: '3', nome: 'Entradas', descricao: 'Aperitivos e entradas', ativa: true }
  ])

  const [unidades, setUnidades] = useState<UnidadeMedida[]>([
    { id: '1', nome: 'Quilograma', simbolo: 'kg', tipo: 'Peso' },
    { id: '2', nome: 'Litro', simbolo: 'L', tipo: 'Volume' },
    { id: '3', nome: 'Unidade', simbolo: 'un', tipo: 'Quantidade' },
    { id: '4', nome: 'Grama', simbolo: 'g', tipo: 'Peso' }
  ])

  const [categoriasInsumos, setCategoriasInsumos] = useState<CategoriaInsumo[]>([
    { id: '1', nome: 'Farinhas', descricao: 'Farinhas e derivados', ativa: true },
    { id: '2', nome: 'Açúcares', descricao: 'Açúcares e adoçantes', ativa: true },
    { id: '3', nome: 'Chocolates', descricao: 'Chocolates e cacau', ativa: true },
    { id: '4', nome: 'Laticínios', descricao: 'Leites, queijos e derivados', ativa: true }
  ])

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', nome: 'Administrador', email: 'admin@sistemachef.com', role: 'admin', ativo: true },
    { id: '2', nome: 'Editor', email: 'editor@sistemachef.com', role: 'editor', ativo: true },
    { id: '3', nome: 'Visualizador', email: 'viewer@sistemachef.com', role: 'viewer', ativo: false }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'categoria' | 'categoria-insumo' | 'unidade' | 'usuario'>('categoria')

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'editor': return 'default'
      case 'viewer': return 'secondary'
      default: return 'secondary'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador'
      case 'editor': return 'Editor'
      case 'viewer': return 'Visualizador'
      default: return role
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie categorias, unidades de medida e usuários
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogType === 'categoria' && 'Nova Categoria'}
                {dialogType === 'categoria-insumo' && 'Nova Categoria de Insumo'}
                {dialogType === 'unidade' && 'Nova Unidade de Medida'}
                {dialogType === 'usuario' && 'Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                Cadastre um novo item no sistema
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {dialogType === 'categoria' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome-cat">Nome da Categoria</Label>
                    <Input id="nome-cat" placeholder="Ex: Sobremesas" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc-cat">Descrição</Label>
                    <Input id="desc-cat" placeholder="Descrição da categoria" />
                  </div>
                </>
              )}

              {dialogType === 'categoria-insumo' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome-cat-insumo">Nome da Categoria</Label>
                    <Input id="nome-cat-insumo" placeholder="Ex: Farinhas" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc-cat-insumo">Descrição</Label>
                    <Input id="desc-cat-insumo" placeholder="Descrição da categoria de insumo" />
                  </div>
                </>
              )}
              
              {dialogType === 'unidade' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-un">Nome</Label>
                      <Input id="nome-un" placeholder="Ex: Quilograma" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="simbolo-un">Símbolo</Label>
                      <Input id="simbolo-un" placeholder="Ex: kg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo-un">Tipo</Label>
                    <Input id="tipo-un" placeholder="Ex: Peso, Volume, Quantidade" />
                  </div>
                </>
              )}
              
              {dialogType === 'usuario' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome-user">Nome</Label>
                    <Input id="nome-user" placeholder="Nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-user">Email</Label>
                    <Input id="email-user" type="email" placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-user">Função</Label>
                    <Input id="role-user" placeholder="admin, editor, viewer" />
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Cadastrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="categorias" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categorias">Categorias de Receitas</TabsTrigger>
          <TabsTrigger value="categorias-insumos">Categorias de Insumos</TabsTrigger>
          <TabsTrigger value="unidades">Unidades de Medida</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categorias de Receitas ({categorias.length})
              </CardTitle>
              <CardDescription>
                Gerencie as categorias para organizar suas receitas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categorias.map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell className="font-medium">{categoria.nome}</TableCell>
                      <TableCell>{categoria.descricao}</TableCell>
                      <TableCell>
                        <Badge variant={categoria.ativa ? 'default' : 'secondary'}>
                          {categoria.ativa ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
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
        </TabsContent>

        <TabsContent value="categorias-insumos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categorias de Insumos ({categoriasInsumos.length})
              </CardTitle>
              <CardDescription>
                Gerencie as categorias para organizar seus insumos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriasInsumos.map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell className="font-medium">{categoria.nome}</TableCell>
                      <TableCell>{categoria.descricao}</TableCell>
                      <TableCell>
                        <Badge variant={categoria.ativa ? 'default' : 'secondary'}>
                          {categoria.ativa ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
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
        </TabsContent>

        <TabsContent value="unidades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Unidades de Medida ({unidades.length})
              </CardTitle>
              <CardDescription>
                Gerencie as unidades de medida para ingredientes e insumos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Símbolo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unidades.map((unidade) => (
                    <TableRow key={unidade.id}>
                      <TableCell className="font-medium">{unidade.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{unidade.simbolo}</Badge>
                      </TableCell>
                      <TableCell>{unidade.tipo}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
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
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários ({usuarios.length})
              </CardTitle>
              <CardDescription>
                Gerencie os usuários e suas permissões no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleColor(usuario.role)}>
                          {getRoleText(usuario.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={usuario.ativo ? 'default' : 'secondary'}>
                          {usuario.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
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
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
