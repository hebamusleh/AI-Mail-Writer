import json
import logging
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq

load_dotenv()

# ── Startup validation (US20) ─────────────────────────────────────────────────

_groq_key = os.environ.get("GROQ_API_KEY")
if not _groq_key:
    logging.warning(
        "GROQ_API_KEY is not set. "
        "The /api/generate endpoint will fail until it is configured in .env."
    )

# ── App setup ─────────────────────────────────────────────────────────────────

app = Flask(__name__)

CORS(
    app,
    origins=os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
)

client = None

_groq_key = os.environ.get("GROQ_API_KEY")

if _groq_key:
    client = Groq(api_key=_groq_key)
else:
    logging.warning("GROQ_API_KEY is missing")

VALID_TYPES = {"professional", "friendly", "formal", "follow-up", "sales"}
VALID_TONES = {"polite", "confident", "friendly", "persuasive"}
MAX_DESCRIPTION_LENGTH = 500


@app.route("/api/health", methods=["GET"])
def health():
    configured = bool(os.environ.get("GROQ_API_KEY"))
    return jsonify({
        "status": "ok" if configured else "degraded",
        "openai_configured": configured,
    })


@app.route("/api/generate", methods=["POST"])
def generate_email():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    description = (data.get("description") or "").strip()
    email_type = (data.get("type") or "professional").strip().lower()
    tone = (data.get("tone") or "polite").strip().lower()

    if not description:
        return jsonify({"error": "Description is required"}), 400

    if len(description) > MAX_DESCRIPTION_LENGTH:
        return jsonify({"error": "Description too long"}), 400

    if client is None:
        return jsonify({"error": "AI service not configured"}), 500

    prompt = f"""
Generate a {email_type} email with a {tone} tone.

Context: {description}

Return ONLY JSON:
{{
  "subject": "",
  "body": ""
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "Return only valid JSON with subject and body."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800,
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content
        result = json.loads(content)

        if "subject" not in result or "body" not in result:
            return jsonify({"error": "Invalid AI response"}), 500

        return jsonify(result)

    except Exception as e:
        logging.exception("Groq API error")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(debug=debug, port=port)
