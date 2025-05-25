import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/save', { text });
      setText('');
      alert('Text saved successfully!');
    } catch (error) {
      console.error('Error saving text:', error);
      alert('Failed to save text. Please try again.');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>A New Beginning</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="text-input"
          />
          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default App; 