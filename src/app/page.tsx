"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { useLifafaProgram } from "@/hooks/useLifafaProgram";
import { CreateLifafaComponent } from "@/components/createLifafaComponent";

export default function CreateMarketPage() {
  const [name, setName] = useState(""); // State for marketplace name
  const [fee, setFee] = useState(""); // State for transaction fee
  const [loading, setLoading] = useState(false); // State for loading indicator

  const { createLifafa } = useLifafaProgram(); // Hook to manage marketplace creation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    try {
      // await initialize(name, parseInt(fee)); // Call the initialize function

      // Clear state variables to default
      setName("");
      setFee("");
    } catch (error) {
      console.error("Failed to initialize marketplace", error);
    } finally {
      setLoading(false); // Set loading to false after processing
    }
  };

  return (
    <div className="min-h-screen w-[23rem] flex flex-col items-center justify-center bg-background">
      <CreateLifafaComponent />
    </div>
  );
}
