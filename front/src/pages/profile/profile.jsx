import React, { useState } from "react";
import * as XLSX from "xlsx";
import styles from "./styles.module.scss";
import Header from "../../providers/layout/header.jsx";

function Profile() {
  // Состояния для таблиц
  const [tableData, setTableData] = useState({ cows: [], muts: [] });
  const [headers, setHeaders] = useState({ cows: [], muts: [] });
  const [editingCell, setEditingCell] = useState({ cows: { rowIndex: null, colIndex: null }, muts: { rowIndex: null, colIndex: null } });

  // Состояние для текущего режима (между коровами и мутациями)
  const [mode, setMode] = useState("mode1");

  // Функция для переключения между таблицами
  const toggleMode = () => {
    setMode(mode === "mode1" ? "mode2" : "mode1");
  };

  // Функция для обработки загрузки файлов
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const abuf = event.target.result;
        const workbook = XLSX.read(abuf, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        setHeaders(prevHeaders => ({ ...prevHeaders, [type]: data[0] }));
        setTableData(prevData => ({ ...prevData, [type]: data.slice(1) }));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Функция для обновления данных таблицы
  const updateCellData = (rowIndex, colIndex, value) => {
    const updatedData = [...tableData[mode === "mode1" ? "cows" : "muts"]];
    updatedData[rowIndex][colIndex] = value;
    setTableData(prevData => ({ ...prevData, [mode === "mode1" ? "cows" : "muts"]: updatedData }));
  };

  // Функция для рендеринга ячеек таблицы
  const renderCell = (value, rowIndex, colIndex) => {
    const currentEditingCell = editingCell[mode === "mode1" ? "cows" : "muts"];
    const isEditing = currentEditingCell.rowIndex === rowIndex && currentEditingCell.colIndex === colIndex;

    return isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => updateCellData(rowIndex, colIndex, e.target.value)}
        onBlur={() => setEditingCell(prev => ({ ...prev, [mode === "mode1" ? "cows" : "muts"]: { rowIndex: null, colIndex: null } }))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditingCell(prev => ({ ...prev, [mode === "mode1" ? "cows" : "muts"]: { rowIndex: null, colIndex: null } }));
          }
        }}
        autoFocus
      />
    ) : (
      <span onDoubleClick={() => setEditingCell(prev => ({ ...prev, [mode === "mode1" ? "cows" : "muts"]: { rowIndex, colIndex } }))}>
        {value || "—"}
      </span>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        
        {tableData[mode === "mode1" ? "cows" : "muts"].length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  {headers[mode === "mode1" ? "cows" : "muts"].map((header, index) => (
                    <th key={index}>{header || "—"}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData[mode === "mode1" ? "cows" : "muts"].map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((value, colIndex) => (
                      <td key={colIndex}>
                        {renderCell(value, rowIndex, colIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.buttonsContainer}>
          <div className={styles.uploadWrapper}>
            <label htmlFor="file-upload-cows" className={styles.uploadButton}>Загрузить список коров</label>
            <input
              id="file-upload-cows"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileUpload(e, "cows")}
              className={styles.uploadInput}
            />
          </div>

          <div className={styles.uploadWrapper}>
            <label htmlFor="file-upload-muts" className={styles.uploadButton}>Загрузить список мутаций</label>
            <input
              id="file-upload-muts"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileUpload(e, "muts")}
              className={styles.uploadInput}
            />
          </div>

          <button className={styles.buttonStyle} onClick={toggleMode}>
            {mode === "mode1" ? "Коровы" : "Мутации"}
          </button>
        </div>

        
          {/* Панели справа */}
        <div className={styles.panelWrapper}>
          {/* Первая панель */}
          <div className={styles.panel1}>
            <h3>Информация 1</h3>
            <p>Здесь может быть любая информация для первой панели. Прокрутка будет включена, если контент будет слишком большим.</p>
            <p>Текст на панели будет прокручиваться.</p>
          </div>

          {/* Вторая панель */}
          <div className={styles.panel2}>
            <h3>Информация 2</h3>
            <p>Здесь может быть любая информация для второй панели. Она будет иметь такую же прокрутку, если контент будет превышать её высоту.</p>
            <p>Текст на второй панели также будет прокручиваться.</p>
          </div>
        </div>
        
      </div>
    </>
  );
}

export default Profile;
