"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

export function GuideSearch() {
  const inputId = useId();
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [value, setValue] = useState(q);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setValue(q);
  }, [q]);

  function go(next: string) {
    const query = new URLSearchParams(params.toString());
    const trimmed = next.trim();
    if (trimmed) query.set("q", trimmed);
    else query.delete("q");
    const search = query.toString();
    router.replace(search ? `/guides?${search}` : "/guides", { scroll: false });
  }

  return (
    <form
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        go(value);
      }}
    >
      <label className="sr-only" htmlFor={inputId}>
        Search guides
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        placeholder="Search guides"
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);
          if (timer.current) window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => go(next), 250);
        }}
        className="h-11 w-full rounded-full border border-rule bg-paper px-4 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-pine"
      />
    </form>
  );
}
