import { motion } from "framer-motion";

export default function MetricCard({ icon: Icon, label, value, detail, tone = "bg-sky-100 text-sky-700" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">{label}</p>
          <p className="mt-3 text-2xl font-bold text-ink dark:text-white">{value}</p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{detail}</p>
        </div>
        {Icon && (
          <span className={`grid size-11 place-items-center rounded-xl ${tone}`}>
            <Icon size={20} />
          </span>
        )}
      </div>
    </motion.div>
  );
}
