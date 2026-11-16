import type { AnchorHTMLAttributes, PointerEvent, ReactNode } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { size?: 'md' | 'lg'; children: ReactNode }

/** Airbnb-style gradient CTA. The bright spot of the gradient follows the pointer. */
export function PrimaryButton({ size = 'md', className = '', children, ...rest }: Props) {
  const onPointerMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }
  return (
    <a
      {...rest}
      onPointerMove={onPointerMove}
      className={`btn-primary ${size === 'lg' ? 'btn-primary--lg' : ''} ${className}`}
    >
      {children}
    </a>
  )
}
