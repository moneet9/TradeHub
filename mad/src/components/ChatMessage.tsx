import React from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatRelativeTime } from '../lib/utils-data';

interface ChatMessageProps {
  content: string;
  timestamp: Date;
  isSender: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export function ChatMessage({ content, timestamp, isSender, senderName, senderAvatar }: ChatMessageProps) {
  return (
    <div className={`flex gap-2 ${isSender ? 'flex-row-reverse' : ''}`}>
      {!isSender && (
        <Avatar className="size-8">
          <AvatarImage src={senderAvatar} />
          <AvatarFallback>{senderName?.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[75%]`}>
        {!isSender && <p className="text-xs text-muted-foreground mb-1">{senderName}</p>}
        <Card className={`p-3 ${isSender ? 'bg-amber-700 text-white' : 'bg-muted'}`}>
          <p className="text-sm">{content}</p>
        </Card>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(timestamp)}
        </p>
      </div>
    </div>
  );
}
