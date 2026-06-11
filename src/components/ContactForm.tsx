import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, User, Mail, MessageSquare, Sparkles } from 'lucide-react';
import { saveMessage } from '../data';

interface ContactFormProps {
  onSuccess: () => void; // callbacks to increase success analytics events
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Field triggers
  const validateField = (name: string, value: string) => {
    let err = '';
    if (!value.trim()) {
      err = `${name.charAt(0).toUpperCase() + name.slice(1)} tidak boleh kosong.`;
    } else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      err = 'Alamat email tidak valid.';
    }
    return err;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error on write
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Total validation
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key as keyof typeof formData]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate natural response latency
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    const newInquiry = {
      id: `msg-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      timestamp: new Date().toLocaleString('id-ID'),
      status: 'unread' as const
    };

    saveMessage(newInquiry);
    
    setIsSubmitting(false);
    setSubmitted(true);
    onSuccess(); // Fire real analytical increment
    
    // Reset forms
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl font-bold text-white tracking-tight">
            Hubungi Saya
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Kirim ide proyek, pertanyaan bisnis, atau say hello. Kami siap berkolaborasi.
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-sm tracking-wider font-semibold">
          MF
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            id="contact-form-main"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-zinc-500" /> Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama Anda..."
                className={`w-full rounded-lg border bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${
                  errors.name ? 'border-red-500/60 focus:ring-red-500/50' : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/40'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-500" /> Alamat Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className={`w-full rounded-lg border bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${
                  errors.email ? 'border-red-500/60 focus:ring-red-500/50' : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/40'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Subject Input */}
            <div>
              <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-zinc-500" /> Subjek Pesan
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Misal: Kerja Sama, Kemitraan Proyek"
                className={`w-full rounded-lg border bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${
                  errors.subject ? 'border-red-500/60 focus:ring-red-500/50' : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/40'
                }`}
              />
              {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
            </div>

            {/* Message Area */}
            <div>
              <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Deskripsi Pesan / Ide Proyek
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tuliskan ide kreatif Anda di sini secara lengkap..."
                className={`w-full rounded-lg border bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all resize-none ${
                  errors.message ? 'border-red-500/60 focus:ring-red-500/50' : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/40'
                }`}
              />
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-submit-contact"
              disabled={isSubmitting}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-black hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Mengirimkan...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Kirim Pesan
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            id="contact-form-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <div className="rounded-full bg-emerald-500/10 p-4 border border-emerald-500/30 text-emerald-400 mb-4 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="font-display text-xl font-bold text-white tracking-tight">
              Pesan Terkirim dengan Sukses!
            </h4>
            <p className="mt-2 max-w-sm text-sm text-zinc-400 leading-relaxed font-sans">
              Terima kasih telah menghubungi kami. Tim kreatif kami akan meninjau pesan Anda dan segera menghubungi Anda kembali dalam kurun waktu 1x24 jam.
            </p>
            <button
              id="btn-send-again"
              onClick={() => setSubmitted(false)}
              className="mt-6 flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Kirim Pesan Baru Lagi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
