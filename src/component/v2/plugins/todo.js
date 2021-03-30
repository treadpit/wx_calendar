/**
 * @Author: drfu*
 * @Description: 代办事项
 * @Date: 2020-10-08 21:22:09*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-11 14:23:02
 * */

import { getCalendarData, dateUtil } from '../utils/index'
import { renderCalendar } from '../render'

function updateDatePropertyOfTodoLabel(todos, dates, showLabelAlways) {
  const datesInfo = [...dates]
  for (let todo of todos) {
    let targetIdx = datesInfo.findIndex(
      item => dateUtil.toTimeStr(item) === dateUtil.toTimeStr(todo)
    )
    let target = datesInfo[targetIdx]
    if (!target) continue
    if (showLabelAlways) {
      target.showTodoLabel = true
    } else {
      target.showTodoLabel = !target.choosed
    }
    if (target.showTodoLabel) {
      target.todoText = todo.todoText
    }
    target.color = todo.color
  }
  return datesInfo
}

export default () => {
  return {
    name: 'todo',
    beforeRender(calendarData = {}, calendarConfig = {}, component) {
      const { todos = [], dates = [], showLabelAlways } = calendarData
      const dateWithTodoInfo = updateDatePropertyOfTodoLabel(
        todos,
        dates,
        showLabelAlways
      )
      return {
        calendarData: {
          ...calendarData,
          dates: dateWithTodoInfo
        },
        calendarConfig
      }
    },
    methods(component) {
      return {
        setTodos: (options = {}) => {
          const calendar = getCalendarData('calendar', component)
          if (!calendar || !calendar.dates) {
            return Promise.reject('请等待日历初始化完成后再调用该方法')
          }
          const {
            circle,
            dotColor = '',
            pos = 'bottom',
            showLabelAlways,
            dates: todoDates = []
          } = options
          const { todos = [] } = calendar
          const tranformStr2NumOfTodo = todoDates.map(date =>
            dateUtil.tranformStr2NumOfDate(date)
          )
          const calendarData = {
            dates: calendar.dates,
            todos: dateUtil.uniqueArrayByDate(
              todos.concat(tranformStr2NumOfTodo)
            )
          }
          if (!circle) {
            calendarData.todoLabelPos = pos
            calendarData.todoLabelColor = dotColor
          }
          calendarData.todoLabelCircle = circle || false
          calendarData.showLabelAlways = showLabelAlways || false
          const existCalendarData = getCalendarData('calendar', component)
          return renderCalendar.call(component, {
            ...existCalendarData,
            ...calendarData
          })
        },
        deleteTodos(todos = []) {
          if (!(todos instanceof Array) || !todos.length)
            return Promise.reject('deleteTodos()应为入参为非空数组')
          const existCalendarData = getCalendarData('calendar', component)
          const allTodos = existCalendarData.todos || []
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
          return renderCalendar.call(component, {
            ...existCalendarData,
            dates: _dates,
            todos: remainTodos
          })
        },
        clearTodos() {
          const existCalendarData = getCalendarData('calendar', component)
          const _dates = [...existCalendarData.dates]
          _dates.forEach(item => {
            item.showTodoLabel = false
          })
          return renderCalendar.call(component, {
            ...existCalendarData,
            dates: _dates,
            todos: []
          })
        },
        getTodos() {
          return getCalendarData('calendar.todos', component) || []
        }
      }
    }
  }
}
