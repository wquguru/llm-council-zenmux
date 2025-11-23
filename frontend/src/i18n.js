import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // App
      appTitle: "LLM Council",
      tagline: "Multi-model collaborative Q&A: collective wisdom, anonymous peer review, comprehensive decision-making",
      privacyWarning: "Privacy Notice: All conversations are visible to all visitors, please do not enter sensitive information",

      // Sidebar
      newConversation: "New Conversation",
      conversations: "Conversations",

      // Chat Interface
      welcomeTitle: "Welcome to LLM Council",
      welcomeSubtitle: "Create a new conversation to get started",
      startConversation: "Start a conversation",
      askQuestion: "Ask a question to consult the LLM Council",
      placeholder: "Ask your question... (Shift+Enter for new line, Enter to send)",
      send: "Send",
      consultingCouncil: "Consulting the council...",

      // Stages
      stage1Title: "Stage 1: Individual Responses",
      stage2Title: "Stage 2: Peer Rankings",
      stage2Description: "Each model evaluated all responses (anonymized as Response A, B, C, etc.) and provided rankings. Below, model names are shown in bold for readability, but the original evaluation used anonymous labels.",
      rawEvaluations: "Raw Evaluations",
      extractedRanking: "Extracted Ranking",
      aggregateRankings: "Aggregate Rankings (Street Cred)",
      aggregateDescription: "Combined results across all peer evaluations (lower score is better):",
      stage3Title: "Stage 3: Final Council Answer",
      chairman: "Chairman",

      // Loading messages
      loadingStage1: "Running Stage 1: Collecting individual responses...",
      loadingStage2: "Running Stage 2: Peer rankings...",
      loadingStage3: "Running Stage 3: Final synthesis...",

      // Council
      councilMembers: "Council Members",

      // Share
      share: "Share",
      copyLink: "Copy link",
      copied: "Copied!",
      shareToX: "Share to X",

      // You label
      you: "You",
      llmCouncil: "LLM Council",

      // Stats
      avg: "Avg",
      votes: "votes",
    },
  },
  zh: {
    translation: {
      // App
      appTitle: "LLM 智库",
      tagline: "多模型协作问答：集体智慧，匿名评审，综合决策",
      privacyWarning: "隐私提示：所有对话对所有访问者可见，请勿输入敏感信息",

      // Sidebar
      newConversation: "新建对话",
      conversations: "对话列表",

      // Chat Interface
      welcomeTitle: "欢迎使用 LLM 智库",
      welcomeSubtitle: "创建新对话开始使用",
      startConversation: "开始对话",
      askQuestion: "向 LLM 智库提问",
      placeholder: "输入您的问题... (Shift+Enter 换行，Enter 发送)",
      send: "发送",
      consultingCouncil: "正在咨询智库...",

      // Stages
      stage1Title: "阶段一：独立回答",
      stage2Title: "阶段二：同行评审",
      stage2Description: "每个模型评估了所有回答（匿名为回答 A、B、C 等）并提供了排名。下方为便于阅读将模型名称加粗显示，但原始评估使用的是匿名标签。",
      rawEvaluations: "原始评价",
      extractedRanking: "提取的排名",
      aggregateRankings: "综合排名",
      aggregateDescription: "所有同行评审的综合结果（分数越低越好）：",
      stage3Title: "阶段三：最终结论",
      chairman: "主席",

      // Loading messages
      loadingStage1: "运行阶段一：收集各模型回答中...",
      loadingStage2: "运行阶段二：同行评审中...",
      loadingStage3: "运行阶段三：综合生成中...",

      // Council
      councilMembers: "智库成员",

      // Share
      share: "分享",
      copyLink: "复制链接",
      copied: "已复制！",
      shareToX: "分享到 X",

      // You label
      you: "您",
      llmCouncil: "LLM 智库",

      // Stats
      avg: "平均",
      votes: "票",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
