/**
 * @Author: drfu*
 * @Description: 代办事项
 * @Date: 2020-10-08 21:22:09*
 * @Last Modified by: drfu
 * @Last Modified time: 2020-10-11 14:23:02
 * */

import { getCalendarData, dateUtil } from '../utils/index'
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
        setTodos: (options = {}) => {
          const calendar = getCalendarData('calendar', component)
          if (!calendar || !calendar.dates) {
            return Promise.reject('请等待日历初始化完成后再调用该方法')
          }
          let dates = [...calendar.dates]
          const { curYear, curMonth } = calendar
          const {
            circle,
            dotColor = '',
            pos = 'bottom',
            showLabelAlways,
            dates: todoDates = []
          } = options
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
            todos: dateUtil.uniqueArrayByDate(
              todos.concat(
                todoDates.map(date => dateUtil.tranformStr2NumOfDate(date))
              )
            )
          }
          if (!circle) {
            if (pos) calendarData.todoLabelPos = pos
            if (dotColor) calendarData.todoLabelColor = dotColor
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
