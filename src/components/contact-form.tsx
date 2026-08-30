"use client";

import { useId, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-rule bg-paper px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-pine";

export function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const websiteId = useId();
  const feedbackId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setStatusMessage("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setStatus("error");
      setStatusMessage(payload.message ?? "Could not send that message.");
      return;
    }

    setStatus("done");
    setName("");
    setEmail("");
    setMessage("");
    setStatusMessage(
      payload.message ?? "Message sent. We'll read it and get back to you.",
    );
  }

  if (status === "done") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-pine/30 bg-pine/10 px-4 py-4 text-sm text-pine"
      >
        <p className="font-medium">{statusMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor={websiteId}>Website</label>
        <input id={websiteId} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className="text-sm font-medium text-ink">
            Name <span className="text-ink-soft">(optional)</span>
          </label>
          <input
            id={nameId}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Rick"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor={emailId} className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="dad@email.com"
            aria-invalid={status === "error"}
            aria-describedby={statusMessage ? feedbackId : undefined}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor={messageId} className="text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id={messageId}
          required
          rows={5}
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Guide idea, shop question, typo on a printable..."
          aria-invalid={status === "error"}
          aria-describedby={statusMessage ? feedbackId : undefined}
          className={`mt-1.5 resize-y ${inputClass}`}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-11 items-center justify-center rounded-full bg-pine px-6 text-sm font-semibold text-paper transition hover:bg-pine-2 disabled:cursor-wait disabled:opacity-70"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
        <p className="text-xs text-ink-soft">
          We read every note. Usually reply within a few days.
        </p>
      </div>

      {statusMessage ? (
        <p
          id={feedbackId}
          role="alert"
          className={`text-sm ${status === "error" ? "text-rust" : "text-pine"}`}
        >
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
