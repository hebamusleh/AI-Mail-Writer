import json
import logging
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI

load_dotenv()

# ── Startup validation (US20) ─────────────────────────────────────────────────

_openai_key = os.environ.get("OPENAI_API_KEY")
if not _openai_key:
    logging.warning(
        "OPENAI_API_KEY is not set. "
        "The /api/generate endpoint will fail until it is configured in .env."
    )

# ── App setup ─────────────────────────────────────────────────────────────────

app = Flask(__name__)

CORS(
    app,
    origins=os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
)

client = OpenAI(api_key=_openai_key)

VALID_TYPES = {"professional", "friendly", "formal", "follow-up", "sales"}
VALID_TONES = {"polite", "confident", "friendly", "persuasive"}
MAX_DESCRIPTION_LENGTH = 500


@app.route("/api/health", methods=["GET"])
def health():
    configured = bool(os.environ.get("OPENAI_API_KEY"))
    return jsonify({
        "status": "ok" if configured else "degraded",
        "openai_configured": configured,
    })


@app.route("/api/generate", methods=["POST"])
def generate_email():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid request body."}), 400

    description = (data.get("description") or "").strip()
    email_type = (data.get("type") or "professional").strip().lower()
    tone = (data.get("tone") or "polite").strip().lower()

    if not description:
        return jsonify({"error": "Description is required."}), 400

    if len(description) > MAX_DESCRIPTION_LENGTH:
        return jsonify(
            {"error": f"Description must not exceed {MAX_DESCRIPTION_LENGTH} characters."}
        ), 400

    if email_type not in VALID_TYPES:
        email_type = "professional"

    if tone not in VALID_TONES:
        tone = "polite"

    prompt = (
        f"Generate a {email_type} email with a {tone} tone.\n\n"
        f"Context: {description}\n\n"
        "Return a JSON object with exactly two fields:\n"
        '- "subject": a concise email subject line\n'
        '- "body": the full email body text\n\n'
        "Do not include any other text or formatting outside the JSON."
    )

    if not os.environ.get("OPENAI_API_KEY"):
        return jsonify({"error": "AI service is not configured. Contact the administrator."}), 500

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional email writing assistant. "
                        "Always respond with valid JSON containing only "
                        "'subject' and 'body' fields."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
            response_format={"type": "json_object"},
        )

        result = json.loads(response.choices[0].message.content)

        if "subject" not in result or "body" not in result:
            raise ValueError("Unexpected AI response structure.")

        return jsonify({"subject": result["subject"], "body": result["body"]})

    except ValueError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception:
        return jsonify({"error": "AI service error. Please try again."}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(debug=debug, port=port)
