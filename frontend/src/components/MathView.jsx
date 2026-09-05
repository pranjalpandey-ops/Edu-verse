import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathView({ math, block = false, className = '' }) {
  const rendered = useMemo(() => {
    if (!math) return '';
    const cleanMath = String(math).trim();
    try {
      return katex.renderToString(cleanMath, {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
    } catch (e) {
      return cleanMath;
    }
  }, [math, block]);

  if (!rendered) return null;

  return (
    <span
      className={`inline-block math-rendered ${className}`}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
