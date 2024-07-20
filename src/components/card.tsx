import React from "react";
import styles from "../styles/Card.module.scss";

const Card = () => {
  return (
    <div className={styles.card}>
      {/* Inner Card */}
      <div className={styles.innercard}>
        {/* Image Container */}
        <div className={styles.imagecontainer}>
          {/* Placeholder Image */}
          <div className="image-placeholder w-8 h-8 bg-gray-200 rounded-full"></div>
          {/* Text Columns */}
          <div className={styles.textColumn}>
            <span className={styles.textPrimary}>Title</span>
            <span className={styles.textSecondary}>Subtitle</span>
          </div>
        </div>
      </div>

      {/* Progress Slider */}
      <div className={styles.progressSlider}></div>

      {/* Text in Border */}
      <div className={styles.textInBborder}>
        <span className={styles.textInBorderContent}>Text in Border</span>
      </div>

      {/* Buttons */}
      <div className={styles.buttons}>
        <button className={styles.button}>
          <span className={styles.buttonText}>Copy Link</span>
        </button>
        <button className={styles.button}>
          <span className={styles.buttonText}>Share</span>
        </button>
      </div>
    </div>
  );
};

export default Card;
