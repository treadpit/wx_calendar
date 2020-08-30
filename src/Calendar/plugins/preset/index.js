import base from './base'
import jump from './jump'
import getCalendarData from './get-calendar-data'

const preset = [
  ['base', base()],
  ['get-calendar-data', getCalendarData()],
  ['jump', jump()]
]

export default preset
