import { Box, Paper, TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';

export default function ChatMock() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to Nullai. This is a mock UI.' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input) return;
    setMessages([
      ...messages,
      { role: 'user', content: input },
      { role: 'assistant', content: '⏳ Model response will appear here.' },
    ]);
    setInput('');
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Box sx={{ mb: 2 }}>
        {messages.map((m, i) => (
          <Typography
            key={i}
            sx={{ mb: 1, color: m.role === 'user' ? 'primary.main' : 'text.primary' }}
          >
            <strong>{m.role}:</strong> {m.content}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type a prompt…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <Button variant="contained" onClick={send}>
          Send
        </Button>
      </Box>
    </Paper>
  );
}
