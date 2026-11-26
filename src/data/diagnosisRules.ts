import type {
  AgeGroup,
  DateInspection,
  DiagnosisAnswers,
  DiagnosisResultData,
  GroupType,
  QuestionOption,
  RequiredDocument,
  ResidenceType,
  SpecialStatus,
} from '../types/diagnosis';

export const AGE_OPTIONS: QuestionOption<AgeGroup>[] = [
  {
    value: 'infant',
    label: '영유아 (만 6세 이하)',
    description: '취학 전 아동 및 만 6세 이하 어린이',
    hint: '연령 확인 시 무료 관람 대상',
  },
  {
    value: 'youth',
    label: '어린이·청소년 (만 7세 ~ 18세)',
    description: '초·중·고등학생 및 만 7세~18세 관람객',
    hint: '연령별 감면 요금 적용 대상',
  },
  {
    value: 'adult',
    label: '성인 (만 19세 ~ 64세)',
    description: '일반 성인 관람객',
    hint: '기본 관람 기준',
  },
  {
    value: 'senior',
    label: '어르신 (만 65세 이상)',
    description: '만 65세 이상 경로우대 대상자',
    hint: '경로우대 무료 관람 대상',
  },
];

export const RESIDENCE_OPTIONS: QuestionOption<ResidenceType>[] = [
  {
    value: 'cheonan',
    label: '천안시 거주 (천안시민)',
    description: '주민등록상 주소지가 충청남도 천안시인 경우',
    hint: '천안시민 관람료 감면 대상',
  },
  {
    value: 'other',
    label: '타 시·군 거주',
    description: '천안시 외 다른 지역에 주소를 둔 경우',
    hint: '일반 지역 기준',
  },
];

export const GROUP_OPTIONS: QuestionOption<GroupType>[] = [
  {
    value: 'individual',
    label: '개인 관람 (19인 이하)',
    description: '혼자 또는 가족·소규모 일행과 함께 방문',
  },
  {
    value: 'group',
    label: '단체 관람 (20인 이상)',
    description: '학교, 기관, 동호회 등 20인 이상 동시 입장',
    hint: '단체 관람료 감면 대상 · 사전 예약 권장',
  },
];

export const SPECIAL_STATUS_OPTIONS: QuestionOption<SpecialStatus>[] = [
  {
    value: 'none',
    label: '해당 사항 없음',
    description: '아래 우대·감면 자격에 해당하지 않는 경우',
  },
  {
    value: 'disabled',
    label: '등록 장애인 (동반 보호자 1인 포함)',
    description: '장애인복지법에 따른 등록 장애인 및 중증 장애인 보호자 1인',
    hint: '관람료 무료 대상',
  },
  {
    value: 'merit',
    label: '국가유공자·독립유공자·참전유공자',
    description: '유공자 본인 및 선순위 유족증 소지자',
    hint: '관람료 무료 대상',
  },
  {
    value: 'welfare',
    label: '기초생활수급자·차상위·한부모가족',
    description: '국민기초생활보장 수급자 및 법정 저소득 우대 대상',
    hint: '관람료 무료 대상',
  },
  {
    value: 'multichild',
    label: '다자녀 가정·병역명문가 등 우대',
    description: '천안시 다자녀 우대카드, 병역명문가증 소지자 등',
    hint: '관람료 감면 대상',
  },
];

export const MUSEUM_CONTACT = {
  name: '천안박물관 안내데스크',
  phone: '041-521-2891',
  cityCallCenter: '1422-36',
  address: '충청남도 천안시 동남구 천안대로 429-13 (삼룡동)',
  hoursSummer: '하절기 (3월~10월) 09:00 ~ 18:00',
  hoursWinter: '동절기 (11월~2월) 09:00 ~ 17:00',
  lastEntry: '입장 마감은 관람 종료 1시간 전까지',
  closedDays: '매주 월요일, 1월 1일, 설날·추석 당일',
};

