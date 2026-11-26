import { useEffect } from 'react'

export default function useScrollReveal() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sections = Array.from(document.querySelectorAll('main > section'))
    const header = document.querySelector('.site-header')
    let frame = 0
    const clamp = n => Math.max(0, Math.min(1, n))
    const smooth = n => { n = clamp(n); return n * n * (3 - 2 * n) }

    function update() {
      frame = 0
      const top = header?.getBoundingClientRect().bottom || 0
      const bottom = window.innerHeight
      const height = Math.max(1, bottom - top)
      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        const visible = Math.max(0, Math.min(rect.bottom, bottom) - Math.max(rect.top, top))
        const ratio = visible / Math.max(1, Math.min(rect.height, height))
        const light = 0.02 + 0.98 * smooth(ratio / 0.95)
        section.style.setProperty('--scroll-light', light.toFixed(3))
      })
    }

    function schedule() {
      if (!frame && !motion.matches) frame = requestAnimationFrame(update)
    }

    function configure() {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      document.documentElement.classList.toggle('continuous-scroll', !motion.matches)
      if (!motion.matches) update()
      else sections.forEach(section => section.style.removeProperty('--scroll-light'))
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    motion.addEventListener('change', configure)
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    sections.forEach(section => resize?.observe(section))
    configure()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      motion.removeEventListener('change', configure)
      resize?.disconnect()
      document.documentElement.classList.remove('continuous-scroll')
      sections.forEach(section => section.style.removeProperty('--scroll-light'))
    }
  }, [])
}