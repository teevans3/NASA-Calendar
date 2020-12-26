import React, { useState, useContext, useEffect } from 'react';
import DayInfo from '../DayInfo/DayInfo';
import classes from './Month.module.css';
import moment from 'moment';
import { CurrentDateContext } from '../../context/CurrentDateContext';
import { SelectedDateContext } from '../../context/SelectedDateContext';
import { EventsContext } from '../../context/EventsContext';

const Month = (props) => {

  const {currentDate, setCurrentDate} = useContext(CurrentDateContext);
  const {selectedDate, setSelectedDate} = useContext(SelectedDateContext);
  const {events, setEvents} = useContext(EventsContext);
  // store events for this specific month in state, retrieved from all events list state
  const [monthEvents, setMonthEvents] = useState([]);


  useEffect(() => {
    let relevantEvents = [];
    for (var i = 0; i < events.length; i++) {
      const monthStart = moment([selectedDate.year, selectedDate.month]);
      const monthEnd = moment(monthStart).endOf('month');
      const eventStart = moment(events[i].start);
      const eventEnd = moment(events[i].end);
      if (
        eventStart >= monthStart ||
        eventStart <= monthEnd ||
        eventEnd >= monthStart ||
        eventEnd <= monthEnd
      ) {
        relevantEvents.push(events[i]);
      };
    };
    setMonthEvents(relevantEvents);
  }, [selectedDate, events])
  // Function for changing DayInfo component when different day is clicked
  // can maybe move this directly to the JSX code??
  const onDateChange = (date) => {
    setSelectedDate({
      ...selectedDate,
      date: date,
      day: moment().year(selectedDate.year).month(selectedDate.month).date(date).day()
    });
  }

  // Create a list of weekday names
  const weekDays = props.weekDays.map((weekday) => {
    return <div className={classes.WeekDayContainer} key={weekday}>{weekday}</div>
  })

  // Create a list of all days (add empty, filler "days" so dates will align with weekdays)
  const dayNums = [];
  for (var i = 1; i <= props.monthDays; i++) {
    dayNums.push(i);
  }
  const emptyDays = [];
  for (var j = 0; j < props.firstDayInMonth; j++) {
    emptyDays.push(0);
  }
  const totalDays = emptyDays.concat(dayNums);
  // Also add empty days at end for styling purposes
  if (totalDays.length % 7 !== 0) {
    do {
      totalDays.push(0);
    } while (totalDays.length % 7 !== 0);
  }
  const days = totalDays.map((day, index) => {
    if (day === 0) {
      return <div className={classes.EmptyDayContainer} key={day - index}></div>
    }
    // create a list of all events for this day, will place a bar in the day box for number of events
    let eventBars = [];
    for (var i = 0; i < monthEvents.length; i++) {
      // if day exists within an event, give it an "eventbar" (just to show that an event exists in calendar)
      const calendarDateMom = moment([selectedDate.year, selectedDate.month, day]);
      const eventStartDateMom = moment(monthEvents[i].start);
      const eventEndDateMom = moment(monthEvents[i].end);
      if (
        calendarDateMom.diff(eventStartDateMom, 'days') >= 0 &&
        calendarDateMom.diff(eventEndDateMom, 'days') <= 0
      ) {
        let eventText = null;
        if (calendarDateMom.diff(eventStartDateMom) === 0) {
          eventText = monthEvents[i].title;
        }
        eventBars.push(<div className={classes.EventBar} key={`${monthEvents[i].title}+${day}`}>{eventText}</div>)
      }
    }
    if (day === selectedDate.date) {
      return <div className={classes.CurrentDayContainer} key={day} onClick={() => onDateChange(day)}>{day}{eventBars}</div>
    } else {
      return <div className={classes.DayContainer} key={day} onClick={() => onDateChange(day)}>{day}{eventBars}</div>
    }
  })

  return (
    <div>
      <div className={classes.MonthContainer}>
        <div className={classes.DaysContainer}>
          {weekDays}
          {days}
        </div>
      </div>
      <DayInfo
        date={selectedDate.date}
        month={selectedDate.month}
        year={selectedDate.year}
        day={selectedDate.day}
        currentDate={currentDate.date}
        currentMonth={currentDate.month}
        currentYear={currentDate.year}
        monthNames={props.months}
      />
    </div>
  )
}

export default Month;
