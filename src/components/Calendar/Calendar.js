import React, { useState, useEffect, useContext } from 'react';
import Month from '../Month/Month';
import Title from '../Title/Title';
import { monthNames, dayNames } from '../../storage/NamesList';
import { getMonthDays, getFirstDay } from '../../helpers/CalendarFunctions';
import { CurrentDateContext } from '../../context/CurrentDateContext';
import { SelectedDateContext } from '../../context/SelectedDateContext';
import moment from 'moment';

const Calendar = () => {

  const {currentDate, setCurrentDate} = useContext(CurrentDateContext);
  const {selectedDate, setSelectedDate} = useContext(SelectedDateContext);
  const [daysInMonth, setDaysInMonth] = useState(getMonthDays(selectedDate.month, selectedDate.year))
  const [firstDay, setFirstDay] = useState(getFirstDay(selectedDate.month, selectedDate.year));

  // Ensure calendar weeks/days are updated and aligned correctly upon date switch
  // (mainly for when user clicks "take me to today" button)
  useEffect(() => {
    setDaysInMonth(getMonthDays(selectedDate.month));
    setFirstDay(getFirstDay(selectedDate.month, selectedDate.year));
  }, [selectedDate])

  // Functions to navigate through the months/years
  const onPrevMonth = () => {
    if (selectedDate.month === 0) {
      setSelectedDate({
        ...selectedDate,
        month: 11,
        year: selectedDate.year - 1,
        day: moment().year(selectedDate.year - 1).month(11).date(selectedDate.date).day()
      })
      // setMonth(11);
      // setYear(selectedDate.year - 1)
      setDaysInMonth(getMonthDays(11))
      setFirstDay(getFirstDay(11, selectedDate.year - 1))
    } else {
      setSelectedDate({
        ...selectedDate,
        month: selectedDate.month - 1,
        day: moment().year(selectedDate.year).month(selectedDate.month - 1).date(selectedDate.date).day()
      })
      // setMonth(month - 1);
      setDaysInMonth(getMonthDays(selectedDate.month - 1))
      setFirstDay(getFirstDay(selectedDate.month - 1, selectedDate.year))
    }
  }
  const onNextMonth = () => {
    if (selectedDate.month === 11) {
      setSelectedDate({
        ...selectedDate,
        month: 0,
        year: selectedDate.year + 1,
        day: moment().year(selectedDate.year + 1).month(0).date(selectedDate.date).day()
      })
      // setMonth(0);
      // setYear(year + 1)
      setDaysInMonth(getMonthDays(0))
      setFirstDay(getFirstDay(0, selectedDate.year + 1))

    } else {
      setSelectedDate({
        ...selectedDate,
        month: selectedDate.month + 1,
        day: moment().year(selectedDate.year).month(selectedDate.month + 1).date(selectedDate.date).day()
      })
      // setMonth(month + 1);
      setDaysInMonth(getMonthDays(selectedDate.month + 1))
      setFirstDay(getFirstDay(selectedDate.month + 1, selectedDate.year))
    }
  }

  return (
    <div>
      <Title titleMonth={monthNames[selectedDate.month]} titleYear={selectedDate.year} prevMonth={onPrevMonth} nextMonth={onNextMonth}/>
        <Month
          weekDays={dayNames}
          months={monthNames}
          monthDays={daysInMonth}
          firstDayInMonth={firstDay}
        />
    </div>
  )
}

export default Calendar;
