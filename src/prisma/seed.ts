import { db } from "./db";

async function main() {
  const electronics = await db.orm.public.Category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
    },
  });
  const apparel = await db.orm.public.Category.create({
    data: {
      name: "Apparel",
      slug: "apparel",
    },
  });

  await db.orm.public.Product.createAll([
    {
      name: "Smartphone",
      description:
        "A high-end smartphone with a sleek design and powerful features.",
      price: 699.99,
      categoryId: electronics.id,
      imageUrl: "/placeholder.png",
    },
    {
      name: "Laptop",
      description: "A powerful laptop for work and entertainment.",
      price: 1299.99,
      categoryId: electronics.id,
      imageUrl: "/placeholder.png",
    },
    {
      name: "T-Shirt",
      description: "A comfortable cotton t-shirt.",
      price: 19.99,
      categoryId: apparel.id,
      imageUrl: "/placeholder.png",
    },
    {
      name: "Jeans",
      description: "Stylish denim jeans for everyday wear.",
      price: 49.99,
      categoryId: apparel.id,
      imageUrl: "/placeholder.png",
    },
  ]);
}
main()
  .then(() => {
    console.log("Seed data created successfully.");
  })
  .catch((error) => {
    console.error("Error creating seed data:", error);
  });
