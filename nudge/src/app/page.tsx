'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white px-4">
      <div className="max-w-2xl w-full text-center bg-neutral-800 rounded-xl shadow-lg p-10">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">Pooke Home</h1>
        <p className="text-lg mb-6">
          Welcome to <span className="font-semibold text-blue-300">Pooke AI</span> — an AI-powered code editor for learning DSA.
        </p>
        <p className="mb-8 text-neutral-300">
          This project is actively being developed (recruiting + classes has slowed progress)
        </p>
        <Link href="/editor">
          <button className="bg-slate-500 hover:bg-neutral-600 text-black font-bold py-3 px-8 rounded transition">
            Go to Code Editor
          </button>
        </Link>
      </div>
    </main>
  );
}