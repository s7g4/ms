import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Initialize database connection for seeding
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing data (Optional, but useful for a clean seed)
  // We delete in reverse order of dependencies to avoid foreign key errors
  await prisma.rewardTransaction.deleteMany({});
  await prisma.referral.deleteMany({});
  await prisma.ticketMessage.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.couponUsage.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.boxCategory.deleteMany({});
  await prisma.mysteryBox.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.blogPost.deleteMany({});

  console.log("🧹 Cleaned existing tables.");

  // 2. Create Admin and Warehouse Users
  const hashedPassword = await bcrypt.hash("adminpassword123", 10);
  const warehousePassword = await bcrypt.hash("warehouse123", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "Scoop Admin",
      email: "admin@mysteryscoop.in",
      role: "ADMIN",
      referralCode: "ADMINSCOOP",
      accounts: {
        create: {
          providerId: "credential",
          accountId: "admin@mysteryscoop.in",
          password: hashedPassword,
        },
      },
    },
  });

  const warehouseUser = await prisma.user.create({
    data: {
      name: "Warehouse Manager",
      email: "warehouse@mysteryscoop.in",
      role: "WAREHOUSE",
      referralCode: "WHSE123",
      accounts: {
        create: {
          providerId: "credential",
          accountId: "warehouse@mysteryscoop.in",
          password: warehousePassword,
        },
      },
    },
  });

  const testUser = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "priya@example.com",
      role: "USER",
      referralCode: "PRIYASCOOP",
      loyaltyPoints: 350,
      accounts: {
        create: {
          providerId: "credential",
          accountId: "priya@example.com",
          password: await bcrypt.hash("priyapassword", 10),
        },
      },
    },
  });

  console.log("👤 Created system users.");

  // 3. Create Categories
  const categories = [
    { name: "Kawaii", slug: "kawaii", emoji: "🌸", description: "Cute plushies, keychains, and accessories" },
    { name: "Anime", slug: "anime", emoji: "⚡", description: "Figures, posters, and collectible merch" },
    { name: "Stationery", slug: "stationery", emoji: "✍️", description: "Washi tapes, notebooks, pens, and stickers" },
    { name: "Plushies", slug: "plushies", emoji: "🧸", description: "Soft, huggable plush toys of all sizes" },
    { name: "DIY", slug: "diy", emoji: "🎨", description: "Craft kits, clay models, and miniature build sets" },
    { name: "Beauty", slug: "beauty", emoji: "💅", description: "Lip balms, hand creams, hair accessories, and mirrors" },
    { name: "Toys", slug: "toys", emoji: "🎮", description: "Fidget toys, blind boxes, and interactive gadgets" },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const created = await prisma.category.create({
      data: cat,
    });
    categoryMap[cat.name] = created.id;
  }

  console.log("🗂️ Created product categories.");

  // 4. Create Products
  const productsData = [
    // Kawaii Category
    { name: "Cute Bunny Airpods Case", slug: "cute-bunny-airpods-case", category: "Kawaii", price: 120, mrp: 299, stock: 150, rarity: "COMMON", weight: 1.0 },
    { name: "Sakura Blossom Keychain", slug: "sakura-blossom-keychain", category: "Kawaii", price: 80, mrp: 199, stock: 200, rarity: "COMMON", weight: 1.5 },
    { name: "Cute Shiba Inu Mug", slug: "cute-shiba-inu-mug", category: "Kawaii", price: 250, mrp: 499, stock: 60, rarity: "UNCOMMON", weight: 1.0 },
    { name: "Starry Night LED Night Light", slug: "starry-night-led-night-light", category: "Kawaii", price: 350, mrp: 799, stock: 45, rarity: "RARE", weight: 0.8 },
    { name: "Giant Toast Pillow Cushion", slug: "giant-toast-pillow-cushion", category: "Kawaii", price: 500, mrp: 1199, stock: 25, rarity: "ULTRA_RARE", weight: 0.5 },

    // Anime Category
    { name: "Chibi Naruto Action Figure", slug: "chibi-naruto-action-figure", category: "Anime", price: 320, mrp: 699, stock: 80, rarity: "UNCOMMON", weight: 1.2 },
    { name: "Demon Slayer Katana Keychain", slug: "demon-slayer-katana-keychain", category: "Anime", price: 90, mrp: 249, stock: 180, rarity: "COMMON", weight: 1.5 },
    { name: "One Piece Straw Hat Replica", slug: "one-piece-straw-hat-replica", category: "Anime", price: 390, mrp: 899, stock: 50, rarity: "UNCOMMON", weight: 1.0 },
    { name: "Spy x Family Anya Plushie", slug: "spy-x-family-anya-plushie", category: "Anime", price: 450, mrp: 999, stock: 35, rarity: "RARE", weight: 0.8 },
    { name: "Premium Kakashi Susanoo Figure", slug: "premium-kakashi-susanoo-figure", category: "Anime", price: 1200, mrp: 2499, stock: 10, rarity: "ULTRA_RARE", weight: 0.3 },

    // Stationery Category
    { name: "Aesthetic Pastel Highlighter Set", slug: "aesthetic-pastel-highlighter-set", category: "Stationery", price: 95, mrp: 249, stock: 220, rarity: "COMMON", weight: 1.5 },
    { name: "Grid Journal Notebook", slug: "grid-journal-notebook", category: "Stationery", price: 150, mrp: 349, stock: 120, rarity: "COMMON", weight: 1.2 },
    { name: "Cute Animal Gel Pens (10 pack)", slug: "cute-animal-gel-pens-10-pack", category: "Stationery", price: 130, mrp: 299, stock: 160, rarity: "COMMON", weight: 1.5 },
    { name: "Washi Tape Set (12 rolls)", slug: "washi-tape-set-12-rolls", category: "Stationery", price: 180, mrp: 399, stock: 90, rarity: "UNCOMMON", weight: 1.0 },
    { name: "Kawaii Sticker Sheets (50 pcs)", slug: "kawaii-sticker-sheets-50-pcs", category: "Stationery", price: 70, mrp: 179, stock: 300, rarity: "COMMON", weight: 2.0 },

    // Plushies Category
    { name: "Mini Shiba Plush Toy", slug: "mini-shiba-plush-toy", category: "Plushies", price: 180, mrp: 399, stock: 110, rarity: "COMMON", weight: 1.2 },
    { name: "Giant Fluffy Alpaca Plush", slug: "giant-fluffy-alpaca-plush", category: "Plushies", price: 700, mrp: 1499, stock: 20, rarity: "ULTRA_RARE", weight: 0.4 },
    { name: "Cute Boba Milk Tea Plushie", slug: "cute-boba-milk-tea-plushie", category: "Plushies", price: 280, mrp: 599, stock: 75, rarity: "UNCOMMON", weight: 1.0 },
    { name: "Sleepy Totoro Body Pillow", slug: "sleepy-totoro-body-pillow", category: "Plushies", price: 550, mrp: 1299, stock: 30, rarity: "RARE", weight: 0.7 },

    // DIY Category
    { name: "Miniature Green House Kit", slug: "miniature-green-house-kit", category: "DIY", price: 650, mrp: 1499, stock: 25, rarity: "RARE", weight: 0.7 },
    { name: "Origami Paper Crane Folding Kit", slug: "origami-paper-crane-folding-kit", category: "DIY", price: 110, mrp: 249, stock: 140, rarity: "COMMON", weight: 1.5 },
    { name: "Clay Sculpture Kit (24 colors)", slug: "clay-sculpture-kit-24-colors", category: "DIY", price: 290, mrp: 599, stock: 85, rarity: "UNCOMMON", weight: 1.2 },
    { name: "Embroidery Starter Hoop Kit", slug: "embroidery-starter-hoop-kit", category: "DIY", price: 220, mrp: 449, stock: 95, rarity: "UNCOMMON", weight: 1.0 },

    // Beauty Category
    { name: "Kawaii Peach Lip Balm", slug: "kawaii-peach-lip-balm", category: "Beauty", price: 75, mrp: 149, stock: 250, rarity: "COMMON", weight: 1.8 },
    { name: "Cute Cat Ears Spa Headband", slug: "cute-cat-ears-spa-headband", category: "Beauty", price: 120, mrp: 299, stock: 150, rarity: "COMMON", weight: 1.5 },
    { name: "Blossom Hand Cream Trio", slug: "blossom-hand-cream-trio", category: "Beauty", price: 180, mrp: 399, stock: 100, rarity: "UNCOMMON", weight: 1.1 },
    { name: "Pocket Folding Hair Brush with Mirror", slug: "pocket-folding-hair-brush-with-mirror", category: "Beauty", price: 95, mrp: 229, stock: 130, rarity: "COMMON", weight: 1.3 },

    // Toys Category
    { name: "Cute Avocado Fidget Pop-It", slug: "cute-avocado-fidget-pop-it", category: "Toys", price: 85, mrp: 199, stock: 210, rarity: "COMMON", weight: 1.8 },
    { name: "Astronaut Starry Galaxy Projector", slug: "astronaut-starry-galaxy-projector", category: "Toys", price: 990, mrp: 1999, stock: 15, rarity: "ULTRA_RARE", weight: 0.3 },
    { name: "Kawaii Squishy Animal Set", slug: "kawaii-squishy-animal-set", category: "Toys", price: 110, mrp: 249, stock: 160, rarity: "COMMON", weight: 1.5 },
    { name: "Wooden Block Balancing Tower", slug: "wooden-block-balancing-tower", category: "Toys", price: 280, mrp: 599, stock: 70, rarity: "UNCOMMON", weight: 1.0 },
  ];

  for (const prod of productsData) {
    await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        categoryId: categoryMap[prod.category],
        price: prod.price,
        mrp: prod.mrp,
        stock: prod.stock,
        rarity: prod.rarity as any,
        weight: prod.weight,
        isActive: true,
        images: [`/assets/products/${prod.slug}.jpg`],
      },
    });
  }

  console.log("📦 Created catalog products.");

  // 5. Create Mystery Boxes
  const mysteryBoxes = [
    {
      name: "Mystery Scoop",
      slug: "mystery-scoop",
      description: "Discover the joy of surprises with our curated Mystery Scoops! Every box is handpicked with love and care, designed to bring excitement, happiness, and a little bit of magic to your doorstep.",
      tagline: "Curated with Love, Stacked with Happiness ✨",
      price: 399,
      mrpValue: 700,
      minItems: 3,
      maxItems: 5,
      theme: "Kawaii & Adorable Surprise",
      gradientFrom: "#f7d6e0",
      gradientTo: "#b7c4a8",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 399, mrpValue: 700, minItems: 3, maxItems: 5 },
        { name: "Mega Scoop", price: 699, mrpValue: 1300, minItems: 5, maxItems: 8 },
        { name: "Luxury Scoop", price: 1190, mrpValue: 2500, minItems: 8, maxItems: 12 }
      ],
      categories: [
        { name: "Kawaii", weight: 2.0 },
        { name: "Stationery", weight: 2.0 },
        { name: "Beauty", weight: 1.0 },
        { name: "Toys", weight: 1.0 },
      ],
    },
    {
      name: "Birthday Scoop",
      slug: "birthday-scoop",
      description: "Celebrate your special day or gift a loved one! Packed with birthday theme goodies, cute party accessories, and kawaii treats.",
      tagline: "Kawaii & Anime Birthday Vibe 🎂",
      price: 399,
      mrpValue: 700,
      minItems: 2,
      maxItems: 3,
      theme: "Kawaii & Anime",
      gradientFrom: "#ffccd5",
      gradientTo: "#ffb3c6",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 399, mrpValue: 700, minItems: 2, maxItems: 3 },
        { name: "Mega Scoop", price: 699, mrpValue: 1300, minItems: 4, maxItems: 6 }
      ],
      categories: [
        { name: "Kawaii", weight: 2.0 },
        { name: "Anime", weight: 2.0 },
        { name: "Stationery", weight: 1.5 },
      ],
    },
    {
      name: "Self-care Scoop",
      slug: "self-care-scoop",
      description: "Treat yourself to a pampering session. Handpicked relaxation, spa, and beauty goodies.",
      tagline: "Kawaii beauty & self care mix 🌸",
      price: 499,
      mrpValue: 900,
      minItems: 4,
      maxItems: 5,
      theme: "Kawaii Mix",
      gradientFrom: "#f7d6e0",
      gradientTo: "#f5e6d3",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 499, mrpValue: 900, minItems: 4, maxItems: 5 },
        { name: "Mega Scoop", price: 799, mrpValue: 1500, minItems: 6, maxItems: 8 }
      ],
      categories: [
        { name: "Kawaii", weight: 1.0 },
        { name: "Beauty", weight: 3.0 },
        { name: "Stationery", weight: 1.0 },
      ],
    },
    {
      name: "Pink Princess Scoop",
      slug: "pink-princess-scoop",
      description: "Everything pink, aesthetic, and royal. Feel like a princess with these handpicked pink goodies.",
      tagline: "Aesthetic pink goodies kawaii mix 👑",
      price: 499,
      mrpValue: 900,
      minItems: 4,
      maxItems: 5,
      theme: "Kawaii Pink Princess",
      gradientFrom: "#ffccd5",
      gradientTo: "#f7d6e0",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 499, mrpValue: 900, minItems: 4, maxItems: 5 },
        { name: "Mega Scoop", price: 799, mrpValue: 1500, minItems: 6, maxItems: 8 }
      ],
      categories: [
        { name: "Kawaii", weight: 3.0 },
        { name: "Beauty", weight: 2.0 },
      ],
    },
    {
      name: "Boyfriend Mystery Scoop",
      slug: "boyfriend-mystery-scoop",
      description: "Cool, practical, and trendy items. A perfect mystery gift for the special boy in your life.",
      tagline: "Perfect gift for him 🎁",
      price: 499,
      mrpValue: 900,
      minItems: 3,
      maxItems: 4,
      theme: "Boys & Unisex Trendy",
      gradientFrom: "#b7c4a8",
      gradientTo: "#d8e2dc",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 499, mrpValue: 900, minItems: 3, maxItems: 4 },
        { name: "Mega Scoop", price: 799, mrpValue: 1500, minItems: 5, maxItems: 7 }
      ],
      categories: [
        { name: "Kawaii", weight: 1.0 },
        { name: "Toys", weight: 2.0 },
        { name: "DIY", weight: 2.0 },
      ],
    },
    {
      name: "Kids Scoop",
      slug: "kids-scoop",
      description: "Adorable toys, squishies, stationery, and stickers. Safe, fun, and delightful mystery picks for kids.",
      tagline: "Fun & cute goodies for children 🧸",
      price: 399,
      mrpValue: 700,
      minItems: 4,
      maxItems: 5,
      theme: "Toys & Stationery",
      gradientFrom: "#ffd166",
      gradientTo: "#f7d6e0",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 399, mrpValue: 700, minItems: 4, maxItems: 5 },
        { name: "Mega Scoop", price: 699, mrpValue: 1300, minItems: 6, maxItems: 8 }
      ],
      categories: [
        { name: "Kawaii", weight: 1.0 },
        { name: "Toys", weight: 3.0 },
        { name: "Stationery", weight: 2.0 },
      ],
    },
    {
      name: "Bestie/Thank You Scoop",
      slug: "bestie-thank-you-scoop",
      description: "Show your gratitude and love! A perfect handpicked box for your best friend or anyone you want to say thank you to.",
      tagline: "Curated with friendship & gratitude 💕",
      price: 499,
      mrpValue: 900,
      minItems: 4,
      maxItems: 5,
      theme: "Kawaii Gift",
      gradientFrom: "#f7d6e0",
      gradientTo: "#e8c1c5",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 499, mrpValue: 900, minItems: 4, maxItems: 5 },
        { name: "Mega Scoop", price: 799, mrpValue: 1500, minItems: 6, maxItems: 8 }
      ],
      categories: [
        { name: "Kawaii", weight: 2.0 },
        { name: "Stationery", weight: 2.0 },
        { name: "Beauty", weight: 1.0 },
      ],
    },
    {
      name: "Anxiety Comfort Scoop",
      slug: "anxiety-comfort-scoop",
      description: "A soothing combination of squishies, fidget toys, relaxing DIYs, and comforting items to ease your mind.",
      tagline: "Soothing fidgets & comfort items 🌿",
      price: 499,
      mrpValue: 900,
      minItems: 4,
      maxItems: 5,
      theme: "Comfort & Reliever",
      gradientFrom: "#b7c4a8",
      gradientTo: "#f5e6d3",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 499, mrpValue: 900, minItems: 4, maxItems: 5 },
        { name: "Mega Scoop", price: 799, mrpValue: 1500, minItems: 6, maxItems: 8 }
      ],
      categories: [
        { name: "Kawaii", weight: 1.0 },
        { name: "Toys", weight: 3.0 },
        { name: "DIY", weight: 1.0 },
      ],
    },
    {
      name: "Mommy Care Scoop",
      slug: "mommy-care-scoop",
      description: "Handpicked treats, cozy beauty items, and practical relaxation gifts for the hardworking mom.",
      tagline: "Cozy relaxation & love for mom 💝",
      price: 499,
      mrpValue: 900,
      minItems: 4,
      maxItems: 5,
      theme: "Mommy Care",
      gradientFrom: "#f7d6e0",
      gradientTo: "#b7c4a8",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 499, mrpValue: 900, minItems: 4, maxItems: 5 },
        { name: "Mega Scoop", price: 799, mrpValue: 1500, minItems: 6, maxItems: 8 }
      ],
      categories: [
        { name: "Kawaii", weight: 1.0 },
        { name: "Beauty", weight: 3.0 },
      ],
    },
    {
      name: "Festive Scoop",
      slug: "festive-scoop",
      description: "Make your festivals extra bright! Customizable for Rakshabandhan, Diwali, Christmas, and Bhai Dooj with themed festive treats.",
      tagline: "Celebrate Rakhi, Diwali, Xmas & more 🎉",
      price: 599,
      mrpValue: 1100,
      minItems: 4,
      maxItems: 6,
      theme: "Festival Special",
      gradientFrom: "#ffb3c6",
      gradientTo: "#ffd166",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 599, mrpValue: 1100, minItems: 4, maxItems: 6 },
        { name: "Mega Scoop", price: 999, mrpValue: 1900, minItems: 7, maxItems: 10 }
      ],
      categories: [
        { name: "Kawaii", weight: 2.0 },
        { name: "Stationery", weight: 2.0 },
        { name: "Beauty", weight: 1.0 },
      ],
    },
    {
      name: "Personalised/Custom Scoop",
      slug: "personalised-custom-scoop",
      description: "The ultimate bespoke box. You tell us exactly what you want and don't want, and we curate the entire stack to your specific vibe.",
      tagline: "100% custom curated stack 💫",
      price: 699,
      mrpValue: 1300,
      minItems: 4,
      maxItems: 5,
      theme: "Personalised",
      gradientFrom: "#f7d6e0",
      gradientTo: "#b7c4a8",
      isActive: true,
      variants: [
        { name: "Small Scoop", price: 699, mrpValue: 1300, minItems: 4, maxItems: 5 },
        { name: "Mega Scoop", price: 1090, mrpValue: 2200, minItems: 7, maxItems: 9 }
      ],
      categories: [
        { name: "Kawaii", weight: 2.0 },
        { name: "Stationery", weight: 2.0 },
        { name: "Beauty", weight: 1.0 },
        { name: "Toys", weight: 1.0 },
      ],
    },
  ];

  for (const box of mysteryBoxes) {
    const createdBox = await prisma.mysteryBox.create({
      data: {
        name: box.name,
        slug: box.slug,
        description: box.description,
        tagline: box.tagline,
        price: box.price,
        mrpValue: box.mrpValue,
        minItems: box.minItems,
        maxItems: box.maxItems,
        theme: box.theme,
        gradientFrom: box.gradientFrom,
        gradientTo: box.gradientTo,
        isActive: box.isActive,
        variants: box.variants || null,
        images: [`/assets/boxes/${box.slug}.jpg`],
      },
    });

    // Create Category Weights
    for (const catWeight of box.categories) {
      await prisma.boxCategory.create({
        data: {
          mysteryBoxId: createdBox.id,
          categoryId: categoryMap[catWeight.name],
          weight: catWeight.weight,
        },
      });
    }
  }

  console.log("✨ Created mystery scoops with box categories and weights.");

  // 6. Create Coupons
  const coupons = [
    { code: "WELCOME10", type: "PERCENT", value: 10, minOrder: 299, usageLimit: 1000 },
    { code: "MAGICSHIPPING", type: "FREE_SHIPPING", value: 0, minOrder: 199, usageLimit: 500 },
    { code: "SCOOP100", type: "FIXED", value: 100, minOrder: 599, usageLimit: 200 },
  ];

  for (const coup of coupons) {
    await prisma.coupon.create({
      data: {
        code: coup.code,
        type: coup.type as any,
        value: coup.value,
        minOrder: coup.minOrder,
        usageLimit: coup.usageLimit,
        isActive: true,
      },
    });
  }

  console.log("🎟️ Created default discount coupons.");

  // 7. Create Sample Order & Review to simulate activity
  const sampleOrder = await prisma.order.create({
    data: {
      user: {
        connect: { id: testUser.id },
      },
      status: "DELIVERED",
      paymentStatus: "PAID",
      subtotal: 399,
      discount: 0,
      shipping: 0,
      total: 399,
      address: {
        create: {
          user: {
            connect: { id: testUser.id },
          },
          name: "Priya Sharma",
          phone: "9876543210",
          line1: "Flat 402, Sunshine Apartments",
          line2: "Sector 5, HSR Layout",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560102",
          isDefault: true,
        },
      },
      items: {
        create: {
          mysteryBox: {
            connect: {
              slug: "mystery-scoop",
            },
          },
          quantity: 1,
          price: 399,
          selectedVariant: "Small Scoop",
          unwantedNote: "no green accessories",
          allocations: [
            { name: "Sakura Blossom Keychain", rarity: "COMMON", value: 199 },
            { name: "Cute Animal Gel Pens (10 pack)", rarity: "COMMON", value: 299 },
            { name: "Chibi Naruto Action Figure", rarity: "UNCOMMON", value: 699 },
          ],
        },
      },
      payments: {
        create: {
          provider: "STRIPE",
          providerPaymentId: "ch_mock_stripe_123",
          amount: 399,
          status: "PAID",
        },
      },
    },
    include: {
      items: true,
    },
  });

  // Create review for this order
  await prisma.review.create({
    data: {
      user: {
        connect: { id: testUser.id },
      },
      mysteryBox: {
        connect: { id: sampleOrder.items[0].mysteryBoxId },
      },
      order: {
        connect: { id: sampleOrder.id },
      },
      rating: 5,
      title: "Oh my gosh, I love it!",
      body: "Everything in my scoop was super cute, especially the Naruto figure! Definitely worth more than what I paid. Highly recommend!",
      isVerified: true,
      helpfulCount: 4,
    },
  });

  console.log("📝 Seeded sample order and review activity.");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
