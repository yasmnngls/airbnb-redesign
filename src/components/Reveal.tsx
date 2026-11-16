import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

type Props = {
  as?: ElementType
  delay?: number
  className?: string
  children: ReactNode
  style?: CSSProperties
}

/** Fades and lifts its content in once, the first time it scrolls into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, style }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref)
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
