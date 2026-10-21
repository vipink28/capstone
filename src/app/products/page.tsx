import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { db } from "@/prisma/db";
import { and, all } from "@prisma/orm-postgres/orm-client";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; maxPrice?: string }>;
}) {
  const { category, maxPrice } = await searchParams;

  const [products, categories] = await Promise.all([
    db.orm.public.Product.where((p) =>
      and(
        category ? p.category.some({ name: category }) : all(),
        maxPrice ? p.price.lte(Number(maxPrice)) : all(),
      ),
    )
      .orderBy((p) => p.createdAt.desc())
      .all(),

    db.orm.public.Category.orderBy((c) => c.name.asc()).all(),
  ]);

  return (
    <div className="flex gap-6 p-6">
      <ProductFilters categories={categories.map((c) => c.name)} />
      <div className="flex-1">
        {products.length === 0 ? (
          <p className="p-6 text-gray-300">No products available right now</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
            {products.map(({ id, name, imageUrl, price }) => (
              <ProductCard
                key={id}
                id={id}
                name={name}
                imageUrl={imageUrl}
                price={price}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
