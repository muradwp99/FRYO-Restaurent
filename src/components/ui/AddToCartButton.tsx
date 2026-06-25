"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import type { MenuItem } from "@/lib/menu";
import { cn } from "@/lib/utils";

type Props = {
  item: Pick<MenuItem, "id" | "name" | "price" | "image">;
  className?: string;
  variant?: "solid" | "outline";
  label?: string;
};

export function AddToCartButton({
  item,
  className,
  variant = "solid",
  label = "Add",
}: Props) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const onClick = () => {
    add(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  };

  return (
    <button
      onClick={onClick}
      data-cursor="ADD"
      className={cn(
        "group/btn inline-flex items-center justify-center gap-1.5 rounded-full font-display tracking-wider transition-all duration-300 active:scale-95",
        variant === "solid"
          ? "bg-gold text-navy hover:bg-gold-light hover:shadow-[0_0_24px_rgba(245,196,0,0.5)]"
          : "border border-gold/60 text-gold hover:bg-gold hover:text-navy",
        className
      )}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> Added
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 transition-transform group-hover/btn:rotate-90" />
          {label}
        </>
      )}
    </button>
  );
}
