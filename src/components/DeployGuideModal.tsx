import React, { useState } from 'react';
import { X, Github, ExternalLink, Check, Terminal, Globe, ArrowUpRight, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const vercelJsonConfig = `{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-neutral-900 dark:text-neutral-100 max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg tracking-tight">
                  GitHub & Vercel Deployment Guide
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Deploy this minimalist productivity app anywhere in 2 steps
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5 text-xs sm:text-sm">
            
            {/* Step 1: Push to GitHub */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                  <Github className="w-4 h-4" />
                  <span>Step 1: Push to GitHub</span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `git init\ngit add .\ngit commit -m "feat: minimalist productivity todo app"\ngit branch -M main\ngit remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git\ngit push -u origin main`,
                      'git'
                    )
                  }
                  className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  {copiedSection === 'git' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Commands</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                In Google AI Studio, click the top-right <strong className="text-neutral-900 dark:text-neutral-200">Settings</strong> menu &rarr; <strong className="text-neutral-900 dark:text-neutral-200">Export to GitHub</strong> or download as ZIP.
              </p>
              <pre className="p-2.5 rounded-lg bg-neutral-900 text-neutral-200 dark:bg-neutral-950 text-[11px] font-mono overflow-x-auto">
{`git init
git add .
git commit -m "feat: minimalist productivity todo app"
git branch -M main
git remote add origin https://github.com/<YOUR-USER>/<YOUR-REPO>.git
git push -u origin main`}
              </pre>
            </div>

            {/* Step 2: Deploy to Vercel */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                  <div className="w-4 h-4 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[9px] font-bold rounded-xs">
                    ▲
                  </div>
                  <span>Step 2: Deploy on Vercel</span>
                </div>
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
                >
                  <span>Open Vercel</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-600 dark:text-neutral-400 text-xs pl-1">
                <li>Go to <strong className="text-neutral-900 dark:text-neutral-200">vercel.com/new</strong> and import your GitHub repository.</li>
                <li>Framework Preset: <strong className="text-neutral-900 dark:text-neutral-200">Vite</strong> (auto-detected).</li>
                <li>Build Command: <code className="px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 font-mono text-[11px]">npm run build</code></li>
                <li>Output Directory: <code className="px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 font-mono text-[11px]">dist</code></li>
                <li>Click <strong className="text-neutral-900 dark:text-neutral-200">Deploy</strong>! Your live URL is generated instantly.</li>
              </ol>
            </div>

          </div>

          <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
