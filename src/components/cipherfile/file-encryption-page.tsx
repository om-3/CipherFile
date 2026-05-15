"use client";

import { useState } from 'react';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, File, KeyRound, Lock, Unlock, Copy, Check, Download, ArrowLeft } from 'lucide-react';
import { SuccessAnimation } from './success-animation';
import { ThemeToggle } from '../theme-toggle';

type Stage = 'upload' | 'select_action' | 'encrypted' | 'decrypted';

// --- Web Crypto API Helpers ---

// Generate a new AES-GCM key
async function generateKey() {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // exportable
    ['encrypt', 'decrypt']
  );
  return key;
}

// Export a CryptoKey to a string for sharing/storage
async function exportKey(key: CryptoKey): Promise<string> {
  const keyData = await crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(keyData);
}

// Import a key from its string representation
async function importKey(keyStr: string): Promise<CryptoKey> {
  try {
    const keyData = JSON.parse(keyStr);
    const key = await crypto.subtle.importKey(
      'jwk',
      keyData,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
    return key;
  } catch (e) {
    console.error("Key import failed:", e);
    throw new Error("Invalid key format.");
  }
}

// Encrypt data using AES-GCM
async function encryptData(key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV
  const encryptedContent = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  // Prepend the IV to the encrypted data for use in decryption
  const result = new Uint8Array(iv.length + encryptedContent.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encryptedContent), iv.length);

  return result.buffer;
}

// Decrypt data using AES-GCM
async function decryptData(key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
  if (data.byteLength < 12) {
      throw new Error("Invalid encrypted data: file is too short.");
  }
  const iv = data.slice(0, 12);
  const encryptedContent = data.slice(12);

  const decryptedContent = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedContent
  );
  return decryptedContent;
}


// --- Component ---

