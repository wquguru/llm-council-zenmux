import React from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Crown } from 'lucide-react';
import { Qwen, Grok, DeepSeek, HuggingFace } from '@lobehub/icons';
import './CouncilAvatars.css';

// Model configuration with brand colors and metadata
const MODEL_CONFIG = {
  'qwen/qwen3-14b': {
    name: 'Qwen',
    shortName: 'QW',
    color: '#7c3aed', // Purple
    Icon: Qwen,
  },
  'x-ai/grok-4.1-fast': {
    name: 'Grok',
    shortName: 'GK',
    color: '#000000', // Black (X.AI)
    Icon: Grok,
  },
  'kuaishou/kat-coder-pro-v1': {
    name: 'KAT',
    shortName: 'KT',
    color: '#ff6b35', // Orange
    Icon: HuggingFace, // Use HuggingFace as default for models without specific logo
  },
  'deepseek/deepseek-chat-v3.1': {
    name: 'DeepSeek',
    shortName: 'DS',
    color: '#0ea5e9', // Sky blue
    Icon: DeepSeek,
    isChairman: true,
  },
};

const ModelAvatar = ({ modelId, isActive, onClick, status = 'idle' }) => {
  const config = MODEL_CONFIG[modelId];
  if (!config) return null;

  const statusText = {
    idle: '',
    thinking: 'Thinking...',
    completed: '✓',
  };

  const IconComponent = config.Icon;

  return (
    <div
      className={`model-avatar ${isActive ? 'active' : ''} ${config.isChairman ? 'chairman' : ''}`}
      onClick={onClick}
      style={{ '--model-color': config.color }}
    >
      <div className="avatar-wrapper">
        <Avatar className="h-12 w-12 cursor-pointer transition-all hover:scale-110">
          {IconComponent ? (
            <div className="flex h-full w-full items-center justify-center p-2">
              <IconComponent size={32} />
            </div>
          ) : (
            <AvatarFallback
              style={{ backgroundColor: config.color, color: 'white' }}
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
        {status !== 'idle' && (
          <div className={`model-status status-${status}`}>
            {statusText[status]}
          </div>
        )}
      </div>
    </div>
  );
};

export const CouncilAvatars = ({
  councilModels = [],
  chairmanModel,
  activeModel,
  onSelectModel,
  modelStatuses = {}
}) => {
  return (
    <div className="council-avatars">
      <div className="council-section">
        <div className="section-label">Council Members</div>
        <div className="avatars-row">
          {councilModels.map((modelId) => (
            <ModelAvatar
              key={modelId}
              modelId={modelId}
              isActive={activeModel === modelId}
              onClick={() => onSelectModel?.(modelId)}
              status={modelStatuses[modelId]}
            />
          ))}
        </div>
      </div>

      {chairmanModel && (
        <div className="chairman-section">
          <div className="section-label">Chairman</div>
          <ModelAvatar
            modelId={chairmanModel}
            isActive={activeModel === chairmanModel}
            onClick={() => onSelectModel?.(chairmanModel)}
            status={modelStatuses[chairmanModel]}
          />
        </div>
      )}
    </div>
  );
};

export default CouncilAvatars;
