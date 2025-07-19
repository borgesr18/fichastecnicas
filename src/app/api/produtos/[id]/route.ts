import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { nome, categoriaId, unidadeId, custoUnitario, estoqueMinimo } = body
    
    const resolvedParams = await params

    const insumo = await prisma.insumo.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!insumo || insumo.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const produto = await prisma.insumo.update({
      where: { id: resolvedParams.id },
      data: {
        nome,
        categoriaInsumoId: categoriaId,
        unidadeMedidaId: unidadeId,
        custoUnitario: parseFloat(custoUnitario),
        estoqueMinimo: parseInt(estoqueMinimo)
      },
      include: {
        categoriaInsumo: true,
        unidadeMedida: true
      }
    })
    
    return NextResponse.json(produto)
  } catch (error) {
    console.error('Error updating produto:', error)
    return NextResponse.json({ error: 'Failed to update produto' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const resolvedParams = await params

    const insumo = await prisma.insumo.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!insumo || insumo.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.insumo.delete({
      where: { id: resolvedParams.id }
    })
    
    return NextResponse.json({ message: 'Produto deleted successfully' })
  } catch (error) {
    console.error('Error deleting produto:', error)
    return NextResponse.json({ error: 'Failed to delete produto' }, { status: 500 })
  }
}
