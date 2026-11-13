import React, { useRef, useState, useCallback, useEffect } from 'react';
import './LineSidebar.css';

const curves = { linear: p => p, smooth: p => p * p * (3 - 2 * p), sharp: p => p * p * p };

export default function LineSidebar({ items = [], accentColor = '#A855F7', textColor = '#c4c4c4', markerColor = '#6c6c6c', showIndex = true, showMarker = true, proximityRadius = 100, maxShift = 30, falloff = 'smooth', markerLength = 60, markerGap = 0, tickScale = 0.5, scaleTick = true, itemGap = 20, fontSize = 1.1, smoothing = 100, defaultActive = null, onItemClick, className = '' }) {
  const listRef = useRef(null), itemRefs = useRef([]), targetsRef = useRef([]), currentRef = useRef([]), rafRef = useRef(null), lastRef = useRef(0), activeRef = useRef(defaultActive), smoothingRef = useRef(smoothing);
  const [activeIndex, setActiveIndex] = useState(defaultActive);
  activeRef.current = activeIndex; smoothingRef.current = smoothing;

  const runFrame = useCallback(now => {
    const dt = Math.min((now - lastRef.current) / 1000, .05); lastRef.current = now;
    const k = 1 - Math.exp(-dt / Math.max(smoothingRef.current, 1) * 1000);
    let moving = false;
    itemRefs.current.forEach((el, i) => { if (!el) return; const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0); const cur = currentRef.current[i] || 0; const next = cur + (target - cur) * k; const settled = Math.abs(target - next) < .0015; const value = settled ? target : next; currentRef.current[i] = value; el.style.setProperty('--effect', value.toFixed(4)); if (!settled) moving = true; });
    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);
  const startLoop = useCallback(() => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); lastRef.current = performance.now(); rafRef.current = requestAnimationFrame(runFrame); }, [runFrame]);
  const handlePointerMove = e => { const rect = listRef.current?.getBoundingClientRect(); if (!rect) return; const ease = curves[falloff] || curves.linear; itemRefs.current.forEach((el, i) => { if (el) targetsRef.current[i] = ease(Math.max(0, 1 - Math.abs(e.clientY - rect.top - (el.offsetTop + el.offsetHeight / 2)) / proximityRadius)); }); startLoop(); };
  const handleLeave = () => { targetsRef.current = targetsRef.current.map(() => 0); startLoop(); };
  useEffect(() => { startLoop(); return () => rafRef.current && cancelAnimationFrame(rafRef.current); }, [activeIndex, startLoop]);
  useEffect(() => {
    const targets = itemRefs.current.map(item => item?.querySelector('a')?.hash).map(hash => hash && document.querySelector(hash)).filter(Boolean);
    if (!targets.length) return;
    let scheduled = false;
    const updateActiveSection = () => {
      scheduled = false;
      const readingLine = window.scrollY + window.innerHeight * .38;
      let nextIndex = 0;
      targets.forEach((target, index) => {
        const documentTop = target.getBoundingClientRect().top + window.scrollY;
        if (documentTop <= readingLine) nextIndex = index;
      });
      setActiveIndex(current => current === nextIndex ? current : nextIndex);
    };
    const onScroll = () => {
      if (!scheduled) { scheduled = true; requestAnimationFrame(updateActiveSection); }
    };
    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return <nav className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''}${className ? ` ${className}` : ''}`} style={{ '--accent-color': accentColor, '--text-color': textColor, '--marker-color': markerColor, '--marker-length': `${markerLength}px`, '--marker-gap': `${markerGap}px`, '--tick-scale': tickScale, '--max-shift': `${maxShift}px`, '--item-gap': `${itemGap}px`, '--font-size': `${fontSize}rem` }}>
    <ul ref={listRef} className="line-sidebar__list" onPointerMove={handlePointerMove} onPointerLeave={handleLeave}>{items.map((label, index) => <li key={`${label}-${index}`} ref={el => { itemRefs.current[index] = el; }} className="line-sidebar__item" aria-current={activeIndex === index ? 'true' : undefined} onClick={() => { setActiveIndex(index); onItemClick?.(index, label); }}><a href={['#top', '#about', '#work', '#capabilities', '#contact'][index]}><span className="line-sidebar__marker" aria-hidden="true" /><span className="line-sidebar__label">{showIndex && <span className="line-sidebar__index">{String(index + 1).padStart(2, '0')}</span>}<span className="line-sidebar__text">{label}</span></span></a></li>)}</ul>
  </nav>;
}
