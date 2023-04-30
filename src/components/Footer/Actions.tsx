import { TbColumns3 } from 'react-icons/tb'
import type { ButtonHTMLAttributes } from 'react'
import { PropsWithChildren, useState } from 'react'
import {
  RiHistoryLine,
  RiInformationLine,
  RiUploadCloud2Line,
  RiCloudOffLine,
} from 'react-icons/ri'

import Credits from './partials/Credits'
import HistoryModal from './partials/HistoryModal'
import YearlyViewModal from './partials/YearlyViewModal'

enum ACTION_TYPE {
  HISTORY,
  CREDITS,
  YEARLYVIEW,
}

const Button = ({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren) => (
  <button
    {...props}
    className={`bg-gray-100 rounded p-2 text-gray-500 transition-all hover:bg-gray-200 ${
      className ?? ''
    }`}
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

const Actions = ({ authenticated, signIn, signOut, loading }: Props) => {
  const [action, setAction] = useState<ACTION_TYPE>()

  const onClose = () => setAction(undefined)

  const renderModal = () => {
    switch (action) {
      case ACTION_TYPE.HISTORY:
        return <HistoryModal close={onClose} />
      case ACTION_TYPE.YEARLYVIEW:
        return <YearlyViewModal close={onClose} />
      case ACTION_TYPE.CREDITS:
        return <Credits close={onClose} />
      default:
        return null
    }
  }

  return (
    <>
      <div className="flex justify-center flex-1 gap-3 sm:gap-5 sm:ml-8 xl:flex-initial xl:justify-end">
        <div className="hidden border-l-2 border-gray-200 xl:block" />
        <Button
          disabled={loading}
          onClick={() => (authenticated ? signOut() : signIn())}
          title="Sync to the cloud"
        >
          {authenticated ? <RiCloudOffLine size={23} /> : <RiUploadCloud2Line size={23} />}
        </Button>
        <Button onClick={() => setAction(ACTION_TYPE.HISTORY)} title="History">
          <RiHistoryLine size={22} />
        </Button>
        <Button onClick={() => setAction(ACTION_TYPE.YEARLYVIEW)} title="Yearly View">
          <TbColumns3 size={22} />
        </Button>
        <Button onClick={() => setAction(ACTION_TYPE.CREDITS)} title="Credits">
          <RiInformationLine size={23} />
        </Button>
      </div>
      {renderModal()}
    </>
  )
}

export default Actions
