import React, { useState, useRef } from 'react';
import { Card, PrimaryButton, SecondaryButton, Input } from '../ui/Shared';
import { useToast } from '../ui/Toast';
import { Youtube, Film, Captions, Download } from 'lucide-react';
import { motion } from 'motion/react';
import GIF from 'gif.js';

// --- YouTube Thumbnail Downloader ---
export const YoutubeThumbnail = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const { showToast } = useToast();

  const handleProcess = () => {
    if (!url) return;
    setIsLoading(true);
    
    // Extract video ID
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      const id = match[2];
      setThumbnails([
        `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${id}/sddefault.jpg`,
        `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
      ]);
      showToast('Thumbnails berhasil diambil!');
    } else {
      showToast('URL YouTube tidak valid');
    }
    setIsLoading(false);
  };

  const handleDownload = (imgUrl: string, quality: number) => {
    // Cannot download directly due to CORS, opening in new tab
    window.open(imgUrl, '_blank');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Youtube className="text-red-500"/> YT Thumbnail Downloader</h3>
        <Input placeholder="Paste YouTube URL..." value={url} onChange={(e) => setUrl(e.target.value)} className="mb-4" />
        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading} disabled={!url}>Get Thumbnails</PrimaryButton>
      </Card>
      {thumbnails.length > 0 && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {thumbnails.map((thumb, i) => (
              <div key={i} className="space-y-2">
                <img src={thumb} alt={`Thumbnail ${i}`} className="w-full rounded-lg border border-[#333]" />
                <SecondaryButton onClick={() => handleDownload(thumb, i)} className="w-full text-sm py-1"><Download className="w-4 h-4"/> Open/Download Q{i+1}</SecondaryButton>
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
};

// --- Video to GIF ---
export const VideoToGif = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleProcess = () => {
    if (!file) return;
    setIsLoading(true);
    
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.muted = true;
    
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      // Scale down for reasonable GIF size
      const scale = Math.min(320 / video.videoWidth, 1);
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      const ctx = canvas.getContext('2d');
      
      const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: 'https://cdn.jsdelivr.net/npm/gif.js/dist/gif.worker.js' // Use CDN for worker
      });

      gif.on('finished', (blob) => {
        setResultUrl(URL.createObjectURL(blob));
        setIsLoading(false);
        showToast('Konversi ke GIF berhasil!');
      });

      let duration = Math.min(video.duration, 5); // Limit to 5s max
      let fps = 10;
      let frames = duration * fps;
      let frameCount = 0;

      const captureFrame = () => {
        video.currentTime = frameCount / fps;
      };

      video.onseeked = () => {
        if(ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          gif.addFrame(canvas, {copy: true, delay: 1000 / fps});
        }
        
        frameCount++;
        if(frameCount < frames) {
          captureFrame();
        } else {
          gif.render();
        }
      };

      captureFrame();
    };
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Film className="text-purple-500"/> Video to GIF</h3>
        <p className="text-sm text-gray-400 mb-4">Maksimal video 10MB, durasi yang diconvert max 5 detik pertama.</p>
        <div className="border-2 border-dashed border-[#333] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors mb-4">
          <input type="file" className="hidden" id="vid-upload" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <label htmlFor="vid-upload" className="cursor-pointer flex flex-col items-center w-full">
            <Film className="w-12 h-12 text-[#555] mb-4" />
            <span className="text-gray-400">{file ? file.name : 'Upload Video (Max 10MB)'}</span>
          </label>
        </div>
        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading} disabled={!file || (file.size > 10 * 1024 * 1024)}>Convert to GIF</PrimaryButton>
      </Card>
      {resultUrl && (
        <Card className="text-center space-y-4">
          <div className="bg-[#0a0a0a] rounded flex items-center justify-center border border-[#333] p-4">
             <img src={resultUrl} alt="Generated GIF" className="max-h-64 rounded" />
          </div>
          <PrimaryButton className="w-full" onClick={() => {
            const a = document.createElement('a');
            a.href = resultUrl;
            a.download = `${file?.name}.gif`;
            a.click();
          }}><Download className="w-4 h-4"/> Download GIF</PrimaryButton>
        </Card>
      )}
    </motion.div>
  );
};

// --- Subtitle Generator ---
export const SubtitleGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleProcess = () => {
    if (!file) return;
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        const res = await fetch('/api/subtitle-generator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data, mimeType: file.type })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        setResult(data.text);
        showToast('Subtitle berhasil dibuat!');
      } catch (e: any) {
        showToast(e.message || 'Error processing request');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subtitle.srt';
    a.click();
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Captions className="text-blue-400"/> AI Subtitle Generator</h3>
        <input type="file" accept="video/*,audio/*" className="mb-4 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading} disabled={!file}>Generate Subtitles (SRT)</PrimaryButton>
      </Card>
      {result && (
        <Card className="space-y-4">
           <div className="p-4 bg-[#0a0a0a] rounded font-mono text-xs text-gray-300 overflow-y-auto h-48 border border-[#272727] whitespace-pre-wrap">
             {result}
           </div>
           <PrimaryButton className="w-full" onClick={handleDownload}><Download className="w-4 h-4"/> Download .SRT File</PrimaryButton>
        </Card>
      )}
    </motion.div>
  );
};
