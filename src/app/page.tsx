import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* carousel */}
        <section>
          <div className="w-full h-112.5">
            <Image
              src="/images/carousel.png"
              alt="carousel"
              width={1200}
              height={450}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
