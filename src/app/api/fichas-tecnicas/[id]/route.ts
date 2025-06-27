import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const fichaTecnica = await prisma.fichaTecnica.findUnique({
      where: { id: resolvedParams.id },
      include: {
        categoriaReceita: true,
        user: true,
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
    
    return NextResponse.json(fichaTecnica)
  } catch (error) {
    console.error('Error fetching ficha técnica:', error)
    return NextResponse.json({ error: 'Failed to fetch ficha técnica' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { 
      nome, 
      categoriaReceitaId, 
      rendimentoTotal, 
      unidadeRendimento,
      modoPreparo,
      tempoPreparoMin 
    } = body
    
    const resolvedParams = await params
    const fichaTecnica = await prisma.fichaTecnica.update({
      where: { id: resolvedParams.id },
      data: {
        nome,
        categoriaReceitaId,
        rendimentoTotal: parseFloat(rendimentoTotal),
        unidadeRendimento,
        modoPreparo,
        tempoPreparoMin: parseInt(tempoPreparoMin) || null
      },
      include: {
        categoriaReceita: true,
        user: true
      }
    })
    
    return NextResponse.json(fichaTecnica)
  } catch (error) {
    console.error('Error updating ficha técnica:', error)
    return NextResponse.json({ error: 'Failed to update ficha técnica' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    await prisma.fichaTecnica.delete({
      where: { id: resolvedParams.id }
    })
    
    return NextResponse.json({ message: 'Ficha técnica deleted successfully' })
  } catch (error) {
    console.error('Error deleting ficha técnica:', error)
    return NextResponse.json({ error: 'Failed to delete ficha técnica' }, { status: 500 })
  }
}
