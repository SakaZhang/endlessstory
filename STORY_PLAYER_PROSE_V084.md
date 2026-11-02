# Player-facing story prose cleanup

This patch changes prose only. Scene IDs, dependencies, flags, knowledge ledger text, choices, action receipts, reward rules, dialogue lengths and combat are unchanged. C08 battle repairs are a separate patch.

## Scope
- C01–C08: 61 objective fields replace author-facing constraints with immediate actions. Five C08.X03 opening lines describe the altar directly without equipment-version bookkeeping.
- C09–end: 25 narrator lines remove optional-investigation and combat-list/checkpoint implementation language, replacing it with visible actions. No change to the approved priest/ashen origin revelation.
- Personal stories: seven text occurrences across dwarf, human, elf and ashen stories turn abstract judgment or author instructions into scenes. Character disagreements and refusals remain.
- Story board: late/deferred personal-story messages no longer speak of rewriting prior experiences or replaying old routes; they still direct the player to current tasks.

## Examples
- “带着保留共同追踪；不是五人提前结盟。” → “与莱姆斯、砾恩说清追踪的方向，循大祭司留下的痕迹前行。” Elf and ashen POVs name only the other person.
- “记录大祭司当场宣称的古代身份和惧死动机；尚未得到独立遗迹印证。” → “走近主祭坛，听大祭司说下去。” The approved identity remains revealed in dialogue, not in the objective before it.
- “挡住大祭司，为伤员争取撤离；对方力量远胜，抵抗后莱姆斯将被封印。” → “挡住大祭司，为身后的伤员争取撤离时间。”
- “凭据有疑点，不代表莱姆斯已经知道动机。” → “莱姆斯把两份凭据推到经手人面前，指了指那两个相同的货名。”
- “其他四人不在中央战斗列表。失败或撤离保留四坛完成记录；只重试本战斗检查点。” → a scene of the protagonist facing the leader while companions remain at the four altars. Retry instructions remain in the battle UI.

## Verification
Passed targeted story/player-prose scan and five-POV rendered C08 boards; narrative-copy; story copy compatibility (38 historical save cases); generated compatibility facts; copy-mechanics invariants; story controller; personal arc runtime/reward; story and personal fake-DOM App tests. No full aggregate or real-browser layout claimed for this standalone text patch. Final integration must rerun affected tests after the separate seal-battle changes. Scenario objective synchronization was sent to that worker as a separate text patch to avoid concurrent edits.
