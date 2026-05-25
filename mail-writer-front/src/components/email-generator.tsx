"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Loader2, Copy, Check, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateEmail } from "@/lib/api";
import { cn } from "@/lib/utils";

// ── Constants ────────────────────────────────────────────────────────────────

const EMAIL_TYPES = ["Professional", "Friendly", "Formal", "Follow-up", "Sales"] as const;
const TONES = ["Polite", "Confident", "Friendly", "Persuasive"] as const;
const MAX_DESCRIPTION_LENGTH = 500;
const TOAST_DURATION_MS = 2500;

type EmailType = (typeof EMAIL_TYPES)[number];
type Tone = (typeof TONES)[number];

// ── Shared class strings ──────────────────────────────────────────────────────

const SELECT_CLASS = cn(
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
  "text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
  "focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
);

// ── Inline toast hook ─────────────────────────────────────────────────────────

function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    timerRef.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { toastMessage: message, showToast };
}

// ── CopyIconButton ────────────────────────────────────────────────────────────

function CopyIconButton({ onCopy }: { onCopy: () => Promise<void> }) {
  const [done, setDone] = useState(false);

  const handleClick = async () => {
    await onCopy();
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      title="Copy to clipboard"
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 transition-colors",
        "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

// ── EmailGenerator ────────────────────────────────────────────────────────────

export function EmailGenerator() {
  const [description, setDescription] = useState("");
  const [emailType, setEmailType] = useState<EmailType>("Professional");
  const [tone, setTone] = useState<Tone>("Polite");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);

  const { toastMessage, showToast } = useToast();

  const charsUsed = description.length;
  const charsLeft = MAX_DESCRIPTION_LENGTH - charsUsed;
  const isNearLimit = charsLeft < 50;
  const canGenerate = description.trim().length > 0 && !loading;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > MAX_DESCRIPTION_LENGTH) return;
    setDescription(val);
    if (error) setError(null);
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Please describe the email you want to generate.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await generateEmail({
        description: description.trim(),
        type: emailType.toLowerCase(),
        tone: tone.toLowerCase(),
      });
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = useCallback(
    async (text: string, label: string) => {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`);
    },
    [showToast]
  );

  const handleCopyFull = () => {
    if (!result) return;
    return copyToClipboard(`Subject: ${result.subject}\n\n${result.body}`, "Email");
  };

  const handleCopySubject = () => {
    if (!result) return;
    return copyToClipboard(result.subject, "Subject");
  };

  const handleCopyBody = () => {
    if (!result) return;
    return copyToClipboard(result.body, "Body");
  };

  return (
    <>
      <div className="w-full space-y-5">
        {/* ── Input card ── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">

          {/* Description textarea */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Describe your email
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="e.g. Write a follow-up email to a client about the pending invoice from last week…"
              rows={4}
              disabled={loading}
              className={cn(
                "w-full resize-none rounded-lg border border-input bg-background",
                "px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
            {/* Character counter */}
            <p
              className={cn(
                "text-right text-xs tabular-nums",
                isNearLimit ? "text-destructive font-medium" : "text-muted-foreground"
              )}
            >
              {charsUsed} / {MAX_DESCRIPTION_LENGTH}
            </p>
          </div>

          {/* Type + Tone dropdowns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email-type" className="text-sm font-medium text-foreground">
                Email Type
              </label>
              <select
                id="email-type"
                value={emailType}
                onChange={(e) => setEmailType(e.target.value as EmailType)}
                disabled={loading}
                className={SELECT_CLASS}
              >
                {EMAIL_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="tone" className="text-sm font-medium text-foreground">
                Tone
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                disabled={loading}
                className={SELECT_CLASS}
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
            >
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            size="lg"
            className="w-full gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate Email
              </>
            )}
          </Button>
        </div>

        {/* ── Result card ── */}
        {result && !loading && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            {/* Result header */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Generated Email
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="gap-1.5"
                >
                  <RefreshCw className="size-3.5" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyFull}
                  className="gap-1.5"
                >
                  <Copy className="size-3.5" />
                  Copy Email
                </Button>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Subject
                </p>
                <CopyIconButton onCopy={handleCopySubject} />
              </div>
              <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
                <p className="text-sm font-medium text-foreground">{result.subject}</p>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Body
                </p>
                <CopyIconButton onCopy={handleCopyBody} />
              </div>
              <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {result.body}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Toast notification ── */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed bottom-5 right-5 z-50 flex items-center gap-2",
            "rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background shadow-lg",
            "animate-in fade-in slide-in-from-bottom-2 duration-200"
          )}
        >
          <Check className="size-4 shrink-0" />
          {toastMessage}
        </div>
      )}
    </>
  );
}
