"""
Every homework vocabulary word must have an authored Spanish word_es that is not just
the English word again — otherwise its flashcard shows the same language on both sides.
"""
import json
import unicodedata

import pytest

from vp_vocab_es import word_es_for


@pytest.fixture(scope="module", autouse=True)
def _bind_test_db(client):
    """vp_curriculum_seed imports vp_models, which creates the DB engine on import.
    Importing it at module level would bind the engine to the real dev database
    before conftest's `client` fixture points VP_DB_PATH at a throwaway one — so
    these imports wait until that fixture has run."""
    global CURRICULUM_DATA, _vocab_with_es, _merge_field
    from vp_curriculum_seed import CURRICULUM_DATA, _vocab_with_es
    from vp_flashcard_seed_es import _merge_field


def _fold(s):
    s = unicodedata.normalize('NFKD', s.strip().lower())
    return ''.join(c for c in s if not unicodedata.combining(c))


def _all_vocab():
    for curr in CURRICULUM_DATA:
        for lesson in curr['lessons']:
            for v in lesson['vocabulary']:
                yield curr['level'], lesson['number'], v


def test_every_vocab_word_has_authored_spanish():
    missing = [f"{lvl} L{n}: {v['word']}" for lvl, n, v in _all_vocab() if not word_es_for(v['word'])]
    assert not missing, missing


def test_no_flashcard_repeats_the_same_word_on_both_sides():
    repeats = [
        f"{lvl} L{n}: {v['word']} -> {word_es_for(v['word'])}"
        for lvl, n, v in _all_vocab()
        if word_es_for(v['word']) and _fold(word_es_for(v['word'])) == _fold(v['word'])
    ]
    assert not repeats, repeats


def test_seed_attaches_word_es_and_keeps_unchanged_definition_es():
    vocab = [{'word': 'locker', 'definition': 'A small metal cabinet.'}]
    existing = json.dumps([{'word': 'locker', 'definition': 'A small metal cabinet.',
                            'word_es': 'locker', 'definition_es': 'Un pequeño armario.'}])
    out = _vocab_with_es(vocab, existing)
    assert out[0]['word'] == 'locker'
    assert out[0]['word_es'] == 'casillero'
    assert out[0]['definition_es'] == 'Un pequeño armario.'


def test_translation_merge_cannot_overwrite_word_fields():
    originals = [{'word': 'locker', 'definition': 'x', 'word_es': 'casillero'}]
    model_output = [{'word': 'casillero', 'definition': 'x', 'word_es': 'locker', 'definition_es': 'y'}]
    merged = _merge_field(originals, model_output, 'definition_es')
    assert merged == [{'word': 'locker', 'definition': 'x', 'word_es': 'casillero', 'definition_es': 'y'}]
