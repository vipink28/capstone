import { db } from "@/prisma/db";
import Image from "next/image";

export default async function Home() {
  const slides = await db.orm.public.SliderItem.where({ isActive: true })
    .orderBy((s) => s.id.desc())
    .limit(4)
    .all();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* carousel */}
        <section>
          {slides.length > 0 ? (
            <div className="relative w-full overflow-hidden rounded-lg">
              {slides.map((slide) => (
                <div key={slide.id}>
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    width={800}
                    height={400}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No slides available</p>
          )}
        </section>
      </main>
    </div>
  );
}
