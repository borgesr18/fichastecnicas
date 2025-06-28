import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const fichasTecnicas = await prisma.fichaTecnica.findMany({
      include: {
        categoriaReceita: true,
        user: true,
        ingredientes: {
          include: {
            insumo: true,
            unidadeMedida: true
          }
        },
        _count: {
          select: {
            ingredientes: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    })
    
    const fichasFormatted = fichasTecnicas.map(ficha => ({
      id: ficha.id,
      nome: ficha.nome,
      categoria: ficha.categoriaReceita.nome,
      rendimento: ficha.rendimentoTotal,
      custoTotal: ficha.ingredientes.reduce((total, ing) => {
        return total + (Number(ing.quantidade) * Number(ing.insumo.custoUnitario) * Number(ing.fatorConversao))
      }, 0),
      custoPorcao: 0, // Will be calculated
      tempoPreparo: ficha.tempoPreparoMin || 0,
      ingredientes: ficha._count.ingredientes
    }))
    
    fichasFormatted.forEach(ficha => {
      ficha.custoPorcao = ficha.custoTotal / Number(ficha.rendimento)
    })
    
    return NextResponse.json(fichasFormatted)
  } catch (error) {
    console.error('Error fetching fichas técnicas:', error)
    return NextResponse.json({ error: 'Failed to fetch fichas técnicas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      nome, 
      categoriaReceitaId, 
      rendimentoTotal, 
      unidadeRendimento,
      modoPreparo,
      tempoPreparoMin,
      userId 
    } = body
    
    const defaultUserId = 'cmcf4w2yj0003qhzr8vt0gz9l'
    const finalUserId = userId || defaultUserId
    
    const fichaTecnica = await prisma.fichaTecnica.create({
      data: {
        nome,
        categoriaReceitaId,
        rendimentoTotal: parseFloat(rendimentoTotal),
        unidadeRendimento: unidadeRendimento || 'porções',
        modoPreparo,
        tempoPreparoMin: parseInt(tempoPreparoMin) || null,
        userId: finalUserId
      },
      include: {
        categoriaReceita: true,
        user: true
      }
    })
    
    return NextResponse.json(fichaTecnica, { status: 201 })
  } catch (error) {
    console.error('Error creating ficha técnica:', error)
    return NextResponse.json({ error: 'Failed to create ficha técnica' }, { status: 500 })
  }
}
