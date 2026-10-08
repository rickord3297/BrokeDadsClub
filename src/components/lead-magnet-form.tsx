"use client";

import { useEffect, useId, useRef, useState } from "react";
import { trackEmailSignup, trackLeadMagnetDownload } from "@/lib/analytics";
import { validateEmail } from "@/lib/email";

function saveFile(href: string, fileName: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function LeadMagnetForm({
  slug,
  fileName,
  source,
  submitLabel = "Download the PDF",
}: {
  slug: string;
  fileName: string;
  /** Analytics label; the server stores its own source per lead magnet. */
  source: string;
  submitLabel?: string;
}) {
  const inputId = useId();
  const feedbackId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
  }, [fileUrl]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = validateEmail(email);
    if (invalid) {
      setStatus("error");
      setMessage(invalid);
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(`/api/lead-magnets/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: honeypot.current?.value ?? "" }),
      });
      if (!response.ok || !response.headers.get("Content-Type")?.includes("application/pdf")) {
        const payload = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(payload.message ?? "Could not get the PDF. Try again in a bit.");
      }
      const url = URL.createObjectURL(await response.blob());
      saveFile(url, fileName);
      setFileUrl(url);
      setStatus("done");
      trackEmailSignup(source);
      trackLeadMagnetDownload(slug);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not get the PDF. Try again in a bit.");
    }
  }

  if (status === "done" && fileUrl) {
    return (
      <div role="status" aria-live="polite" className="rounded-md border border-pine/30 bg-pine/10 px-4 py-3 text-sm text-pine">
        <p className="font-medium">Your PDF is downloading. You&apos;re on the Sunday list too.</p>
        <p className="mt-2 text-ink-soft">
          Didn&apos;t start?{" "}
          <a
            href={fileUrl}
            download={fileName}
            className="font-medium text-pine underline decoration-current/30 underline-offset-2 hover:text-rust"
          >
            Download the checklist again
          </a>
        </p>
      </div>
    );
  }

  const isError = status === "error";
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
      <label className="sr-only" htmlFor={inputId}>
        Email
      </label>
      <div
        className={`flex min-h-12 flex-1 items-stretch overflow-hidden rounded-md border bg-paper ${
          isError ? "border-rust" : "border-rule"
        }`}
      >
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (isError) {
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
          {status === "loading" ? "Preparing…" : submitLabel}
        </button>
      </div>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {message ? (
        <p id={feedbackId} role="alert" className="text-sm text-rust">
          {message}
        </p>
      ) : (
        <p className="text-xs leading-5 text-ink-soft">
          Instant download. You also get one short Sunday email. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
