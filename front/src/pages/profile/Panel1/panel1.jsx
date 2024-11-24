import React, { useState } from "react";
import styles from "./styles.module.scss";

function Panel1() {
  const [options, setOptions] = useState({
    milk: false,
    fitness: false,
    weightGain: false,
    health: false,
    geneticValue: false,
  });

  const handleCheckboxChange = (key) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderSlider = (key, min, max, step = 1) => (
    <div className={styles.sliderContainer}>
      <input
        type="range"
        min={0}
        max={4}
        step={step}
        defaultValue={0}
        className={styles.slider}
      />
      <div className={styles.sliderLabels}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  return (
    <div className={styles.panel1}>
      <h3>Приорететные качества</h3>
      <div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={options.milk}
            onChange={() => handleCheckboxChange("milk")}
            className={styles.customCheckbox}
          />
          Удой л/день
        </label>
        {options.milk && renderSlider("milk", 0, 1)}
      </div>

      <div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={options.fitness}
            onChange={() => handleCheckboxChange("fitness")}
            className={styles.customCheckbox}
          />
          Упитанность
        </label>
        {options.fitness && renderSlider("fitness", 0, 1)}
      </div>

      <div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={options.weightGain}
            onChange={() => handleCheckboxChange("weightGain")}
            className={styles.customCheckbox}
          />
          Прирост веса кг/день
        </label>
        {options.weightGain && renderSlider("weightGain", 0, 1)}
      </div>

      <div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={options.health}
            onChange={() => handleCheckboxChange("health")}
            className={styles.customCheckbox}
          />
          Здоровье (1-10)
        </label>
        {options.health && renderSlider("health", 0, 1)}
      </div>

      <div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={options.geneticValue}
            onChange={() => handleCheckboxChange("geneticValue")}
            className={styles.customCheckbox}
          />
          Генетическая ценность (баллы)
        </label>
        {options.geneticValue && renderSlider("geneticValue", 0, 1)}
      </div>
    </div>
  );
}

export default Panel1;
