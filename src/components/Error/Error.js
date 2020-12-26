import React, { useContext } from 'react';
import { ErrorContext } from '../../context/ErrorContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import classes from './Error.module.css';


const Error = (props) => {
  const {error, setError} = useContext(ErrorContext);

  const windowClose = <FontAwesomeIcon icon={faWindowClose} className={classes.WindowClose} size="2x"/>;

  const closeError = () => {
    setError({
      error: false,
      message: ''
    })
  }

  if (error) {
    window.scrollTo(0,document.body.scrollHeight);
  }

  return (
    <div className={classes.ErrorModal}>
      <div className={classes.ErrorDiv}>
        <div className={classes.CloseDiv}>
          <button onClick={closeError} className={classes.CloseBtn}>{windowClose}</button>
        </div>
        <div className={classes.MsgDiv}>
          {props.message}
        </div>
      </div>
    </div>
  )
}

export default Error;
