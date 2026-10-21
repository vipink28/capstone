import ProductCard from "@/components/ProductCard";
import { db } from "@/prisma/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function getCategory(slug: string) {
  return db.orm.public.Category.where({ slug }).first();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: `Browse all ${category.name} products`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const products = await db.orm.public.Product.where({
    categoryId: category.id,
  })
    .orderBy((p) => p.createdAt.desc())
    .limit(25)
    .all();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
      {products.length === 0 ? (
        <p>No products in this category</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              imageUrl={p.imageUrl}
              price={p.price}
            />
          ))}
        </div>
      )}
    </div>
  );
}
