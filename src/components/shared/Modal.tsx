import type { PropsWithChildren, ReactNode } from 'react'
import { RiCloseLine } from 'react-icons/ri'

type Props = {
  title?: string
  onClick: () => void
  additionalEl?: ReactNode
  modalStyles?: string
} & PropsWithChildren

const Modal = ({ children, title, onClick, modalStyles, additionalEl }: Props) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-gray-800 bg-opacity-30 modal"
    onClick={onClick}
  >
    <div
      className={`bg-white rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md shadow-lg py-4 px-5 border-2 border-tertiary mx-2 ${
        modalStyles || ''
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <h1 className="pt-1 text-2xl font-display text-primary">{title || ''}</h1>
          {!!additionalEl && additionalEl}
        </div>
        <button
          onClick={onClick}
          className="flex items-center justify-center w-8 h-8 transition-all hover:opacity-60"
        >
          <RiCloseLine size={24} />
        </button>
      </div>
      {children}
    </div>
  </div>
)

export default Modal
