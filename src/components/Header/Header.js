import React, { useContext } from 'react';
import classes from './Header.module.css';
import { CurrentDateContext } from '../../context/CurrentDateContext';
import { SelectedDateContext } from '../../context/SelectedDateContext';
import {monthNames, dayNames} from '../../storage/NamesList';
import {getOrdinal} from '../../helpers/CalendarFunctions';


const Header = () => {
  const {currentDate, setCurrentDate} = useContext(CurrentDateContext);
  const {selectedDate, setSelectedDate} = useContext(SelectedDateContext);

  let sameDay = true;
  if (
    currentDate.date !== selectedDate.date ||
    currentDate.month !== selectedDate.month ||
    currentDate.year !== selectedDate.year
  ) {
    sameDay = false;
  };

  // Function to take user to current date
  const changeToToday = () => {
    const todayObj = {
      day: currentDate.day,
      date: currentDate.date,
      month: currentDate.month,
      year: currentDate.year
    }
    setSelectedDate(todayObj);
  }

  return (
    <div className={classes.Header}>
      <div className={classes.HeaderLeft}>
        <span>My Space-Calendar</span>
      </div>
      <div className={classes.HeaderRight}>
        <div className={classes.HeaderToday}>
          <span>Today is</span> <b>{dayNames[currentDate.day]}, {monthNames[currentDate.month]} {currentDate.date}<sup>{getOrdinal(currentDate.date)}</sup> {currentDate.year}</b>
        </div>
        <div className={classes.HeaderChangeBtn}>
          <button disabled={sameDay ? true : false} onClick={changeToToday} className={classes.TodayBtn}>Take me there</button>
        </div>
      </div>

    </div>
  )
};

export default Header;
