import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const unidades = await prisma.unidadeMedida.findMany({
      orderBy: {
        nome: 'asc'
      }
    })
    return NextResponse.json(unidades)
  } catch (error) {
    console.error('Error fetching unidades:', error)
    return NextResponse.json({ error: 'Failed to fetch unidades' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, simbolo } = body
    
    const unidade = await prisma.unidadeMedida.create({
      data: {
        nome,
        simbolo,
        tipo: 'Peso'
      }
    })
    
    return NextResponse.json(unidade, { status: 201 })
  } catch (error) {
    console.error('Error creating unidade:', error)
    return NextResponse.json({ error: 'Failed to create unidade' }, { status: 500 })
  }
}
