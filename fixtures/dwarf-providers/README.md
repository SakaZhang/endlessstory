# Archived released dwarf combat providers

These are immutable JSON extractions of `PRODUCTION_DWARF_PARAMETERS` from the
historical releases recorded in each provenance file—not snapshots of today's
implementation. The source Git blob and SHA-256, fixture SHA-256, and complete
original approval metadata are retained. `historical-dwarf-provider-fixture.mjs`
pins each released commit and JSON digest independently.

The former tests depended on untracked `/workspace/shared/.../final-provider.json`
and `provider-candidate.json`. Those pre-publication files are unavailable in a
fresh checkout. Their original digests remain in `approval.providerSha256` for
provenance; we do not claim the archived released JSON has those original bytes.
Approval changed `reviewed`/`status` metadata, so those digests must not be blindly
replaced by a hash of current production output.

Activation tests now verify the exact historical **released** provider, including
approval metadata, against committed fixtures. M3 settlement tests use that
approved provider rather than the missing earlier candidate, and retain their
explicit test-only HP/attack reductions. Full real settlement coverage is kept.
The old numerical-preservation comparisons remain independent historical Git
comparisons. Node-count assertions cover dwarf nodes explicitly, since the
production registry now also contains four other races.

To audit an extraction, read `git show <sourceCommit>:dist/dwarf-parameters.js`,
parse the JSON argument of `PRODUCTION_DWARF_PARAMETERS=freeze(...)`, and compare
with the corresponding JSON fixture. No current `dist` output is an acceptable
replacement source.
