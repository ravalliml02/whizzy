import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";

const VoiceSearch = () => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser doesn't support speech recognition.</p>;
  }

  const handleSearch = async () => {
    if (!transcript.trim()) {
      alert("Please say something to search.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/process-query", {
        query: transcript,
      });

      const sortedResults = response.data.results.sort((a, b) => a.price - b.price);
      setResults(sortedResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
      resetTranscript();
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Voice Search App</h1>
      <button onClick={SpeechRecognition.startListening}>🎤 Start Speaking</button>
      <button onClick={SpeechRecognition.stopListening}>⏹ Stop</button>
      <button onClick={handleSearch} disabled={loading}>
        🔍 Search
      </button>
      <p><strong>Your Query:</strong> {transcript}</p>
      {loading && <p>Loading results...</p>}
      {results.length > 0 && (
        <div>
          <h2>Results:</h2>
          <ul>
            {results.map((item, index) => (
              <li key={index}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.name} - ${item.price}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;
