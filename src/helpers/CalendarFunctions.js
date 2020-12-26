import moment from 'moment';

// Updates number of days in month (checks for leap year)
export const getMonthDays = (monthNum, yearNum) => {
  let monthDays = 31;
  if (
    monthNum === 3 ||
    monthNum === 5 ||
    monthNum === 8 ||
    monthNum === 10
  ) {
    monthDays = 30;
  } else {
    if (monthNum === 1) {
      monthDays = 28;
      if (yearNum % 4 === 0) {
        monthDays = 29;
      }
    }
  }
  return monthDays
}

// Gets the first day of month, so we know where to align dates in relation to week days
export const getFirstDay = (firstMonth, firstYear) => {
  const firstDay = moment().year(firstYear).month(firstMonth).date(1).day();
  return firstDay;
}

// Returns a string of the date that includes the ordinal ('st', 'nd', 'rd', 'th')
export const getOrdinal = (date) => {
  let ordinal = 'th';
  if (date === 1 || date === 21 || date === 31) {
    ordinal = 'st';
  }
  if (date === 2 || date === 22) {
    ordinal = 'nd';
  }
  if (date === 3) {
    ordinal = 'rd';
  }
  return ordinal
}
