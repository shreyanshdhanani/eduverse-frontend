"use client";
import { useEffect, useState } from "react";
import { Bot } from "lucide-react"; // AI Icon
import { WiStars } from "react-icons/wi";
import { SiGooglegemini } from "react-icons/si";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.08 : 1.08)); // AI Pulsing Effect
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-[1300px] mx-auto my-10 p-4 relative">
      {/* Hero Image */}
      <div className="relative">
        <img
          src="/hero.jpg"
          alt="Hero Banner"
          className="w-full h-auto rounded-lg shadow-lg"
        />

        {/* AI-Powered Beeping Button */}

      </div>
    </section>
  );
}
