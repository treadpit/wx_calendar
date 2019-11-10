import mock from '../__mocks__';
import {
  uniqueArrayByDate,
  delRepeatedEnableDay,
  convertEnableAreaToTimestamp,
  converEnableDaysToTimestamp
} from '../src/component/calendar/func/utils';

test('unique days array by date', () => {
  expect(uniqueArrayByDate(mock.Days)).toEqual(mock.UniqueArrayByDate.Expected);
});

test('delete repeated day when call enableDay and enabelArea', () => {
  expect(
    delRepeatedEnableDay(mock.EnableDays.Received, mock.EnableArea.Received)
  ).toEqual(mock.EnableDayRepeated.Expected);
});

test('convert string array of days to timestamp', () => {
  expect(convertEnableAreaToTimestamp(mock.EnableArea.Received)).toEqual(
    mock.EnableArea.Expected
  );
});

test('convert object array of days to timestamp', () => {
  expect(converEnableDaysToTimestamp(mock.EnableDays.Received)).toEqual(
    mock.EnableDays.Expected
  );
});
