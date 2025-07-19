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
            unidadeMedida: true,
          },
        },
        _count: {
          select: {
            ingredientes: true,
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    })

    const fichasFormatted = fichasTecnicas.map((ficha) => {
      // Cálculo seguro do custoTotal
      const custoTotal = ficha.ingredientes.reduce((total, ing) => {
        const quantidade = Number(ing.quantidade) || 0
        const custoUnitario = Number(ing.insumo?.custoUnitario) || 0
        const fatorConversao = Number(ing.fatorConversao) || 1 // Usar 1 como padrão se não houver conversão

        // Adiciona ao total apenas se a linha for válida
        return total + quantidade * custoUnitario * fatorConversao
      }, 0)

      const rendimento = Number(ficha.rendimentoTotal) || 0
      
      // Cálculo seguro do custoPorcao, evitando divisão por zero
      const custoPorcao = rendimento > 0 ? custoTotal / rendimento : 0

      return {
        id: ficha.id,
        nome: ficha.nome,
        categoria: ficha.categoriaReceita.nome,
        rendimento: rendimento,
        custoTotal: custoTotal, // Agora é um número seguro
        custoPorcao: custoPorcao, // Agora é um número seguro
        tempoPreparo: ficha.tempoPreparoMin || 0,
        ingredientes: ficha._count.ingredientes,
        // Incluir todos os dados necessários para a edição
        modoPreparo: ficha.modoPreparo,
        unidadeRendimento: ficha.unidadeRendimento,
        categoriaReceitaId: ficha.categoriaReceitaId,
        listaIngredientes: ficha.ingredientes.map(ing => ({
          insumoId: ing.insumoId,
          nome: ing.insumo.nome,
          quantidade: ing.quantidade,
          unidadeMedidaId: ing.unidadeMedidaId,
          unidadeMedida: ing.unidadeMedida.simbolo,
          custoUnitario: Number(ing.insumo?.custoUnitario) || 0,
          custoTotal: (Number(ing.quantidade) || 0) * (Number(ing.insumo?.custoUnitario) || 0) * (Number(ing.fatorConversao) || 1)
        }))
      }
    })

    return NextResponse.json(fichasFormatted)
  } catch (error) {
    console.error('Error fetching fichas técnicas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fichas técnicas' },
      { status: 500 },
    )
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
      userId,
      ingredientes,
    } = body

    const defaultUserId = 'cmcf4w2yj0003qhzr8vt0gz9l'
    let finalUserId = userId || defaultUserId

    try {
      const userExists = await prisma.user.findUnique({
        where: { id: finalUserId },
      })

      if (!userExists) {
        const defaultUser = await prisma.user.create({
          data: {
            id: defaultUserId,
            email: 'admin@sistemachef.com',
            name: 'Administrador',
            role: 'ADMIN',
          },
        })
        finalUserId = defaultUser.id
      }
    } catch (userError) {
      console.warn('User creation/check failed, using default:', userError)
      finalUserId = defaultUserId
    }

    const fichaTecnica = await prisma.fichaTecnica.create({
      data: {
        nome,
        categoriaReceitaId,
        rendimentoTotal: parseFloat(rendimentoTotal),
        unidadeRendimento: unidadeRendimento || 'porções',
        modoPreparo,
        tempoPreparoMin: parseInt(tempoPreparoMin) || null,
        userId: finalUserId,
        ingredientes: {
          create: ingredientes.map((ing: any) => ({
            insumoId: ing.insumoId,
            quantidade: parseFloat(ing.quantidade),
            unidadeMedidaId: ing.unidadeMedidaId,
          })),
        },
      },
      include: {
        categoriaReceita: true,
        user: true,
        ingredientes: true,
      },
    })

    return NextResponse.json(fichaTecnica, { status: 201 })
  } catch (error) {
    console.error('Error creating ficha técnica:', error)
    return NextResponse.json(
      { error: 'Failed to create ficha técnica' },
      { status: 500 },
    )
  }
}
