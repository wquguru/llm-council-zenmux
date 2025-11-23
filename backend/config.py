"""Configuration for the LLM Council."""

import os
from dotenv import load_dotenv

load_dotenv()

# OpenRouter API key
ZENMUX_API_KEY = os.getenv("ZENMUX_API_KEY")

# Council members - list of ZenMux model identifiers
COUNCIL_MODELS = [
    "deepseek/deepseek-chat-v3.1",
    "qwen/qwen3-14b",
    "x-ai/grok-4.1-fast",
    "kuaishou/kat-coder-pro-v1",
]

# Chairman model - synthesizes final response
CHAIRMAN_MODEL = "deepseek/deepseek-chat-v3.1"

# ZenMux API endpoint
ZENMUX_API_URL = "https://zenmux.ai/api/v1/chat/completions"

# Data directory for conversation storage
DATA_DIR = "data/conversations"
