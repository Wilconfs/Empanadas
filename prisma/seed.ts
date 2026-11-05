// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Limpiar la base de datos antes de poblarla (útil en desarrollo)
  await prisma.recipeItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.ingredient.deleteMany();

  // 1. Crear Ingredientes con los costos de tu Excel
  // Asumimos precios por gramo o unidad para facilitar el cálculo de la receta
  const tapa = await prisma.ingredient.create({ data: { name: 'Tapas (Masa)', unit: 'unidad', costPerUnit: 460, currentStock: 100 } }); 
  const carne = await prisma.ingredient.create({ data: { name: 'Carne', unit: 'gramos', costPerUnit: 14, currentStock: 5000 } }); // $14.000 el kilo = $14 x gramo
  const papa = await prisma.ingredient.create({ data: { name: 'Papa', unit: 'gramos', costPerUnit: 2, currentStock: 5000 } }); // $2.000 el kilo = $2 x gramo
  const huevo = await prisma.ingredient.create({ data: { name: 'Huevos', unit: 'unidad', costPerUnit: 500, currentStock: 30 } });
  const chorizo = await prisma.ingredient.create({ data: { name: 'Chorizo', unit: 'unidad', costPerUnit: 2000, currentStock: 20 } });
  const queso = await prisma.ingredient.create({ data: { name: 'Queso', unit: 'gramos', costPerUnit: 9, currentStock: 2000 } }); // $4.500 la libra = $9 x gramo

  // 2. Crear Producto: Empanada Tradicional de Carne y Papa
  await prisma.product.create({
    data: {
      name: 'Empanada Tradicional (Carne y Papa)',
      price: 3500, // Precio de venta al público
      recipe: {
        create: [
          { ingredientId: tapa.id, quantity: 1 },       // 1 Tapa = $460
          { ingredientId: carne.id, quantity: 40 },     // 40g de carne = $560
          { ingredientId: papa.id, quantity: 50 },      // 50g de papa = $100
          { ingredientId: huevo.id, quantity: 0.25 },   // 1/4 de huevo = $125
        ],
      },
    },
  });

  // 3. Crear Producto: Empanada de Chorizo y Queso
  await prisma.product.create({
    data: {
      name: 'Empanada Mixta (Chorizo y Queso)',
      price: 4000, 
      recipe: {
        create: [
          { ingredientId: tapa.id, quantity: 1 },       // 1 Tapa = $460
          { ingredientId: chorizo.id, quantity: 0.5 },  // Medio chorizo = $1000
          { ingredientId: queso.id, quantity: 40 },     // 40g de queso = $360
        ],
      },
    },
  });

  console.log('✅ Base de datos poblada con éxito con los costos del Excel');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });