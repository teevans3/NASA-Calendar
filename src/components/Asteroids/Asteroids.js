import React from 'react';
import classes from './Asteroids.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'

const Asteroids = (props) => {
  const windowClose = <FontAwesomeIcon icon={faWindowClose} size="2x" className={classes.WindowClose}/>

  let asteroidsList = [];
  if (props.asteroidsList.length > 0) {
    asteroidsList = props.asteroidsList.map(ast => {
      return (
        <li key={ast.id}>
          <a
            href={ast.url}
            target="_blank"
            title={`Diameter range: ${ast.diameterMin.toFixed(2)} ft. - ${ast.diameterMax.toFixed(2)} ft.`}>
            {ast.name}
          </a>
        </li>
      );
    });
  }
  return (
    <div className={classes.AsteroidsContainer}>
      <div className={classes.AsteroidsDiv}>
        <div className={classes.CloseDiv}>
          <button onClick={props.closeAst} className={classes.CloseBtn}>{windowClose}</button>
        </div>
        <ul className={classes.AsteroidsList}>
          {asteroidsList}
        </ul>
      </div>
    </div>
  )
}

export default Asteroids;
