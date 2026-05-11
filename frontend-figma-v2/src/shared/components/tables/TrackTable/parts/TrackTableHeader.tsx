/**
 * TrackTableHeader — column labels aligned with TrackTableRow widths.
 * Spacer widths must match the row exactly to keep columns aligned.
 */
export function TrackTableHeader() {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-lm-gray-200">
      {/* cover spacer */}
      <span className="w-11 flex-shrink-0" />
      {/* play spacer */}
      <span className="w-4 flex-shrink-0" />
      <span className="text-xs font-semibold uppercase tracking-wider text-lm-gray-400 flex-1 min-w-[140px]">
        Canción + artista
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider text-lm-gray-400 w-12 text-center flex-shrink-0">
        BPM
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider text-lm-gray-400 flex-shrink-0">
        Pista
      </span>
      {/* waveform spacer (lg+) */}
      <span className="hidden lg:block flex-shrink-0 w-[63px]" />
      <span className="text-xs font-semibold uppercase tracking-wider text-lm-gray-400 flex-shrink-0 w-[104px]">
        Acciones
      </span>
      {/* CTA spacer */}
      <span className="flex-shrink-0 w-[88px]" />
    </div>
  );
}
