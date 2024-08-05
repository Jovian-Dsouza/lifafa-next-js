"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
// import { useLifafaProgram } from "@/hooks/useLifafaProgram";
import { CreateLifafaComponent } from "@/components/createLifafaComponent";
import Image from "next/image";
import HeroImage from "../../public/Hero-section.png";

export default function CreateMarketPage() {
  const [name, setName] = useState(""); // State for marketplace name
  const [fee, setFee] = useState(""); // State for transaction fee
  const [loading, setLoading] = useState(false); // State for loading indicator

  // const { createLifafa } = useLifafaProgram(); // Hook to manage marketplace creation

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
    <div className="w-full flex flex-col md:flex-row items-center justify-center bg-background gap-[3rem] lg:gap-[8rem] mt-5">
      <Image src={HeroImage} alt="envelop-image" className="w-full md:w-[50%] h-auto" />
      <CreateLifafaComponent />
      
    </div>
  );
}
