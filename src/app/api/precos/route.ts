import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const precos = await prisma.precoFichaTecnica.findMany({
      include: {
        fichaTecnica: {
          include: {
            categoriaReceita: true
          }
        }
      },
      where: {
        ativo: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(precos)
  } catch (error) {
    console.error('Error fetching preços:', error)
    return NextResponse.json({ error: 'Failed to fetch preços' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      fichaTecnicaId, 
      custoPorcao, 
      markup, 
      precoVenda, 
      margemLucro 
    } = body
    
    await prisma.precoFichaTecnica.updateMany({
      where: { 
        fichaTecnicaId,
        ativo: true 
      },
      data: { ativo: false }
    })
    
    const preco = await prisma.precoFichaTecnica.create({
      data: {
        custoPorcao: parseFloat(custoPorcao),
        markup: parseFloat(markup),
        precoVenda: parseFloat(precoVenda),
        margemLucro: parseFloat(margemLucro),
        fichaTecnicaId,
        ativo: true
      },
      include: {
        fichaTecnica: true
      }
    })
    
    return NextResponse.json(preco, { status: 201 })
  } catch (error) {
    console.error('Error creating preço:', error)
    return NextResponse.json({ error: 'Failed to create preço' }, { status: 500 })
  }
}
