/**
 * A deliberately small Markdown parser.
 *
 * Blog bodies are written by the studio in the admin panel, so the supported
 * subset is exactly what that editor needs: headings, paragraphs, ordered and
 * unordered lists, blockquotes, horizontal rules, and inline bold / italic /
 * code / links. Anything else passes through as plain text.
 *
 * It produces a token tree rather than an HTML string, so the renderer in
 * `src/components/Markdown.tsx` never needs `dangerouslySetInnerHTML` - post
 * bodies can come from the database without opening an injection hole.
 */

export type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'em'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; value: string; href: string };

export type BlockToken =
  | { type: 'heading'; level: 2 | 3 | 4; content: InlineToken[] }
  | { type: 'paragraph'; content: InlineToken[] }
  | { type: 'list'; ordered: boolean; items: InlineToken[][] }
  | { type: 'quote'; content: InlineToken[] }
  | { type: 'rule' };

/** Matches the first inline construct in a string, in precedence order. */
const INLINE_PATTERN =
  /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/;

export function parseInline(input: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let rest = input;

  while (rest.length > 0) {
    const match = INLINE_PATTERN.exec(rest);
    if (!match || match.index === undefined) {
      tokens.push({ type: 'text', value: rest });
      break;
    }

    if (match.index > 0) {
      tokens.push({ type: 'text', value: rest.slice(0, match.index) });
    }

    if (match[1]) {
      tokens.push({ type: 'link', value: match[2], href: match[3] });
    } else if (match[4]) {
      tokens.push({ type: 'strong', value: match[5] });
    } else if (match[6]) {
      tokens.push({ type: 'em', value: match[7] });
    } else if (match[8]) {
      tokens.push({ type: 'code', value: match[9] });
    }

    rest = rest.slice(match.index + match[0].length);
  }

  return tokens.filter((t) => t.type !== 'text' || t.value.length > 0);
}

const HEADING = /^(#{2,4})\s+(.*)$/;
const UNORDERED = /^[-*]\s+(.*)$/;
const ORDERED = /^\d+\.\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;
const RULE = /^(-{3,}|\*{3,}|_{3,})$/;

export function parseMarkdown(input: string): BlockToken[] {
  const lines = (input ?? '').replace(/\r\n/g, '\n').split('\n');
  const blocks: BlockToken[] = [];

  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let quote: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ type: 'paragraph', content: parseInline(paragraph.join(' ')) });
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    blocks.push({
      type: 'list',
      ordered: list.ordered,
      items: list.items.map(parseInline),
    });
    list = null;
  };

  const flushQuote = () => {
    if (quote.length === 0) return;
    blocks.push({ type: 'quote', content: parseInline(quote.join(' ')) });
    quote = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.length === 0) {
      flushAll();
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      flushAll();
      blocks.push({
        type: 'heading',
        level: heading[1].length as 2 | 3 | 4,
        content: parseInline(heading[2]),
      });
      continue;
    }

    if (RULE.test(line)) {
      flushAll();
      blocks.push({ type: 'rule' });
      continue;
    }

    const quoteLine = QUOTE.exec(line);
    if (quoteLine) {
      flushParagraph();
      flushList();
      quote.push(quoteLine[1]);
      continue;
    }

    const unordered = UNORDERED.exec(line);
    const ordered = ORDERED.exec(line);
    if (unordered || ordered) {
      flushParagraph();
      flushQuote();
      const isOrdered = Boolean(ordered);
      const text = (unordered ?? ordered)![1];
      if (!list || list.ordered !== isOrdered) {
        flushList();
        list = { ordered: isOrdered, items: [] };
      }
      list.items.push(text);
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(line);
  }

  flushAll();
  return blocks;
}

/** Plain-text preview used for meta descriptions and card excerpts. */
export function markdownToPlainText(input: string, maxLength = 180): string {
  const text = parseMarkdown(input)
    .filter((b): b is Extract<BlockToken, { type: 'paragraph' }> => b.type === 'paragraph')
    .map((b) => b.content.map((t) => t.value).join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`;
}
