interface Props {
  onOpenChat: () => void;
}

export function FirstVisitCallout({ onOpenChat }: Props) {
  return (
    <div role="status" className="relative animate-panel-in rounded-2xl border-2 border-brand/15 bg-brand-wash px-4 py-3 text-sm font-semibold leading-5 text-ink shadow-panel">
      <button type="button" onClick={onOpenChat} className="max-w-56 text-left transition hover:text-brand">
        Want to learn more about me? Come chat!
      </button>
      <span aria-hidden="true" className="absolute -bottom-1.5 right-6 size-3 rotate-45 border-b-2 border-r-2 border-brand/15 bg-brand-wash" />
    </div>
  );
}
