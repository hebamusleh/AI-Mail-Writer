export interface GenerateEmailRequest {
  description: string;
  type: string;
  tone: string;
}

export interface GenerateEmailResponse {
  subject: string;
  body: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function generateEmail(
  payload: GenerateEmailRequest
): Promise<GenerateEmailResponse> {
  const res = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Failed to generate email. Please try again."
    );
  }

  return res.json() as Promise<GenerateEmailResponse>;
}
