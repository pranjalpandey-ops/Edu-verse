import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Fallback formatter for clean unicode mathematical text if needed
function fallbackFormat(str) {
  return str
    .replace(/\\vec\{([^}]+)\}/g, '$1⃗')
    .replace(/\\hat\{([^}]+)\}/g, '$1̂')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\theta/g, 'θ')
    .replace(/\\pi/g, 'π')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\omega/g, 'ω')
    .replace(/\\mu/g, 'μ')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\nu/g, 'ν')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\approx/g, '≈')
    .replace(/\\pm/g, '±')
    .replace(/\\mp/g, '∓')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\quad/g, '  ')
    .replace(/\\left|\\right/g, '')
    .replace(/\\\\/g, ' ')
    .replace(/[\\]/g, '');
}

export default function MathView({ math, block = false, className = '' }) {
  const rendered = useMemo(() => {
    if (!math) return '';
    let cleanMath = String(math).trim();
    
    // Normalize LaTeX command escape sequences
    cleanMath = cleanMath.replace(/\\\\/g, '\\');
    cleanMath = cleanMath.replace(/\\{2,}([a-zA-Z]+)/g, '\\$1');

    try {
      return katex.renderToString(cleanMath, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        trust: true,
        output: 'htmlAndMathml'
      });
    } catch (e) {
      return `<span class="fallback-math font-mono">${fallbackFormat(cleanMath)}</span>`;
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

