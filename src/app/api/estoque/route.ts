import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TipoMovimentacao } from '@prisma/client'

export async function GET() {
  try {
    const movimentacoes = await prisma.movimentacaoEstoque.findMany({
      include: {
        insumo: true,
        unidadeMedida: true,
        user: true,
        producao: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    const movimentacoesFormatted = movimentacoes.map(mov => ({
      id: mov.id,
      produto: mov.insumo.nome,
      tipo: mov.tipo.toLowerCase() as 'entrada' | 'saida',
      quantidade: Number(mov.quantidade),
      unidade: mov.unidadeMedida.simbolo,
      motivo: mov.observacao || '',
      data: mov.createdAt.toISOString().split('T')[0],
      usuario: mov.user.email
    }))
    
    return NextResponse.json(movimentacoesFormatted)
  } catch (error) {
    console.error('Error fetching movimentações estoque:', error)
    return NextResponse.json({ error: 'Failed to fetch movimentações estoque' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      insumoId, 
      tipo, 
      quantidade, 
      unidadeMedidaId, 
      observacao, 
      userId,
      valorUnitario 
    } = body
    
    const defaultUserId = 'cmcf4w2yj0003qhzr8vt0gz9l'
    let finalUserId = userId || defaultUserId
    
    try {
      const userExists = await prisma.user.findUnique({
        where: { id: finalUserId }
      })
      
      if (!userExists) {
        const defaultUser = await prisma.user.create({
          data: {
            id: defaultUserId,
            email: 'admin@sistemachef.com',
            name: 'Administrador',
            role: 'ADMIN'
          }
        })
        finalUserId = defaultUser.id
      }
    } catch (userError) {
      console.warn('User creation/check failed, using default:', userError)
      finalUserId = defaultUserId
    }
    
    const movimentacao = await prisma.movimentacaoEstoque.create({
      data: {
        tipo: tipo as TipoMovimentacao,
        quantidade: parseFloat(quantidade),
        valorUnitario: valorUnitario ? parseFloat(valorUnitario) : null,
        valorTotal: valorUnitario ? parseFloat(quantidade) * parseFloat(valorUnitario) : null,
        observacao,
        insumoId,
        unidadeMedidaId,
        userId: finalUserId
      },
      include: {
        insumo: true,
        unidadeMedida: true,
        user: true
      }
    })
    
    const currentInsumo = await prisma.insumo.findUnique({
      where: { id: insumoId }
    })
    
    if (currentInsumo) {
      const newQuantity = tipo === 'ENTRADA'
        ? Number(currentInsumo.estoqueAtual) + parseFloat(quantidade)
        : Number(currentInsumo.estoqueAtual) - parseFloat(quantidade)
      
      await prisma.insumo.update({
        where: { id: insumoId },
        data: {
          estoqueAtual: Math.max(0, newQuantity) // Prevent negative stock
        }
      })
    }
    
    return NextResponse.json(movimentacao, { status: 201 })
  } catch (error) {
    console.error('Error creating movimentação estoque:', error)
    return NextResponse.json({ error: 'Failed to create movimentação estoque' }, { status: 500 })
  }
}
