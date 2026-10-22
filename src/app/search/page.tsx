import ProductCard from "@/components/ProductCard";
import { db } from "@/prisma/db";
import { or } from "@prisma/orm-postgres/orm-client";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return <p>Type something in the search box to find prouducts</p>;
  }

  const pattern = `%${query}%`;

  const products = await db.orm.public.Product.where((p) =>
    or(p.name.ilike(pattern), p.description.ilike(pattern)),
  )
    .orderBy((p) => p.name.asc())
    .limit(25)
    .all();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        {products.length} result{products.length === 1 ? "" : "s"} for {query}
      </h1>

      {products.length === 0 ? (
        <p>No products matched. Try a different search</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              imageUrl={p.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
