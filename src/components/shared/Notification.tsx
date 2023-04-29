type Type = 'offline' | 'syncing' | 'synced'

const typeStyles = (type: Type): string => {
  if (type === 'offline') return 'bg-gradient-to-r from-gray-400 to-gray-600'
  if (type === 'syncing') return 'bg-primary'
  if (type === 'synced') return 'bg-gradient-to-r from-secondary to-primary'
  return ''
}

const typeText = (type: Type): string => {
  if (type === 'offline') return "You're offline"
  if (type === 'syncing') return 'Syncing data to the cloud'
  if (type === 'synced') return 'Data synced successfully'
  return ''
}

type Props = {
  type: Type | null
}

const Notification = ({ type }: Props) =>
  type && (
    <div
      className={`fixed h-10 flex justify-center items-center w-full text-white font-display tracking-wider text-lg z-50 ${typeStyles(
        type
      )}`}
    >
      {typeText(type)}
    </div>
  )

export default Notification
