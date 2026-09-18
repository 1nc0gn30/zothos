import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

export default function SmtpSettings({ open, onClose }) {
  const [form, setForm] = useState({ server: '', port: 465, user: '', password: '' });

  const save = async () => {
    await axios.post('http://localhost:8000/api/config/smtp', form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Configure SMTP Engine</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="SMTP Server (e.g. smtp.gmail.com)" fullWidth onChange={e => setForm({...form, server: e.target.value})} />
          <TextField label="Port" type="number" fullWidth defaultValue={465} onChange={e => setForm({...form, port: e.target.value})} />
          <TextField label="Username / Email" fullWidth onChange={e => setForm({...form, user: e.target.value})} />
          <TextField label="Password / App Secret" type="password" fullWidth onChange={e => setForm({...form, password: e.target.value})} />
          <Button variant="contained" color="success" onClick={save}>Save Credentials</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}