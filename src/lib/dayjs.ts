import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(weekOfYear)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  weekStart: 1,
})

export default dayjs
