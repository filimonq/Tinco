import React, { useState } from 'react';
import * as XLSX from 'xlsx';  // Импортируем библиотеку для работы с Excel
import styles from './styles.module.scss'; // Ваши стили
import Header from '../../providers/layout/header.jsx';

function Profile() {
  const [tableData, setTableData] = useState([]); // Состояние для данных таблицы

  // Обработчик для загрузки и чтения Excel файла
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Чтение данных Excel файла
        const abuf = event.target.result;
        const workbook = XLSX.read(abuf, { type: 'array' });

        // Получение первого листа из Excel файла
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Преобразуем данные из листа в формат JSON
        const data = XLSX.utils.sheet_to_json(worksheet);
        setTableData(data); // Обновляем состояние с новыми данными
      };
      reader.readAsArrayBuffer(file); // Чтение файла как ArrayBuffer
    }
  };

  // Обработчик для загрузки Excel файла
  const handleFileInputChange = (e) => {
    handleFileUpload(e);
  };

  // Функция для безопасного отображения пустых ячеек
  const renderCellValue = (value) => {
    return value === undefined || value === null || value === '' ? '—' : value;
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* Отображаем таблицу, если данные есть */}
        {tableData.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  {Object.keys(tableData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{renderCellValue(value)}</td>  
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Кнопка загрузки файла под таблицей */}
        <div className={styles.uploadWrapper}>
          {/* Кастомная кнопка для загрузки файла */}
          <label htmlFor="file-upload" className={styles.uploadButton}>
            Загрузить файл
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileInputChange}
            className={styles.uploadInput}
          />
        </div>

      </div>
    </>
  );
}

export default Profile;
