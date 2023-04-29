import type { PropsWithChildren } from 'react'

import { ReactComponent as LogoSvg } from 'src/assets/logo.svg'

type Props = { className?: string } & PropsWithChildren

const LogoText = ({ children, className }: Props) => (
  <p className={`font-display tracking-wide text-primary text-lg ${className || ''}`}>{children}</p>
)

const Logo = () => (
  <div className="flex flex-col items-center mt-3 w-min xs:mt-0">
    <LogoText className="-mb-4 text-sm md:-mb-6 md:text-base">The</LogoText>
    <LogoSvg className="w-28 h-28 md:w-40 md:h-40 xl:w-48 xl:h-48" />
    <LogoText className="-mt-3 text-sm md:-mt-6 md:text-base">weekly planner</LogoText>
  </div>
)

export default Logo
