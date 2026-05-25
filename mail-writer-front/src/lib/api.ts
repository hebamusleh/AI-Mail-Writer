export interface GenerateEmailRequest {
  description: string;
  type: string;
  tone: string;
}

export interface GenerateEmailResponse {
  subject: string;
  body: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ;
const REQUEST_TIMEOUT_MS = 30_000;

export async function generateEmail(
  payload: GenerateEmailRequest
): Promise<GenerateEmailResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { error?: string }).error ?? "Failed to generate email. Please try again."
      );
    }

    return res.json() as Promise<GenerateEmailResponse>;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
