import { Image as ImageIcon, FileText, Code2, Search, Video } from 'lucide-react';

export const TOOLS_CONFIG = [
  {
    category: 'Image Tools',
    icon: ImageIcon,
    tools: [
      { id: 'bg-remover', name: 'Background Remover' },
      { id: 'image-compressor', name: 'Image Compressor' },
      { id: 'image-resizer', name: 'Image Resizer' },
    ]
  },
  {
    category: 'Text Tools',
    icon: FileText,
    tools: [
      { id: 'ai-writer', name: 'AI Writer' },
      { id: 'grammar-checker', name: 'Grammar Checker' },
      { id: 'paraphraser', name: 'Paraphraser' },
      { id: 'translator', name: 'Translator' },
    ]
  },
  {
    category: 'Developer Tools',
    icon: Code2,
    tools: [
      { id: 'json-formatter', name: 'JSON Formatter' },
      { id: 'base64-tool', name: 'Base64 Encoder/Decoder' },
      { id: 'color-picker', name: 'Color Picker' },
    ]
  },
  {
    category: 'SEO Tools',
    icon: Search,
    tools: [
      { id: 'keyword-density', name: 'Keyword Density Checker' },
      { id: 'meta-tag-gen', name: 'Meta Tag Generator' },
      { id: 'backlink-checker', name: 'Backlink Checker' },
    ]
  },
  {
    category: 'Video Tools',
    icon: Video,
    tools: [
      { id: 'yt-thumbnail', name: 'YouTube Thumbnail Downloader' },
      { id: 'video-to-gif', name: 'Video to GIF' },
      { id: 'subtitle-gen', name: 'Subtitle Generator' },
    ]
  }
];
