import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import {
  Camera, RefreshCw, Zap, ShieldAlert, CheckCircle2, AlertTriangle, Loader2,
  KeyRound, Upload, Volume2, VolumeX, Sparkles, HelpCircle, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyzeBud, ScanResult, PRESET_SPECIMENS, generateOfflineScanResult } from '@/src/services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import BotanicalScannerCanvas from './BotanicalScannerCanvas';
import SpecimenPresetPicker from './SpecimenPresetPicker';
import TerpeneSommelierBreakdown from './TerpeneSommelierBreakdown';
import { playScanStart, playScanSuccess, playWarningBeep, isSoundEnabled, setSoundEnabled } from '@/src/lib/audio';

const API_KEY_STORAGE_KEY = 'budscan_gemini_api_key';

interface ScannerProps {
  onPost: (result: ScanResult, image: string) => void;
  announcerText?: string;
  setAnnouncerText?: (text: string) => void;
}

export default function Scanner({ onPost, announcerText, setAnnouncerText }: ScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE_KEY) || '');
  const [soundActive, setSoundActive] = useState(() => isSoundEnabled());

  const announce = (msg: string) => {
    if (setAnnouncerText) setAnnouncerText(msg);
  };

  const toggleAudio = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    toast.info(next ? 'Sound FX Enabled' : 'Sound FX Muted');
  };

  const executeAnalysis = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setIsScanning(true);
    setScanResult(null);
    playScanStart();
    announce('Initiating multi-stage AI visual specimen analysis...');

    try {
      const base64Data = imageSrc.split(',')[1] || imageSrc;
      const result = await analyzeBud(base64Data, apiKey.trim());
      setScanResult(result);

      if (result.quality === 'moldy' || result.quality === 'pgr') {
        playWarningBeep();
        announce(`Scan warning: ${result.quality.toUpperCase()} quality risk detected. Confidence: ${Math.round(result.confidence * 100)}%`);
      } else {
        playScanSuccess();
        announce(`Scan complete. Quality assessed as ${result.quality.toUpperCase()}. Confidence: ${Math.round(result.confidence * 100)}%`);
      }
    } catch (error) {
      console.error('Scan failed:', error);
      toast.error('AI analysis fallback engaged.');
      const fallback = generateOfflineScanResult(imageSrc);
      setScanResult(fallback);
      playScanSuccess();
    } finally {
      setIsScanning(false);
    }
  };

  const captureWebcam = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      toast.error('Unable to capture webcam image. Try preset gallery or file upload.');
      return;
    }
    executeAnalysis(imageSrc);
  }, [apiKey]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        executeAnalysis(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof PRESET_SPECIMENS[0]) => {
    setCapturedImage(preset.imageUrl);
    setIsScanning(true);
    setScanResult(null);
    playScanStart();
    announce(`Analyzing specimen preset: ${preset.name}...`);

    setTimeout(() => {
      setScanResult(preset.result);
      setIsScanning(false);
      if (preset.quality === 'moldy' || preset.quality === 'pgr') {
        playWarningBeep();
      } else {
        playScanSuccess();
      }
      announce(`Preset scan complete. Grade: ${preset.quality.toUpperCase()}`);
    }, 1200);
  };

  const saveKey = () => {
    if (!apiKey.trim()) {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      toast.info('API key removed. Running in Intelligent Simulation Mode.');
      return;
    }
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
    toast.success('Gemini API Key saved locally!');
  };

  const reset = () => {
    setScanResult(null);
    setCapturedImage(null);
    announce('Scanner reset ready for next specimen.');
  };

  const handlePost = () => {
    if (scanResult && capturedImage) {
      onPost(scanResult, capturedImage);
      reset();
      toast.success('Result posted to community feed!');
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'fire': return 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10 shadow-[0_0_12px_rgba(52,211,153,0.2)]';
      case 'suspect': return 'text-amber-400 border-amber-400/50 bg-amber-400/10 shadow-[0_0_12px_rgba(251,191,36,0.2)]';
      case 'moldy': return 'text-red-400 border-red-400/50 bg-red-400/10 shadow-[0_0_12px_rgba(248,113,113,0.2)]';
      case 'pgr': return 'text-purple-400 border-purple-400/50 bg-purple-400/10 shadow-[0_0_12px_rgba(192,132,252,0.2)]';
      default: return 'text-slate-400 border-slate-400/50 bg-slate-400/10';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'fire': return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'suspect': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'moldy': return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'pgr': return <ShieldAlert className="w-5 h-5 text-purple-400" />;
      default: return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto h-full overflow-y-auto pb-24 scrollbar-thin">
      {/* Top Controls: API Key & Audio Mute */}
      <section aria-label="Scanner Configuration" className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-3 space-y-2 backdrop-blur-md">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-emerald-400" />
            Gemini API Integration
          </span>
          <button
            type="button"
            onClick={toggleAudio}
            className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400"
            aria-label={soundActive ? 'Mute audio feedback' : 'Unmute audio feedback'}
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span>{soundActive ? 'Audio ON' : 'Audio OFF'}</span>
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Gemini API Key (Optional for simulation)"
              className="w-full h-9 rounded-lg bg-black/50 border border-slate-700/80 pl-3 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              aria-label="Gemini API key input"
            />
          </div>
          <Button
            type="button"
            onClick={saveKey}
            size="sm"
            className="h-9 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            Save
          </Button>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
          <span className="text-emerald-400/80">
            {apiKey ? '✓ Custom Gemini API Key Connected' : '⚡ Offline Neural Simulation Engine Ready'}
          </span>
        </div>
      </section>

      {/* Main Specimen Viewer / Webcam Screen */}
      <section aria-label="Specimen Scanner Screen" className="relative aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500/30 bg-black shadow-2xl shadow-emerald-500/10 group">
        <BotanicalScannerCanvas isScanning={isScanning} quality={scanResult?.quality} />

        {!capturedImage ? (
          <>
            {!cameraError ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'environment' }}
                onUserMedia={() => setCameraReady(true)}
                onUserMediaError={() => setCameraError(true)}
                className="w-full h-full object-cover"
                mirrored={false}
                imageSmoothing={true}
                screenshotQuality={0.92}
                disablePictureInPicture={true}
                forceScreenshotSourceSize={false}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 text-slate-400">
                <Camera className="w-10 h-10 text-slate-600 mb-2" />
                <p className="text-xs font-semibold text-slate-300 mb-1">Webcam Access Unavailable</p>
                <p className="text-[11px] text-slate-500 mb-3">Select a sample specimen from below or upload an image file.</p>
              </div>
            )}

            {/* Reticle corner guides */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br" />
            </div>
          </>
        ) : (
          <img
            src={capturedImage}
            alt="Captured botanical specimen"
            className="w-full h-full object-cover"
          />
        )}

        {/* Loading Overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <div className="text-emerald-400 font-mono text-xs tracking-widest animate-pulse font-bold">
              EXTRACTING BOTANICAL FEATURES...
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Stage 1/3: Trichome clarity analysis</div>
          </div>
        )}
      </section>

      {/* Input Actions: File Upload & Camera Scan */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
        aria-label="Upload specimen image file"
      />

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div
            key="scanner-controls"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-3"
          >
            {!capturedImage ? (
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  onClick={captureWebcam}
                  disabled={!cameraReady || isScanning}
                  className="col-span-2 h-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-900/30 border border-emerald-400/30"
                  aria-label="Scan specimen using camera"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  SCAN CAMERA
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="h-14 rounded-xl border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-xs flex flex-col items-center justify-center gap-0.5"
                  aria-label="Upload image from file"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>UPLOAD</span>
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={reset}
                variant="outline"
                className="w-full h-12 rounded-xl border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-bold text-xs tracking-wider uppercase"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                NEW SPECIMEN SCAN
              </Button>
            )}

            {/* Test-Drive Preset Gallery */}
            <SpecimenPresetPicker onSelectPreset={handleSelectPreset} disabled={isScanning} />
          </motion.div>
        ) : (
          <motion.div
            key="scanner-results"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <Card className="bg-slate-900/70 border border-emerald-500/30 p-4 space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${getQualityColor(scanResult.quality)}`}>
                    {getQualityIcon(scanResult.quality)}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Specimen Quality</span>
                    <span className={`font-black uppercase tracking-tight text-xl ${getQualityColor(scanResult.quality).split(' ')[0]}`}>
                      {scanResult.quality}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">AI Confidence</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">
                    {(scanResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Assessment details */}
              <div className="text-xs text-slate-200 italic leading-relaxed bg-black/40 p-3 rounded-lg border border-slate-800">
                "{scanResult.details}"
              </div>

              {/* Terpene Sommelier Breakdown */}
              <TerpeneSommelierBreakdown result={scanResult} />

              {/* Safety Warnings */}
              {scanResult.warnings && scanResult.warnings.length > 0 && (
                <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    Safety Warnings Detected
                  </div>
                  <ul className="text-xs text-red-200/90 space-y-1 list-disc list-inside">
                    {scanResult.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
            </Card>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                onClick={reset}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-800 text-slate-300 hover:bg-slate-800 font-bold text-xs"
              >
                DISCARD
              </Button>
              <Button
                type="button"
                onClick={handlePost}
                className="flex-2 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/30"
              >
                POST TO COMMUNITY FEED
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
