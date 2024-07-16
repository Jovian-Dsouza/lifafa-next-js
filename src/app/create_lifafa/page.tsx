"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { useLifafaProgram } from "@/hooks/useLifafaProgram";

export default function CreateMarketPage() {
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [loading, setLoading] = useState(false);

  const { createLifafa } = useLifafaProgram();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // await initialize(name, parseInt(fee)); // Call the initialize function

      // Clear state variables to default
      setName("");
      setFee("");
    } catch (error) {
      console.error("Failed to initialize marketplace", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <h1 className="text-2xl font-bold">Initialize Marketplace</h1>
          <ThemeModeToggle />
        </div>
      </header>
      <main className="flex-1 space-y-10 max-w-screen-xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Marketplace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Transaction Fee (%)
            </label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Initializing..." : "Initialize Marketplace"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
