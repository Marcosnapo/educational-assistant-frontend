// src/App.jsx
// Componente principal de la aplicación "Asistente de Contenido Educativo para Padres".
// Frontend en React que se comunica con un backend FastAPI para resumir texto
// y extraer puntos clave, devolviéndolos en español e inglés.

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [summaryEs, setSummaryEs] = useState(null);
  const [summaryEn, setSummaryEn] = useState(null);
  // Nuevos estados para los puntos clave
  const [keyPointsEs, setKeyPointsEs] = useState([]);
  const [keyPointsEn, setKeyPointsEn] = useState([]);
  // Estado para controlar qué tipo de resultado se muestra
  const [resultType, setResultType] = useState(null); // 'summary' o 'key_points'

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [highContrast, setHighContrast] = useState(false);

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.fontFamily = fontFamily;
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [fontSize, fontFamily, highContrast]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value));
  };

  const handleFontFamilyChange = (e) => {
    setFontFamily(e.target.value);
  };

  const handleHighContrastChange = () => {
    setHighContrast(!highContrast);
  };

  // Función para limpiar resultados y establecer el tipo de resultado
  const resetResults = (type) => {
    setMessage('');
    setSummaryEs(null);
    setSummaryEn(null);
    setKeyPointsEs([]);
    setKeyPointsEn([]);
    setResultType(type);
  };

  const handleSummarize = async () => {
    resetResults('summary'); // Limpia y establece el tipo de resultado
    setIsLoading(true);

    if (!prompt.trim()) {
      setMessage('Por favor, ingresa el texto a resumir.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || `Error ${response.status}: ${response.statusText}`;
        setMessage(`Error al procesar el resumen: ${errorMessage}`);
        console.error('Error detallado del backend (summarize):', errorData);
        setIsLoading(false);
        return;
      }

      const result = await response.json();

      if (result.summary_es && result.summary_en) {
        setSummaryEs(result.summary_es);
        setSummaryEn(result.summary_en);
        setMessage('¡Resumen generado exitosamente en ambos idiomas!');
      } else {
        setMessage('Error: El backend no devolvió los resúmenes esperados.');
        console.error('Respuesta inesperada del backend (summarize):', result);
      }

    } catch (error) {
      console.error('Error de conexión o inesperado (summarize):', error);
      setMessage('Error de conexión con el backend. Asegúrate de que el servidor FastAPI esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Nueva función para obtener puntos clave
  const handleGetKeyPoints = async () => {
    resetResults('key_points'); // Limpia y establece el tipo de resultado
    setIsLoading(true);

    if (!prompt.trim()) {
      setMessage('Por favor, ingresa el texto para extraer los puntos clave.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/key-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || `Error ${response.status}: ${response.statusText}`;
        setMessage(`Error al procesar los puntos clave: ${errorMessage}`);
        console.error('Error detallado del backend (key-points):', errorData);
        setIsLoading(false);
        return;
      }

      const result = await response.json();

      if (Array.isArray(result.key_points_es) && Array.isArray(result.key_points_en)) {
        setKeyPointsEs(result.key_points_es);
        setKeyPointsEn(result.key_points_en);
        setMessage('¡Puntos clave generados exitosamente en ambos idiomas!');
      } else {
        setMessage('Error: El backend no devolvió los puntos clave esperados.');
        console.error('Respuesta inesperada del backend (key-points):', result);
      }

    } catch (error) {
      console.error('Error de conexión o inesperado (key-points):', error);
      setMessage('Error de conexión con el backend. Asegúrate de que el servidor FastAPI esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Asistente de Contenido Educativo para Padres</h1>

      {/* Controles de Accesibilidad */}
      <div className="accessibility-controls">
        <h3>Controles de Accesibilidad</h3>
        <div className="control-group">
          <label htmlFor="font-size-slider">Tamaño de Fuente:</label>
          <input
            type="range"
            id="font-size-slider"
            min="12"
            max="24"
            value={fontSize}
            onChange={handleFontSizeChange}
          />
          <span>{fontSize}px</span>
        </div>

        <div className="control-group">
          <label htmlFor="font-family-select">Tipo de Fuente:</label>
          <select id="font-family-select" value={fontFamily} onChange={handleFontFamilyChange}>
            <option value="Inter">Estándar (Inter)</option>
            <option value="Open Dyslexic">Dislexia (Open Dyslexic)</option>
            <option value="Lexend">Legible (Lexend)</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="high-contrast-toggle">Alto Contraste:</label>
          <input
            type="checkbox"
            id="high-contrast-toggle"
            checked={highContrast}
            onChange={handleHighContrastChange}
          />
        </div>
      </div>

      <div className="input-section">
        <textarea
          placeholder="Pega aquí el texto educativo que deseas procesar para ayudar a tu hijo/a (ej. un párrafo de un libro de texto, apuntes de clase)."
          value={prompt}
          onChange={handlePromptChange}
          rows="10"
        />
        <div className="button-group"> {/* Nuevo contenedor para los botones */}
          <button onClick={handleSummarize} disabled={isLoading}>
            {isLoading && resultType === 'summary' ? 'Generando Resumen...' : 'Generar Resumen Bilingüe'}
          </button>
          <button onClick={handleGetKeyPoints} disabled={isLoading}>
            {isLoading && resultType === 'key_points' ? 'Extrayendo Puntos...' : 'Extraer Puntos Clave Bilingües'}
          </button>
        </div>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="generated-content-section">
        {isLoading && <p>Cargando contenido...</p>}

        {/* Renderizado condicional basado en resultType */}
        {resultType === 'summary' && summaryEs && summaryEn && !isLoading && (
          <div className="summary-output-container">
            <div className="summary-column">
              <h3>Resumen en Español:</h3>
              <p>{summaryEs}</p>
            </div>
            <div className="summary-column">
              <h3>Summary in English:</h3>
              <p>{summaryEn}</p>
            </div>
          </div>
        )}

        {resultType === 'key_points' && keyPointsEs.length > 0 && keyPointsEn.length > 0 && !isLoading && (
          <div className="key-points-output-container"> {/* Nuevo contenedor para puntos clave */}
            <div className="key-points-column">
              <h3>Puntos Clave en Español:</h3>
              <ul>
                {keyPointsEs.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="key-points-column">
              <h3>Key Points in English:</h3>
              <ul>
                {keyPointsEn.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!resultType && !isLoading && !message && (
          <p>Tu resumen o puntos clave bilingües aparecerán aquí.</p>
        )}
      </div>
    </div>
  );
}

export default App;
