const automator = require('miniprogram-automator');
const path = require('path');

let miniProgram;
let page;

beforeAll(async () => {
  miniProgram = await automator.launch({
    projectPath: path.join(__dirname, '../dist')
  });
  page = await miniProgram.reLaunch('/pages/calendarComponent/index');
  await page.waitFor(500);
}, 60000);

afterAll(async () => {
  await miniProgram.close();
});

describe('页面渲染', () => {
  it('日历组件UI渲染', async () => {
    const calendar = await page.$('.calendar');
    expect(calendar.tagName).toBe('view');
    const handle = await calendar.$('.handle');
    expect(handle.tagName).toBe('view');
    const weeks = await calendar.$('.weeks');
    expect(weeks.tagName).toBe('view');
    const wrap = await calendar.$('.wrap');
    expect(wrap.tagName).toBe('view');
  });
  it('功能测试按钮', async () => {
    const btns = await page.$('.btn-wrap');
    const btn = await btns.$$('.btn');
    expect(btn.length).toBe(15);
  });
});

describe('功能操作', () => {
  let calendarComp;
  let btnWrap;
  beforeAll(async () => {
    calendarComp = await page.$('calendar');
    btnWrap = await page.$('.btn-wrap');
  });
  it('测试跳转', async () => {
    // const calendarComp = await page.$('calendar');
    const lastData = (await calendarComp.data('calendar.selectedDay')[0]) || {};
    const jumpBtn = await page.$('.btn-action-jump');
    jumpBtn.tap();
    await page.waitFor(100);
    const newData = await calendarComp.data('calendar.selectedDay');
    expect(newData.length).toBeTruthy();
    const o = `${lastData.year}-${lastData.month}-${lastData.day}`;
    const n = `${newData[0].year}-${newData[0].month}-${newData[0].day}`;
    expect(o).not.toBe(n);
  });
  it('切换周月视图', async () => {
    const switchViewBtn = await btnWrap.$('.btn-action-switchView');
    switchViewBtn.tap();
    await page.waitFor(100);
    const panelDates = await calendarComp.data('calendar.days');
    expect(panelDates.length > 1 && panelDates.length <= 7).toBeTruthy();
    await page.waitFor(100);
    switchViewBtn.tap();
  });
  it('获取当前已选', async () => {
    const getSelectedDateBtn = await btnWrap.$('.btn-action-getSelectedDay');
    getSelectedDateBtn.tap();
    await page.waitFor(100);
    const selectedDate = await calendarComp.data('calendar.selectedDay');
    expect(selectedDate.length).toBeTruthy();
  });
  it('获取日历面板日期', async () => {
    const getDateBtn = await btnWrap.$('.btn-action-getCalendarDates');
    getDateBtn.tap();
    await page.waitFor(100);
    const dates = await calendarComp.data('calendar.days');
    expect(dates.length).toBeTruthy();
  });
  it('获取日历配置', async () => {
    const getConfigBtn = await btnWrap.$('.btn-action-getConfig');
    getConfigBtn.tap();
    const config = await calendarComp.data('calendarConfig');
    expect(config).toBeDefined();
  });
  it('设置代办事项', async () => {
    const setTodoBtn = await btnWrap.$('.btn-action-setTodoLabels');
    setTodoBtn.tap();
    await page.waitFor(100);
    const todoDate = await calendarComp.data('calendar.todoLabels');
    expect(todoDate.length).toBeTruthy();
  });
  it('获取代办事项', async () => {
    const getTodoBtn = await btnWrap.$('.btn-action-getTodoLabels');
    getTodoBtn.tap();
    await page.waitFor(100);
    const todoDate = await calendarComp.data('calendar.todoLabels');
    expect(todoDate.length).toBeTruthy();
  });
  it('删除代办事项', async () => {
    const oldTodoDate = await calendarComp.data('calendar.todoLabels');
    const getTodoBtn = await btnWrap.$('.btn-action-deleteTodoLabels');
    getTodoBtn.tap();
    await page.waitFor(100);
    const todoDate = await calendarComp.data('calendar.todoLabels');
    expect(oldTodoDate.length > todoDate.length).toBeTruthy();
  });
  it('禁选指定日期', async () => {
    const disableDaysBtn = await btnWrap.$('.btn-action-disableDay');
    disableDaysBtn.tap();
    await page.waitFor(100);
    const disableDates = await calendarComp.data('calendar.disableDays');
    expect(disableDates.length).toBeTruthy();
  });
  it('指定特定可选', async () => {
    const getTodoBtn = await btnWrap.$('.btn-action-enableDays');
    getTodoBtn.tap();
    await page.waitFor(100);
    const enableDates = await calendarComp.data('calendar.enableDays');
    expect(enableDates.length).toBeTruthy();
  });
  it('指定可选区域', async () => {
    const enableAreaBtn = await btnWrap.$('.btn-action-enableArea');
    enableAreaBtn.tap();
    await page.waitFor(100);
    const enableArea = await calendarComp.data('calendar.enableArea');
    expect(enableArea.length).toBeTruthy();
  });
  it('自定义配置', async () => {
    const setSelectedDateBtn = await btnWrap.$('.btn-action-config');
    setSelectedDateBtn.tap();
    await page.waitFor(100);
    const calendarConfig = await calendarComp.data('calendarConfig');
    expect(calendarConfig.multi).toBeTruthy();
  });
  it('选中指定日期', async () => {
    const setSelectedDateBtn = await btnWrap.$('.btn-action-setSelectedDays');
    setSelectedDateBtn.tap();
    await page.waitFor(100);
    const selectedDates = await calendarComp.data('calendar.selectedDay');
    expect(selectedDates.length).toBeTruthy();
  });
});
