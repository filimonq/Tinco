import React, { useState } from "react";
import styles from "./styles.module.scss";

function Panel2({ breeds }) {
  const [values, setValues] = useState({
    milk: { min: 0, max: 100 },
    fitness: { min: 0, max: 5 },
    weightGain: { min: 0, max: 5 },
    health: { min: 1, max: 10 },
    geneticValue: { min: 0, max: 100 },
    inbreeding: { min: 0, max: 100 },
  });
  const [selectedBreed, setSelectedBreed] = useState(breeds[0]);

  // Обработчик изменения значения для min или max
  const handleValueChange = (key, type) => (event) => {
    const value = event.target.value;
    setValues((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value,
      },
    }));
  };

  // Функция рендеринга параметра с полями ввода
  const renderParameter = (key, min, max) => {
    const param = values[key] || { min: 0, max: 0 }; // Дефолтное значение для param
    return (
      <div className={styles.parameter}>
        <span>{key}</span>
        <div className={styles.valueContainer}>
          <label>
            от 
            <input
              type="number"
              min={min}
              max={max}
              value={param.min}
              onChange={handleValueChange(key, "min")}
            />
          </label>
          <label>
            до 
            <input
              type="number"
              min={min}
              max={max}
              value={param.max}
              onChange={handleValueChange(key, "max")}
            />
          </label>
        </div>
      </div>
    );
  };

  // Обработчик выбора породы
  const handleBreedChange = (event) => {
    setSelectedBreed(event.target.value);
  };

  return (
    <div className={styles.panel2}>
      <h3>Ограничения</h3>

      <div>
        {renderParameter("Удой л/день", 0, 10)}
        {renderParameter("Упитанность", 0, 10)}
        {renderParameter("Прирост веса кг/день", 0, 10)}
        {renderParameter("Здоровье", 1, 10)}
        {renderParameter("Генетическая ценность (баллы)", 0, 100)}
        {renderParameter("Инбридинг", 0, 100)}
      </div>

      {/* Выбор породы */}
      <div className={styles.selectBreed}>
        <label htmlFor="breed">Выберите породу:</label>
        <select
          id="breed"
          value={selectedBreed}
          onChange={handleBreedChange}
        >
          {breeds.map((breed, index) => (
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Panel2;