const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function formatIsoDateLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayIso(): string {
  return formatIsoDateLocal(new Date());
}

export function getUpcomingSaturdayIso(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 6 ? 0 : (6 - day + 7) % 7;
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
  return formatIsoDateLocal(target);
}

export function getUpcomingCultureDayIso(): string {
  const now = new Date();
  const findLastWednesday = (year: number, monthIndex: number): Date => {
    const lastDay = new Date(year, monthIndex + 1, 0);
    const offset = (lastDay.getDay() - 3 + 7) % 7;
    return new Date(year, monthIndex, lastDay.getDate() - offset);
  };

  let candidate = findLastWednesday(now.getFullYear(), now.getMonth());
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (candidate < todayMidnight) {
    candidate = findLastWednesday(now.getFullYear(), now.getMonth() + 1);
  }
  return formatIsoDateLocal(candidate);
}

export function getUpcomingChildrensDayIso(): string {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let candidate = new Date(now.getFullYear(), 4, 5); // May 5
  if (candidate < todayMidnight) {
    candidate = new Date(now.getFullYear() + 1, 4, 5);
  }
  return formatIsoDateLocal(candidate);
}

export function inspectVisitDate(isoDate: string): DateInspection {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return {
      formattedKorean: '날짜 미선택',
      dayName: '-',
      isCultureDay: false,
      isChildrensDay: false,
      isRegularClosedDay: false,
      closedReason: null,
      benefitLabel: null,
    };
  }

  const [year, month, day] = parts;
  const dateObj = new Date(year, month - 1, day);
  const weekday = dateObj.getDay();
  const dayName = WEEKDAY_NAMES[weekday];
  const daysInMonth = new Date(year, month, 0).getDate();

  // Last Wednesday of the month = Culture Day
  const isCultureDay = weekday === 3 && day + 7 > daysInMonth;
  const isChildrensDay = month === 5 && day === 5;
  const isNewYearsDay = month === 1 && day === 1;
  const isMonday = weekday === 1;

  let closedReason: string | null = null;
  if (isNewYearsDay) {
    closedReason = '1월 1일(신정)은 박물관 정기 휴관일입니다.';
  } else if (isMonday) {
    closedReason =
      '매주 월요일은 박물관 정기 휴관일입니다. 공휴일과 겹치는 경우 운영 여부가 달라질 수 있으니 방문 전 안내데스크로 확인해 주세요.';
  }

  let benefitLabel: string | null = null;
  if (isCultureDay) {
    benefitLabel = "매월 마지막 주 수요일 '문화가 있는 날' 무료 개방 해당";
  } else if (isChildrensDay) {
    benefitLabel = '어린이날 기념 어린이·청소년 무료 개방일 해당';
  }

  return {
    formattedKorean: `${year}년 ${month}월 ${day}일 (${dayName})`,
    dayName,
    isCultureDay,
    isChildrensDay,
    isRegularClosedDay: isMonday || isNewYearsDay,
    closedReason,
    benefitLabel,
  };
}

export type ClassifiedFeeLabel = '무료' | '감면' | '일반 요금';

export function classifyAdmissionFee(answers: DiagnosisAnswers): ClassifiedFeeLabel {
  return evaluateDiagnosis(answers).tierLabel as ClassifiedFeeLabel;
}

