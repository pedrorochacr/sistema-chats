import React, { useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

export const Chat = () => {
  const [msgs, setMsgs] = useState<string[]>([]);
  const [txt, setTxt] = useState('');
  const wsRef = useRef<ReconnectingWebSocket|null>(null);

  useEffect(() => {
    const ws = new ReconnectingWebSocket('ws://localhost:8080');
    wsRef.current = ws;
    ws.onmessage = e => setMsgs(m=>[...m,e.data]);
    ws.onopen = () => console.log('Conectado ao bridge');
    return () => ws.close();
  }, []);

  const onSend = () => {
    if (txt.trim()) {
      wsRef.current?.send(txt);
      setTxt('');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto' }}>
      <h2>Chat TCP via WebSocket</h2>
      <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'auto', padding: 8 }}>
        {msgs.map((m,i)=><div key={i}>{m}</div>)}
      </div>
      <input
        value={txt}
        onChange={e=>setTxt(e.target.value)}
        onKeyDown={e=>e.key==='Enter'&&onSend()}
        placeholder="Digite algo..."
      />
      <button onClick={onSend}>Enviar</button>
    </div>
  );
};
