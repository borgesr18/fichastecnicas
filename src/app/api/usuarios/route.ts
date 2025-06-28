import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const usuarios = await prisma.user.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Error fetching usuários:', error)
    return NextResponse.json({ error: 'Failed to fetch usuários' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role } = body
    
    const defaultUserId = 'cmcf4w2yj0003qhzr8vt0gz9l'
    try {
      const defaultUserExists = await prisma.user.findUnique({
        where: { id: defaultUserId }
      })
      
      if (!defaultUserExists) {
        await prisma.user.create({
          data: {
            id: defaultUserId,
            email: 'admin@sistemachef.com',
            name: 'Administrador',
            role: 'ADMIN'
          }
        })
      }
    } catch (userError) {
      console.warn('Default user creation/check failed:', userError)
    }
    
    const usuario = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'VISUALIZADOR'
      }
    })
    
    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    console.error('Error creating usuário:', error)
    return NextResponse.json({ error: 'Failed to create usuário' }, { status: 500 })
  }
}
