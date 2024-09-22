import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";


function App() {
  
  
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [filter, setFilter] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [Title, setTitle] = useState("");
  useEffect(() => {
    window.document.title = Title;
  }, [Title]);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const parsedJson = JSON.parse(jsonInput);
      console.log("Parsed JSON:", parsedJson);
      const res = await axios.post(
        "https://bfhl-depl-backend.vercel.app/bfhl",
        parsedJson
      );
      setResponse(res.data);
      setTitle(res.data.roll_number);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Invalid JSON or Server Error. Please try again.");
      setResponse(null);
    }
  };

  const handleFilterChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFilter(value);
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    return (
      <div className="response-section">
        <h3>Response Data</h3>
        {filter.includes("alphabets") && response.alphabets.length > 0 && (
          <div>
            <strong>Alphabets: </strong> {response.alphabets.join(", ")}
          </div>
        )}
        {filter.includes("numbers") && response.numbers.length > 0 && (
          <div>
            <strong>Numbers: </strong> {response.numbers.join(", ")}
          </div>
        )}
        {filter.includes("highest_lowercase_alphabet") &&
          response.highest_lowercase_alphabet.length > 0 && (
            <div>
              <strong>Highest Lowercase Alphabet: </strong>{" "}
              {response.highest_lowercase_alphabet.join(", ")}
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL Challenge</h1>

      <div className="input-section">
        <textarea
          placeholder="Enter valid JSON here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="json-input"
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="dropdown-section">
        <label htmlFor="filter">Select Data to Display:</label>
        <select id="filter" multiple onChange={handleFilterChange}>
          <option value="alphabets">Alphabets</option>
          <option value="numbers">Numbers</option>
          <option value="highest_lowercase_alphabet">
            Highest Lowercase Alphabet
          </option>
        </select>
      </div>

      {renderFilteredResponse()}
    </div>
  );
}

export default App;
