import React, { useState, useEffect, useContext } from 'react';
import classes from './Events.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {getOrdinal} from '../../helpers/CalendarFunctions';
import { ErrorContext } from '../../context/ErrorContext';
import { EventsContext } from '../../context/EventsContext';
import moment from 'moment';


const Event = (props) => {
  const {events, setEvents} = useContext(EventsContext);
  const [eventTitle, setEventTitle] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [newEventModal, setNewEventModal] = useState(false);
  const [newEventError, setNewEventError] = useState(false);
  const {error, setError} = useContext(ErrorContext);
  const [todayEvents, setTodayEvents] = useState([]);

  const windowClose = <FontAwesomeIcon icon={faWindowClose} className={classes.WindowClose} size="2x"/>
  const trashAlt = <FontAwesomeIcon icon={faTrashAlt} className={classes.TrashAlt} size="lg" />

  // Retrieve list of events for the day (updates whenever new date is selected);
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events'));
    if (storedEvents) {
      let dayEventsList = [];
      for (var i = 0; i < storedEvents.length; i++) {
        const eventStartMom = moment(storedEvents[i].start);
        const eventEndMom = moment(storedEvents[i].end);
        const currentMom = moment(props.officialDate);
        if (currentMom >= eventStartMom && currentMom <= eventEndMom) {
          dayEventsList.push(storedEvents[i]);
        }
      };
      setTodayEvents(dayEventsList);
    }
  }, [props.officialDate, events]);

  // Function for displaying event form
  const onEventModalDisplay = (val) => {
    if (val) {
      setNewEventModal(true);
    } else {
      setNewEventModal(false);
    }
  }
  // Functions to update event form
  // Can maybe add these directly to the JSX code??
  const onChangeTitle = (e) => {
    setEventTitle(e.target.value);
  }
  const onChangeEnd = (e) => {
    setEventEnd(e.target.value);
  }
  const onChangeDescription = (e) => {
    setEventDescription(e.target.value);
  }

  // Function to submit the new event (added to localstorage);
  const onSubmitEvent = () => {
    // Make sure all fields are filled out
    if (
      eventTitle.length < 1 ||
      !/\S/.test(eventTitle) ||
      eventDescription.length < 1 ||
      !/\S/.test(eventDescription) ||
      eventEnd === ''
    ) {
      setError({
        error: true,
        message: 'Please fill out all fields before creating an event.'
      });
      return;
    }

    const newEvent = {
      title: eventTitle,
      start: props.officialDate,
      end: eventEnd,
      description: eventDescription,
      id: Date.now()
    };
    // Update events list in local storage (all events)
    let newEventList = [];
    if (localStorage.getItem('events') !== null) {
      const storedEvents = JSON.parse(localStorage.getItem('events'));
      newEventList = storedEvents.concat(newEvent);
    } else {
      newEventList = [newEvent];
    }
    localStorage.setItem('events', JSON.stringify(newEventList));
    // Update events list for specific day (ones we've already retrieved);
    setEvents(events.concat(newEvent));
    // Hide the new event modal and reset new event states
    setNewEventModal(false);
    setEventTitle('');
    setEventEnd('');
    setEventDescription('');
  }

  // Function to delete an event
  const onRemoveEvent = (eventId) => {
    const updatedList = events;
    // Remove event from events list for specific day
    for (var i = 0; i < events.length; i++) {
      if (events[i].id === eventId) {
        updatedList.splice(i, 1);
      }
    }
    setEvents([...updatedList]);
    // Remove event from local storage events list (stores all events, regardless of day)
    const updatedListFull = JSON.parse(localStorage.getItem('events'));
    for (var i = 0; i < updatedListFull.length; i++) {
      if (updatedListFull[i].id === eventId) {
        updatedListFull.splice(i, 1);
      }
    }
    localStorage.setItem('events', JSON.stringify(updatedListFull));
  };

  const dayEvents = todayEvents.map(ev => {
    return (
      <li key={ev.id}>
        <div className={classes.ListDiv}>
          <div title={ev.description} className={classes.ListEvent}>{ev.title}</div>
          <div className={classes.ListBtnDiv}>
            <button onClick={() => onRemoveEvent(ev.id)}>{trashAlt}</button>
          </div>
        </div>
      </li>
    );
  })

  let newEventDisplay = <button className={classes.AddBtn} onClick={() => onEventModalDisplay(true)}>New Event</button>;
  if (newEventModal) {
    newEventDisplay = (
      <div className={classes.NewEventDiv}>
        <div className={classes.CloseDiv}>
          <button className={classes.CloseBtn} onClick={() => onEventModalDisplay(false)}>{windowClose}</button>
        </div>
        <div className={classes.TitleDiv}>
          <label for="title">Title</label>
          <input type="text" onChange={onChangeTitle} maxlength="60"/>
        </div>
        <div className={classes.DateDiv}>
          <div className={classes.StartDate}>
            <label for="start" >Start Date</label>
            <input type="date" id="start" value={props.officialDate} disabled/>
          </div>
          <div className={classes.EndDate}>
            <label for="end" >End Date</label>
            <input type="date" id="end" onChange={onChangeEnd} min={props.officialDate}/>
          </div>
        </div>
        <div className={classes.DescriptionDiv}>
          <label for="description" >Description</label>
          <textarea id="description" onChange={onChangeDescription}></textarea>
        </div>
        <button className={classes.SubmitBtn} onClick={onSubmitEvent}>Create</button>
      </div>
    )
  }

  return (
    <div className={classes.EventsDiv}>
      <div className={classes.OfficialDate}>
        <div className={classes.WeekDay}>{props.eventDay}</div>
        <div className={classes.Date}>{props.eventMonth} {props.eventDate}<sup>{getOrdinal(props.eventDate)}</sup> {props.eventYear}</div>
      </div>
      <div className={classes.EventsListDiv}>
        <ul className={classes.EventsList}>
          {dayEvents}
        </ul>
      </div>
      {newEventDisplay}
    </div>
  );
}

export default Event;
