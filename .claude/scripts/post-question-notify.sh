#!/bin/bash

# 質問回答後の処理
# PostToolUse(AskUserQuestion) から呼ばれる
# 次の Stop で音を鳴らさないためのスキップマーカーを作成

touch /tmp/claude-skip-next-stop
