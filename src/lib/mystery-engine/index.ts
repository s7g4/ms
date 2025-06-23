import { prisma } from "@/lib/db";
import getRedis from "@/lib/redis";

type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "ULTRA_RARE";

interface BoxSelection {
  products: Array<{ productId: string; name: string; quantity: number; value: number }>;
  totalValue: number;
  packingSlipData: {
    boxName: string;
    orderId: string;
    items: Array<{ name: string; rarity: string; value: number }>;
    totalValue: number;
    generatedAt: string;
  };
}

function rollRarity(): Rarity {
  const roll = Math.random() * 100;
  if (roll < 5) return "ULTRA_RARE";
  if (roll < 20) return "RARE";
  if (roll < 50) return "UNCOMMON";
  return "COMMON";
}

function weightedRandom<T>(items: Array<{ item: T; weight: number }>): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let rand = Math.random() * total;
  for (const { item, weight } of items) {
    rand -= weight;
    if (rand <= 0) return item;
  }
  return items[items.length - 1].item;
}

export async function generateBoxAllocation(
  mysteryBoxId: string,
  orderId: string
): Promise<BoxSelection> {
  const box = await prisma.mysteryBox.findUniqueOrThrow({
    where: { id: mysteryBoxId },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });

  const itemCount =
    box.minItems + Math.floor(Math.random() * (box.maxItems - box.minItems + 1));

  const allProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      stock: { gt: 0 },
      categoryId: { in: box.categories.map((bc) => bc.categoryId) },
    },
  });

  const selectedProducts: typeof allProducts = [];
  const selectedIds = new Set<string>();
  let attempts = 0;

  while (selectedProducts.length < itemCount && attempts < itemCount * 10) {
    attempts++;
    const targetRarity = rollRarity();

    // Get weighted category
    const categoryWeights = box.categories.map((bc) => ({
      item: bc.categoryId,
      weight: bc.weight,
    }));
    const targetCategoryId = weightedRandom(categoryWeights);

    // Filter eligible products
    const eligible = allProducts.filter(
      (p) =>
        p.categoryId === targetCategoryId &&
        p.rarity === targetRarity &&
        !selectedIds.has(p.id) &&
        p.stock > 0
    );

    // Fallback: any product from category not already selected
    const fallback = allProducts.filter(
      (p) => p.categoryId === targetCategoryId && !selectedIds.has(p.id) && p.stock > 0
    );

    const pool = eligible.length > 0 ? eligible : fallback;
    if (pool.length === 0) continue;

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    selectedProducts.push(chosen);
    selectedIds.add(chosen.id);
  }

  // Ensure total value >= promised mrpValue
  const totalValue = selectedProducts.reduce((sum, p) => sum + p.mrp, 0);
  if (totalValue < box.mrpValue && allProducts.length > 0) {
    // Add a high-value product if needed
    const extra = allProducts
      .filter((p) => !selectedIds.has(p.id) && p.stock > 0)
      .sort((a, b) => b.mrp - a.mrp)[0];
    if (extra) {
      selectedProducts.push(extra);
      selectedIds.add(extra.id);
    }
  }

  // Reserve inventory with Redis locks
  const redis = getRedis();
  for (const product of selectedProducts) {
    const lockKey = `lock:product:${product.id}`;
    if (redis) {
      await redis.set(lockKey, orderId, { ex: 30, nx: true });
    }
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: { decrement: 1 } },
    });
    if (redis) await redis.del(lockKey);
  }

  const finalValue = selectedProducts.reduce((sum, p) => sum + p.mrp, 0);

  return {
    products: selectedProducts.map((p) => ({
      productId: p.id,
      name: p.name,
      quantity: 1,
      value: p.mrp,
    })),
    totalValue: finalValue,
    packingSlipData: {
      boxName: box.name,
      orderId,
      items: selectedProducts.map((p) => ({
        name: p.name,
        rarity: p.rarity,
        value: p.mrp,
      })),
      totalValue: finalValue,
      generatedAt: new Date().toISOString(),
    },
  };
}
