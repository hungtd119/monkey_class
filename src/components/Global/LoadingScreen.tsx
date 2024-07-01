import React from "react"
import styles from './LoadingScreen.module.scss';

const LoadingScreen = () => {
    return (
      <div className={`${styles.screen}`}>
        <div className={`${styles.lds_ellipsis}`}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
};

export default LoadingScreen;
