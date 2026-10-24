"""
Runs at startup to add Spanish translations (definition_es, meaning_es) to all
VPHomeworkAssignment records that don't yet have them.

word_es is NOT generated here — it is authored in vp_vocab_es.py and attached by
seed_curriculum, because model-generated word_es sometimes repeated the English word
(or translated the English `word` itself), leaving a flashcard with the same language
on both sides. The model's output is merged by position onto the original entries, so
it can only ever add definition_es / meaning_es, never change word or word_es.

Uses Claude Haiku API for accurate, natural Latin American Spanish translations.
Only runs on records that haven't been translated yet — safe to call every startup.
"""

import json
import os


def _translate_lesson(client, vocab: list, expressions: list) -> dict:
    words_text = json.dumps(vocab, ensure_ascii=False, indent=2)
    expr_text = json.dumps(expressions, ensure_ascii=False, indent=2)

    prompt = (
        "Translate the following English vocabulary words and expressions to Spanish "
        "for Latin American Spanish-speaking teenagers (ages 13-18) who are learning English. "
        "Use natural, everyday Latin American Spanish — not overly formal.\n\n"
        "For each vocabulary word provide:\n"
        "  definition_es: 1-2 sentence Spanish definition a teenager would understand\n\n"
        "For each expression provide:\n"
        "  meaning_es: 1-2 sentences explaining what the expression means in Spanish "
        "and when/how it's used, with context for Latin American learners\n\n"
        "IMPORTANT: Return ONLY valid JSON — no markdown, no extra text. "
        "Copy all original fields and ADD the Spanish fields. Structure:\n"
        "{\n"
        '  "vocabulary": [{original fields + "definition_es": "..."}],\n'
        '  "expressions": [{original fields + "meaning_es": "..."}]\n'
        "}\n\n"
        f"Vocabulary:\n{words_text}\n\n"
        f"Expressions:\n{expr_text}"
    )

    msg = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}],
    )

    text = msg.content[0].text.strip()
    if "```" in text:
        parts = text.split("```")
        text = parts[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.split("```")[0].strip()

    return json.loads(text)


def _merge_field(originals: list, translated, field: str) -> list:
    """Copies only `field` from the model's output onto the original entries, by
    position, so the model can't alter word / word_es / expression."""
    translated = translated if isinstance(translated, list) else []
    merged = []
    for i, orig in enumerate(originals):
        entry = dict(orig)
        t = translated[i] if i < len(translated) and isinstance(translated[i], dict) else {}
        if not entry.get(field) and isinstance(t.get(field), str) and t[field].strip():
            entry[field] = t[field].strip()
        merged.append(entry)
    return merged


def update_flashcard_es(db):
    try:
        from vp_models import VPHomeworkAssignment
    except ImportError:
        return

    records = db.query(VPHomeworkAssignment).all()
    if not records:
        return

    # Find records that still need Spanish translations
    needs_update = []
    for rec in records:
        try:
            vocab = json.loads(rec.vocabulary) if isinstance(rec.vocabulary, str) else (rec.vocabulary or [])
        except Exception:
            vocab = []
        try:
            exprs = json.loads(rec.expressions) if isinstance(rec.expressions, str) else (rec.expressions or [])
        except Exception:
            exprs = []
        if not isinstance(vocab, list):
            vocab = []
        if not isinstance(exprs, list):
            exprs = []
        if any("definition_es" not in v for v in vocab) or any("meaning_es" not in e for e in exprs):
            needs_update.append(rec)

    if not needs_update:
        print(f"[flashcard seed es] All {len(records)} lessons already have Spanish translations.")
        return

    print(f"[flashcard seed es] Translating {len(needs_update)} lessons…")

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("[flashcard seed es] ANTHROPIC_API_KEY not set — skipping Spanish translations.")
        return

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
    except ImportError:
        print("[flashcard seed es] anthropic package not installed — skipping.")
        return

    for rec in needs_update:
        try:
            vocab = json.loads(rec.vocabulary) if isinstance(rec.vocabulary, str) else (rec.vocabulary or [])
            exprs = json.loads(rec.expressions) if isinstance(rec.expressions, str) else (rec.expressions or [])

            result = _translate_lesson(client, vocab, exprs)

            rec.vocabulary = json.dumps(
                _merge_field(vocab, result.get("vocabulary"), "definition_es"), ensure_ascii=False)
            rec.expressions = json.dumps(
                _merge_field(exprs, result.get("expressions"), "meaning_es"), ensure_ascii=False)
            db.commit()
            print(f"[flashcard seed es] ✓ lesson_id={rec.lesson_id}")
        except Exception as e:
            db.rollback()
            err_str = str(e)
            print(f"[flashcard seed es] ✗ lesson_id={rec.lesson_id}: {e}")
            if "credit balance is too low" in err_str or "insufficient_quota" in err_str or "402" in err_str:
                print("[flashcard seed es] Out of API credits — skipping remaining lessons.")
                break

    print("[flashcard seed es] Done.")
