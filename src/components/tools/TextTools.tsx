import React, { useState } from 'react';
import { Card, PrimaryButton, SecondaryButton, Input, TextArea } from '../ui/Shared';
import { useToast } from '../ui/Toast';
import { Copy, Sparkles, Wand2, SpellCheck, Languages } from 'lucide-react';
import { motion } from 'motion/react';

// --- AI Writer ---
export const AiWriter = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const { showToast } = useToast();

  const handleProcess = async () => {
    if (!topic) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.text);
      showToast('Artikel berhasil dibuat!');
    } catch (e: any) {
      showToast(e.message || 'Error processing request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Sparkles className="text-purple-500"/> AI Writer</h3>
        <Input 
          placeholder="Masukkan topik artikel..." 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          className="mb-4"
        />
        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading} disabled={!topic}>
          Generate Artikel
        </PrimaryButton>
      </Card>
      {result && (
        <Card>
          <TextArea value={result} readOnly rows={12} className="mb-4 text-gray-300 bg-[#0a0a0a]" />
          <SecondaryButton onClick={() => { navigator.clipboard.writeText(result); showToast('Berhasil di copy!'); }} className="w-full">
            <Copy className="w-4 h-4" /> Copy Result
          </SecondaryButton>
        </Card>
      )}
    </motion.div>
  );
};

// --- Grammar Checker ---
export const GrammarChecker = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const { showToast } = useToast();

  const handleProcess = async () => {
    if (!text) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/grammar-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.text);
      showToast('Grammar checked!');
    } catch (e: any) {
      showToast(e.message || 'Error processing request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><SpellCheck className="text-blue-500"/> Grammar Checker</h3>
        <TextArea 
          placeholder="Paste teks Anda disini..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          className="mb-4"
          rows={5}
        />
        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading} disabled={!text}>
          Check Grammar
        </PrimaryButton>
      </Card>
      {result && (
        <Card>
          <TextArea value={result} readOnly rows={10} className="mb-4 text-green-400 bg-[#0a0a0a]" />
          <SecondaryButton onClick={() => { navigator.clipboard.writeText(result); showToast('Berhasil di copy!'); }} className="w-full">
            <Copy className="w-4 h-4" /> Copy Result
          </SecondaryButton>
        </Card>
      )}
    </motion.div>
  );
};

// --- Paraphraser ---
export const Paraphraser = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const { showToast } = useToast();

  const handleProcess = async () => {
    if (!text) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/paraphraser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.text);
      showToast('Teks berhasil diparafrase!');
    } catch (e: any) {
      showToast(e.message || 'Error processing request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Wand2 className="text-purple-500"/> Paraphraser</h3>
        <TextArea 
          placeholder="Paste teks yang ingin diubah..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          className="mb-4"
          rows={5}
        />
        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading} disabled={!text}>
          Paraphrase Teks
        </PrimaryButton>
      </Card>
      {result && (
        <Card>
          <TextArea value={result} readOnly rows={10} className="mb-4 text-gray-300 bg-[#0a0a0a]" />
          <SecondaryButton onClick={() => { navigator.clipboard.writeText(result); showToast('Berhasil di copy!'); }} className="w-full">
            <Copy className="w-4 h-4" /> Copy Result
          </SecondaryButton>
        </Card>
      )}
    </motion.div>
  );
};

// --- Translator ---
export const Translator = () => {
  const [text, setText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const { showToast } = useToast();

  const handleProcess = async () => {
    if (!text) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/translator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.text);
      showToast('Teks berhasil diterjemahkan!');
    } catch (e: any) {
      showToast(e.message || 'Error processing request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Languages className="text-pink-500"/> Translator</h3>
        <TextArea 
          placeholder="Paste teks yang ingin diterjemahkan..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          className="mb-4"
          rows={5}
        />
        <select 
          value={targetLanguage} 
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-full mb-4 bg-[#111] border border-[#333] focus:border-purple-500 rounded-lg px-4 py-2 text-white"
        >
          <option value="English">English</option>
          <option value="Indonesian">Indonesian</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="Japanese">Japanese</option>
          <option value="Korean">Korean</option>
        </select>
        <PrimaryButton className="w-full" onClick={handleProcess} isLoading={isLoading} disabled={!text}>
          Terjemahkan
        </PrimaryButton>
      </Card>
      {result && (
        <Card>
          <TextArea value={result} readOnly rows={6} className="mb-4 text-gray-300 bg-[#0a0a0a]" />
          <SecondaryButton onClick={() => { navigator.clipboard.writeText(result); showToast('Berhasil di copy!'); }} className="w-full">
            <Copy className="w-4 h-4" /> Copy Result
          </SecondaryButton>
        </Card>
      )}
    </motion.div>
  );
};
