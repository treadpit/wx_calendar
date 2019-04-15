export default {
  Days: [
    { year: 2019, month: 3, day: 15 },
    { year: 2019, month: 3, day: 15 },
    { year: 2019, month: 3, day: 19 }
  ],
  UniqueArrayByDate: {
    Received: [],
    Expected: [
      { year: 2019, month: 3, day: 15 },
      { year: 2019, month: 3, day: 19 }
    ]
  },
  EnableDayRepeated: {
    Received: [],
    Expected: [1552320000000, 1551542400000]
  },
  EnableArea: {
    Received: ['2019-10-7', '2019-10-28'],
    Expected: {
      start: ['2019', '10', '7'],
      end: ['2019', '10', '28'],
      startTimestamp: 1570377600000,
      endTimestamp: 1572192000000
    }
  },
  EnableDays: {
    Received: ['2019-3-12', '2019-3-3'],
    Expected: [1552320000000, 1551542400000]
  }
};
