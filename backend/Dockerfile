# Backend Dockerfile for LLM Council
FROM python:3.11-slim

WORKDIR /app

# Install uv for dependency management
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies using uv
RUN uv sync --frozen

# Copy backend code
COPY backend ./backend

# Create data directory for conversations
RUN mkdir -p /app/data/conversations

# Expose backend port
EXPOSE 8008

# Run the application
CMD ["uv", "run", "python", "-m", "backend.main"]
