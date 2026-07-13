import React, { memo } from 'react';
import type { ParticipantProfile } from '../../config/eventData';

type ParticipantItemProps = {
  participant: ParticipantProfile;
};

const participantItemClassName =
  'performance-surface-subtle flex items-center gap-3 rounded-[14px] border border-white/80 bg-white/90 px-3 py-2.5 shadow-[0_16px_40px_-36px_rgba(16,36,95,0.85)]';

const avatarClassName =
  'h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-idasan-yellow/35';

const nameClassName =
  'font-sans text-[0.76rem] leading-tight font-medium tracking-[-0.01em] text-[#081736] md:text-[0.8rem]';

const roleClassName =
  'mt-1 font-sans text-[0.66rem] leading-tight font-light tracking-[0.005em] text-[#081736]/70 md:text-[0.7rem]';

export const ParticipantItem = memo(({ participant }: ParticipantItemProps) => (
  <div className={participantItemClassName}>
    <div className={avatarClassName}>
      <img
        src={participant.photo}
        alt={`${participant.name} ${participant.surname}`}
        className="h-full w-full object-cover"
        width={44}
        height={44}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
    </div>

    <div className="min-w-0">
      <p className={nameClassName}>
        {participant.name} {participant.surname}
      </p>
      <p className={roleClassName}>{participant.role}</p>
    </div>
  </div>
));

ParticipantItem.displayName = 'ParticipantItem';
