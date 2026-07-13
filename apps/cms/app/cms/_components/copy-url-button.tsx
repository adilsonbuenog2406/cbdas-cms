"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

type CopyUrlButtonProps = {
  url: string;
};

export default function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#10224f]/12 bg-white px-3 py-2 text-xs font-semibold text-[#10224f] transition hover:border-[#10224f]/24 hover:bg-[#f6f8fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9d600]/70"
      aria-label="Copiar URL publica"
    >
      <Copy className="h-4 w-4" aria-hidden="true" />
      {copied ? "Copiado" : "Copiar URL"}
    </button>
  );
}
