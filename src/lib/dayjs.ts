import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import updateLocale from 'dayjs/plugin/updateLocale'
import localeData from 'dayjs/plugin/localeData'
import utc from 'dayjs/plugin/utc'

dayjs.extend(weekOfYear)
dayjs.extend(updateLocale)
dayjs.extend(localeData)
dayjs.extend(utc)
dayjs.updateLocale('en', {
  weekStart: 1,
})

export default dayjs
