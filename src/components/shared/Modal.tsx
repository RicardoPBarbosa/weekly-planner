import type { FC } from 'react'
import { RiCloseLine } from 'react-icons/ri'

type Props = {
  title?: string
  onClick: () => void
}

const Modal: FC<Props> = ({ children, title, onClick }) => (
  <div
    className="fixed inset-0 bg-gray-800 bg-opacity-30 w-screen h-screen flex justify-center items-center modal z-50"
    onClick={onClick}
  >
    <div
      className="bg-white rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md shadow-lg py-4 px-5 border-2 border-tertiary max-w-md mx-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl text-primary">{title || ''}</h1>
        <button
          onClick={onClick}
          className="w-8 h-8 flex justify-center items-center transition-all hover:opacity-60"
        >
          <RiCloseLine size={24} />
        </button>
      </div>
      {children}
    </div>
  </div>
)

export default Modal