export function FileEncryptionPage() {
  const [stage, setStage] = useState<Stage>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [processedContent, setProcessedContent] = useState<ArrayBuffer | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStage('select_action');
      setProcessedContent(null);
      setDecryptedText(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setStage('select_action');
      setProcessedContent(null);
      setDecryptedText(null);
    }
  };

  const triggerSuccessAnimation = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };
  
  const handleEncrypt = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (arrayBuffer) {
            const newKey = await generateKey();
            const encryptedBuffer = await encryptData(newKey, arrayBuffer);
            const exportedKey = await exportKey(newKey);
            
            setProcessedContent(encryptedBuffer);
            setKey(exportedKey);
            setStage('encrypted');
            triggerSuccessAnimation();
        }
      };
      reader.onerror = () => {
        toast({ variant: "destructive", title: "Error reading file."});
      }
      reader.readAsArrayBuffer(file);
    } catch(err) {
       toast({ variant: "destructive", title: "Encryption Failed", description: (err as Error).message });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!file || !key) {
      toast({
        variant: 'destructive',
        title: 'Missing File or Key',
        description: 'Please provide both a file and a decryption key.',
      });
      return;
    }
    setIsProcessing(true);

    try {
      const importedKey = await importKey(key);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (arrayBuffer) {
           try {
            const decryptedBuffer = await decryptData(importedKey, arrayBuffer);
            const decoder = new TextDecoder();
            const decryptedString = decoder.decode(decryptedBuffer);

            setProcessedContent(decryptedBuffer); // for download
            setDecryptedText(decryptedString); // for display
            setStage('decrypted');
            triggerSuccessAnimation();
          } catch (decryptErr) {
             toast({
                variant: 'destructive',
                title: 'Decryption Failed',
                description: 'The file could not be decrypted. Please check if the key is correct and the file is not corrupted.',
            });
          }
        }
      };
      reader.onerror = () => {
        toast({ variant: "destructive", title: "Error reading file."});
      }
      reader.readAsArrayBuffer(file);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Decryption Failed',
        description: (err as Error).message,
      });
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (processedContent === null || !file) return;
    const blob = new Blob([processedContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${stage === 'encrypted' ? 'encrypted' : 'decrypted'}-${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyKey = () => {
    if(!key) return;
    navigator.clipboard.writeText(key);
    setCopied(true);
    toast({ title: 'Key Copied!', description: 'The key has been copied to your clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  }

  const reset = () => {
    setFile(null);
    setKey('');
    setProcessedContent(null);
    setDecryptedText(null);
    setStage('upload');
  }

  const goBack = () => {
    if (stage === 'encrypted' || stage === 'decrypted') {
        setStage('select_action');
        setProcessedContent(null);
        setDecryptedText(null);
    } else if (stage === 'select_action') {
        reset();
    }
  }
  
  const renderContent = () => {
    if (isProcessing) {
        return (
            <div className="flex flex-col items-center justify-center text-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                <p className="text-muted-foreground">Processing...</p>
                 <style jsx>{`
                    .loader {
                        border-top-color: hsl(var(--primary));
                        animation: spinner 1.5s linear infinite;
                    }
                    @keyframes spinner {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (showSuccess) return <SuccessAnimation />;
    
    switch (stage) {
      case 'upload':
        return (
          <div 
            className="text-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
            onClick={() => document.getElementById('file-upload')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm text-muted-foreground">any file type</p>
            <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
          </div>
        );
      
      case 'select_action':
        return (
          <div className="text-center">
            <File className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-4 font-semibold truncate">{file?.name}</p>
            <p className="text-sm text-muted-foreground">File is ready. What's next?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Button size="lg" onClick={handleEncrypt} disabled={isProcessing}><Lock className="mr-2" /> Encrypt</Button>
              <div className="flex flex-col">
                <Input 
                  id="key-input" 
                  placeholder="Paste decryption key here..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="text-center mb-2"
                  aria-label="Decryption Key"
                />
                <Button size="lg" variant="secondary" onClick={handleDecrypt} disabled={!key || isProcessing}>
                    <Unlock className="mr-2" /> Decrypt
                </Button>
              </div>
            </div>
          </div>
        );

      case 'encrypted':
        return (
          <div className="text-center space-y-4">
             <File className="mx-auto h-12 w-12 text-accent" />
             <h3 className="text-xl font-semibold">Encryption Successful</h3>
             <p className="text-muted-foreground">Your file has been encrypted. Download it and save your key.</p>
             <div className="p-3 bg-muted rounded-md flex items-center justify-between gap-2">
                <KeyRound className="h-5 w-5 text-accent flex-shrink-0" />
                <p className="text-sm font-mono truncate text-muted-foreground flex-grow text-left">
                  {key}
                </p>
                <Button variant="ghost" size="icon" onClick={handleCopyKey}>
                  {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
             <Button onClick={handleDownload} className="w-full"><Download className="mr-2"/> Download Encrypted File</Button>
          </div>
        );

      case 'decrypted':
        return (
          <div className="text-center space-y-4">
            <File className="mx-auto h-12 w-12 text-accent" />
            <h3 className="text-xl font-semibold">Decryption Successful</h3>
            <p className="text-muted-foreground">Your file has been decrypted.</p>
            <Card className="text-left max-h-48 overflow-auto">
              <CardContent className="p-4">
                <pre className="text-sm whitespace-pre-wrap">{decryptedText ?? 'No preview available.'}</pre>
              </CardContent>
            </Card>
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2" /> Download Decrypted File
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground font-headline">CipherFile</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground hidden sm:block">Your simple & secure file encryption tool</p>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {stage === 'upload' && 'Upload Your File'}
                {stage === 'select_action' && 'Choose Your Action'}
                {stage === 'encrypted' && 'Your Encrypted File'}
                {stage === 'decrypted' && 'Your Decrypted File'}
              </CardTitle>
              <CardDescription className="text-center h-9">
                {stage === 'upload' && 'Start by selecting a file from your device.'}
                {stage !== 'upload' && (
                  <div className="flex justify-center items-center gap-4">
                    <Button variant="link" onClick={goBack} disabled={isProcessing}>
                      <ArrowLeft className="mr-2" /> Back
                    </Button>
                    <Button variant="link" onClick={reset} disabled={isProcessing}>
                      Start Over
                    </Button>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[250px] flex items-center justify-center">
              {renderContent()}
            </CardContent>
          </Card>

          {/* Premium Footer */}
          <footer className="mt-10 border-t border-white/10 pt-6 pb-4">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-sm text-muted-foreground">
                Developed by
                <span className="text-cyan-400 font-semibold ml-1">OM YERPUDE</span>
              </h3>
              <div className="flex items-center gap-3 mt-4 flex-wrap justify-center">
                <a
                  href="https://github.com/om-3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition text-cyan-400 text-sm"
                >
                  GitHub
                </a>
                <a
                  href="https://www.instagram.com/_om_3.y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition text-pink-400 text-sm"
                >
                  Instagram
                </a>
                <a
                  href="mailto:omyerpude2005@gmail.com"
                  className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition text-green-400 text-sm"
                >
                  Email
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-5 opacity-60">
                © 2026 CipherFile
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}