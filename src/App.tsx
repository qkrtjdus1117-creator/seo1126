import { useMemo, useRef, useState } from 'react';
import { Clock, Landmark, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { DiagnosisResult } from './components/DiagnosisResult';
import { MuseumHeader } from './components/MuseumHeader';
import { StepWizard } from './components/StepWizard';
import {
  MUSEUM_CONTACT,
  evaluateDiagnosis,
  getAnswerDisplayLabel,
  getTodayIso,
} from './data/diagnosisRules';
import type { DiagnosisAnswers } from './types/diagnosis';

const GALLERY_IMAGE_SRC = '/src/assets/images/cheonan_museum_gallery_1795668348142.jpg';

const STEP_SUMMARY_ITEMS = [
  '나이',
  '거주지',
  '단체 여부',
  '우대·감면 자격',
  '방문일',
] as const;

function createInitialAnswers(): DiagnosisAnswers {
  return {
    ageGroup: null,
    residence: null,
    groupType: null,
    specialStatus: null,
    visitDate: getTodayIso(),
  };
}

export default function App() {
  const [answers, setAnswers] = useState<DiagnosisAnswers>(createInitialAnswers);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const infoSectionRef = useRef<HTMLElement | null>(null);
  const mainTopRef = useRef<HTMLDivElement | null>(null);

  const result = useMemo(() => evaluateDiagnosis(answers), [answers]);

  const handleUpdateAnswer = <K extends keyof DiagnosisAnswers>(
    key: K,
    value: DiagnosisAnswers[K],
  ) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleEditStep = (stepIndex: number) => {
    setIsCompleted(false);
    setCurrentStep(stepIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnswers(createInitialAnswers());
    setCurrentStep(0);
    setIsCompleted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToInfo = () => {
    const target = document.getElementById('museum-contact') ?? infoSectionRef.current;
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasAnyProgress =
    isCompleted ||
    currentStep > 0 ||
    answers.ageGroup !== null ||
    answers.residence !== null ||
    answers.groupType !== null ||
    answers.specialStatus !== null;

  return (
    <div id="top" ref={mainTopRef} className="min-h-dvh flex flex-col bg-[#f7f7f4] text-stone-900">
      <MuseumHeader
        onReset={handleReset}
        onJumpToInfo={handleJumpToInfo}
        showReset={hasAnyProgress}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* Left Column: Curatorial Context, Gallery Visual & Live Step Overview */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
              {/* Museum Gallery Image with Resilient Fallback */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-200">
                {!imageError ? (
                  <img
                    src={GALLERY_IMAGE_SRC}
                    alt="천안박물관 전시실 내부와 청자 유물 전시 전경"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200 p-4 text-center">
                    <Landmark className="h-8 w-8 text-[#1f5143]" aria-hidden="true" />
                    <span className="mt-2 font-serif text-sm font-semibold text-stone-700">
                      천안박물관 전시관
                    </span>
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-xs text-stone-200">
                    충청남도 천안시 · 상설 및 기획전시
                  </p>
                  <p className="mt-0.5 font-serif text-base font-semibold tracking-tight">
                    천안의 역사와 문화가 담긴 공간
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span>관람료 자가진단</span>
                  <span aria-hidden="true">·</span>
                  <span>질문 5문항</span>
                  <span aria-hidden="true">·</span>
                  <span>약 30초 소요</span>
                </div>

                <h1 className="mt-2.5 font-serif text-2xl font-semibold text-stone-900 leading-snug text-balance">
                  관람료 감면·무료 대상 자가진단
                </h1>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  방문 전 5가지 질문에 답하시면 무료, 감면, 일반 요금 중 해당하는 기준과 지참 서류를 바로 안내해 드립니다.
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-4 text-xs text-stone-500">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#1f5143]" aria-hidden="true" />
                  <span>별도 로그인이나 개인정보 저장 없이 브라우저에서만 확인됩니다.</span>
                </div>
              </div>
            </div>

            {/* Desktop Step Progress Summary Rail */}
            {!isCompleted && (
              <div className="hidden lg:block rounded-2xl border border-stone-200 bg-white p-5">
                <h2 className="text-xs font-semibold text-stone-500">진단 항목 목록</h2>
                <ol className="mt-3 divide-y divide-stone-100">
                  {STEP_SUMMARY_ITEMS.map((label, idx) => {
                    const isCurrent = idx === currentStep;
                    const isAnswered =
                      (idx === 0 && answers.ageGroup !== null) ||
                      (idx === 1 && answers.residence !== null) ||
                      (idx === 2 && answers.groupType !== null) ||
                      (idx === 3 && answers.specialStatus !== null) ||
                      (idx === 4 && currentStep === 4);

                    return (
                      <li key={label}>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(idx)}
                          className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm transition-colors hover:text-[#1f5143] cursor-pointer"
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={`tabular-nums text-xs font-semibold ${
                                isCurrent ? 'text-[#1f5143]' : 'text-stone-400'
                              }`}
                            >
                              0{idx + 1}
                            </span>
                            <span
                              className={
                                isCurrent
                                  ? 'font-semibold text-stone-900'
                                  : 'font-medium text-stone-600'
                              }
                            >
                              {label}
                            </span>
                          </span>
                          <span className="max-w-[140px] truncate text-xs text-stone-500 tabular-nums">
                            {isAnswered ? getAnswerDisplayLabel(idx, answers) : '선택 대기'}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </aside>

          {/* Right Column: 1-by-1 Question Wizard OR Final Result Sheet */}
          <div className="lg:col-span-7 space-y-6">
            {!isCompleted ? (
              <>
                <StepWizard
                  currentStep={currentStep}
                  answers={answers}
                  onUpdateAnswer={handleUpdateAnswer}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />

                {/* Compact Contact & Hours Strip for Visitors Before Completion */}
                <section
                  id="museum-contact"
                  ref={infoSectionRef}
                  aria-label="천안박물관 관람 및 문의 안내"
                  className="rounded-2xl border border-stone-200 bg-white p-5"
                >
                  <h2 className="font-serif text-base font-semibold text-stone-900">
                    천안박물관 이용 및 문의 안내
                  </h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs sm:text-sm text-stone-600">
                    <div className="flex items-start gap-2.5">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5143]" aria-hidden="true" />
                      <div>
                        <div className="font-medium text-stone-900">{MUSEUM_CONTACT.name}</div>
                        <a
                          href={`tel:${MUSEUM_CONTACT.phone}`}
                          className="font-semibold text-[#1f5143] hover:underline tabular-nums"
                        >
                          {MUSEUM_CONTACT.phone}
                        </a>
                        <span className="ml-1.5 text-xs text-stone-500 tabular-nums">
                          (시 콜센터 {MUSEUM_CONTACT.cityCallCenter})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" aria-hidden="true" />
                      <div>
                        <div className="font-medium text-stone-900">관람시간 · 휴관일</div>
                        <p className="text-xs leading-relaxed">
                          09:00~18:00 (동절기 17:00) · {MUSEUM_CONTACT.closedDays} 휴관
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 sm:col-span-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" aria-hidden="true" />
                      <span className="text-xs sm:text-sm">{MUSEUM_CONTACT.address}</span>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <DiagnosisResult
                answers={answers}
                result={result}
                onEditStep={handleEditStep}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer with Mandatory Disclaimer */}
      <footer className="mt-auto border-t border-stone-200 bg-white/70">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <p className="text-sm font-semibold text-stone-900">
            본 결과는 참고용이며, 현장에서 서류 확인에 따라 달라질 수 있습니다
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
            <span>천안박물관</span>
            <span aria-hidden="true">·</span>
            <span>외부 API 미연동</span>
            <span aria-hidden="true">·</span>
            <span>개인정보 미저장</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">문의 {MUSEUM_CONTACT.phone}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
