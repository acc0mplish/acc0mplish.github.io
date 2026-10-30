import React from 'react';
import { getInitials, getPortrait } from '../../public/portraits/registry.mjs';
import './PersonAvatar.css';

/** Local demo portraits are keyed by the person's name, never a reused legacy URL. */
type PersonAvatarProps = Pick<React.ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'src' | 'className' | 'style' | 'title' | 'width' | 'height' | 'loading' | 'onError'> & {
  name?: string;
};

export function PersonAvatar({ name, alt, className = '', style, title, width, height }: PersonAvatarProps) {
  const label = name || alt || '이름 없는 구성원';
  const portrait = getPortrait(label);
  const initials = getInitials(label);
  return (
    <span
      role="img"
      aria-label={portrait ? `${label} · AI 생성 가상 인물 프로필` : `${label} · 이니셜`}
      title={title || label}
      className={`klic-avatar ${className}`}
      data-portrait-name={portrait?.canonicalName || undefined}
      data-has-portrait={portrait ? 'true' : 'false'}
      style={{ width, height, ...style }}
    >
      <span className="klic-avatar__initials" aria-hidden="true">{initials}</span>
      {portrait && (
        <span
          className="klic-avatar__photo"
          aria-hidden="true"
          style={{
            backgroundImage: `url("${portrait.url}")`,
            backgroundPosition: portrait.backgroundPosition,
            backgroundSize: portrait.backgroundSize,
          }}
        />
      )}
    </span>
  );
}
