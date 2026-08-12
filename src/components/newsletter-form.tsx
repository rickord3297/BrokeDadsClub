"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.message ?? "Could not subscribe. Try again?");
      return;
    }

    setStatus("done");
    setMessage(payload.message ?? "You're in.");
    setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="newsletter-email">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="dad@email.com"
        className="h-11 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-sm text-paper outline-none placeholder:text-paper/50 focus:border-gold"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-11 rounded-full bg-gold px-5 text-sm font-semibold text-ink hover:bg-paper disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Join"}
      </button>
      {message ? (
        <p className="basis-full text-sm text-gold">{message}</p>
      ) : null}
    </form>
  );
}
