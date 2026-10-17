"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = ["Electronics", "Apparel", "Footwear", "Jewellery"]; // will be made dynamic later
export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  const searchParams = useSearchParams();
  console.log(searchParams);

  function updateFilter(key: string, value: string): void {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key); // Remove the filter if the value is empty from the url entirely.
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="w-56 space-y-4">
      <div>
        <h4>Category Filter</h4>
        <select
          className="bg-slate-950"
          defaultValue={searchParams.get("category") || ""}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h4>Max Price</h4>
        <input
          type="number"
          placeholder="e.g 2000"
          defaultValue={searchParams.get("maxPrice") || ""}
          onBlur={(e) => updateFilter("maxPrice", e.target.value)}
        />
      </div>
    </aside>
  );
}
