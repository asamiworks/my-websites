#!/bin/bash

# Stop通知スクリプト
# 質問直後かどうかを判定して異なる音を鳴らす

QUESTION_MARKER="/tmp/claude-ask-question-marker"
SKIP_MARKER="/tmp/claude-skip-next-stop"

# 回答送信直後（PostToolUse(AskUserQuestion) → Stop）
if [ -f "$SKIP_MARKER" ]; then
    # 音を鳴らさず、スキップマーカーを削除
    rm "$SKIP_MARKER"
# 質問表示直後（PreToolUse(AskUserQuestion) → Stop）
elif [ -f "$QUESTION_MARKER" ]; then
    # 質問通知音を鳴らす
    aplay /home/asamiworks/claude-notifications/sounds/error.wav 2>/dev/null &
    # 質問マーカーを削除
    rm "$QUESTION_MARKER"
# 通常の応答完了時
else
    # 通常の完了通知音
    aplay /home/asamiworks/claude-notifications/sounds/notification.wav 2>/dev/null &
fi
