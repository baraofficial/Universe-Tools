import React, { useState } from 'react';
import { Card, PrimaryButton, SecondaryButton, TextArea, Input } from '../ui/Shared';
import { useToast } from '../ui/Toast';
import { Copy, Code2, Binary, Palette } from 'lucide-react';
import { motion } from 'motion/react';

// --- JSON Formatter ---
export const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
      showToast('JSON Formatted!');
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
      showToast('JSON Minified!');
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Code2 className="text-blue-500"/> JSON Formatter & Minifier</h3>
        <TextArea 
          placeholder='{"key": "value"}' 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="mb-4 font-mono text-sm"
          rows={6}
        />
        <div className="flex gap-4 mb-4">
          <PrimaryButton className="flex-1" onClick={handleFormat} disabled={!input}>Format JSON</PrimaryButton>
          <SecondaryButton className="flex-1" onClick={handleMinify} disabled={!input}>Minify JSON</SecondaryButton>
        </div>
        {error && <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">{error}</div>}
      </Card>
      
      {output && (
        <Card>
          <TextArea value={output} readOnly rows={10} className="mb-4 text-green-400 bg-[#0a0a0a] font-mono text-sm" />
          <SecondaryButton onClick={() => { navigator.clipboard.writeText(output); showToast('Berhasil di copy!'); }} className="w-full">
            <Copy className="w-4 h-4" /> Copy Result
          </SecondaryButton>
        </Card>
      )}
    </motion.div>
  );
};

// --- Base64 Encoder/Decoder ---
export const Base64Tool = () => {
  const [plain, setPlain] = useState('');
  const [base64, setBase64] = useState('');
  const { showToast } = useToast();

  const handlePlainChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPlain(val);
    try {
      setBase64(btoa(val));
    } catch {
      setBase64('Error encoding');
    }
  };

  const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBase64(val);
    try {
      setPlain(atob(val));
    } catch {
      setPlain('Error decoding (invalid base64)');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Binary className="text-purple-500"/> Base64 Encoder/Decoder</h3>
        <p className="text-sm text-gray-400 mb-4">Ketik di salah satu kotak, kotak lainnya akan otomatis update.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Plain Text</label>
            <TextArea 
              placeholder="Plain text..." 
              value={plain} 
              onChange={handlePlainChange} 
              rows={6}
            />
            <button onClick={() => { navigator.clipboard.writeText(plain); showToast('Plain copied!'); }} className="mt-2 text-sm text-purple-400 flex items-center gap-1"><Copy className="w-3 h-3"/> Copy Plain</button>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Base64 Text</label>
            <TextArea 
              placeholder="Base64..." 
              value={base64} 
              onChange={handleBase64Change} 
              rows={6}
              className="font-mono text-sm"
            />
            <button onClick={() => { navigator.clipboard.writeText(base64); showToast('Base64 copied!'); }} className="mt-2 text-sm text-purple-400 flex items-center gap-1"><Copy className="w-3 h-3"/> Copy Base64</button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// --- Color Picker ---
export const ColorPickerTool = () => {
  const [color, setColor] = useState('#8b5cf6');
  const { showToast } = useToast();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
  };

  const hexToHsl = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt("0x" + hex[1] + hex[1]);
      g = parseInt("0x" + hex[2] + hex[2]);
      b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
      r = parseInt("0x" + hex[1] + hex[2]);
      g = parseInt("0x" + hex[3] + hex[4]);
      b = parseInt("0x" + hex[5] + hex[6]);
    }
    r /= 255; g /= 255; b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const copyVal = (val: string) => {
    navigator.clipboard.writeText(val);
    showToast(`Copied: ${val}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Palette className="text-pink-500"/> Color Picker</h3>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-32 h-32 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
          <div className="flex-1 space-y-3 w-full">
            <div className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg border border-[#333]">
              <span className="text-gray-400">HEX</span>
              <span className="font-mono">{color.toUpperCase()}</span>
              <button onClick={() => copyVal(color.toUpperCase())} className="text-purple-400 hover:text-purple-300"><Copy className="w-4 h-4" /></button>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg border border-[#333]">
              <span className="text-gray-400">RGB</span>
              <span className="font-mono">{hexToRgb(color)}</span>
              <button onClick={() => copyVal(hexToRgb(color) || '')} className="text-purple-400 hover:text-purple-300"><Copy className="w-4 h-4" /></button>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg border border-[#333]">
              <span className="text-gray-400">HSL</span>
              <span className="font-mono">{hexToHsl(color)}</span>
              <button onClick={() => copyVal(hexToHsl(color) || '')} className="text-purple-400 hover:text-purple-300"><Copy className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
