import React from 'react';
import './PromoBadge.css';

export default function PromoBadge({ text, type = 'default', mode = 'promo' }) {
  // mode: 'promo' for promotional badges, 'product' for product type badges (LLM, VPS)
  const className = mode === 'product'
    ? `product-badge product-badge-${type}`
    : `promo-badge promo-badge-${type}`;

  return (
    <span className={className}>
      {text}
    </span>
  );
}
