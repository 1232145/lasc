import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data, error } = await supabase.from("events").select("*").limit(1);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold">Supabase Connection Test</h1>
      {error ? (
        <p className="text-red-500 mt-4">❌ {error.message}</p>
      ) : (
        <pre className="mt-4 bg-gray-100 p-3 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
