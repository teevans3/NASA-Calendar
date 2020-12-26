import logo from './logo.svg';
import './App.css';
import Calendar from './components/Calendar/Calendar';
import Header from './components/Header/Header';
import { CurrentDateContext } from './context/CurrentDateContext';
import { SelectedDateContext } from './context/SelectedDateContext';
import { EventsContext } from './context/EventsContext';
import { ErrorContext } from './context/ErrorContext';
import React, { useState, useMemo } from 'react';

// Create a dictionary of current date
const today = new Date();

const currentDateObj = {
  day: today.getDay(),
  date: today.getDate(),
  month: today.getMonth(),
  year: today.getFullYear()
}

const errorObj = {
  error: false,
  message: ''
};

let eventsList = []
// retrieve list of events from local storage
if (localStorage.getItem('events') !== null) {
  eventsList = JSON.parse(localStorage.getItem('events'));
};

function App() {
  // Note: both current date and selected date start off the same
  const [currentDate, setCurrentDate] = useState(currentDateObj);
  const [selectedDate, setSelectedDate] = useState(currentDateObj);
  const [events, setEvents] = useState(eventsList);
  const [error, setError] = useState(errorObj);


  const currentProviderValue = useMemo(() => ({ currentDate, setCurrentDate}), [currentDate, setCurrentDate]);
  const selectedProviderValue = useMemo(() => ({ selectedDate, setSelectedDate}), [selectedDate, setSelectedDate]);
  const eventsProviderValue = useMemo(() => ({ events, setEvents}), [events, setEvents]);
  const errorProviderValue = useMemo(() => ({ error, setError }), [error, setError]);

  return (
    <div className="App">
      <ErrorContext.Provider value={errorProviderValue}>
        <CurrentDateContext.Provider value={currentProviderValue}>
          <SelectedDateContext.Provider value={selectedProviderValue}>
            <Header />
            <EventsContext.Provider value={eventsProviderValue}>
              <Calendar />
            </EventsContext.Provider>
          </SelectedDateContext.Provider>
        </CurrentDateContext.Provider>
      </ErrorContext.Provider>
    </div>
  );
}

export default App;
