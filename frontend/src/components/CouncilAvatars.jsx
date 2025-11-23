import React from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Crown, ExternalLink } from "lucide-react";
import { Qwen, Grok, DeepSeek, HuggingFace } from "@lobehub/icons";
import "./CouncilAvatars.css";

// Zenmux model page URL
const getZenmuxModelUrl = (modelId) =>
  `https://zenmux.ai/settings/chat?model=${encodeURIComponent(modelId)}`;

// Model configuration with brand colors and metadata
const MODEL_CONFIG = {
  "qwen/qwen3-14b": {
    name: "Qwen",
    shortName: "QW",
    color: "#7c3aed", // Purple
    Icon: Qwen,
  },
  "x-ai/grok-4.1-fast": {
    name: "Grok",
    shortName: "GK",
    color: "#000000", // Black (X.AI)
    Icon: Grok,
  },
  "kuaishou/kat-coder-pro-v1": {
    name: "KAT",
    shortName: "KT",
    color: "#ff6b35", // Orange
    Icon: HuggingFace, // Use HuggingFace as default for models without specific logo
  },
  "deepseek/deepseek-chat-v3.1": {
    name: "DeepSeek",
    shortName: "DS",
    color: "#0ea5e9", // Sky blue
    Icon: DeepSeek,
    isChairman: true,
  },
};

const ModelAvatar = ({ modelId, isActive, status = "idle" }) => {
  const config = MODEL_CONFIG[modelId];
  if (!config) return null;

  const statusText = {
    idle: "",
    thinking: "Thinking...",
    completed: "✓",
  };

  const IconComponent = config.Icon;

  const handleClick = () => {
    window.open(getZenmuxModelUrl(modelId), "_blank", "noopener,noreferrer");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`model-avatar ${isActive ? "active" : ""} ${config.isChairman ? "chairman" : ""}`}
          onClick={handleClick}
          style={{ "--model-color": config.color }}
        >
          <div className="avatar-wrapper">
            <Avatar className="h-12 w-12 cursor-pointer transition-all hover:scale-110">
              {IconComponent ? (
                <div className="flex h-full w-full items-center justify-center p-2">
                  <IconComponent size={30} />
                </div>
              ) : (
                <AvatarFallback
                  style={{
                    backgroundColor: config.color,
                    color: "white",
                    fontSize: "0.875rem",
                  }}
                >
                  {config.shortName}
                </AvatarFallback>
              )}
            </Avatar>
            {config.isChairman && (
              <div className="chairman-badge">
                <Crown size={12} />
              </div>
            )}
          </div>
          <div className="model-info">
            <div className="model-name">{config.name}</div>
            {status !== "idle" && (
              <div className={`model-status status-${status}`}>
                {statusText[status]}
              </div>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs">{modelId}</span>
          <ExternalLink size={10} className="opacity-60" />
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export const CouncilAvatars = ({
  councilModels = [],
  chairmanModel,
  activeModel,
  modelStatuses = {},
}) => {
  const { t } = useTranslation();

  return (
    <TooltipProvider delayDuration={300}>
      <div className="council-avatars">
        <div className="council-section">
          <div className="section-label">{t("councilMembers")}</div>
          <div className="avatars-row">
            {councilModels.map((modelId) => (
              <ModelAvatar
                key={modelId}
                modelId={modelId}
                isActive={activeModel === modelId}
                status={modelStatuses[modelId]}
              />
            ))}
          </div>
        </div>

        {chairmanModel && (
          <div className="chairman-section">
            <div className="section-label">{t("chairman")}</div>
            <ModelAvatar
              modelId={chairmanModel}
              isActive={activeModel === chairmanModel}
              status={modelStatuses[chairmanModel]}
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default CouncilAvatars;
