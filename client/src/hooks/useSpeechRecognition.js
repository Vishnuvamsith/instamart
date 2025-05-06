import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = (onTranscript) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const handleResult = useCallback((event) => {
    const transcript = event.results[0][0].transcript;
    console.log('Transcript received:', transcript);
    onTranscript(transcript);
    setIsRecording(false);
  }, [onTranscript]);

  const handleError = useCallback((event) => {
    console.error('Recognition error:', event.error);
    if (event.error !== 'aborted') {
      setError(`Speech error: ${event.error}`);
    }
    setIsRecording(false);
  }, []);

  const startRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition not supported');
      return false;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = handleResult;
      recognitionRef.current.onerror = handleError;
      recognitionRef.current.onend = () => {
        console.log('Recognition ended naturally');
        setIsRecording(false);
      };
    }

    try {
      recognitionRef.current.start();
      console.log('Recognition started successfully');
      setIsRecording(true);
      setError(null);
      return true;
    } catch (err) {
      console.error('Start error:', err);
      setError('Could not start microphone');
      return false;
    }
  }, [handleResult, handleError]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      console.log('Stopping recognition');
      recognitionRef.current.abort();
    }
    setIsRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }, [isRecording, startRecognition, stopRecognition]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        console.log('Cleaning up recognition');
        stopRecognition();
        recognitionRef.current = null;
      }
    };
  }, [stopRecognition]);

  return {
    isRecording,
    error,
    toggleRecording,
    startRecognition,
    stopRecognition
  };
};

export default useSpeechRecognition;