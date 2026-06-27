import json
import os


def _anthropic_client():
    import anthropic
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        raise ValueError("ANTHROPIC_API_KEY environment variable is not set")
    return anthropic.Anthropic(api_key=key)


def _google_creds():
    from google.oauth2 import service_account
    raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
    if not raw:
        raise ValueError("GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set")
    info = json.loads(raw)
    scopes = [
        "https://www.googleapis.com/auth/presentations",
        "https://www.googleapis.com/auth/drive",
    ]
    return service_account.Credentials.from_service_account_info(info, scopes=scopes)


def _generate_content(prompt: str) -> dict:
    client = _anthropic_client()
    system = (
        "You are an educational content creator for PeerLingo, an English tutoring platform "
        "for Spanish-speaking students in Latin America.\n\n"
        "Generate a Google Slides presentation as JSON with this exact structure:\n"
        '{\n  "title": "Presentation title",\n  "slides": [\n'
        '    {"title": "Slide title", "bullets": ["bullet 1", "bullet 2", "bullet 3"]}\n'
        "  ]\n}\n\n"
        "Create 6-8 slides. Keep content clear and appropriate for English learners. "
        "Return ONLY valid JSON — no markdown fences, no extra text."
    )
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        system=system,
        messages=[{"role": "user", "content": f"Create a presentation about: {prompt}"}],
    )
    text = msg.content[0].text.strip()
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.split("```")[0].strip()
    return json.loads(text)


def create_slides(prompt: str) -> str:
    """Generate slide content with Claude then build a Google Slides presentation."""
    from googleapiclient.discovery import build

    creds = _google_creds()
    slides_svc = build("slides", "v1", credentials=creds)
    drive_svc = build("drive", "v3", credentials=creds)

    content = _generate_content(prompt)

    # Create empty presentation (comes with one blank slide)
    prs = slides_svc.presentations().create(body={"title": content["title"]}).execute()
    prs_id = prs["presentationId"]
    default_slide_id = prs["slides"][0]["objectId"]

    requests = []
    for i, slide in enumerate(content.get("slides", [])):
        s_id = f"gs_slide_{i}"
        t_id = f"gs_title_{i}"
        b_id = f"gs_body_{i}"

        requests.append({
            "createSlide": {
                "objectId": s_id,
                "slideLayoutReference": {"predefinedLayout": "TITLE_AND_BODY"},
                "placeholderIdMappings": [
                    {"layoutPlaceholder": {"type": "TITLE", "index": 0}, "objectId": t_id},
                    {"layoutPlaceholder": {"type": "BODY", "index": 0}, "objectId": b_id},
                ],
            }
        })
        requests.append({
            "insertText": {
                "objectId": t_id,
                "insertionIndex": 0,
                "text": slide.get("title", ""),
            }
        })
        bullets = slide.get("bullets", [])
        if bullets:
            requests.append({
                "insertText": {
                    "objectId": b_id,
                    "insertionIndex": 0,
                    "text": "\n".join(bullets),
                }
            })

    # Remove the default blank slide after new slides are created
    requests.append({"deleteObject": {"objectId": default_slide_id}})

    slides_svc.presentations().batchUpdate(
        presentationId=prs_id, body={"requests": requests}
    ).execute()

    # Make viewable by anyone with the link
    drive_svc.permissions().create(
        fileId=prs_id,
        body={"type": "anyone", "role": "reader"},
    ).execute()

    return f"https://docs.google.com/presentation/d/{prs_id}/edit?usp=sharing"
