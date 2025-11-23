# LLM Council

![llmcouncil](header.jpg)

这个项目的核心理念是：与其向单个 LLM 提问（如 DeepSeek Chat V3.1、Qwen3 14B、xAI Grok 4.1 Fast、Kuaishou KAT Coder Pro V1 等），不如将它们组成一个"LLM 委员会"。本项目是一个简单的本地 Web 应用，界面类似 ChatGPT，但使用 ZenMux 将你的问题发送给多个 LLM，然后让它们互相评审和排名彼此的回答，最后由主席 LLM 生成最终答案。

更详细的工作流程：

1. **阶段 1：初始观点**。用户的问题被分别发送给所有 LLM，收集各自的回答。各个回答以"标签页视图"显示，用户可以逐一查看。
2. **阶段 2：互评**。每个 LLM 都会收到其他 LLM 的回答。在底层，LLM 的身份被匿名化，这样 LLM 就不会在评判时偏袒某些模型。LLM 被要求根据准确性和洞察力对回答进行排名。
3. **阶段 3：最终答案**。指定的主席 LLM 综合所有模型的回答，编译成一个最终答案呈现给用户。

## Vibe Code 警告

这个项目 99% 是作为一个有趣的周六 hack 项目随性编写的，因为我想在 [和 LLM 一起读书](https://x.com/karpathy/status/1990577951671509438) 的过程中并排探索和评估多个 LLM。并排查看多个回答以及所有 LLM 对彼此输出的交叉意见是非常有用的。我不会以任何方式支持它，它按原样提供，仅供他人参考，我不打算改进它。代码现在是短暂的，库已经过时了，让你的 LLM 以你喜欢的任何方式改变它。

## 安装配置

### 1. 安装依赖

本项目使用 [uv](https://docs.astral.sh/uv/) 进行项目管理。

**后端：**
```bash
uv sync
```

**前端：**
```bash
cd frontend
npm install
cd ..
```

### 2. 配置 API Key

在项目根目录创建 `.env` 文件：

```bash
ZENMUX_API_KEY=zm-...
```

在 [ZenMux](https://zenmux.ai/invite/ICIEEXGV14722567)（首充8折，支持支付宝）获取你的 API key。确保购买所需的积分，或注册自动充值。

### 3. 配置模型（可选）

编辑 `backend/config.py` 自定义委员会：

```python
COUNCIL_MODELS = [
    "deepseek/deepseek-chat-v3.1",
    "qwen/qwen3-14b",
    "x-ai/grok-4.1-fast",
    "kuaishou/kat-coder-pro-v1",
]

CHAIRMAN_MODEL = "deepseek/deepseek-chat-v3.1"
```

更多可用的模型 ID，请查看 [ZenMux Models 页面](https://zenmux.ai/models)。

## 运行应用

**方式 1：使用启动脚本**
```bash
./start.sh
```

**方式 2：手动运行**

终端 1（后端）：
```bash
uv run python -m backend.main
```

终端 2（前端）：
```bash
cd frontend
npm run dev
```

然后在浏览器中打开 http://localhost:5173。

## Docker 部署（生产环境）

### 前置要求

- 已安装 Docker 和 Docker Compose
- 域名（可选，用于生产环境）
- Cloudflare 账号（用于 SSL）

### 快速部署

1. **构建前端并启动服务：**
```bash
./deploy.sh
```

2. **或者手动执行：**
```bash
# 构建前端
cd frontend && npm install && npm run build && cd ..

# 启动服务
docker-compose up -d
```

3. **查看日志：**
```bash
docker-compose logs -f
```

4. **停止服务：**
```bash
docker-compose down
```

### VPS 部署与 Cloudflare SSL 配置

1. **在 VPS 上克隆仓库：**
```bash
git clone <your-repo-url>
cd llm-council-zenmux
```

2. **创建 `.env` 文件：**
```bash
echo "ZENMUX_API_KEY=zm-your-key-here" > .env
```

3. **更新 `nginx.conf`：**
将 `server_name _;` 替换为你的域名：
```nginx
server_name yourdomain.com;
```

4. **部署：**
```bash
./deploy.sh
```

5. **配置 Cloudflare：**
   - 将你的域名添加到 Cloudflare
   - 添加 A 记录指向你的 VPS IP
   - SSL/TLS 设置：**Flexible**（Cloudflare ↔ 用户：HTTPS，Cloudflare ↔ VPS：HTTP）
   - 等待 DNS 传播（约 5 分钟）

6. **访问应用：**
   - http://yourdomain.com（Cloudflare 会自动重定向到 HTTPS）

### Docker 常用命令

```bash
# 查看运行中的容器
docker-compose ps

# 重启服务
docker-compose restart

# 查看后端日志
docker-compose logs -f backend

# 查看 nginx 日志
docker-compose logs -f nginx

# 代码修改后重新构建
docker-compose up -d --build

# 停止并删除容器
docker-compose down

# 停止并删除容器 + 数据卷
docker-compose down -v
```

### 数据持久化

对话数据存储在 `./data/conversations/` 目录中，并作为数据卷挂载到 Docker 容器。你的数据在容器重启后会保持不变。

## 技术栈

- **后端：** FastAPI（Python 3.10+）、async httpx、ZenMux API
- **前端：** React + Vite、react-markdown 渲染
- **存储：** JSON 文件存储在 `data/conversations/`
- **包管理：** Python 使用 uv，JavaScript 使用 npm
