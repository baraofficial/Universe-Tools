import React, { useState, useRef } from 'react';
import { Card, PrimaryButton, SecondaryButton, Input } from '../ui/Shared';
import { useToast } from '../ui/Toast';
import { Copy, Download, Image as ImageIcon, Maximize, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { removeBackground } from '@imgly/background-removal';
import imageCompression from 'browser-image-compression';

// --- Background Remover ---
export const BackgroundRemover = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleProcess = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const imageBlob = await removeBackground(file);
      const url = URL.createObjectURL(imageBlob);
      setResultUrl(url);
      showToast('Berhasil menghapus background!');
    } catch (error) {
      console.error(error);
      showToast('Gagal memproses gambar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `nobg_${file?.name || 'image.png'}`;
    a.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4">Upload Gambar (Background Remover)</h3>
        <div className="border-2 border-dashed border-[#333] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500 transition-colors">
          <input type="file" className="hidden" id="bg-upload" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <label htmlFor="bg-upload" className="cursor-pointer flex flex-col items-center w-full">
            <ImageIcon className="w-12 h-12 text-[#555] mb-4" />
            <span className="text-gray-400">{file ? file.name : 'Klik atau drag file kesini'}</span>
          </label>
        </div>
        <PrimaryButton className="w-full mt-4" onClick={handleProcess} isLoading={isLoading} disabled={!file}>
          {isLoading ? 'Sedang Memproses...' : 'Hapus Background'}
        </PrimaryButton>
      </Card>

      {resultUrl && (
        <Card>
          <h3 className="text-xl font-semibold mb-4">Hasil</h3>
          <div className="bg-[#0a0a0a] rounded-lg p-4 flex justify-center border border-[#272727] relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgLz4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlIiAvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2VlZSIgLz4KPC9zdmc+')]">
            <img src={resultUrl} alt="Result" className="max-h-64 rounded object-contain" />
          </div>
          <div className="flex gap-4 mt-4">
            <PrimaryButton className="w-full" onClick={handleDownload}><Download className="w-4 h-4" /> Download .PNG</PrimaryButton>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

// --- Image Compressor ---
export const ImageCompressor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80); // 1-100 mapped to 0.01 - 1
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [savings, setSavings] = useState('');
  const { showToast } = useToast();

  const handleProcess = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: quality / 100
      };
      const compressedFile = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedFile);
      setResultUrl(url);
      
      const savedPercent = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
      setSavings(`Ukuran turun ${savedPercent}% (${(compressedFile.size / 1024).toFixed(1)} KB)`);
      
      showToast('Berhasil kompres gambar!');
    } catch (error) {
      console.error(error);
      showToast('Gagal memproses gambar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `compressed_${file?.name || 'image.jpg'}`;
    a.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4">Compress Image</h3>
        <input type="file" accept="image/*" className="mb-4 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Quality: {quality}% (Lower is smaller size)</label>
          <input type="range" min="1" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-purple-600" />
        </div>

        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading} disabled={!file}>
          <Zap className="w-4 h-4" /> Compress Now
        </PrimaryButton>
      </Card>

      {resultUrl && (
        <Card>
          <div className="text-center text-green-400 mb-4">✓ Berhasil! {savings}</div>
          <PrimaryButton className="w-full" onClick={handleDownload}><Download className="w-4 h-4" /> Download Compressed Image</PrimaryButton>
        </Card>
      )}
    </motion.div>
  );
};

// --- Image Resizer ---
export const ImageResizer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const img = new Image();
      img.onload = () => {
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleProcess = () => {
    if (!file || !width || !height) return;
    setIsLoading(true);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = parseInt(width);
      canvas.height = parseInt(height);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            setResultUrl(URL.createObjectURL(blob));
            showToast('Berhasil me-resize gambar!');
          }
          setIsLoading(false);
        }, file.type);
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `resized_${file?.name || 'image.jpg'}`;
    a.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4">Image Resizer</h3>
        <input type="file" accept="image/*" className="mb-4 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" onChange={handleFileChange} />
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Width (px)</label>
            <Input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Auto" />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Height (px)</label>
            <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Auto" />
          </div>
        </div>
        
        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading} disabled={!file}>
          <Maximize className="w-4 h-4" /> Resize
        </PrimaryButton>
      </Card>

      {resultUrl && (
        <Card>
          <h3 className="text-xl font-semibold mb-4">Result</h3>
          <div className="bg-[#0a0a0a] rounded-lg p-4 flex justify-center border border-[#272727]">
            <img src={resultUrl} alt="Resized" className="max-h-64 rounded object-contain" />
          </div>
          <div className="flex gap-4 mt-4">
             <PrimaryButton className="w-full" onClick={handleDownload}><Download className="w-4 h-4" /> Download</PrimaryButton>
          </div>
        </Card>
      )}
    </motion.div>
  );
};
