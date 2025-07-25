import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { nome, categoriaId, unidadeId, custoUnitario, estoqueMinimo } = body
    
    const resolvedParams = await params
    const produto = await prisma.insumo.update({
      where: { id: resolvedParams.id },
      data: {
        nome,
        categoriaInsumoId: categoriaId,
        unidadeMedidaId: unidadeId,
        custoUnitario: parseFloat(custoUnitario),
        estoqueMinimo: parseInt(estoqueMinimo)
      },
      include: {
        categoriaInsumo: true,
        unidadeMedida: true
      }
    })
    
    return NextResponse.json(produto)
  } catch (error) {
    console.error('Error updating produto:', error)
    return NextResponse.json({ error: 'Failed to update produto' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    await prisma.insumo.delete({
      where: { id: resolvedParams.id }
    })
    
    return NextResponse.json({ message: 'Produto deleted successfully' })
  } catch (error) {
    console.error('Error deleting produto:', error)
    return NextResponse.json({ error: 'Failed to delete produto' }, { status: 500 })
  }
}
