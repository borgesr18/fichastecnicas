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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { 
  Plus,
  Edit,
  Trash2,
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
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [unidades, setUnidades] = useState<UnidadeMedida[]>([])
  const [categoriasInsumos, setCategoriasInsumos] = useState<CategoriaInsumo[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriasReceitasRes, categoriasRes, unidadesRes] = await Promise.all([
        fetch('/api/categorias-receitas'),
        fetch('/api/categorias-insumos'),
        fetch('/api/unidades')
      ])

      if (!categoriasReceitasRes.ok || !categoriasRes.ok || !unidadesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [categoriasReceitasData, categoriasData, unidadesData] = await Promise.all([
        categoriasReceitasRes.json(),
        categoriasRes.json(),
        unidadesRes.json()
      ])

      setCategorias(categoriasReceitasData.map((c: { id: string; nome: string; descricao: string }) => ({ ...c, ativa: true })))
      setUnidades(unidadesData.map((u: { id: string; nome: string; simbolo: string; tipo: string }) => ({ ...u, ativa: true })))
      setCategoriasInsumos(categoriasData.map((c: { id: string; nome: string; descricao: string }) => ({ ...c, ativa: true })))
      setUsuarios([
        { id: '1', nome: 'Administrador', email: 'admin@sistemachef.com', role: 'admin', ativo: true },
        { id: '2', nome: 'Editor', email: 'editor@sistemachef.com', role: 'editor', ativo: true },
        { id: '3', nome: 'Visualizador', email: 'viewer@sistemachef.com', role: 'viewer', ativo: false }
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'categoria' | 'categoria-insumo' | 'unidade' | 'usuario'>('categoria')

  const handleCreateCategoria = async (formData: FormData) => {
    try {
      const response = await fetch('/api/categorias-receitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.get('nome'),
          descricao: formData.get('descricao')
        })
      })
      
      if (!response.ok) throw new Error('Failed to create categoria')
      
      await fetchData()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create categoria')
    }
  }

  const handleCreateCategoriaInsumo = async (formData: FormData) => {
    try {
      const response = await fetch('/api/categorias-insumos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.get('nome'),
          descricao: formData.get('descricao')
        })
      })
      
      if (!response.ok) throw new Error('Failed to create categoria insumo')
      
      await fetchData()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create categoria insumo')
    }
  }

  const handleCreateUnidade = async (formData: FormData) => {
    try {
      const response = await fetch('/api/unidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.get('nome'),
          simbolo: formData.get('simbolo'),
          tipo: formData.get('tipo')
        })
      })
      
      if (!response.ok) throw new Error('Failed to create unidade')
      
      await fetchData()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create unidade')
    }
  }

  const handleCreateUsuario = async (formData: FormData) => {
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('nome'),
          email: formData.get('email'),
          role: formData.get('role')
        })
      })
      
      if (!response.ok) throw new Error('Failed to create usuario')
      
      await fetchData()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create usuario')
    }
  }

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
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen && dialogType === 'categoria'} onOpenChange={(isOpen) => { if (!isOpen) setIsDialogOpen(false) }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setDialogType('categoria'); setIsDialogOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Categoria de Receita</DialogTitle>
                <DialogDescription>Cadastre uma nova categoria para suas receitas</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateCategoria(new FormData(e.currentTarget)) }}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome-cat">Nome da Categoria</Label>
                    <Input id="nome-cat" name="nome" placeholder="Ex: Sobremesas" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc-cat">Descrição</Label>
                    <Input id="desc-cat" name="descricao" placeholder="Descrição da categoria" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit">Cadastrar</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen && dialogType === 'categoria-insumo'} onOpenChange={(isOpen) => { if (!isOpen) setIsDialogOpen(false) }}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => { setDialogType('categoria-insumo'); setIsDialogOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Categoria Insumo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Categoria de Insumo</DialogTitle>
                <DialogDescription>Cadastre uma nova categoria para seus insumos</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateCategoriaInsumo(new FormData(e.currentTarget)) }}>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-cat-insumo">Nome da Categoria</Label>
                      <Input id="nome-cat-insumo" name="nome" placeholder="Ex: Farinhas" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desc-cat-insumo">Descrição</Label>
                      <Input id="desc-cat-insumo" name="descricao" placeholder="Descrição da categoria de insumo" />
                    </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit">Cadastrar</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen && dialogType === 'unidade'} onOpenChange={(isOpen) => { if (!isOpen) setIsDialogOpen(false) }}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => { setDialogType('unidade'); setIsDialogOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Unidade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Unidade de Medida</DialogTitle>
                <DialogDescription>Cadastre uma nova unidade de medida</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateUnidade(new FormData(e.currentTarget)) }}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome-un">Nome</Label>
                        <Input id="nome-un" name="nome" placeholder="Ex: Quilograma" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="simbolo-un">Símbolo</Label>
                        <Input id="simbolo-un" name="simbolo" placeholder="Ex: kg" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo-un">Tipo</Label>
                      <Input id="tipo-un" name="tipo" placeholder="Ex: Peso, Volume, Quantidade" required />
                    </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit">Cadastrar</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen && dialogType === 'usuario'} onOpenChange={(isOpen) => { if (!isOpen) setIsDialogOpen(false) }}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => { setDialogType('usuario'); setIsDialogOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Usuário</DialogTitle>
                <DialogDescription>Cadastre um novo usuário no sistema</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateUsuario(new FormData(e.currentTarget)) }}>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome-user">Nome</Label>
                      <Input id="nome-user" name="nome" placeholder="Nome completo" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-user">Email</Label>
                      <Input id="email-user" name="email" type="email" placeholder="email@exemplo.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role-user">Função</Label>
                      <select
                        id="role-user"
                        name="role"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Selecione uma função</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="EDITOR">Editor</option>
                        <option value="VISUALIZADOR">Visualizador</option>
                      </select>
                    </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit">Cadastrar</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
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
