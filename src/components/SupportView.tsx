import React from 'react';
import { HelpCircle, MessageSquare, BookOpen, Github, Twitter, ExternalLink, Mail, ShieldQuestion } from 'lucide-react';
import { motion } from 'motion/react';

export const SupportView = () => {
  const FAQ = [
    {
      q: "What is zBTC?",
      a: "zBTC is a privacy-preserving representation of Bitcoin on Starknet. It is minted when you deposit BTC into the ShadowBTC shielded vault."
    },
    {
      q: "How do STARK proofs ensure my privacy?",
      a: "STARK proofs allow you to prove you own a specific amount of zBTC without revealing which commitment in the Merkle tree belongs to you, effectively breaking the link between your identity and your assets."
    },
    {
      q: "Is ShadowBTC audited?",
      a: "ShadowBTC's Cairo smart contracts are formally verified and have undergone rigorous internal audits by StarkWare ecosystem partners."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold">Support Center</h2>
        <p className="text-white/40 text-sm">Get help with the ShadowBTC protocol and shielded transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* FAQ Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <ShieldQuestion size={16} />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {FAQ.map((item, i) => (
                <div key={i} className="glass p-6 rounded-2xl border-white/5 hover:border-brand-primary/20 transition-colors">
                  <h4 className="text-sm font-bold mb-2">{item.q}</h4>
                  <p className="text-xs text-white/60 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <MessageSquare size={14} />
              Community & Social
            </h4>
            
            <div className="space-y-2">
              <a href="#" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Twitter size={18} className="text-brand-primary" />
                  <span className="text-sm font-medium">Twitter</span>
                </div>
                <ExternalLink size={14} className="text-white/20 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Github size={18} />
                  <span className="text-sm font-medium">GitHub</span>
                </div>
                <ExternalLink size={14} className="text-white/20 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-indigo-400" />
                  <span className="text-sm font-medium">Discord</span>
                </div>
                <ExternalLink size={14} className="text-white/20 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <BookOpen size={14} />
              Documentation
            </h4>
            <p className="text-xs text-white/40 leading-relaxed">
              Learn more about the technical specifications of ShadowBTC, STARK proofs, and Cairo 2.x integration.
            </p>
            <button className="w-full btn-secondary py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              Read Docs <BookOpen size={14} />
            </button>
          </div>

          <div className="glass p-6 rounded-2xl border-brand-primary/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 mb-4 flex items-center gap-2">
              <Mail size={14} />
              Direct Support
            </h4>
            <p className="text-[10px] text-white/40 mb-4">
              For institutional inquiries and technical support, contact our core team.
            </p>
            <button className="w-full py-2 text-xs font-bold text-white/60 hover:text-white transition-colors">
              support@shadowbtc.io
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
