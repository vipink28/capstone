import { addToCart } from "@/app/cart/actions";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import { db } from "@/prisma/db";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getProduct(id: string) {
  return db.orm.public.Product.include("category")
    .where({ id: Number(id) })
    .first(); /// first returns - the object ({id:1, name: "tshirts"}) or null if not found, all returns an array ([{id:1, name: "tshirts"}])
}

async function getRelatedProducts(
  categoryId: number | undefined,
  excludedId: number | undefined,
) {
  if (excludedId)
    return db.orm.public.Product.where({ categoryId })
      .where((p) => p.id.neq(excludedId))
      .limit(5)
      .all();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const relatedProducts = await getRelatedProducts(
    product?.categoryId,
    product?.id,
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid md:grid-cols-2 gap-8 p-6">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={500}
          height={500}
          className="rounded-lg object-cover"
        />
        <div>
          <p className="text-sm text-gray-200">{product.category.name}</p>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
          <p className="text-xl text-gray-100 mt-2">{product.price}</p>
          <p className="mt-4">{product.description}</p>
          <p className="mt-2 text-sm">
            {product.inStock ? (
              <span>In Stock</span>
            ) : (
              <span>Out of Stock</span>
            )}
          </p>
          <div className="flex">
            <button className="bg-amber-700 px-8 py-2">Add To Wishlist</button>
            <form action={addToCart.bind(null, product.id)}>
              <AddToCartButton disabled={!product.inStock} />
            </form>
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts?.length > 0 && (
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                imageUrl={p.imageUrl}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
