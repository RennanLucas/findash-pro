import React, { useState } from 'react';
import { X, Smartphone, Download, Copy, Check, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function InstallModal({ isOpen, onClose, installPrompt, onTriggerInstall }) {
  const [copied, setCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const mobileUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? window.location.origin + window.location.pathname
    : "http://192.168.0.90:5173";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(mobileUrl)}&margin=10`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDirectDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = './findash-pro.html';
    link.download = 'FinDash-Pro-App.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 animate-in slide-in-from-bottom-8 duration-200">
        
        {/* Handle for mobile */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrandLogo size={42} />
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Baixar Aplicativo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instale no seu celular com o ícone oficial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Option 1: Native 1-Click Install Button (PWA) if available */}
          {installPrompt && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Recomendado
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Instalar no seu Aparelho com 1 Clique
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Adiciona o FinDash Pro com ícone oficial direto na tela inicial do seu celular ou PC.
              </p>
              <button
                onClick={() => {
                  onTriggerInstall();
                  onClose();
                }}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/25 transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Instalar Agora no Aparelho</span>
              </button>
            </div>
          )}

          {/* Option 2: Direct Download Portable Offline Single-File App */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Baixar Aplicativo Portátil (.html)
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Baixe o aplicativo completo em um único arquivo leve. Ele roda direto no seu celular ou computador mesmo sem internet!
            </p>
            <button
              onClick={handleDirectDownload}
              className="w-full mt-1 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              {downloadStarted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Download Iniciado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo do App (Download Direto)</span>
                </>
              )}
            </button>
          </div>

          {/* Option 3: Access via Wi-Fi & QR Code */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Acessar no Celular via Wi-Fi:
            </h4>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white p-2 rounded-xl border border-slate-200 shrink-0">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code FinDash Pro" 
                  className="w-28 h-28 object-contain rounded-md"
                />
              </div>

              <div className="space-y-1.5 flex-1 text-center sm:text-left">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Aponte a câmera do celular para o QR Code ou acesse:
                </p>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="text"
                    readOnly
                    value={mobileUrl}
                    className="w-full text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0"
                    title="Copiar"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <p><b>No Chrome do celular:</b> Toque nos 3 pontinhos ➔ <b>"Instalar aplicativo"</b>.</p>
            <p><b>No Safari do iPhone:</b> Toque em Compartilhar ➔ <b>"Adicionar à Tela de Início"</b>.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
