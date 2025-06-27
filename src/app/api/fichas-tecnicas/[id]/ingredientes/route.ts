import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const ingredientes = await prisma.ingredienteFichaTecnica.findMany({
      where: { fichaTecnicaId: resolvedParams.id },
      include: {
        insumo: {
          include: {
            unidadeMedida: true
          }
        },
        unidadeMedida: true
      }
    })
    
    return NextResponse.json(ingredientes)
  } catch (error) {
    console.error('Error fetching ingredientes:', error)
    return NextResponse.json({ error: 'Failed to fetch ingredientes' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { insumoId, quantidade, fatorConversao, unidadeMedidaId } = body
    
    const resolvedParams = await params
    const ingrediente = await prisma.ingredienteFichaTecnica.create({
      data: {
        fichaTecnicaId: resolvedParams.id,
        insumoId,
        quantidade,
        fatorConversao: fatorConversao || 1,
        unidadeMedidaId
      },
      include: {
        insumo: {
          include: {
            unidadeMedida: true
          }
        },
        unidadeMedida: true
      }
    })
    
    return NextResponse.json(ingrediente)
  } catch (error) {
    console.error('Error creating ingrediente:', error)
    return NextResponse.json({ error: 'Failed to create ingrediente' }, { status: 500 })
  }
}
