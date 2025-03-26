import React, { useState, useEffect, useRef } from 'react';

const TranscriptionPage = () => {
  const [transcript, setTranscript] = useState('');
  const ws = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  // Массив для накопления чанков аудио (каждый чанк – Float32Array)
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Создаем WebSocket соединение
    ws.current = new WebSocket('ws://localhost:8088/ws/transcription');

    ws.current.onopen = () => {
      console.log('Соединение WebSocket установлено');
      // Отправляем частоту дискретизации на сервер
      const sampleRate = audioContextRef.current.sampleRate;
      ws.current.send(JSON.stringify({ sampleRate }));
    };

    ws.current.onmessage = (event) => {
      console.log('Получено сообщение:', event.data);
      setTranscript(prev => prev + '\n' + event.data);
    };

    ws.current.onclose = () => {
      console.log('Соединение WebSocket закрыто');
    };

    // Запрашиваем доступ к микрофону и настраиваем AudioContext с частотой 16 кГц
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        streamRef.current = stream;
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });
        const source = audioContextRef.current.createMediaStreamSource(stream);
        // Используем ScriptProcessor для получения аудио данных
        const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

        source.connect(processor);
        processor.connect(audioContextRef.current.destination);

        // В обработчике накапливаем аудио данные в буфер
        processor.onaudioprocess = (e) => {
          const audioData = e.inputBuffer.getChannelData(0);
          // Создаем копию полученного чанка, чтобы избежать проблем с переиспользованием памяти
          const bufferCopy = new Float32Array(audioData);
          audioChunksRef.current.push(bufferCopy);
        };

        // Каждые 30 секунд отправляем накопленные аудио данные
        const intervalId = setInterval(() => {
          if (audioChunksRef.current.length > 0 && ws.current.readyState === WebSocket.OPEN) {
            // Определяем общий размер собранного буфера
            const totalLength = audioChunksRef.current.reduce((acc, chunk) => acc + chunk.length, 0);
            // Создаем единый массив для объединения всех чанков
            const combined = new Float32Array(totalLength);
            let offset = 0;
            audioChunksRef.current.forEach(chunk => {
              combined.set(chunk, offset);
              offset += chunk.length;
            });
            // Отправляем объединенный буфер как ArrayBuffer
            ws.current.send(combined.buffer);
            console.log(`Отправлено ${combined.length} сэмплов (30 секунд записи)`);
            // Очищаем буфер для накопления нового аудио
            audioChunksRef.current = [];
          }
        }, 30000); // 30000 мс = 30 секунд

        // Очистка ресурсов при размонтировании компонента
        return () => {
          clearInterval(intervalId);
          if (ws.current) ws.current.close();
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
          if (audioContextRef.current) audioContextRef.current.close();
        };
      })
      .catch(err => console.error('Ошибка доступа к микрофону:', err));
  }, []);

  return (
    <div>
      <h1>Транскрибация с Whisper в реальном времени</h1>
      <pre>{transcript}</pre>
    </div>
  );
};

export default TranscriptionPage;