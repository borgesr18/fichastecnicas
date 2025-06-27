import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const produtos = await prisma.insumo.findMany({
      include: {
        categoriaInsumo: true,
        unidadeMedida: true
      },
      orderBy: {
        nome: 'asc'
      }
    })
    return NextResponse.json(produtos)
  } catch (error) {
    console.error('Error fetching produtos:', error)
    return NextResponse.json({ error: 'Failed to fetch produtos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, marca, categoriaId, unidadeId, custoUnitario, estoqueMinimo } = body
    
    const parsedCusto = parseFloat(custoUnitario)
    const parsedEstoque = parseInt(estoqueMinimo)
    
    if (isNaN(parsedCusto) || isNaN(parsedEstoque)) {
      return NextResponse.json({ error: 'Invalid numeric values' }, { status: 400 })
    }
    
    const produto = await prisma.insumo.create({
      data: {
        nome,
        marca: marca || null,
        categoriaInsumoId: categoriaId,
        unidadeMedidaId: unidadeId,
        custoUnitario: parsedCusto,
        estoqueAtual: 0,
        estoqueMinimo: parsedEstoque
      },
      include: {
        categoriaInsumo: true,
        unidadeMedida: true
      }
    })
    
    return NextResponse.json(produto, { status: 201 })
  } catch (error) {
    console.error('Error creating produto:', error)
    return NextResponse.json({ error: 'Failed to create produto' }, { status: 500 })
  }
}
