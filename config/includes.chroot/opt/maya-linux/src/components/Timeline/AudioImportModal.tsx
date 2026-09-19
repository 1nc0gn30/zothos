import React, { useState, useEffect } from 'react';
import { Video, Upload, Music, Loader2, X, CheckCircle2, AlertCircle, RefreshCw, ArrowDownToLine, Terminal } from 'lucide-react';

interface AudioImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAudioImported: (audio: { url: string; name: string }) => void;
}

export const AudioImportModal: React.FC<AudioImportModalProps> = ({
  isOpen,
  onClose,
  onAudioImported,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'youtube'>('youtube');
  const [ytUrl, setYtUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTerminal, setLoadingTerminal] = useState(false);
  const [updatingYtdlp, setUpdatingYtdlp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [depsInfo, setDepsInfo] = useState<{ isDesktop: boolean; ytdlp: boolean; ytdlpVersion?: string; ffmpeg: boolean } | null>(null);

  const refreshDeps = async () => {
    if ((window as any).electronAPI?.checkSystemDeps) {
      try {
        const res = await (window as any).electronAPI.checkSystemDeps();
        setDepsInfo(res);
      } catch (_) {
        setDepsInfo({ isDesktop: true, ytdlp: true, ffmpeg: true });
      }
    } else {
      setDepsInfo({ isDesktop: false, ytdlp: false, ffmpeg: false });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    refreshDeps();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onAudioImported({
      url,
      name: file.name,
    });
    onClose();
  };

  const handleUpdateYtdlp = async () => {
    if (!(window as any).electronAPI?.updateYtdlp) return;
    setUpdatingYtdlp(true);
    setError(null);
    try {
      await (window as any).electronAPI.updateYtdlp();
      await refreshDeps();
    } catch (err: any) {
      setError(err.message || 'Failed to update yt-dlp');
    } finally {
      setUpdatingYtdlp(false);
    }
  };

  const handleYoutubeDownload = async () => {
    let cleanUrl = ytUrl.trim();
    if (!cleanUrl) return;

    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
      setYtUrl(cleanUrl);
    }

    setLoading(true);
    setError(null);

    try {
      if ((window as any).electronAPI?.downloadYouTubeAudio) {
        const result = await (window as any).electronAPI.downloadYouTubeAudio(cleanUrl);
        if (result.success) {
          onAudioImported({
            url: result.audioDataUrl,
            name: result.fileName || `YouTube - ${cleanUrl.slice(0, 24)}...`,
          });
          onClose();
        }
      } else {
        throw new Error('yt-dlp integration is active in the Maya Linux desktop AppImage.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to extract audio with yt-dlp');
    } finally {
      setLoading(false);
    }
  };

  const handleYoutubeDownloadTerminal = async () => {
    let cleanUrl = ytUrl.trim();
    if (!cleanUrl) return;

    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
      setYtUrl(cleanUrl);
    }

    setLoadingTerminal(true);
    setError(null);

    try {
      if ((window as any).electronAPI?.downloadYouTubeAudioInTerminal) {
        const result = await (window as any).electronAPI.downloadYouTubeAudioInTerminal(cleanUrl);
        if (result.success) {
          onAudioImported({
            url: result.audioDataUrl,
            name: result.fileName || `YouTube - ${cleanUrl.slice(0, 24)}...`,
          });
          onClose();
        }
      } else {
        throw new Error('Terminal download is active in the Maya Linux desktop AppImage.');
      }
    } catch (err: any) {
      setError(err.message || 'Terminal execution was interrupted or failed');
    } finally {
      setLoadingTerminal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-[490px] bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2 text-brand-400 font-semibold">
            <Music className="w-5 h-5" />
            <span>Add Background Audio</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 gap-1.5 bg-dark-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('youtube')}
            className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'youtube' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>YouTube URL (yt-dlp)</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'upload' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload MP3 / Audio</span>
          </button>
        </div>

        {activeTab === 'youtube' ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">YouTube Video URL</label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                onBlur={() => {
                  const trimmed = ytUrl.trim();
                  if (trimmed && !/^https?:\/\//i.test(trimmed)) {
                    setYtUrl('https://' + trimmed);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono transition"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] px-3 py-2 rounded-xl bg-dark-950/90 border border-slate-800">
              <div className="flex items-center space-x-2">
                {depsInfo?.ytdlp !== false ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="text-slate-300 truncate">
                  {depsInfo?.isDesktop 
                    ? `yt-dlp ${depsInfo?.ytdlpVersion ? `v${depsInfo.ytdlpVersion}` : 'Ready'}`
                    : 'Web Preview Mode (Use Upload)'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {depsInfo?.ffmpeg && (
                  <span className="text-[10px] text-emerald-400/90 font-mono bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">FFmpeg Ready</span>
                )}
                {depsInfo?.isDesktop && (
                  <button
                    onClick={handleUpdateYtdlp}
                    disabled={updatingYtdlp || loading || loadingTerminal}
                    title="Update yt-dlp engine to latest version"
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white transition disabled:opacity-50"
                  >
                    {updatingYtdlp ? (
                      <Loader2 className="w-3 h-3 animate-spin text-rose-400" />
                    ) : (
                      <RefreshCw className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{updatingYtdlp ? 'Updating...' : 'Update'}</span>
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-start space-x-2 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
                {depsInfo?.isDesktop && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleUpdateYtdlp}
                      disabled={updatingYtdlp}
                      className="py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-medium flex items-center justify-center space-x-1.5 border border-rose-500/30 transition"
                    >
                      {updatingYtdlp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowDownToLine className="w-3.5 h-3.5" />}
                      <span>Update Engine</span>
                    </button>
                    <button
                      onClick={handleYoutubeDownloadTerminal}
                      disabled={loadingTerminal || !ytUrl.trim()}
                      className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center justify-center space-x-1.5 border border-slate-700 transition"
                    >
                      {loadingTerminal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Terminal className="w-3.5 h-3.5 text-amber-400" />}
                      <span>Run in Terminal</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-5 gap-2">
              <button
                disabled={loading || loadingTerminal || !ytUrl.trim() || updatingYtdlp}
                onClick={handleYoutubeDownload}
                className="col-span-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-xs font-semibold text-white transition flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    <span>Download Audio</span>
                  </>
                )}
              </button>

              {depsInfo?.isDesktop ? (
                <button
                  disabled={loading || loadingTerminal || !ytUrl.trim() || updatingYtdlp}
                  onClick={handleYoutubeDownloadTerminal}
                  title="Run download inside an interactive desktop terminal (Konsole / Xterm)"
                  className="col-span-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center space-x-1.5 border border-slate-700 shadow-md"
                >
                  {loadingTerminal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>In Terminal...</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-4 h-4 text-amber-400" />
                      <span>In Terminal</span>
                    </>
                  )}
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <label className="block p-8 border-2 border-dashed border-slate-800 hover:border-brand-500/50 bg-dark-950/60 rounded-2xl cursor-pointer group transition">
              <Upload className="w-8 h-8 text-brand-400 mx-auto mb-2 group-hover:scale-110 transition" />
              <span className="text-xs font-semibold text-slate-200 block">Choose Audio File</span>
              <span className="text-[10px] text-slate-500">MP3, WAV, AAC, OGG supported</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
