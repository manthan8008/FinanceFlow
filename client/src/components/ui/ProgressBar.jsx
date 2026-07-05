import { motion } from "framer-motion";

export default function ProgressBar({ value, tone = "bg-mint" }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
      <motion.div initial={{ width: 0 }} animate={{ width: `${safeValue}%` }} transition={{ duration: 0.7 }} className={`h-full rounded-full ${tone}`} />
    </div>
  );
}