export function evaluateDiagnosis(answers: DiagnosisAnswers): DiagnosisResultData {
  const dateInspection = inspectVisitDate(answers.visitDate);
  const freeReasons: string[] = [];
  const discountReasons: string[] = [];
  const freeDocuments: RequiredDocument[] = [];
  const discountDocuments: RequiredDocument[] = [];

  // 1. Age group checks
  if (answers.ageGroup === 'infant') {
    freeReasons.push('만 6세 이하 영유아 무료 관람 대상');
    freeDocuments.push({
      title: '연령 확인 서류 (필요시)',
      detail: '육안으로 확인이 어려운 경우 주민등록등본, 건강보험증 등 연령을 확인할 수 있는 서류',
      reasonTag: '영유아 확인',
    });
  } else if (answers.ageGroup === 'senior') {
    freeReasons.push('만 65세 이상 경로우대 무료 관람 대상');
    freeDocuments.push({
      title: '신분증 (사진·생년월일 기재)',
      detail: '주민등록증, 운전면허증, 여권 또는 모바일 신분증 등 만 65세 이상 확인 가능 신분증',
      reasonTag: '경로우대',
    });
  } else if (answers.ageGroup === 'youth') {
    const youthDoc: RequiredDocument = {
      title: '학생증 또는 청소년증',
      detail: '초·중·고등학생증, 청소년증, 주민등록등본 등 연령·신분 확인 서류',
      reasonTag: '어린이·청소년',
    };
    if (dateInspection.isChildrensDay) {
      freeReasons.push('어린이날(5월 5일) 어린이·청소년 무료 개방 대상');
      freeDocuments.push(youthDoc);
    } else {
      discountReasons.push('어린이·청소년 (만 7세 ~ 18세) 우대 요금 대상');
      discountDocuments.push(youthDoc);
    }
  }

  // 2. Special status checks
  if (answers.specialStatus === 'disabled') {
    freeReasons.push('등록 장애인 및 동반 보호자 1인(중증) 무료 대상');
    freeDocuments.push({
      title: '장애인등록증(복지카드) 또는 모바일 복지카드',
      detail: '심한 장애(기존 1~3급)의 경우 동반 보호자 1인까지 함께 무료 적용',
      reasonTag: '장애인 우대',
    });
  } else if (answers.specialStatus === 'merit') {
    freeReasons.push('국가·독립·참전유공자 및 유족 무료 대상');
    freeDocuments.push({
      title: '국가유공자증 또는 유족증',
      detail: '국가보훈부 발행 유공자증, 독립유공자증, 참전유공자증 또는 유족증',
      reasonTag: '보훈 우대',
    });
  } else if (answers.specialStatus === 'welfare') {
    freeReasons.push('국민기초생활수급자·차상위계층·한부모가족 무료 대상');
    freeDocuments.push({
      title: '수급자 증명서 또는 차상위·한부모가족 증명서',
      detail: '최근 3개월 이내 발급된 증명서와 본인 확인용 신분증(복지로 모바일 확인 포함)',
      reasonTag: '복지 우대',
    });
  } else if (answers.specialStatus === 'multichild') {
    discountReasons.push('다자녀 가정·병역명문가 등 조례 우대 감면 대상');
    discountDocuments.push({
      title: '다자녀 우대카드 또는 병역명문가증',
      detail: '천안시 다자녀 우대카드(행복키움카드 등), 가족관계증명서 또는 병역명문가증과 신분증',
      reasonTag: '다자녀·병역명문가',
    });
  }

  // 3. Visit date special open day
  if (dateInspection.isCultureDay) {
    freeReasons.push("매월 마지막 주 수요일 '문화가 있는 날' 무료 개방일");
  }

  // 4. Residence check
  if (answers.residence === 'cheonan') {
    discountReasons.push('천안시민(주민등록상 천안시 거주) 관람료 감면 대상');
    discountDocuments.push({
      title: '천안시 주소지 확인 신분증',
      detail: '현 주소지(충남 천안시)가 기재된 주민등록증, 운전면허증, 주민등록등본 또는 모바일 신분증',
      reasonTag: '천안시민 확인',
    });
  }

  // 5. Group check
  if (answers.groupType === 'group') {
    discountReasons.push('20인 이상 단체 관람 감면 대상');
    discountDocuments.push({
      title: '단체 관람 확인 및 인솔자 신분증',
      detail: '단체 관람 사전 예약 내역 또는 인솔자 신분증(20인 이상 동시 발권 시 적용)',
      reasonTag: '단체 관람',
    });
  }

  // Determine final tier: '무료' > '감면' > '일반 요금'
  if (freeReasons.length > 0) {
    const effectiveDocs: RequiredDocument[] = dateInspection.isCultureDay
      ? [
          {
            title: '별도 필요 서류 없음 (문화가 있는 날)',
            detail: '매월 마지막 주 수요일에는 모든 관람객에게 무료 개방이 적용됩니다. 매표소 안내에 따라 입장권을 발권받으세요.',
            reasonTag: '문화가 있는 날',
          },
        ]
      : freeDocuments.length > 0
        ? freeDocuments
        : [
            {
              title: '신분증 또는 확인 서류',
              detail: '해당 무료 대상 여부를 확인할 수 있는 신분증 또는 증명서를 지참해 주세요.',
              reasonTag: '기본 확인',
            },
          ];

    return {
      tier: 'free',
      tierLabel: '무료',
      headline: '관람료 무료 대상에 해당합니다',
      summary:
        '선택하신 조건을 기준으로 무료 관람 혜택이 적용됩니다. 매표소에서 아래 필요 서류를 제시하시면 무료 입장권을 발권받으실 수 있습니다.',
      appliedReasons: [...freeReasons, ...discountReasons],
      nonStackingNote:
        freeReasons.length + discountReasons.length > 1
          ? '여러 감면·무료 조건에 중복 해당되는 경우, 가장 유리한 혜택(무료) 1가지만 적용됩니다.'
          : null,
      documents: effectiveDocs,
      dateInspection,
    };
  }

  if (discountReasons.length > 0) {
    return {
      tier: 'discounted',
      tierLabel: '감면',
      headline: '관람료 감면 대상에 해당합니다',
      summary:
        '선택하신 조건을 기준으로 관람료 감면 혜택이 적용됩니다. 방문 당일 매표소에서 아래 필요 서류를 제시해 주세요.',
      appliedReasons: discountReasons,
      nonStackingNote:
        discountReasons.length > 1
          ? '감면 사유가 중복되는 경우 중복 할인은 적용되지 않으며, 1개의 감면 기준이 적용됩니다.'
          : null,
      documents: discountDocuments,
      dateInspection,
    };
  }

  return {
    tier: 'standard',
    tierLabel: '일반 요금',
    headline: '일반 관람료 적용 대상입니다',
    summary:
      '현재 선택하신 조건에서는 별도의 감면·무료 사유가 확인되지 않았습니다. 일반 성인 관람료 기준이 적용되며, 매월 마지막 주 수요일(문화가 있는 날) 방문 시 무료 관람이 가능합니다.',
    appliedReasons: ['만 19세~64세 일반 개인 관람 (감면·우대 조건 미해당)'],
    nonStackingNote: null,
    documents: [
      {
        title: '별도 필요 서류 없음',
        detail: '일반 요금 발권 시 별도의 증빙서류가 필요하지 않습니다. 현장 매표소 또는 무인발권기를 이용해 주세요.',
        reasonTag: '일반 발권',
      },
    ],
    dateInspection,
  };
}

export function getAnswerDisplayLabel(
  stepIndex: number,
  answers: DiagnosisAnswers,
): string {
  switch (stepIndex) {
    case 0:
      return AGE_OPTIONS.find((o) => o.value === answers.ageGroup)?.label ?? '미선택';
    case 1:
      return RESIDENCE_OPTIONS.find((o) => o.value === answers.residence)?.label ?? '미선택';
    case 2:
      return GROUP_OPTIONS.find((o) => o.value === answers.groupType)?.label ?? '미선택';
    case 3:
      return (
        SPECIAL_STATUS_OPTIONS.find((o) => o.value === answers.specialStatus)?.label ?? '미선택'
      );
    case 4:
      return inspectVisitDate(answers.visitDate).formattedKorean;
    default:
      return '';
  }
}
