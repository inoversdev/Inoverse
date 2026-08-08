// ─── SplitHeading — V4-style split-text reveal ───
// Splits the heading into per-character spans, then staggers them up
// with a subtle rotateX when the heading scrolls into view. `accent`
// marks a substring (e.g. "launched") with the ember style so headings
// keep the V2 signature look. `\n` in `text` forces a line break (e.g.
// the hero's two-line headline) — safe no-op for callers without one.
// Reduced-motion renders plain text.

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SplitHeading({
  as: Tag = 'h2',
  text = '',
  accent = '',
  className = '',
  delay = 0,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !text) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Split into lines → words → chars. Accent substring gets the ember
    // class; indices run across the whole original string (line breaks
    // count as one char) so accent matching stays correct across lines.
    const accentStart = accent ? text.indexOf(accent) : -1
    const accentEnd = accentStart >= 0 ? accentStart + accent.length : -1
    let cursor = 0
    const lines = text.split('\n').map((line) => {
      const words = line.split(' ').map((word) => {
        const chars = word.split('').map((ch, i) => {
          const globalIdx = cursor + i
          const isAccent = globalIdx >= accentStart && globalIdx < accentEnd
          return `<span class="sh-char${isAccent ? ' sh-ember' : ''}">${ch}</span>`
        })
        cursor += word.length + 1
        return `<span class="sh-word">${chars.join('')}</span>`
      })
      return words.join(' ')
    })
    el.innerHTML = lines.join('<br />')

    const chars = el.querySelectorAll('.sh-char')
    const tween = gsap.fromTo(
      chars,
      { opacity: 0, y: 26, rotateX: -45 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.022,
        delay,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    )
    return () => {
      el.innerHTML = text
      // Kill the ScrollTrigger FIRST — killTweensOf alone leaves the
      // trigger registered against a dead element, leaking it every time
      // a heading unmounts (e.g. navigating home → /projects → home).
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.killTweensOf(chars)
    }
  }, [text, accent, delay])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text}
    </Tag>
  )
}
