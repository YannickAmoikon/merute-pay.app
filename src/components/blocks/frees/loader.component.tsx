import { CircleDashed } from "lucide-react";
import React from "react";

export function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-10rem)]">
      <CircleDashed size={44} className="font-bold text-slate-400 animate-spin" />{" "}
    </div>
  );
}