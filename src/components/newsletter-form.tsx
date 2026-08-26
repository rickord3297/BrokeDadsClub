"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { trackEmailSignup } from "@/lib/analytics";
import { site } from "@/lib/site";

type NewsletterFormProps = {
  variant?: "footer" | "article" | "inline";
  submitLabel?: string;
  source?: string;
  successMessage?: string;
  successHref?: string;
  successLinkLabel?: string;
};

function validateEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "That email doesn't look right.";
  }
  return null;
}

export function NewsletterForm({
  variant = "footer",
  submitLabel = site.weekStart.button,
  source = "footer",
  successMessage,
  successHref,
  successLinkLabel,
}: NewsletterFormProps) {
  const inputId = useId();
  const feedbackId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const isArticle = variant === "article";
  const isInline = variant === "inline";
  const isError = status === "error";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setStatus("error");
      setMessage(validationError);
      return;
    }

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
      <div
        role="status"
        aria-live="polite"
        className={
          isInline || isArticle
            ? "rounded-md border border-pine/30 bg-pine/10 px-4 py-3 text-sm text-pine"
            : "rounded-md border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold"
        }
      >
        <p className="font-medium">{message}</p>
        {successHref && successLinkLabel ? (
          <p className="mt-2 text-ink-soft">
            <Link
              href={successHref}
              className="font-medium text-pine underline decoration-current/30 underline-offset-2 hover:text-rust"
            >
              {successLinkLabel} →
            </Link>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        isInline
          ? "flex flex-col gap-2"
          : "flex flex-col gap-2 sm:flex-row sm:flex-wrap"
      }
      noValidate
    >
      <label className="sr-only" htmlFor={inputId}>
        Email
      </label>
      {isInline ? (
        <div
          className={`flex min-h-12 flex-1 items-stretch overflow-hidden rounded-md border bg-paper ${
            isError ? "border-rust" : "border-rule"
          }`}
        >
          <input
            id={inputId}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error") {
                setStatus("idle");
                setMessage("");
              }
            }}
            placeholder="dad@email.com"
            aria-invalid={isError}
            aria-describedby={message ? feedbackId : undefined}
            className="min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink-soft"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 bg-pine px-5 text-sm font-medium text-paper transition hover:bg-pine-2 disabled:cursor-wait disabled:opacity-70 sm:px-6"
          >
            {status === "loading" ? "Sending…" : submitLabel}
          </button>
        </div>
      ) : (
        <>
          <input
            id={inputId}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error") {
                setStatus("idle");
                setMessage("");
              }
            }}
            placeholder="dad@email.com"
            aria-invalid={isError}
            aria-describedby={message ? feedbackId : undefined}
            className={
              isArticle
                ? `h-11 flex-1 rounded-full border bg-paper px-4 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-pine ${
                    isError ? "border-rust" : "border-rule"
                  }`
                : `h-11 flex-1 rounded-full border bg-white/10 px-4 text-sm text-paper outline-none placeholder:text-paper/50 focus:border-gold ${
                    isError ? "border-rust" : "border-white/20"
                  }`
            }
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={
              isArticle
                ? "h-11 rounded-full bg-pine px-5 text-sm font-semibold text-paper hover:bg-pine-2 disabled:cursor-wait disabled:opacity-70"
                : "h-11 rounded-full bg-gold px-5 text-sm font-semibold text-ink hover:bg-paper disabled:cursor-wait disabled:opacity-70"
            }
          >
            {status === "loading" ? "Sending…" : submitLabel}
          </button>
        </>
      )}
      {message ? (
        <p
          id={feedbackId}
          role="alert"
          className={`text-sm ${isError ? "text-rust" : isInline || isArticle ? "text-pine" : "text-gold"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
