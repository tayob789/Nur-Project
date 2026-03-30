import { useEffect, useState } from 'react';

export function useCountdown(targetTime: string | null): { text: string; isUrgent: boolean } {
  const [text, setText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!targetTime) return;

    const update = () => {
      const now = new Date();
      const [h, m] = targetTime.split(':').map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);

      const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
      const hours = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;

      const urgent = diff < 5 * 60;
      setIsUrgent(urgent);

      if (hours > 0) setText(`${hours}h ${mins}m ${String(secs).padStart(2, '0')}s`);
      else if (mins > 0) setText(`${mins}m ${String(secs).padStart(2, '0')}s`);
      else setText(`${secs}s`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return { text, isUrgent };
}
