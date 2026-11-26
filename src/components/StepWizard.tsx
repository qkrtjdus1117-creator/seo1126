import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  AGE_OPTIONS,
  GROUP_OPTIONS,
  RESIDENCE_OPTIONS,
  SPECIAL_STATUS_OPTIONS,
  getTodayIso,
  getUpcomingChildrensDayIso,
  getUpcomingCultureDayIso,
  getUpcomingSaturdayIso,
  inspectVisitDate,
} from '../data/diagnosisRules';
import type { DiagnosisAnswers, QuestionOption } from '../types/diagnosis';

interface StepWizardProps {
  currentStep: number;
  answers: DiagnosisAnswers;
  onUpdateAnswer: <K extends keyof DiagnosisAnswers>(
    key: K,
    value: DiagnosisAnswers[K],
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const STEP_META = [
  {
    indexLabel: '01 / 05',
    category: '나이 확인',
    title: '관람하시는 분의 연령대는 어떻게 되나요?',
    subtitle: '영유아·어린이·청소년 및 어르신(만 65세 이상) 여부에 따라 요금 기준이 달라집니다.',
  },
  {
    indexLabel: '02 / 05',
    category: '거주지 확인',
    title: '현재 주민등록상 거주지가 어디인가요?',
    subtitle: '천안시민은 조례에 따라 관람료 감면 혜택이 적용됩니다.',
  },
  {
    indexLabel: '03 / 05',
    category: '단체 여부',
    title: '개인 관람인가요, 20인 이상 단체 관람인가요?',
    subtitle: '20인 이상이 동시에 입장하는 단체 관람에는 단체 감면 기준이 적용됩니다.',
  },
  {
    indexLabel: '04 / 05',
    category: '우대·감면 자격',
    title: '장애인·국가유공자 등 우대 대상에 해당하나요?',
    subtitle: '본인에게 해당하는 항목이 있다면 선택해 주세요. 중복 시 가장 유리한 1개 혜택이 적용됩니다.',
  },
  {
    indexLabel: '05 / 05',
    category: '방문일 확인',
    title: '천안박물관 방문 예정일은 언제인가요?',
    subtitle: "매월 마지막 주 수요일 '문화가 있는 날' 등 무료 개방일과 정기 휴관일 여부를 함께 확인합니다.",
  },
] as const;

function OptionList<T extends string>({
  options,
  selectedValue,
  onSelect,
  groupLabel,
}: {
  options: QuestionOption<T>[];
  selectedValue: T | null;
  onSelect: (val: T) => void;
  groupLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={groupLabel} className="space-y-3">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option.value)}
            className={`group flex min-h-[64px] w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5143] ${
              isSelected
                ? 'border-[#1f5143] bg-[#1f5143]/[0.04]'
                : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/70'
            }`}
          >
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-[15px] font-semibold text-stone-900 leading-snug">
                {option.label}
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                {option.description}
              </p>
              {option.hint && (
                <p
                  className={`pt-0.5 text-xs font-medium ${
                    isSelected ? 'text-[#1f5143]' : 'text-stone-500'
                  }`}
                >
                  {option.hint}
                </p>
              )}
            </div>

            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                isSelected
                  ? 'border-[#1f5143] bg-[#1f5143] text-white'
                  : 'border-stone-300 bg-white text-transparent group-hover:border-stone-400'
              }`}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function StepWizard({
  currentStep,
  answers,
  onUpdateAnswer,
  onNext,
  onPrev,
}: StepWizardProps) {
  const meta = STEP_META[currentStep];
  const progressPercent = ((currentStep + 1) / STEP_META.length) * 100;

  const isCurrentStepValid = (() => {
    switch (currentStep) {
      case 0:
        return answers.ageGroup !== null;
      case 1:
        return answers.residence !== null;
      case 2:
        return answers.groupType !== null;
      case 3:
        return answers.specialStatus !== null;
      case 4:
        return Boolean(answers.visitDate);
      default:
        return false;
    }
  })();

  const dateInfo = inspectVisitDate(answers.visitDate);
  const todayIso = getTodayIso();
  const saturdayIso = getUpcomingSaturdayIso();
  const cultureDayIso = getUpcomingCultureDayIso();
  const childrensDayIso = getUpcomingChildrensDayIso();

  const quickDates = [
    { label: '오늘 방문', value: todayIso },
    { label: '이번 주 토요일', value: saturdayIso },
    { label: '이달 문화가 있는 날', value: cultureDayIso },
    { label: '어린이날 (5/5)', value: childrensDayIso },
  ];

  return (
    <section
      aria-label={`자가진단 ${currentStep + 1}단계`}
      className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7"
    >
      {/* Progress & Editorial Index */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-2 font-medium tabular-nums">
            <span className="text-[#1f5143] font-semibold">{meta.indexLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{meta.category}</span>
          </div>
          <span className="tabular-nums text-stone-400">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-label="진단 진행률"
          className="h-1 w-full overflow-hidden rounded-full bg-stone-100"
        >
          <div
            className="h-full bg-[#1f5143] transition-all duration-200 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Heading */}
      <div className="mb-6 space-y-2">
        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900 leading-snug text-balance">
          {meta.title}
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed">{meta.subtitle}</p>
      </div>

      {/* Step Content */}
      <div className="min-h-[260px]">
        {currentStep === 0 && (
          <OptionList
            options={AGE_OPTIONS}
            selectedValue={answers.ageGroup}
            onSelect={(val) => onUpdateAnswer('ageGroup', val)}
            groupLabel="연령대 선택"
          />
        )}

        {currentStep === 1 && (
          <OptionList
            options={RESIDENCE_OPTIONS}
            selectedValue={answers.residence}
            onSelect={(val) => onUpdateAnswer('residence', val)}
            groupLabel="거주지 선택"
          />
        )}

        {currentStep === 2 && (
          <OptionList
            options={GROUP_OPTIONS}
            selectedValue={answers.groupType}
            onSelect={(val) => onUpdateAnswer('groupType', val)}
            groupLabel="단체 여부 선택"
          />
        )}

        {currentStep === 3 && (
          <OptionList
            options={SPECIAL_STATUS_OPTIONS}
            selectedValue={answers.specialStatus}
            onSelect={(val) => onUpdateAnswer('specialStatus', val)}
            groupLabel="우대 및 감면 자격 선택"
          />
        )}

        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <label
                htmlFor="visit-date-input"
                className="mb-2 block text-xs font-medium text-stone-600"
              >
                날짜 직접 선택
              </label>
              <div className="relative">
                <Calendar
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
                  aria-hidden="true"
                />
                <input
                  id="visit-date-input"
                  type="date"
                  value={answers.visitDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      onUpdateAnswer('visitDate', e.target.value);
                    }
                  }}
                  className="min-h-[48px] w-full rounded-xl border border-stone-300 bg-white pl-10 pr-4 text-sm font-medium text-stone-900 tabular-nums focus:border-[#1f5143] focus:outline-none focus:ring-2 focus:ring-[#1f5143]/20"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-stone-600">
                자주 확인하는 날짜 빠른 선택
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickDates.map((preset) => {
                  const active = answers.visitDate === preset.value;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => onUpdateAnswer('visitDate', preset.value)}
                      className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap truncate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5143] ${
                        active
                          ? 'border-[#1f5143] bg-[#1f5143] text-white'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Inspection Card for Selected Date */}
            <div className="rounded-xl border border-stone-200 bg-[#f7f7f4] p-4 space-y-2">
              <div className="flex items-center justify-between gap-2 text-sm font-semibold text-stone-900 tabular-nums">
                <span>선택한 방문일</span>
                <span>{dateInfo.formattedKorean}</span>
              </div>

              {dateInfo.benefitLabel && (
                <div className="flex items-start gap-2 rounded-lg border border-[#1f5143]/25 bg-[#1f5143]/[0.06] p-3 text-xs font-medium text-[#1f5143]">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{dateInfo.benefitLabel}</span>
                </div>
              )}

              {dateInfo.closedReason ? (
                <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs font-medium text-amber-900 leading-relaxed">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                  <span>{dateInfo.closedReason}</span>
                </div>
              ) : (
                !dateInfo.benefitLabel && (
                  <p className="text-xs text-stone-600 leading-relaxed">
                    일반 운영일 기준입니다. 동절기(11월~2월)는 17:00, 하절기(3월~10월)는 18:00까지 운영합니다.
                  </p>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons (Thumb-friendly 48px targets) */}
      <div className="mt-7 flex items-center justify-between gap-3 border-t border-stone-100 pt-5">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep === 0}
          className={`inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5143] ${
            currentStep === 0
              ? 'cursor-not-allowed border-stone-200 bg-stone-50 text-stone-300'
              : 'cursor-pointer border-stone-300 bg-white text-stone-700 hover:bg-stone-50 active:scale-[0.98]'
          }`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          이전
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isCurrentStepValid}
          className={`inline-flex min-h-[48px] flex-1 sm:flex-none sm:min-w-[168px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f5143] ${
            isCurrentStepValid
              ? 'cursor-pointer bg-[#1f5143] text-white hover:bg-[#173e33] active:scale-[0.98]'
              : 'cursor-not-allowed bg-stone-200 text-stone-400'
          }`}
        >
          <span>{currentStep === 4 ? '결과 확인하기' : '다음 질문'}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
