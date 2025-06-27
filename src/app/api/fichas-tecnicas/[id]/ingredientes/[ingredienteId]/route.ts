import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ingredienteId: string }> }
) {
  try {
    const resolvedParams = await params
    await prisma.ingredienteFichaTecnica.delete({
      where: { id: resolvedParams.ingredienteId }
    })
    
    return NextResponse.json({ message: 'Ingrediente deleted successfully' })
  } catch (error) {
    console.error('Error deleting ingrediente:', error)
    return NextResponse.json({ error: 'Failed to delete ingrediente' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ingredienteId: string }> }
) {
  try {
    const body = await request.json()
    const { quantidade, fatorConversao, custoUnitario } = body
    
    const resolvedParams = await params
    const ingrediente = await prisma.ingredienteFichaTecnica.update({
      where: { id: resolvedParams.ingredienteId },
      data: {
        quantidade,
        fatorConversao,
        custoUnitario,
        custoTotal: quantidade * custoUnitario * fatorConversao
      },
      include: {
        produto: {
          include: {
            unidadeMedida: true
          }
        }
      }
    })
    
    return NextResponse.json(ingrediente)
  } catch (error) {
    console.error('Error updating ingrediente:', error)
    return NextResponse.json({ error: 'Failed to update ingrediente' }, { status: 500 })
  }
}
