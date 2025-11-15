#!/bin/bash

# ユーザー送信時の処理
# 回答待ちマーカーがあれば削除

WAITING_ANSWER_MARKER="/tmp/claude-waiting-answer-marker"

# 回答待ちマーカーを削除（あれば）
if [ -f "$WAITING_ANSWER_MARKER" ]; then
    rm "$WAITING_ANSWER_MARKER"
fi
