import React, { useState, useEffect, useContext } from 'react';
import Events from '../Events/Events';
import Error from '../Error/Error';
import classes from './DayInfo.module.css';
import moment from 'moment';
import Asteroids from '../Asteroids/Asteroids';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMeteor } from '@fortawesome/free-solid-svg-icons'
import { ErrorContext } from '../../context/ErrorContext';
import {dayNames} from '../../storage/NamesList';
import dotenv from 'dotenv';

dotenv.config();

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;

const DayInfo = (props) => {
  const [apodURL, setApodURL] = useState('');
  const [apodExp, setApodExp] = useState('');
  const [asteroidsList, setAsteroidsList] = useState([]);
  const [displayAsteroids, setDisplayAsteroids] = useState(false);
  // officialDate IS the selected date, but stored as string (e.g. "2020-09-28")
  // rather than an object.
  const [officialDate, setOfficialDate] = useState();
  // Determines if the selected(official) date is in the future
  const [officialDateInFuture, setOfficialDateInFuture] = useState(false);
  const {error, setError} = useContext(ErrorContext);


  const meteor = <FontAwesomeIcon icon={faMeteor} className={classes.MeteorIcon} size="2x"/>

  // retrieve NASA photo of the day and list of asteroids (based on their closest approach date to earth)
  useEffect(() => {
    // update date and month numbers for url query
    let dateNum = props.date;
    if (dateNum < 10) {
      dateNum = `0${props.date}`;
    }
    let monthNum = props.month + 1;
    if (monthNum < 10) {
      monthNum = `0${props.month}`;
    }
    const officialDate = `${props.year}-${monthNum}-${dateNum}`;
    // If selected date is in future, only fetch asteroids list; else fetch both asteroids list and APOD
    const curDate = moment([props.currentYear, props.currentMonth, props.currentDate]);
    const selDate = moment([props.year, props.month, props.date]);
    if (curDate.diff(selDate) < 0) {
      setOfficialDateInFuture(true);
      fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${officialDate}&end_date=${officialDate}&api_key=${NASA_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          if (data.near_earth_objects[officialDate] !== null) {
            const selectedDayAsteroids = [];
            for (var i = 0; i < data.near_earth_objects[officialDate].length; i++) {
              selectedDayAsteroids.push({
                id: data.near_earth_objects[officialDate][i].id,
                name: data.near_earth_objects[officialDate][i].name,
                url: data.near_earth_objects[officialDate][i].nasa_jpl_url,
                dangerous: data.near_earth_objects[officialDate][i].is_potentially_hazardous_asteroid,
                diameterMin: data.near_earth_objects[officialDate][i].estimated_diameter.feet.estimated_diameter_min,
                diameterMax: data.near_earth_objects[officialDate][i].estimated_diameter.feet.estimated_diameter_max
              })
            }
            setAsteroidsList(selectedDayAsteroids);
          }
        })
        .catch(err => {
          console.log(err);
          setError({error: true, message: 'There was a problem with your API request.'})
        })
        setOfficialDate(officialDate);
    } else {
      fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${officialDate}`)
        .then(response => response.json())
        .then(data => {
          setApodURL(data.url);
          setApodExp(data.explanation);
        })
        .catch(err => {
          setError({error: true, message: 'There was a problem with your API request.'})
        })
        fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${officialDate}&end_date=${officialDate}&api_key=${NASA_API_KEY}`)
          .then(response => response.json())
          .then(data => {
            if (data.near_earth_objects[officialDate] !== null) {
              const selectedDayAsteroids = [];
              for (var i = 0; i < data.near_earth_objects[officialDate].length; i++) {
                selectedDayAsteroids.push({
                  id: data.near_earth_objects[officialDate][i].id,
                  name: data.near_earth_objects[officialDate][i].name,
                  url: data.near_earth_objects[officialDate][i].nasa_jpl_url,
                  dangerous: data.near_earth_objects[officialDate][i].is_potentially_hazardous_asteroid,
                  diameterMin: data.near_earth_objects[officialDate][i].estimated_diameter.feet.estimated_diameter_min,
                  diameterMax: data.near_earth_objects[officialDate][i].estimated_diameter.feet.estimated_diameter_max
                })
              }
              setAsteroidsList(selectedDayAsteroids);
            }
          })
          .catch(err => {
            setError({error: true, message: 'There was a problem with your API request.'})
          })
          setOfficialDate(officialDate);
    }
    return () => {
      setOfficialDateInFuture(false);
    }
  }, [props.date, props.month]);


  let dayImage = (
    <img
      src={apodURL}
      title={apodExp}
      alt="No image available."
      className={officialDateInFuture ? classes.EmptyImg : classes.ApodImg}
    />
  );
  // If date is in future, give it an empty image
  if (officialDateInFuture) {
    dayImage = <div className={classes.EmptyImg}></div>;
  }
  // If APOD is actually a video, make it a video tag
  if (apodURL.includes('youtube')) {
    dayImage = (
      <video className={classes.ApodVid} src={apodURL} type="video/mp4" autoplay loop />
    )
  }


  let displayAstDiv = <button onClick={() => setDisplayAsteroids(!displayAsteroids)} className={classes.OpenBtn}>{meteor}</button>;
  if (displayAsteroids) {
    displayAstDiv = <Asteroids asteroidsList={asteroidsList} closeAst={() => setDisplayAsteroids(!displayAsteroids)}/>;
  }


  return (
    <div className={classes.DayInfo}>
      {error.error ? <Error message={error.message} /> : null}
      <div className={officialDateInFuture ? classes.EmptyDiv : classes.ApodDiv}>
        <div className={classes.AsteroidsDiv}>
          {displayAstDiv}
        </div>
        {dayImage}
      </div>
      <Events
        // eventList={dayEvents}
        eventDay={dayNames[props.day]}
        eventDate={props.date}
        eventMonth={props.monthNames[props.month]}
        eventYear={props.year}
        officialDate={officialDate}
      />

    </div>
  )
}

export default DayInfo
