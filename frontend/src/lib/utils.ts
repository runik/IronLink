import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PageType } from "@/types/project";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCategoryColor = (category: PageType): string => {
  const map: Record<PageType, string> = {
    Lead: "bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800",
    Checkout: "bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-900",
    Sales: "bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800",
    "Thank You":
      "bg-gradient-to-r from-purple-800 via-fuchsia-700 to-purple-900",
    Upsell: "bg-gradient-to-r from-pink-800 via-rose-700 to-pink-900",
    Other: "bg-gradient-to-r from-slate-800 via-gray-700 to-slate-900",
  };
  return map[category] || map.Other;
};

export const getBadgeColor = (category: PageType): string => {
  const map: Record<PageType, string> = {
    Lead: "bg-emerald-800",
    Checkout: "bg-blue-800",
    Sales: "bg-amber-800",
    "Thank You": "bg-purple-800",
    Upsell: "bg-pink-800",
    Other: "bg-gray-800",
  };
  return map[category] || map.Other;
};

export const formatRevenue = (revenue: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(revenue);

export const generateSlug = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, "-");
