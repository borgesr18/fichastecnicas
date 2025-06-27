import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categorias = await prisma.categoriaReceita.findMany({
      orderBy: {
        nome: 'asc'
      }
    })
    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Error fetching categorias receitas:', error)
    return NextResponse.json({ error: 'Failed to fetch categorias receitas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, descricao } = body
    
    const categoria = await prisma.categoriaReceita.create({
      data: {
        nome,
        descricao: descricao || null
      }
    })
    
    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    console.error('Error creating categoria receita:', error)
    return NextResponse.json({ error: 'Failed to create categoria receita' }, { status: 500 })
  }
}
