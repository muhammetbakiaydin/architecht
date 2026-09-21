import React from 'react';
import { parseMarkdown, type BlockToken, type InlineToken } from '@/lib/markdown';

function Inline({ tokens }: { tokens: InlineToken[] }) {
  return (
    <>
      {tokens.map((token, i) => {
        switch (token.type) {
          case 'strong':
            return (
              <strong key={i} className="font-semibold text-[#161413]">
                {token.value}
              </strong>
            );
          case 'em':
            return (
              <em key={i} className="italic">
                {token.value}
              </em>
            );
          case 'code':
            return (
              <code
                key={i}
                className="rounded bg-[#161413]/[0.06] px-1.5 py-0.5 font-mono text-[0.9em]"
              >
                {token.value}
              </code>
            );
          case 'link':
            return (
              <a
                key={i}
                href={token.href}
                target={token.href.startsWith('http') ? '_blank' : undefined}
                rel={token.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="underline decoration-[#8B1117] decoration-1 underline-offset-4 transition-colors hover:text-[#8B1117]"
              >
                {token.value}
              </a>
            );
          default:
            return <React.Fragment key={i}>{token.value}</React.Fragment>;
        }
      })}
    </>
  );
}

function Block({ block }: { block: BlockToken }) {
  switch (block.type) {
    case 'heading': {
      const size =
        block.level === 2
          ? 'mt-16 text-[clamp(1.375rem,2.6vw,1.875rem)]'
          : block.level === 3
            ? 'mt-12 text-[1.25rem]'
            : 'mt-10 text-[1.0625rem]';
      const Tag = (`h${block.level}` as unknown) as 'h2';
      return (
        <Tag
          className={`${size} font-syne font-bold leading-tight tracking-[-0.01em] text-[#161413] first:mt-0`}
        >
          <Inline tokens={block.content} />
        </Tag>
      );
    }
    case 'paragraph':
      return (
        <p className="mt-6 text-[17px] leading-[1.8] text-[#584E44] first:mt-0">
          <Inline tokens={block.content} />
        </p>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag
          className={`mt-6 space-y-3 pl-6 text-[17px] leading-[1.8] text-[#584E44] ${
            block.ordered ? 'list-decimal' : 'list-disc'
          } marker:text-[#8B1117]`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <Inline tokens={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case 'quote':
      return (
        <blockquote className="mt-10 border-l-2 border-[#8B1117] pl-6 font-syne text-[clamp(1.125rem,2.2vw,1.5rem)] font-medium leading-[1.5] tracking-[-0.01em] text-[#161413]">
          <Inline tokens={block.content} />
        </blockquote>
      );
    case 'rule':
      return <hr className="mt-12 border-t border-[#161413]/12" />;
    default:
      return null;
  }
}

/**
 * Renders the Markdown subset described in `src/lib/markdown.ts` as real React
 * elements - never as raw HTML - so database-authored post bodies stay safe.
 */
export default function Markdown({ source }: { source: string }) {
  // Parsed inline, not memoised: this renders on the server where there is no
  // hook to memoise into, and the subset parser is cheap.
  const blocks = parseMarkdown(source);
  return (
    <div className="markdown">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
