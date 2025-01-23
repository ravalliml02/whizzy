import React, { useState } from 'react';

// Main App Component
function App() {
  const [transcript, setTranscript] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [searchUrl, setSearchUrl] = useState('');

  // Start speech recognition
  const handleStartListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      extractKeywords(spokenText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  };

  // Extract keywords by removing common words
  const extractKeywords = (text) => {
    const stopWords = ['i', 'want', 'to', 'buy', 'a', 'with', 'and', 'for', 'the', 'is'];
    const words = text.toLowerCase().split(/\s+/);
    const filteredKeywords = words.filter(word => !stopWords.includes(word));
    setKeywords(filteredKeywords);
    generateSearchUrl(filteredKeywords);
  };

  // Generate search URL (example for Google)
  const generateSearchUrl = (keywords) => {
    const baseUrl = 'https://www.google.com/search?q=';
    const query = keywords.join('+');
    const url = `${baseUrl}${query}`;
    setSearchUrl(url);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Voice to Search Keyword Generator</h1>
      <button onClick={handleStartListening} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Start Speaking
      </button>
      <p><strong>Transcript:</strong> {transcript}</p>
      <p><strong>Keywords:</strong> {keywords.join(', ')}</p>
      {searchUrl && (
        <p>
          <strong>Search Link:</strong>{' '}
          <a href={searchUrl} target="_blank" rel="noopener noreferrer">
            Click to Search
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
