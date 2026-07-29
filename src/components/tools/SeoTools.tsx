import React, { useState } from 'react';
import { Card, PrimaryButton, SecondaryButton, Input, TextArea } from '../ui/Shared';
import { useToast } from '../ui/Toast';
import { Search, Hash, Link as LinkIcon, Copy } from 'lucide-react';
import { motion } from 'motion/react';

// --- Keyword Density Checker ---
export const KeywordDensity = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProcess = () => {
    if (!text) return;
    setIsLoading(true);
    // Hitung kata > 3 huruf
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const counts: Record<string, number> = {};
    words.forEach(w => { counts[w] = (counts[w] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    setResult({ total: words.length, top: sorted });
    setIsLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Hash className="text-blue-400"/> Keyword Density Checker</h3>
        <p className="text-sm text-gray-400 mb-4">Menganalisa kata dengan panjang lebih dari 3 huruf.</p>
        <TextArea placeholder="Paste artikel Anda..." value={text} onChange={(e) => setText(e.target.value)} rows={5} className="mb-4" />
        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading}>Analisis Keywords</PrimaryButton>
      </Card>
      {result && (
        <Card>
          <div className="mb-4 text-gray-300">Total kata terpilih: <span className="text-white font-bold">{result.total}</span></div>
          <div className="space-y-2">
            {result.top.map(([word, count]: any, i: number) => (
              <div key={i} className="flex justify-between p-2 bg-[#0a0a0a] rounded border border-[#272727]">
                <span>{word}</span>
                <span className="text-purple-400 font-mono">{count} kali ({(count/result.total*100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
};

// --- Meta Tag Generator ---
export const MetaTagGenerator = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState('');
  const { showToast } = useToast();

  const handleProcess = () => {
    const meta = `<!-- Primary Meta Tags -->\n<title>${title}</title>\n<meta name="title" content="${title}">\n<meta name="description" content="${desc}">\n<meta name="keywords" content="${keywords}">\n\n<!-- Open Graph / Facebook -->\n<meta property="og:type" content="website">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">\n\n<!-- Twitter -->\n<meta property="twitter:card" content="summary_large_image">\n<meta property="twitter:title" content="${title}">\n<meta property="twitter:description" content="${desc}">`;
    setResult(meta);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Search className="text-green-400"/> Meta Tag Generator</h3>
        <div className="space-y-4 mb-4">
          <Input placeholder="Page Title (max 60 chars)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextArea placeholder="Page Description (max 160 chars)" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
          <Input placeholder="Keywords (comma separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        </div>
        <PrimaryButton className="w-full" onClick={handleProcess} disabled={!title || !desc}>Generate Meta Tags</PrimaryButton>
      </Card>
      {result && (
        <Card>
          <TextArea value={result} readOnly rows={12} className="mb-4 text-blue-300 bg-[#0a0a0a] font-mono text-sm" />
          <SecondaryButton onClick={() => { navigator.clipboard.writeText(result); showToast('Berhasil di copy!'); }} className="w-full">
            <Copy className="w-4 h-4" /> Copy HTML
          </SecondaryButton>
        </Card>
      )}
    </motion.div>
  );
};

// --- Backlink Checker ---
export const BacklinkChecker = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(false);

  const handleProcess = () => {
    if (!url) return;
    setIsLoading(true);
    setTimeout(() => {
      setResult(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><LinkIcon className="text-purple-400"/> Backlink Checker (Dummy)</h3>
        <p className="text-sm text-yellow-500 mb-4 bg-yellow-500/10 p-2 rounded">Note: Fitur ini membutuhkan API berbayar (seperti Ahrefs/Moz). Hasil yang ditampilkan adalah dummy.</p>
        <Input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} className="mb-4" />
        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading} disabled={!url}>Check Backlinks</PrimaryButton>
      </Card>
      {result && (
        <Card className="text-center">
          <div className="text-4xl font-bold text-white mb-2">120</div>
          <div className="text-gray-400 mb-6">Total Backlinks Ditemukan</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-[#272727]">
              <div className="text-green-400 font-bold mb-1">Dofollow</div>
              <div>84 (70%)</div>
            </div>
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-[#272727]">
              <div className="text-red-400 font-bold mb-1">Nofollow</div>
              <div>36 (30%)</div>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};
