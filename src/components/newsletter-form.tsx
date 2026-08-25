"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { trackEmailSignup } from "@/lib/analytics";
import { site } from "@/lib/site";

type NewsletterFormProps = {
  variant?: "footer" | "article";
  submitLabel?: string;
  source?: string;
  successMessage?: string;
  successHref?: string;
  successLinkLabel?: string;
};

export function NewsletterForm({
  variant = "footer",
  submitLabel = site.weekStart.button,
  source = "footer",
  successMessage,
  successHref,
  successLinkLabel,
}: NewsletterFormProps) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const isArticle = variant === "article";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });
    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.message ?? "Could not subscribe. Try again?");
      return;
    }

    trackEmailSignup(source);
    setStatus("done");
    setEmail("");
    setMessage(
      successMessage ??
        payload.message ??
        site.weekStart.success,
    );
  }

  if (status === "done") {
    return (
      <p className={`text-sm ${isArticle ? "text-pine" : "text-gold"}`}>
        {message}
        {successHref && successLinkLabel ? (
          <>
            {" "}
            <Link
              href={successHref}
              className="font-semibold underline decoration-current underline-offset-2"
            >
              {successLinkLabel} →
            </Link>
          </>
        ) : null}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <label className="sr-only" htmlFor={inputId}>
        Email
      </label>
      <input
        id={inputId}
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="dad@email.com"
        className={
          isArticle
            ? "h-11 flex-1 rounded-full border border-rule bg-paper px-4 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-pine"
            : "h-11 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-sm text-paper outline-none placeholder:text-paper/50 focus:border-gold"
        }
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={
          isArticle
            ? "h-11 rounded-full bg-pine px-5 text-sm font-semibold text-paper hover:bg-pine-2 disabled:opacity-60"
            : "h-11 rounded-full bg-gold px-5 text-sm font-semibold text-ink hover:bg-paper disabled:opacity-60"
        }
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </button>
      {message ? (
        <p
          className={`basis-full text-sm ${isArticle ? "text-pine" : "text-gold"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
