#!/bin/bash
# Запускается отдельным шагом в semantic-release.js.yml с if: failure(), если
# джоба "Release 🚀" упала НА ЛЮБОМ шаге ПОСЛЕ того, как @semantic-release/git
# уже закоммитил и запушил "chore(release): X.Y.Z" в main. Без этого main
# застревает с бампнутой версией/CHANGELOG, а тега и npm publish при этом
# может не быть (см. историю с 6.0.18/6.0.19).
#
# Не вызывается через .releaserc.json failCmd намеренно: semantic-release
# вызывает плагинные "fail"-хуки только для настоящих SemanticReleaseError
# (невалидный конфиг/ветка и т.п.), а не для сырых runtime-исключений вроде
# упавшего generateNotes — такие крашат процесс напрямую, минуя fail-хуки.
#
# Откатывает: удаляет тег(и), указывающие на этот коммит (если core уже успел
# его создать), затем делает git revert коммита релиза и пушит обратно в main.
# Если последний коммит — не наш release-коммит (сбой случился раньше, до
# git-плагина), ничего не делает.

set -euo pipefail

LAST_MSG=$(git log -1 --pretty=%s)

if [[ "$LAST_MSG" != chore\(release\):* ]]; then
    echo "HEAD is not a semantic-release commit ('$LAST_MSG') — nothing to roll back."
    exit 0
fi

echo "::warning::semantic-release failed after pushing a release commit — rolling back '$LAST_MSG'"

# Если core уже успел создать тег на этом коммите (то есть упали уже на
# публикации в npm/GitHub, а не раньше) — удаляем его и локально, и на origin.
TAGS_AT_HEAD=$(git tag --points-at HEAD)
for tag in $TAGS_AT_HEAD; do
    echo "Deleting dangling tag $tag"
    git push origin ":refs/tags/$tag" || true
    git tag -d "$tag" || true
done

git revert --no-edit HEAD
git push origin HEAD:main

echo "Rolled back. main is back to the pre-release state; the next successful run will retry cleanly."
