import type { FC, ReactElement, ReactNode } from 'react'
import { BsGlobe2 } from 'react-icons/bs'
import { IoBookSharp } from 'react-icons/io5'
import { FaTwitter, FaGithub } from 'react-icons/fa'

import Modal from 'src/components/shared/Modal'

type ButtonProps = {
  icon?: ReactNode
  text: string | ReactElement
  href: string
}

const Link: FC<ButtonProps> = ({ icon, text, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="credits-btn">
    {icon || null}
    <span className="font-body font-semibold text-gray-700">{text}</span>
  </a>
)

type Props = {
  close: () => void
}

const Credits: FC<Props> = ({ close }) => (
  <Modal title="Credits" onClick={close}>
    <div className="flex flex-col space-y-3 mt-2 w-64">
      <p className="font-body flex items-center space-x-1">
        <span>Made by</span> <b>Ricardo Barbosa</b>
      </p>
      <p className="font-display text-lg text-tertiary">Follow me</p>
      <Link
        icon={<FaTwitter size={20} className="text-[#1da1f2]" />}
        text="On Twitter"
        href="https://twitter.com/Ricard0Barbosa"
      />
      <Link
        icon={<FaGithub size={20} />}
        text="On Github"
        href="https://github.com/RicardoPBarbosa"
      />
      <Link
        icon={<BsGlobe2 size={19} className="text-gray-700" />}
        text="On my website"
        href="https://ricardopbarbosa.com"
      />
      <hr className="border-primary opacity-50" />
      <Link
        icon={<IoBookSharp size={22} className="text-primary" />}
        text="Buy me a book"
        href="https://www.buymeacoffee.com/ricardopbarbosa"
      />
    </div>
  </Modal>
)

export default Credits
