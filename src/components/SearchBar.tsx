export default function SearchBar() {
  return (
    <form action="/search" method="get">
      <input
        name="q"
        type="search"
        placeholder="Search Products..."
        className="border rounded px-3 py-1"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-amber-200 text-black rounded"
      >
        Search
      </button>
    </form>
  );
}
