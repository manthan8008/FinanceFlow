export default function EmptyState({ title, description, action }) {
  return (
    <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-white/10">
      <div>
        <p className="text-lg font-bold text-ink dark:text-white">{title}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
