import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  try {
    const defaultUser = await prisma.user.upsert({
      where: { email: 'admin@sistemachef.com' },
      update: {},
      create: {
        id: 'cmcf4w2yj0003qhzr8vt0gz9l',
        email: 'admin@sistemachef.com',
        name: 'Administrador',
        role: 'ADMIN'
      }
    })
    console.log('Default user created/updated:', defaultUser.email)

  const categorias = await Promise.all([
    prisma.categoriaInsumo.upsert({
      where: { nome: 'Farinhas' },
      update: {},
      create: {
        nome: 'Farinhas',
        descricao: 'Farinhas e derivados'
      }
    }),
    prisma.categoriaInsumo.upsert({
      where: { nome: 'Açúcares' },
      update: {},
      create: {
        nome: 'Açúcares',
        descricao: 'Açúcares e adoçantes'
      }
    }),
    prisma.categoriaInsumo.upsert({
      where: { nome: 'Chocolates' },
      update: {},
      create: {
        nome: 'Chocolates',
        descricao: 'Chocolates e cacau'
      }
    }),
    prisma.categoriaInsumo.upsert({
      where: { nome: 'Laticínios' },
      update: {},
      create: {
        nome: 'Laticínios',
        descricao: 'Leite e derivados'
      }
    })
  ])

  const unidades = await Promise.all([
    prisma.unidadeMedida.upsert({
      where: { simbolo: 'kg' },
      update: {},
      create: {
        nome: 'Quilograma',
        simbolo: 'kg',
        tipo: 'Peso'
      }
    }),
    prisma.unidadeMedida.upsert({
      where: { simbolo: 'L' },
      update: {},
      create: {
        nome: 'Litro',
        simbolo: 'L',
        tipo: 'Volume'
      }
    }),
    prisma.unidadeMedida.upsert({
      where: { simbolo: 'un' },
      update: {},
      create: {
        nome: 'Unidade',
        simbolo: 'un',
        tipo: 'Quantidade'
      }
    }),
    prisma.unidadeMedida.upsert({
      where: { simbolo: 'g' },
      update: {},
      create: {
        nome: 'Grama',
        simbolo: 'g',
        tipo: 'Peso'
      }
    })
  ])

  const existingFarinha = await prisma.insumo.findFirst({ where: { nome: 'Farinha de Trigo' } })
  const existingAcucar = await prisma.insumo.findFirst({ where: { nome: 'Açúcar Cristal' } })
  const existingChocolate = await prisma.insumo.findFirst({ where: { nome: 'Chocolate em Pó' } })

  const produtos = []

  if (!existingFarinha) {
    produtos.push(await prisma.insumo.create({
      data: {
        nome: 'Farinha de Trigo',
        categoriaInsumoId: categorias[0].id,
        unidadeMedidaId: unidades[0].id,
        custoUnitario: 4.50,
        estoqueAtual: 25,
        estoqueMinimo: 5,
        userId: defaultUser.id
      }
    }))
  } else {
    produtos.push(existingFarinha)
  }

  if (!existingAcucar) {
    produtos.push(await prisma.insumo.create({
      data: {
        nome: 'Açúcar Cristal',
        categoriaInsumoId: categorias[1].id,
        unidadeMedidaId: unidades[0].id,
        custoUnitario: 3.20,
        estoqueAtual: 15,
        estoqueMinimo: 10,
        userId: defaultUser.id
      }
    }))
  } else {
    produtos.push(existingAcucar)
  }

  if (!existingChocolate) {
    produtos.push(await prisma.insumo.create({
      data: {
        nome: 'Chocolate em Pó',
        categoriaInsumoId: categorias[2].id,
        unidadeMedidaId: unidades[0].id,
        custoUnitario: 12.80,
        estoqueAtual: 3,
        estoqueMinimo: 5,
        userId: defaultUser.id
      }
    }))
  } else {
    produtos.push(existingChocolate)
  }

    console.log('Database seeded successfully!')
    console.log(`Created default user: ${defaultUser.email}`)
    console.log(`Created ${categorias.length} categories`)
    console.log(`Created ${unidades.length} units`)
    console.log(`Created ${produtos.length} products`)
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
