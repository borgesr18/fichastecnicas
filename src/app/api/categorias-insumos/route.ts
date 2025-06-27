import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categorias = await prisma.categoriaInsumo.findMany({
      orderBy: {
        nome: 'asc'
      }
    })
    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Error fetching categorias:', error)
    return NextResponse.json({ error: 'Failed to fetch categorias' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, descricao } = body
    
    const categoria = await prisma.categoriaInsumo.create({
      data: {
        nome,
        descricao: descricao || null
      }
    })
    
    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    console.error('Error creating categoria:', error)
    return NextResponse.json({ error: 'Failed to create categoria' }, { status: 500 })
  }
}
