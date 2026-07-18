import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

function processLatex(text) {
  if (!text) return [];
  const parts = [];
  // Split on $$...$$ (block) and $...$ (inline)
  const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('$$') && raw.endsWith('$$')) {
      parts.push({ type: 'block-math', content: raw.slice(2, -2).trim() });
    } else {
      parts.push({ type: 'inline-math', content: raw.slice(1, -1).trim() });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return parts;
}

function MathText({ children }) {
  if (typeof children !== 'string') return children;
  const parts = processLatex(children);
  return parts.map((part, i) => {
    if (part.type === 'block-math') {
      try { return <BlockMath key={i} math={part.content} />; } catch { return <code key={i}>{part.content}</code>; }
    }
    if (part.type === 'inline-math') {
      try { return <InlineMath key={i} math={part.content} />; } catch { return <code key={i}>{part.content}</code>; }
    }
    return <span key={i}>{part.content}</span>;
  });
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p>{typeof children === 'string' ? <MathText>{children}</MathText> : children}</p>,
          li: ({ children }) => <li>{typeof children === 'string' ? <MathText>{children}</MathText> : children}</li>,
          strong: ({ children }) => <strong>{typeof children === 'string' ? <MathText>{children}</MathText> : children}</strong>,
          code: ({ inline, children }) => {
            const text = String(children);
            if (inline) {
              try { return <InlineMath math={text} />; } catch { return <code>{text}</code>; }
            }
            return <pre><code>{text}</code></pre>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
