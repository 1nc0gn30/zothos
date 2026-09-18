import {
  Button,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { useState } from 'react'

const TOOLS = [
  { label: 'Nmap – Safe Scan', category: 'network', tool: 'nmap', preset: 'safe_scan' },
  { label: 'Nmap – Service Scan', category: 'network', tool: 'nmap', preset: 'service_scan' },
  { label: 'HTTPX – Basic', category: 'web', tool: 'httpx', preset: 'basic' },
  { label: 'Nikto – Vuln Scan (Queued)', category: 'web', tool: 'nikto', preset: 'vuln_scan' },
]

export default function HexStrikeForm({ onRun, loading }) {
  const [toolKey, setToolKey] = useState(TOOLS[0].label)
  const [target, setTarget] = useState('')
  const [flags, setFlags] = useState('')

  const selected = TOOLS.find(t => t.label === toolKey)

  function submit() {
    onRun({
      category: selected.category,
      tool: selected.tool,
      preset: selected.preset,
      target,
      flags,
    })
  }

  return (
    <Stack spacing={2}>
      <TextField
        select
        label="Tool"
        value={toolKey}
        onChange={e => setToolKey(e.target.value)}
      >
        {TOOLS.map(t => (
          <MenuItem key={t.label} value={t.label}>
            {t.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Target"
        placeholder="example.com or 8.8.8.8"
        value={target}
        onChange={e => setTarget(e.target.value)}
      />

      <TextField
        label="Extra flags"
        placeholder="-p 443,80 --open"
        value={flags}
        onChange={e => setFlags(e.target.value)}
      />

      <Button
        variant="contained"
        disabled={!target || loading}
        onClick={submit}
      >
        Run
      </Button>
    </Stack>
  )
}
