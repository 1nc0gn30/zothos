import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Slider, Stack, Chip, Button } from '@mui/material';

const NeuronCanvas = ({
  temperature = 0.7,
  topP = 0.9,
  activeHead = 0,
  isProcessing = false,
  themeColor = '#1fb6ff',
}) => {
  const canvasRef = useRef(null);
  const [selectedNeuron, setSelectedNeuron] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let width = (canvas.width = canvas.parentElement.clientWidth || 800);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    // Layer definitions
    const layers = [
      { name: 'Input Tokens', count: 5, x: 0.12, nodes: [] },
      { name: 'Self-Attention', count: 8, x: 0.35, nodes: [] },
      { name: 'Feed-Forward MLP', count: 12, x: 0.62, nodes: [] },
      { name: 'Softmax / Logits', count: 5, x: 0.88, nodes: [] },
    ];

    // Initialize node positions & activations
    layers.forEach((layer) => {
      layer.nodes = [];
      const stepY = height / (layer.count + 1);
      for (let i = 0; i < layer.count; i++) {
        layer.nodes.push({
          id: `${layer.name}-${i}`,
          layerName: layer.name,
          index: i,
          x: layer.x * width,
          y: stepY * (i + 1),
          baseActivation: 0.3 + Math.random() * 0.7,
          activation: 0.5,
          gradient: (Math.random() * 0.08 - 0.04).toFixed(4),
          head: i % 8,
        });
      }
    });

    // Synaptic pulses
    let pulses = [];
    const createPulse = () => {
      const startLayerIdx = Math.floor(Math.random() * (layers.length - 1));
      const startLayer = layers[startLayerIdx];
      const endLayer = layers[startLayerIdx + 1];
      const startNode = startLayer.nodes[Math.floor(Math.random() * startLayer.nodes.length)];
      const endNode = endLayer.nodes[Math.floor(Math.random() * endLayer.nodes.length)];

      pulses.push({
        x: startNode.x,
        y: startNode.y,
        targetX: endNode.x,
        targetY: endNode.y,
        progress: 0,
        speed: 0.018 + Math.random() * 0.02,
        weight: (Math.random() * 2 - 1) * (1 / (temperature + 0.1)),
      });
    };

    let tick = 0;

    const render = () => {
      animationId = requestAnimationFrame(render);
      tick++;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid
      ctx.strokeStyle = 'rgba(31, 182, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Random pulse spawning
      if (Math.random() < (isProcessing ? 0.45 : 0.15)) {
        createPulse();
      }

      // Update and draw Synapses
      for (let l = 0; l < layers.length - 1; l++) {
        const currentL = layers[l];
        const nextL = layers[l + 1];

        currentL.nodes.forEach((n1, idx1) => {
          nextL.nodes.forEach((n2, idx2) => {
            // Synapse weight based on temperature and attention head
            const weightVal = Math.sin(idx1 * 1.5 + idx2 * 2.1 + activeHead + tick * 0.015);
            const isHeadActive = n1.head === activeHead || n2.head === activeHead;

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);

            if (isHeadActive) {
              ctx.strokeStyle = weightVal > 0 ? 'rgba(0, 240, 255, 0.18)' : 'rgba(255, 0, 100, 0.14)';
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
              ctx.lineWidth = 0.6;
            }
            ctx.stroke();
          });
        });
      }

      // Update and render pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed * (isProcessing ? 1.8 : 1.0);
        p.x = p.x + (p.targetX - p.x) * p.speed * 2;
        p.y = p.y + (p.targetY - p.y) * p.speed * 2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.weight > 0 ? '#00f0ff' : '#ff0077';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.progress >= 1 || Math.hypot(p.targetX - p.x, p.targetY - p.y) < 6) {
          pulses.splice(i, 1);
        }
      }

      // Draw Nodes
      layers.forEach((layer) => {
        // Layer label
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '10px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(layer.name.toUpperCase(), layer.x * width, 20);

        layer.nodes.forEach((node) => {
          // Calculate dynamic activation modulated by temperature and tick
          const pulseNoise = Math.sin(tick * 0.05 + node.index * 0.8) * 0.2;
          const dynamicAct = Math.min(1, Math.max(0.1, node.baseActivation + pulseNoise * (temperature / 1.0)));
          node.activation = dynamicAct;

          const isSelected = selectedNeuron?.id === node.id;
          const radius = isSelected ? 8 : 5.5;

          // Glow halo
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = node.head === activeHead
            ? `rgba(0, 240, 255, ${0.12 * dynamicAct})`
            : `rgba(125, 211, 252, ${0.05 * dynamicAct})`;
          ctx.fill();

          // Node core
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? '#ffffff'
            : node.head === activeHead
            ? `rgba(0, 240, 255, ${0.4 + dynamicAct * 0.6})`
            : `rgba(31, 182, 255, ${0.25 + dynamicAct * 0.4})`;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = isSelected ? 16 : 6 * dynamicAct;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Border
          ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
    };

    render();

    // Click handler for node selection
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let found = null;
      layers.forEach((l) => {
        l.nodes.forEach((n) => {
          if (Math.hypot(n.x - clickX, n.y - clickY) < 15) {
            found = n;
          }
        });
      });

      setSelectedNeuron(found);
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleClick);
    };
  }, [temperature, topP, activeHead, isProcessing, themeColor]);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 360,
          background: 'rgba(5, 7, 13, 0.85)',
          borderRadius: 8,
          border: '1px solid rgba(31, 182, 255, 0.2)',
          cursor: 'pointer',
        }}
      />

      {/* Selected Neuron Inspector Floating Card */}
      {selectedNeuron && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            p: 1.5,
            bgcolor: 'rgba(11, 18, 32, 0.95)',
            border: '1px solid #1fb6ff',
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            maxWidth: 240,
            zIndex: 10,
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#1fb6ff', fontWeight: 700 }}>
              [{selectedNeuron.id.toUpperCase()}]
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#fff' }}>
              Layer: <strong>{selectedNeuron.layerName}</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Activation: <strong style={{ color: '#00ff88' }}>{selectedNeuron.activation.toFixed(4)}</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Gradient Norm: <strong style={{ color: '#ffaa00' }}>{selectedNeuron.gradient}</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Attention Head: <strong>Head {selectedNeuron.head}</strong>
            </Typography>
            <Button
              size="small"
              variant="text"
              sx={{ fontSize: '0.65rem', color: '#1fb6ff', p: 0, justifyContent: 'flex-start', mt: 0.5 }}
              onClick={() => setSelectedNeuron(null)}
            >
              Close Inspector ✕
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default NeuronCanvas;
