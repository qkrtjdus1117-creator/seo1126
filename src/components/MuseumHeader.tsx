import { RotateCcw } from 'lucide-react';

interface MuseumHeaderProps {
  onReset: () => void;
  onJumpToInfo: () => void;
  showReset: boolean;
}

export function MuseumHeader({ onReset, onJumpToInfo, showReset }: MuseumHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-stone-200/90 bg-[#f7f7f4]/92 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-8 px-4 sm:px-6">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onReset();
          }}
          className="font-serif text-lg font-semibold tracking-tight text-stone-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f5143]"
        >
          천안박물관
        </a>

        <nav
          aria-label="주요 메뉴"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600"
        >
          <button
            type="button"
            onClick={onReset}
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            자가진단
          </button>
          <button
            type="button"
            onClick={onJumpToInfo}
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            관람 안내
          </button>
          <a
            href="#museum-contact"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            문의처
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          {showReset ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-stone-800 hover:bg-stone-100 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5143]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              처음부터 다시
            </button>
          ) : (
            <a
              href="#museum-contact"
              className="inline-flex min-h-[40px] items-center rounded-lg bg-[#1f5143] px-4 py-2 text-xs font-medium text-white hover:bg-[#173e33] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5143]"
            >
              문의처 안내
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
