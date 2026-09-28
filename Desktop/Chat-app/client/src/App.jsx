import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import './App.css';

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!joined) return;
    fetch(API_URL + '/api/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => setError('Could not load chat history'));
  }, [joined]);

  useEffect(() => {
    function onNewMessage(message) {
      setMessages((prev) => [...prev, message]);
    }
    socket.on('message:new', onNewMessage);
    return () => socket.off('message:new', onNewMessage);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function join(e) {
    e.preventDefault();
    if (username.trim()) setJoined(true);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await fetch(API_URL + '/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, text: text.trim() }),
      });
      if (!res.ok) throw new Error('Request failed');
      setText("");
      setError("");
    } catch {
      setError('Message could not be sent. Is the server running?');
    }
  }

  if (!joined) {
    return (
      <div className="join-screen">
        <form className="join-card" onSubmit={join}>
          <h1>Real-Time Chat</h1>
          <p>Enter a username to join</p>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" maxLength={20} />
          <button type="submit">Join chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-screen">
      <header className="chat-header">
        <h1>Real-Time Chat</h1>
        <span className="me">You are {username}</span>
      </header>

      <main className="messages">
        {messages.map((m) => (
          <div key={m.id ?? m._id} className={m.username === username ? 'msg own' : 'msg'}>
            <span className="msg-user">{m.username}</span>
            <p className="msg-text">{m.text}</p>
            <span className="msg-time">
              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {error && <p className="error">{error}</p>}

      <form className="composer" onSubmit={sendMessage}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;