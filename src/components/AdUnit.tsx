import React, { useEffect } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'auto', responsive = true, className = '' }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-container my-10 mx-auto overflow-hidden rounded-2xl border border-gold-900/10 bg-surface-container-low/30 backdrop-blur-sm p-4 flex flex-col items-center justify-center min-h-[100px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
      {/* Dev indicator - only visible in dev if needed or as a subtle hint */}
      <div className="mt-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity">
        إعلان ملكي موثق 🏛️
      </div>
    </div>
  );
};

export default AdUnit;
