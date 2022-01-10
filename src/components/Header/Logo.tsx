import type { FC } from 'react'

import { ReactComponent as LogoSvg } from 'public/assets/logo.svg'

const LogoText: FC<{ className?: string }> = ({ children, className }) => (
  <p className={`font-display tracking-wide text-primary text-lg ${className || ''}`}>{children}</p>
)

const Logo: FC = () => (
  <div className="flex flex-col items-center w-min mt-3 xs:mt-0">
    <LogoText className="-mb-4 md:-mb-6 text-sm md:text-base">The</LogoText>
    <LogoSvg className="w-28 h-28 md:w-40 md:h-40 xl:w-48 xl:h-48" />
    <LogoText className="-mt-3 md:-mt-6 text-sm md:text-base">weekly planner</LogoText>
  </div>
)

export default Logo
