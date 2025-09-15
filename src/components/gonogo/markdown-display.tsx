'use client';

import React from 'react';

interface MarkdownDisplayProps {
  content: string;
}

export function MarkdownDisplay({ content }: MarkdownDisplayProps) {
  const formatText = (text: string) => {
    // Basic bold formatting: **text** -> <strong>text</strong>
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return formattedText;
  };

  const renderContent = () => {
    const lines = content.split('\n').filter(line => line.trim() !== '');

    return lines.map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: formatText(line.substring(4)) }} />;
      }
      if (line.match(/^\d+\.\s/)) {
        const items = content.split(/^\d+\.\s/m).filter(Boolean);
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 my-2">
            {items.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: formatText(item.trim()) }} />
            ))}
          </ol>
        );
      }
      
      const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
      return (
        <p key={index} className="text-sm text-muted-foreground mb-2">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    }).filter((value, index, self) => {
      // Filter out duplicate list rendering
      if (value && value.type === 'ol') {
        return self.findIndex(v => v && v.type === 'ol') === index;
      }
      return true;
    });
  };

  return <div className="prose prose-sm dark:prose-invert max-w-none">{renderContent()}</div>;
}