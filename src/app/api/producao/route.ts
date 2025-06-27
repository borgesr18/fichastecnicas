import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const producoes = await prisma.producao.findMany({
      include: {
        fichaTecnica: {
          include: {
            categoriaReceita: true
          }
        },
        user: true,
        movimentacoesEstoque: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(producoes)
  } catch (error) {
    console.error('Error fetching produções:', error)
    return NextResponse.json({ error: 'Failed to fetch produções' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      fichaTecnicaId, 
      quantidadeProduzida, 
      observacao, 
      userId 
    } = body
    
    const fichaTecnica = await prisma.fichaTecnica.findUnique({
      where: { id: fichaTecnicaId },
      include: {
        ingredientes: {
          include: {
            insumo: true,
            unidadeMedida: true
          }
        }
      }
    })
    
    if (!fichaTecnica) {
      return NextResponse.json({ error: 'Ficha técnica not found' }, { status: 404 })
    }
    
    let custoTotalProducao = 0
    for (const ingrediente of fichaTecnica.ingredientes) {
      const quantidadeNecessaria = Number(ingrediente.quantidade) * Number(quantidadeProduzida) * Number(ingrediente.fatorConversao)
      custoTotalProducao += quantidadeNecessaria * Number(ingrediente.insumo.custoUnitario)
    }
    
    const producao = await prisma.producao.create({
      data: {
        quantidadeProduzida: parseFloat(quantidadeProduzida),
        custoTotalProducao,
        observacao,
        fichaTecnicaId,
        userId
      },
      include: {
        fichaTecnica: true,
        user: true
      }
    })
    
    for (const ingrediente of fichaTecnica.ingredientes) {
      const quantidadeNecessaria = Number(ingrediente.quantidade) * Number(quantidadeProduzida) * Number(ingrediente.fatorConversao)
      
      await prisma.movimentacaoEstoque.create({
        data: {
          tipo: 'SAIDA',
          quantidade: quantidadeNecessaria,
          valorUnitario: Number(ingrediente.insumo.custoUnitario),
          valorTotal: quantidadeNecessaria * Number(ingrediente.insumo.custoUnitario),
          observacao: `Produção - ${fichaTecnica.nome}`,
          insumoId: ingrediente.insumoId,
          unidadeMedidaId: ingrediente.unidadeMedidaId,
          userId,
          producaoId: producao.id
        }
      })
      
      const currentInsumo = await prisma.insumo.findUnique({
        where: { id: ingrediente.insumoId }
      })
      
      if (currentInsumo) {
        const newQuantity = Number(currentInsumo.estoqueAtual) - quantidadeNecessaria
        await prisma.insumo.update({
          where: { id: ingrediente.insumoId },
          data: {
            estoqueAtual: Math.max(0, newQuantity)
          }
        })
      }
    }
    
    return NextResponse.json(producao, { status: 201 })
  } catch (error) {
    console.error('Error creating produção:', error)
    return NextResponse.json({ error: 'Failed to create produção' }, { status: 500 })
  }
}
