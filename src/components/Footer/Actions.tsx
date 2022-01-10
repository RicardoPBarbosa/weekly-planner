import { useState } from 'react'
import type { ButtonHTMLAttributes, FC } from 'react'
import {
  RiHistoryLine,
  RiInformationLine,
  RiUploadCloud2Line,
  RiCloudOffLine,
} from 'react-icons/ri'

import History from './partials/History'
import Credits from './partials/Credits'

enum ACTION_TYPE {
  HISTORY,
  CREDITS,
}

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`bg-gray-100 rounded p-2 text-gray-500 transition-all hover:bg-gray-200 ${className}`}
  >
    {children}
  </button>
)

type Props = {
  authenticated: boolean
  signIn: () => void
  signOut: () => void
  loading: boolean
}

const Actions: FC<Props> = ({ authenticated, signIn, signOut, loading }) => {
  const [action, setAction] = useState<ACTION_TYPE>()

  const onClose = () => setAction(undefined)

  const renderModal = () => {
    switch (action) {
      case ACTION_TYPE.HISTORY:
        return <History close={onClose} />
      case ACTION_TYPE.CREDITS:
        return <Credits close={onClose} />
      default:
        return null
    }
  }

  return (
    <>
      <div className="footer-actions-container">
        <div className="border-l-2 border-gray-200 hidden lg:block" />
        <Button disabled={loading} onClick={() => (authenticated ? signOut() : signIn())}>
          {authenticated ? <RiCloudOffLine size={23} /> : <RiUploadCloud2Line size={23} />}
        </Button>
        <Button onClick={() => setAction(ACTION_TYPE.HISTORY)}>
          <RiHistoryLine size={22} />
        </Button>
        <Button onClick={() => setAction(ACTION_TYPE.CREDITS)}>
          <RiInformationLine size={23} />
        </Button>
      </div>
      {renderModal()}
    </>
  )
}

export default Actions
