import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { nome, descricao } = body
    
    const resolvedParams = await params
    const categoria = await prisma.categoriaInsumo.update({
      where: { id: resolvedParams.id },
      data: {
        nome,
        descricao: descricao || null
      }
    })
    
    return NextResponse.json(categoria)
  } catch (error) {
    console.error('Error updating categoria:', error)
    return NextResponse.json({ error: 'Failed to update categoria' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    await prisma.categoriaInsumo.delete({
      where: { id: resolvedParams.id }
    })
    
    return NextResponse.json({ message: 'Categoria deleted successfully' })
  } catch (error) {
    console.error('Error deleting categoria:', error)
    return NextResponse.json({ error: 'Failed to delete categoria' }, { status: 500 })
  }
}
