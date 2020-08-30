import { logger, getCalendarData, dateUtil } from '../utils/index'
import { renderCalendar } from '../render'

function filterTodos({ curYear, curMonth, exsitedTodos, toSetTodos }) {
  const exsitedCurrentMonthTodos = dateUtil.filterDatesByYM(
    {
      year: curYear,
      month: curMonth
    },
    exsitedTodos
  )
  const toSetTodosOfThisMonth = dateUtil.filterDatesByYM(
    {
      year: curYear,
      month: curMonth
    },
    toSetTodos
  )
  const allTodosOfThisMonths = dateUtil.uniqueArrayByDate(
    exsitedCurrentMonthTodos.concat(toSetTodosOfThisMonth)
  )
  return allTodosOfThisMonths
}

function updateDatePropertyOfTodoLabel(todos, dates, showLabelAlways) {
  const datesInfo = [...dates]
  for (let todo of todos) {
    let target = datesInfo[todo.date - 1]
    if (!target) continue
    if (showLabelAlways) {
      target.showTodoLabel = true
    } else {
      target.showTodoLabel = !target.choosed
    }
    if (target.showTodoLabel && todo.todoText) {
      target.todoText = todo.todoText
    }
    if (todo.color) target.color = todo.color
  }
  return datesInfo
}

export default () => {
  return {
    name: 'todo',
    methods(component) {
      return {
        setTodos: (options, componentId) => {
          if (options) component.todoConfig = options
          const calendar = getCalendarData('calendar', component)
          if (!calendar || !calendar.dates) {
            return logger.warn('请等待日历初始化完成后再调用该方法')
          }
          let dates = [...calendar.dates]
          const { curYear, curMonth } = calendar
          const {
            circle,
            dotColor = '',
            pos = 'bottom',
            showLabelAlways,
            dates: todoDates = []
          } = component.todoConfig || {}
          const { todos = [] } = calendar
          const allTodosOfThisMonths = filterTodos({
            curYear,
            curMonth,
            exsitedTodos: todos,
            toSetTodos: todoDates
          })
          dates = updateDatePropertyOfTodoLabel(
            allTodosOfThisMonths,
            dates,
            showLabelAlways
          )
          const calendarData = {
            dates,
            todos: dateUtil.uniqueArrayByDate(todos.concat(todoDates))
          }
          if (!circle) {
            if (pos) calendarData.todoLabelPos = pos
            if (dotColor) calendarData.todoLabelColor = dotColor
          }
          calendarData.todoLabelCircle = circle || false
          calendarData.showLabelAlways = showLabelAlways || false
          const existCalendarData = getCalendarData('calendar', component)
          renderCalendar.call(component, {
            ...existCalendarData,
            ...calendarData
          })
        },
        deleteTodos(todos = []) {
          if (!(todos instanceof Array) || !todos.length) return
          const existCalendarData = getCalendarData('calendar', component)
          const allTodos = existCalendarData.todos
          const toDeleteTodos = todos.map(item => dateUtil.toTimeStr(item))
          const remainTodos = allTodos.filter(
            item => !toDeleteTodos.includes(dateUtil.toTimeStr(item))
          )
          const { dates, curYear, curMonth } = existCalendarData
          const _dates = [...dates]
          const currentMonthTodos = dateUtil.filterDatesByYM(
            {
              year: curYear,
              month: curMonth
            },
            remainTodos
          )
          _dates.forEach(item => {
            item.showTodoLabel = false
          })
          currentMonthTodos.forEach(item => {
            _dates[item.date - 1].showTodoLabel = !_dates[item.date - 1].choosed
          })
          renderCalendar.call(component, {
            ...existCalendarData,
            dates: _dates,
            todos: remainTodos
          })
        },
        clearTodoLabels() {
          const existCalendarData = getCalendarData('calendar', component)
          const _dates = [...existCalendarData.dates]
          _dates.forEach(item => {
            item.showTodoLabel = false
          })
          renderCalendar.call(component, {
            ...existCalendarData,
            dates: _dates,
            selectedDates: []
          })
        },
        getTodos() {
          const existCalendarData = getCalendarData('calendar', component)
          return existCalendarData.selectedDates || []
        }
      }
    }
  }
}
