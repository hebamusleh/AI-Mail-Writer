import { EmailGenerator } from "@/components/email-generator";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            AI
          </div>
          <span className="text-base font-semibold text-foreground">AI Mail Writer</span>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Write better emails with AI
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Describe your email, choose a type and tone, and let AI do the writing.
          </p>
        </div>
        <EmailGenerator />
      </main>
    </div>
  );
}
