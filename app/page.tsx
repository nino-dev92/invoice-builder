import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-semibold">Invoice & Receipt Generator</h1>
      <p className="max-w-md text-gray-600">
        Fill in a few details and get a clean PDF invoice or receipt — stored so
        you can find it again later.
      </p>
      <div className="flex gap-4">
        <Link
          href="/new"
          className="rounded-md bg-black px-5 py-2.5 text-white hover:bg-gray-800"
        >
          Create new
        </Link>
        <Link
          href="/invoices"
          className="rounded-md border border-gray-300 px-5 py-2.5 hover:bg-white hover:text-white dark:hover:text-black"
        >
          View history
        </Link>
      </div>
    </main>
  );
}
