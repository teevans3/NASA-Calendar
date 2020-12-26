import React from 'react';
import classes from './Title.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Title = (props) => {
  const arrowLeft = <FontAwesomeIcon icon={faArrowLeft} className={classes.ArrowIcon} size="2x"/>
  const arrowRight = <FontAwesomeIcon icon={faArrowRight} className={classes.ArrowIcon} size="2x"/>

  return (
    <div className={classes.Title}>
      <button onClick={props.prevMonth} className={classes.ButtonPrev}>{arrowLeft}</button>
      <span>{props.titleMonth} {props.titleYear}</span>
      <button onClick={props.nextMonth} className={classes.ButtonNext}>{arrowRight}</button>
    </div>
  )
};

export default Title
