import {
  AlertTriangle,
  BadgePercent,
  CheckCircle2,
  Clock,
  FileCheck2,
  MapPin,
  Pencil,
  Phone,
  RotateCcw,
  Ticket,
} from 'lucide-react';
import {
  MUSEUM_CONTACT,
  getAnswerDisplayLabel,
} from '../data/diagnosisRules';
import type { DiagnosisAnswers, DiagnosisResultData, FeeTier } from '../types/diagnosis';

interface DiagnosisResultProps {
  answers: DiagnosisAnswers;
  result: DiagnosisResultData;
  onEditStep: (stepIndex: number) => void;
  onReset: () => void;
}

const STEP_LABELS = ['나이', '거주지', '단체 여부', '우대·감면 자격', '방문 예정일'] as const;

function getTierStyles(tier: FeeTier) {
  switch (tier) {
    case 'free':
      return {
        container: 'border-[#1f5143]/30 bg-[#1f5143]/[0.05]',
        badge: 'bg-[#1f5143] text-white',
        icon: CheckCircle2,
        subAccent: 'text-[#1f5143]',
      };
    case 'discounted':
      return {
        container: 'border-[#8a6626]/30 bg-[#8a6626]/[0.06]',
        badge: 'bg-[#8a6626] text-white',
        icon: BadgePercent,
        subAccent: 'text-[#73531c]',
      };
    case 'standard':
    default:
      return {
        container: 'border-stone-300 bg-stone-100/80',
        badge: 'bg-stone-800 text-white',
        icon: Ticket,
        subAccent: 'text-stone-800',
      };
  }
}

export function DiagnosisResult({
  answers,
  result,
  onEditStep,
  onReset,
}: DiagnosisResultProps) {
  const style = getTierStyles(result.tier);
  const TierIcon = style.icon;

  return (
    <div className="space-y-6">
      {/* Primary Result Card */}
      <section
        aria-label="자가진단 결과"
        className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7"
      >
        <div className={`rounded-xl border p-5 ${style.container}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-stone-600">
              천안박물관 관람료 자가진단 결과
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-semibold whitespace-nowrap shrink-0 ${style.badge}`}
            >
              <TierIcon className="h-4 w-4" aria-hidden="true" />
              {result.tierLabel}
            </span>
          </div>

          <h2 className="mt-4 font-serif text-2xl sm:text-[26px] font-semibold text-stone-900 leading-snug text-balance">
            {result.headline}
          </h2>
          <p className="mt-2 text-sm text-stone-700 leading-relaxed">{result.summary}</p>
        </div>

        {/* Closed Day Warning if Monday / Jan 1 */}
        {result.dateInspection.closedReason && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs sm:text-sm text-amber-950 leading-relaxed">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold">정기 휴관일 확인 필요</p>
              <p className="mt-0.5 text-amber-900">{result.dateInspection.closedReason}</p>
            </div>
          </div>
        )}

        {/* Applied Reasons */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-stone-900">적용 기준</h3>
          <ul className="mt-2.5 space-y-2">
            {result.appliedReasons.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-2.5 text-sm text-stone-700 leading-relaxed"
              >
                <span
                  aria-hidden="true"
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                    result.tier === 'free'
                      ? 'bg-[#1f5143]'
                      : result.tier === 'discounted'
                        ? 'bg-[#8a6626]'
                        : 'bg-stone-500'
                  }`}
                />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
          {result.nonStackingNote && (
            <p className="mt-3 text-xs text-stone-500 leading-relaxed">
              {result.nonStackingNote}
            </p>
          )}
        </div>

        {/* Required Verification Documents */}
        <div className="mt-7 border-t border-stone-200 pt-6">
          <div className="flex items-center gap-2">
            <FileCheck2 className={`h-4 w-4 ${style.subAccent}`} aria-hidden="true" />
            <h3 className="text-sm font-semibold text-stone-900">
              필요 서류 목록
            </h3>
          </div>
          <div className="mt-3 divide-y divide-stone-100 rounded-xl border border-stone-200 bg-[#fafaf8]">
            {result.documents.map((doc) => (
              <div key={doc.title} className="p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-stone-900">{doc.title}</p>
                  <span className="text-xs font-medium text-stone-500">{doc.reasonTag}</span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {doc.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Answers Summary with Quick Edit */}
        <div className="mt-7 border-t border-stone-200 pt-6">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-stone-900">입력하신 조건</h3>
            <span className="text-xs text-stone-500">항목별 수정 가능</span>
          </div>
          <dl className="mt-3 divide-y divide-stone-100 border-y border-stone-200">
            {STEP_LABELS.map((label, idx) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <dt className="shrink-0 text-stone-500">{label}</dt>
                <div className="flex min-w-0 items-center gap-2">
                  <dd className="truncate font-medium text-stone-900 tabular-nums">
                    {getAnswerDisplayLabel(idx, answers)}
                  </dd>
                  <button
                    type="button"
                    onClick={() => onEditStep(idx)}
                    aria-label={`${label} 수정`}
                    className="inline-flex min-h-[36px] shrink-0 items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-600 hover:border-stone-300 hover:text-stone-900 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5143]"
                  >
                    <Pencil className="h-3 w-3" aria-hidden="true" />
                    수정
                  </button>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Reset Action */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-50 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5143]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            다른 조건으로 다시 진단하기
          </button>
        </div>
      </section>

      {/* Contact & Visiting Info Card */}
      <section
        id="museum-contact"
        aria-label="천안박물관 문의처 및 관람 안내"
        className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7"
      >
        <h3 className="font-serif text-lg font-semibold text-stone-900">
          천안박물관 문의처
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-stone-600">
          감면·무료 기준 세부 확인 및 단체 관람 사전 문의는 아래 천안박물관 안내데스크로 연락해 주세요.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href={`tel:${MUSEUM_CONTACT.phone}`}
            className="flex min-h-[56px] items-center gap-3 rounded-xl border border-stone-200 bg-[#fafaf8] p-4 hover:border-[#1f5143]/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5143]"
          >
            <Phone className="h-5 w-5 shrink-0 text-[#1f5143]" aria-hidden="true" />
            <div>
              <div className="text-xs text-stone-500">{MUSEUM_CONTACT.name}</div>
              <div className="text-base font-semibold text-stone-900 tabular-nums">
                {MUSEUM_CONTACT.phone}
              </div>
              <div className="text-xs text-stone-500 tabular-nums">
                천안시 민원콜센터 {MUSEUM_CONTACT.cityCallCenter}
              </div>
            </div>
          </a>

          <div className="flex min-h-[56px] items-start gap-3 rounded-xl border border-stone-200 bg-[#fafaf8] p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-stone-600" aria-hidden="true" />
            <div>
              <div className="text-xs text-stone-500">오시는 길</div>
              <div className="text-sm font-medium text-stone-900 leading-snug">
                {MUSEUM_CONTACT.address}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-3 rounded-xl border border-stone-200 bg-[#fafaf8] p-4">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-stone-600" aria-hidden="true" />
          <div className="space-y-1 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <div>
              <span className="font-semibold text-stone-900">관람시간: </span>
              {MUSEUM_CONTACT.hoursSummer} · {MUSEUM_CONTACT.hoursWinter} ({MUSEUM_CONTACT.lastEntry})
            </div>
            <div>
              <span className="font-semibold text-stone-900">정기휴관: </span>
              {MUSEUM_CONTACT.closedDays}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
