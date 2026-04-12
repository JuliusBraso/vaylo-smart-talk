const ru = {
  app: { name: "Vaylo", tagline: "AI-помощник для бюрократии и жизни в Германии", languageName: "Русский" },
  common: {
    unknown: "Неизвестно",
    employment: {
      freelancer: "Фрилансер / самозанятый",
      employee: "Наёмный работник",
      job_seeker: "Ищу работу",
    },
    family: {
      single: "Один / одна",
      family: "Пара / семья (без детей)",
      children: "Семья с детьми",
    },
    language: {
      A1: "A1",
      A2: "A2",
      B1: "B1",
      B2: "B2",
      C1: "C1",
    },
    goals: {
      bureaucracy: "Бюрократия и органы",
      job: "Работа и заявки",
      orientation: "Ориентация и быт",
    },
  },
  nav: { dashboard: "Главная", assistant: "Ассистент", letters: "Письма", forms: "Формы", guides: "Гайды", documents: "Документы", phrases: "Фразы", jobs: "Работа", taxes: "Налоги", settings: "Настройки", premium: "Premium" },
  onboarding: {
    title: "Добро пожаловать в Vaylo",
    subtitle: "Ваш персональный помощник для жизни в Германии.",
    description: "Мы помогаем с бюрократией, работой и повседневной жизнью.",
    question: "Для кого Vaylo?",
    optionSingle: "Я здесь один/одна",
    optionCouple: "Пара / семья (без детей)",
    optionFamilyKids: "Семья с детьми",
    continue: "Продолжить",
    privacyNote:
      "Ваши ответы помогают персонализировать Vaylo. Они используются только для настройки вашего опыта.",
    step: "Шаг {step} из {total}",
    questionFamily: "Для кого Vaylo?",
    back: "Назад",
    finish: "Завершить onboarding",
    kidsSchoolingTitle: "Дети и школа",
    kidsSchoolingDesc:
      "Это помогает лучше приоритизировать темы Kindergeld, садика и школы.",
    yesSchoolAge: "Да, как минимум один ребенок школьного возраста",
    notYetSmallKids: "Пока нет / только маленькие дети",
    employmentTitle: "Как вы сейчас работаете в Германии?",
    employmentDesc:
      "Это помогает Vaylo правильно приоритизировать работу, налоги и бюрократию.",
    employmentEmployee: "Сотрудник",
    employmentFreelancer: "Фрилансер / самозанятый",
    employmentJobSeeker: "Ищу работу",
    freelanceSetupTitle: "Фриланс-настройка",
    freelanceSetupDesc: "Вы уже регулярно выставляете немецкие счета?",
    yesRegularly: "Да, регулярно",
    notYetStarting: "Пока нет / только начинаю",
    jobUrgencyTitle: "Срочность поиска работы",
    jobUrgencyDesc:
      "Это определяет, насколько активно Vaylo приоритизирует job-модули и напоминания.",
    jobUrgencyRelaxed: "Пока присматриваюсь (спокойно)",
    jobUrgencyUrgent: "Мне срочно нужна работа",
    languageTitle: "Ваш уровень немецкого (реалистично)?",
    languageDesc:
      "Vaylo адаптирует язык и уровень объяснений под ваш текущий уровень.",
    goalsTitle: "С чем вам сейчас больше всего нужна помощь?",
    goalsDesc:
      "По этому мы определяем, какие модули показывать вверху дашборда.",
    goalBureaucracy: "Бюрократия и госорганы",
    goalJob: "Работа, контракты и счета",
    goalOrientation: "Ориентация и повседневная жизнь",
  },
  assistant: {
    title: "Ассистент",
    subtitle: "Describe your bureaucracy question. We match keywords and suggest Guides, Forms, and Letters - no AI API yet.",
    emptyHint: "Try: \"I need to register my address\" (Anmeldung) or \"Kindergeld status\".",
    noKeywordMatch: "No keyword match",
    inputPlaceholder: "Type your message...",
    send: "Send",
    fallbackExplanation: "The Assistant does not use an AI API yet. It matches a few core bureaucracy topics (Anmeldung, tax ID, Kindergeld, health insurance, residence permit). For anything else, browse step-by-step help in Guides.",
    openGuides: "Open Guides",
    browseForms: "Browse Forms",
    lettersTool: "Letters tool",
    anmeldungExplanation: "That sounds like address registration (Anmeldung). Start with the guide, then the form; use Letters to contact the Bürgeramt if you need an appointment.",
    anmeldungGuide: "Guide: Anmeldung",
    anmeldungForm: "Form: Anmeldung",
    anmeldungLetter: "Letter: Bürgeramt (appointment)",
    steuerIdExplanation: "That points to tax ID (Steuer-ID) topics. Follow the guide, check the Finanzamt form help, or draft a letter to the Finanzamt.",
    steuerIdGuide: "Guide: Steuer-ID",
    steuerIdForm: "Form: Steuer number",
    steuerIdLetter: "Letter: Finanzamt (Steuer-ID)",
    kindergeldExplanation: "That matches Kindergeld (child benefit). Open the guide and main application form, or write to the Familienkasse.",
    kindergeldGuide: "Guide: Kindergeld",
    kindergeldForm: "Form: Kindergeld application",
    kindergeldLetter: "Letter: Familienkasse (status)",
    healthInsuranceExplanation: "That sounds like statutory health insurance (Krankenkasse). Use the guide and membership form, or contact your insurer by letter.",
    healthInsuranceGuide: "Guide: Health insurance",
    healthInsuranceForm: "Form: Health insurance",
    healthInsuranceLetter: "Letter: Health insurance",
    residencePermitExplanation: "That fits residence permit or Ausländerbehörde tasks. See the extension guide, the application form, or draft a letter to the immigration office.",
    residencePermitGuide: "Guide: Residence permit",
    residencePermitForm: "Form: Extension application",
    residencePermitLetter: "Letter: Ausländerbehörde (extension)",
    buergergeldExplanation: "That matches Bürgergeld or Jobcenter topics. Open the guide and forms, or write to Jobcenter.",
    buergergeldGuide: "Guide: Bürgergeld",
    buergergeldForm: "Form: Bürgergeld",
    buergergeldLetter: "Letter: Jobcenter (Bürgergeld)",
    elterngeldExplanation: "That matches Elterngeld topics. Start with the guide and forms, or contact Elterngeldstelle by letter.",
    elterngeldGuide: "Guide: Elterngeld",
    elterngeldForm: "Form: Elterngeld",
    elterngeldLetter: "Letter: Elterngeldstelle",
    bankAccountExplanation: "That sounds like opening a bank account (Girokonto). Use the guide and forms, or write to a bank.",
    bankAccountGuide: "Guide: Bank account",
    bankAccountForm: "Form: Open account",
    bankAccountLetter: "Letter: Bank (open account)",
    meldebescheinigungExplanation: "That matches Meldebescheinigung requests. Open the guide and forms, or contact Bürgeramt by letter.",
    meldebescheinigungGuide: "Guide: Meldebescheinigung",
    meldebescheinigungForm: "Form: Meldebescheinigung",
    meldebescheinigungLetter: "Letter: Bürgeramt (Meldebescheinigung)",
    taxReturnExplanation: "That matches tax return / ELSTER topics. Use the guide and forms, or contact Finanzamt.",
    taxReturnGuide: "Guide: Tax return",
    taxReturnForm: "Form: Tax return",
    taxReturnLetter: "Letter: Finanzamt (tax return)",
    socialInsuranceExplanation: "That matches social insurance number topics. Open the guide and forms, or write to Deutsche Rentenversicherung.",
    socialInsuranceGuide: "Guide: Social insurance",
    socialInsuranceForm: "Form: Social insurance",
    socialInsuranceLetter: "Letter: Deutsche Rentenversicherung (SV number)",
    pensionNumberExplanation: "That matches pension insurance number topics. Start with the guide and forms, or contact Deutsche Rentenversicherung.",
    pensionNumberGuide: "Guide: Pension insurance",
    pensionNumberForm: "Form: Pension insurance",
    pensionNumberLetter: "Letter: Deutsche Rentenversicherung (pension number)",
    blueCardExplanation: "That matches EU Blue Card / work visa topics. Use the guide and forms, or contact Ausländerbehörde.",
    blueCardGuide: "Guide: Blue Card",
    blueCardForm: "Form: Blue Card",
    blueCardLetter: "Letter: Ausländerbehörde (Blue Card)",
  },
  documents: {
    title: "Документы",
    subtitle: "Загружайте файлы в Supabase Storage; метаданные остаются приватными в вашей строке.",
    loading: "Загрузка…",
    signInPrompt: "Войдите, чтобы загружать и просматривать документы.",
    signIn: "Войти",
    uploading: "Загрузка…",
    upload: "Загрузить",
    maxPerFile: "Макс. {size} на файл.",
    empty: "Документов пока нет. Нажмите «Загрузить», чтобы добавить первый.",
    untitled: "Без названия",
    open: "Открыть",
    delete: "Удалить",
    loadError: "Не удалось загрузить документы",
    previewLoadFailed: "Не удалось загрузить содержимое файла",
    fileTooLarge: "Файл слишком большой (макс. {size}).",
    uploadFailed: "Загрузка не удалась",
    deleteFailed: "Удаление не удалось",
    deleteConfirm: "Удалить «{name}»? Это действие нельзя отменить.",
    previewTitle: "Просмотр текста",
    previewSubtitle: "Быстрый просмотр извлечённого текста",
    previewNotSupported: "Предпросмотр для этого типа файла недоступен",
    previewEmpty: "Для этого документа пока нет доступного текста",
    explainTitle: "Объяснить документ",
    explainSubtitle: "Mock-превью — только маршрутизация по ключевым словам. Реальный AI пока не подключен.",
    previewBadge: "Превью",
    explainButton: "Объяснить документ",
    hideExplanation: "Скрыть объяснение",
    note: "Примечание",
    mockNotice: "Placeholder / mock система. Это еще не финальное AI-объяснение.",
    explanationSummary: "Сводка объяснения",
    urgency: "Срочность",
    category: "Категория",
    suggestedActions: "Рекомендуемые следующие шаги",
    documentTextPreview: "Текстовый превью документа",
    urgencyHigh: "Высокая",
    urgencyMedium: "Средняя",
    urgencyLow: "Низкая",
  },
  documentDetail: {
    untitled: "Без названия",
    download: "Скачать",
    downloadUnavailable: "Не удалось создать ссылку для скачивания.",
    backToList: "Назад к списку",
  },
  dashboard: {
    title: "Главная",
    controlCenter: "Центр управления Vaylo",
    operationsCockpit: "Твой операционный cockpit по Германии",
    intro: "Мы настроили этот workspace под твой onboarding DNA, чтобы ты мог сфокусироваться на самом важном прямо сейчас.",
    activePriority: "Активный приоритет",
    priorityJob: "Работа & Bewerbungen",
    priorityBureaucracy: "Документы & ведомства",
    priorityFamilyAdmin: "Семья & Kindergeld",
    priorityOrientation: "Ориентация & интеграция",
    dnaSnapshotTitle: "Снимок DNA Vaylo",
    dnaSnapshotDesc: "Мы постоянно адаптируем этот dashboard по мере изменений твоей ситуации, документов и статуса работы.",
    familyLabel: "Семья",
    familyChildren: "Дети в домохозяйстве",
    familyPartner: "Партнер / иждивенцы",
    familySingle: "Один(а)",
    workModeLabel: "Режим работы",
    workFreelancer: "Freelancer / самозанятый",
    workJobSeeker: "В поиске работы",
    workEmployee: "Сотрудник",
    languageLabel: "Язык",
    dnaLanguageCourseLine: "Немецкий {level}",
    focusLabel: "Фокус",
    focusPaperwork: "Документы",
    focusJob: "Работа",
    focusOrientation: "Ориентация",
    statusLabel: "Статус",
    statusLocked: "DNA-профиль зафиксирован",
    statusDesc: "Это первая версия твоего Vaylo dashboard. По мере прогресса мы откроем больше модулей автоматизации.",
    nextActionsTitle: "Следующие действия",
    nextActionsDesc: "Твой ассистент приоритизирует, что делать дальше.",
    actionSituationSummary: "Контекст: {employment} · {goal} · {language}",
    highestPriorityLabel: "Высший приоритет",
    nextLabel: "Следующий шаг",
    editProfile: "Редактировать профиль",
    editProfileTitle: "Редактировать профиль",
    editProfileDesc: "Обнови свою текущую ситуацию. Vaylo подстроится под изменения.",
    saveChanges: "Сохранить изменения",
    saving: "Сохранение…",
    cancel: "Отмена",
    refineProfile: "Дополнить профиль",
    refineProfileTitle: "Дополнить профиль",
    refineProfileDesc: "Помоги Vaylo лучше тебе помогать, добавив несколько деталей. Всё — опционально.",
    refineSectionFamilyTitle: "Семья & быт",
    refineSectionFamilyDesc: "Детали о домохозяйстве помогут с более точными рекомендациями.",
    refineSectionWorkTitle: "Работа & доход",
    refineSectionWorkDesc: "Инфо о поиске работы поможет точнее направлять по шагам.",
    refineSectionDocsTitle: "Ведомства & документы",
    refineSectionDocsDesc: "Что уже сделано, чтобы не предлагать лишние шаги.",
    refineSectionFocusTitle: "Фокус / приоритеты",
    refineSectionFocusDesc: "Что хочешь делать в первую очередь (можно несколько).",
    refineYesChildren: "Да, у меня есть дети",
    refineNoChildren: "Нет, детей нет",
    refineYesSchoolAge: "Хотя бы один школьного возраста",
    refineNoSchoolAge: "Нет / только маленькие дети",
    refineYesArbeitsagentur: "Я зарегистрирован в Arbeitsagentur",
    refineNoArbeitsagentur: "Не зарегистрирован",
    refineYesHasCv: "У меня есть CV",
    refineNoHasCv: "Нет / нужно подготовить",
    refineJobUrgencyLabel: "Срочность поиска работы",
    refineYesSteuerId: "У меня есть Steuer-ID",
    refineNoSteuerId: "Нет / не знаю",
    refineYesHealthInsurance: "У меня есть медстраховка",
    refineNoHealthInsurance: "Нет / решаю",
    refineYesBankAccount: "У меня есть банковский счёт",
    refineNoBankAccount: "Нет / решаю",
    cvWorkflowTitle: "Подготовь немецкое резюме (Lebenslauf)",
    cvWorkflowDesc: "Этот модуль помогает адаптировать резюме под немецкие стандарты.",
    cvWorkflowPremiumNote:
      "Эта функция в Premium. Разблокируй Premium, чтобы пользоваться процессом работы с CV.",
    cvWorkflowActionUpload: "Загрузить существующее CV",
    cvWorkflowActionCreate: "Создать CV с нуля",
    cvWorkflowActionCheck: "Проверить структуру под Германию",
    actionArbeitsagenturTitle: "Зарегистрируйся в Arbeitsagentur",
    actionArbeitsagenturDesc:
      "Заверши регистрацию, чтобы запустить поддержку по поиску работы и выплаты.",
    actionCvTitle: "Подготовь немецкое CV (Lebenslauf)",
    actionCvDesc:
      "Подправь структуру, ключевые слова и соответствие роли перед следующими откликами.",
    actionFamilyChecklistTitle: "Проверь семейный checklist",
    actionFamilyChecklistDesc:
      "Приоритизируй Kindergeld и школьные документы на этот месяц.",
    actionHealthStatusTitle: "Проверь статус медстраховки",
    actionHealthStatusDesc:
      "Проверь покрытие и недостающие документы, чтобы избежать задержек.",
    actionAdminPriorityTitle: "Закрой самую важную админ-задачу",
    actionAdminPriorityDesc:
      "Заверши сегодня одну ключевую форму, чтобы ускорить прогресс в других модулях.",
    actionTaxesPriorityTitle: "Расставь приоритеты: налоги и счета",
    actionTaxesPriorityDesc:
      "Сделай сегодня конкретный шаг по налогам, чтобы следующие недели были спокойнее.",
    actionKindergeldPriorityTitle: "Начни с Kindergeld (основное заявление)",
    actionKindergeldPriorityDesc:
      "Основное заявление — самый быстрый путь запустить семейные дела.",
    actionHealthMembershipTitle: "Заполни форму медицинского страхования",
    actionHealthMembershipDesc:
      "Заполни заявление о членстве, чтобы оформить страховку и избежать задержек.",
    actionCtaStart: "Начать",
    actionCtaOpen: "Открыть",
    actionCtaCheck: "Проверить",
    criticalHealthTitle: "Оформи медицинскую страховку",
    criticalHealthDesc:
      "Нужна действующая страховка для легальной работы и медпомощи в Германии.",
    criticalSteuerTitle: "Получи Steuer-ID",
    criticalSteuerDesc:
      "Без Steuer-ID нельзя выставлять счета и легально работать как {employment}.",
    criticalBankTitle: "Открой или подтверди немецкий банковский счёт",
    criticalBankDesc:
      "Нужен локальный счёт для зарплаты, налогов и повседневных платежей.",
    criticalArbeitsagenturTitle: "Зарегистрируйся в Arbeitsagentur",
    criticalArbeitsagenturDesc:
      "Регистрация открывает поддержку в поиске работы и выплаты.",
    criticalCvTitle: "Подготовь немецкое резюме (Lebenslauf)",
    criticalCvDesc:
      "Сильное резюме нужно до эффективных откликов в Германии.",
    actionUploadDocumentCta: "Загрузить документ",
    actionViewGuideCta: "Открыть руководство",
    actionMarkDone: "Готово",
    actionExplainBureaucracyGoal:
      "Твой фокус — «{goal}»: формы и ведомства соответствуют этому приоритету.",
    actionExplainBureaucracyFreelancerSteuer:
      "Как {employment} без Steuer-ID налоговые шаги блокируют дальнейшие действия.",
    actionExplainBureaucracyBank:
      "Без подтверждённого счёта выплаты и многие заявки сложнее.",
    actionExplainBureaucracyFamily:
      "С {family} семейные и административные процессы часто срочные.",
    actionExplainHealthMissing:
      "В профиле страховка ещё не отмечена как решённая.",
    actionExplainHealthGoalBureaucracy:
      "К цели «{goal}» часто относятся членство и документы.",
    actionExplainHealthFamily:
      "С {family} страховка и документы особенно важны.",
    actionExplainBankMissing:
      "Нужен локальный счёт для зарплаты, налогов и быта.",
    actionExplainBankFreelancer:
      "Как {employment} платежи и налоги идут через доступный счёт.",
    actionExplainArbeitsagenturJobSeeker:
      "Как {employment} агентство — центр поддержки по поиску работы.",
    actionExplainArbeitsagenturNotRegistered:
      "В профиле нет регистрации — открывает поддержку и выплаты.",
    actionExplainArbeitsagenturUrgent:
      "Поиск работы помечен как срочный — сначала агентство и заявки.",
    actionExplainCvJobSeeker:
      "Как {employment} резюме — основной инструмент.",
    actionExplainCvMissing:
      "В профиле нет подтверждённого резюме.",
    actionExplainCvUrgent:
      "При срочном поиске стоит быстро обновить CV.",
    actionExplainSteuerMissing:
      "У тебя нет Steuer-ID — без неё часто нельзя работать или выставлять счета.",
    actionExplainSteuerFreelancer:
      "Как {employment}, она нужна для счетов и Finanzamt.",
    actionExplainSteuerGoalBureaucracy:
      "Ты хочешь „{goal}” — без Steuer-ID многие шаги в ведомствах стопорятся.",
    actionExplainFamilyBenefitsProfileChildren:
      "У тебя „{family}” — без заявления можно пропустить выплаты и сроки.",
    actionExplainFamilyBenefitsRefineChildren:
      "Ты отметил детей — без заявлений теряются деньги и сроки.",
    actionExplainFamilyBenefitsSchoolAge:
      "Школьный возраст требует дополнительных документов — без них выплата задерживается.",
    actionExplainFamilyBenefitsBureaucracyGoal:
      "Ты хочешь „{goal}” — Kindergeld — чёткий официальный шаг.",
    actionExplainFamilyBenefitsDefault:
      "Без чеклиста легко пропустить сроки Kindergeld и документы.",
    quickPhrases: "Быстрые фразы",
    phrasesModuleTitle: "Фразы",
    phrasesModuleSubtitle:
      "Готовые немецкие фразы для этого модуля — разверни, чтобы скопировать или отметить.",
    phrasesModuleExpand: "Показать фразы",
    phrasesModuleCollapse: "Скрыть фразы",
    freelancerTitle: "Freelancer cockpit",
    freelancerBadge: "Налоги & счета",
    freelancerIntro: "Отслеживай счета, НДС и налоговые обязательства в одном месте.",
    freelancerLoad: "Нагрузка",
    freelancerLoadHint: "На основе твоих ответов мы заранее ранжируем налоговые темы для стабилизации.",
    freelancerPoint1: "НДС, подоходный налог и соцвзносы заранее сопоставлены для freelancer-ов.",
    freelancerPoint2: "Шаблоны счетов оптимизированы для немецких клиентов и Finanzamt.",
    freelancerPoint3: "Скоро: автоматические напоминания перед квартальными и годовыми налоговыми событиями.",
    familyModuleTitle: "Стабильность семьи",
    familyModuleBadge: "Kindergeld & повседневность",
    familyModuleIntro: "Мы группируем самые важные семейные темы под твою текущую ситуацию.",
    familyImmediateFocus: "Немедленный фокус",
    familyWithChildrenPoint1: "Право на Kindergeld/Elterngeld, Anmeldung и регулярные проверки.",
    familyWithChildrenPoint2: "Сроки записи в Kita/школу в зависимости от Bundesland.",
    familyWithChildrenPoint3: "Медстраховка и onboarding Hausarzt/Kinderarzt.",
    familyWithoutChildrenPoint1: "Корректная регистрация домохозяйства (Anmeldung, Rundfunkbeitrag и т.д.).",
    familyWithoutChildrenPoint2: "Базовые страховки: Haftpflicht, медстраховка и первые защитные сетки.",
    familyWithoutChildrenPoint3: "Простой checklist для повторяющихся семейных бюро-событий.",
    familyComingNext: "Дальше",
    familyComingNextDesc: "Со временем модуль откроет проактивные алерты по продлениям, очередям в Kita и визовым/резидентским зависимостям.",
    jobSeekerTitle: "Job seeker lane",
    jobSeekerBadge: "Работа & Bewerbungen",
    jobSeekerIntro: "Мы сжимаем лабиринт поиска работы в Германии в компактный pipeline под твой DNA-профиль.",
    jobFocusSignal: "Сигнал фокуса на работе",
    jobFocusHint: "Показывает, насколько onboarding указывал на срочность поиска работы.",
    jobSeekerPoint1: "Checklist немецкого CV и LinkedIn по локальным ожиданиям.",
    jobSeekerPoint2: "Еженедельные микро-цели для откликов, networking и recruiter outreach.",
    jobSeekerPoint3: "Скоро: интеграция с Arbeitsagentur, Jobcenter и визовыми ограничениями.",
    profile: "Профиль",
    uiLang: "Язык интерфейса",
    level: "Уровень",
    open: "Открыть",
    phrasesTitle: "Словарь фраз",
    phrasesDesc: "Фразы + фильтры + DE → твой язык",
    jobsTitle: "Job Guide",
    jobsDesc: "Гид по работе по уровню",
    taxesTitle: "Tax Guide",
    taxesDesc: "Налоги в DE по уровню",
    reset: "Сброс онбординга",
  },
  settings: { title: "Настройки", appLanguage: "Язык приложения", hint: "Всё приложение отображается на этом языке." },
  phrases: {
    title: "Словарь фраз",
    subtitle: "Выбери язык, уровень, категорию, сектор и ищи.",
    fromTo: "DE →",
    language: "Язык",
    level: "Уровень",
    category: "Категория",
    sector: "Сектор",
    search: "Поиск",
    favorites: "Избранное",
    results: "Результаты",
    all: "ALL",
    empty: "Ничего не найдено",
    placeholderSearch: "напр. работа / жильё / налоги…",

    lang_sk: "Словацкий",
    lang_de: "Немецкий",

    category_job: "Работа",
    category_tax: "Налоги",
    category_wohnung: "Жильё",

    sector_warehouse: "Склад / Логистика",
    sector_production: "Производство / Фабрика",
    sector_gastro: "Гастро / Отель",
    sector_cleaning: "Уборка",
    sector_construction: "Стройка",
    sector_care: "Уход",
    sector_delivery: "Доставка / Водитель",
    sector_office: "Office junior",

    sector_warehouse_title: "Склад / Логистика",
    sector_warehouse_short: "Логистика, комиссионирование, упаковка, сканеры",
    sector_production_title: "Производство / Фабрика",
    sector_production_short: "Конвейер, работа на станках, упаковка",
    sector_gastro_title: "Гастро / Отель",
    sector_gastro_short: "Кухня, мойка, housekeeping",
    sector_cleaning_title: "Уборка",
    sector_cleaning_short: "Офисы, отели, промышленная уборка",
    sector_construction_title: "Стройка",
    sector_construction_short: "Подсобные работы, монтаж, физический труд",
    sector_care_title: "Уход",
    sector_care_short: "Уход за пожилыми, хозяйство, ответственность",
    sector_delivery_title: "Доставка / Водитель",
    sector_delivery_short: "Курьер, доставка, давление времени",
    sector_office_title: "Office junior",
    sector_office_short: "Админ, складской офис (A2+)",

    jobs_section_reality: "Реальность работы",
    jobs_section_roles: "Типичные позиции",
    jobs_section_pay: "Оплата",
    jobs_section_pros: "Плюсы",
    jobs_section_cons: "Минусы",
    jobs_section_tips: "Советы",
    jobs_section_next: "Следующие шаги",

    sector_warehouse_reality: "Для приезжих часто первая работа. Темп может быть высоким, но система понятна, быстро научишься. Важны дисциплина, точность и безопасность.",
    sector_warehouse_roles_1: "Picker / Packer",
    sector_warehouse_roles_2: "Складской работник",
    sector_warehouse_roles_3: "Оператор сканера",
    sector_warehouse_roles_4: "Водитель погрузчика (выше зарплата)",
    sector_warehouse_pay: "12–16 €/час (с надбавками больше)",
    sector_warehouse_pros_1: "Низкий языковой барьер (A0–A2)",
    sector_warehouse_pros_2: "Быстрое трудоустройство",
    sector_warehouse_pros_3: "Стабильность и много предложений",
    sector_warehouse_cons_1: "Физическая нагрузка",
    sector_warehouse_cons_2: "Монотонность",
    sector_warehouse_cons_3: "Давление на результат в сезон",
    sector_warehouse_tips_1: "Начни через агентство (Zeitarbeit) – быстрее всего",
    sector_warehouse_tips_2: "Через 2–6 недель проси лучшую позицию (сканер, помощник)",
    sector_warehouse_tips_3: "Если можешь, получи права на погрузчик – выше зарплата",
    sector_warehouse_next_1: "Фразы: склад / безопасность / сканер",
    sector_warehouse_next_2: "Чеклист: что взять в первый день",
    sector_warehouse_next_3: "Мини-план: рост через 4–8 недель",

    sector_production_reality: "Работа на машинах или конвейере. Важны точность, ритм и соблюдение процедур. Часто стабильнее склада, но есть смены.",
    sector_production_roles_1: "Оператор производства",
    sector_production_roles_2: "Упаковка",
    sector_production_roles_3: "Контроль качества",
    sector_production_roles_4: "Подсобные работы после обучения",
    sector_production_pay: "13–18 €/час (зависит от компании и смены)",
    sector_production_pros_1: "Стабильность",
    sector_production_pros_2: "Понятные процессы",
    sector_production_pros_3: "Иногда меньше стресса, чем на складе",
    sector_production_cons_1: "Смены (утро/ночь)",
    sector_production_cons_2: "Монотонность",
    sector_production_cons_3: "Строгая безопасность",
    sector_production_tips_1: "Сначала фокус на точность, не скорость",
    sector_production_tips_2: "Спрашивай про СИЗ и процедуры – покажешь ответственность",
    sector_production_tips_3: "Через месяц проси лучшее место (контроль качества, станок)",
    sector_production_next_1: "Фразы: инструкции, безопасность, ошибка/ремонт",
    sector_production_next_2: "Чеклист: сменность и сон",

    sector_gastro_reality: "Быстрый темп и работа в команде. В час пик стресс нормален. Плюс: быстрое трудоустройство и язык часто быстрее улучшается.",
    sector_gastro_roles_1: "Мойщик посуды (Küche)",
    sector_gastro_roles_2: "Помощник на кухне",
    sector_gastro_roles_3: "Housekeeping",
    sector_gastro_roles_4: "Помощник официанта (A2+)",
    sector_gastro_pay: "12–15 €/час (+ чаевые по позиции)",
    sector_gastro_pros_1: "Быстрое трудоустройство",
    sector_gastro_pros_2: "Социальная среда",
    sector_gastro_pros_3: "Быстрое улучшение языка на практике",
    sector_gastro_cons_1: "Стресс в час пик",
    sector_gastro_cons_2: "Физическая нагрузка",
    sector_gastro_cons_3: "Иногда нерегулярные смены",
    sector_gastro_tips_1: "Выучи 10 фраз: пожалуйста, спасибо, не понимаю, повторите",
    sector_gastro_tips_2: "Договаривай чёткие задачи – в хаосе это помогает",
    sector_gastro_tips_3: "Следи за гигиеной и точностью – это ценят",
    sector_gastro_next_1: "Фразы: кухня/отель",
    sector_gastro_next_2: "Чеклист: одежда, обувь, гигиена",
    sector_gastro_next_3: "",

    sector_cleaning_reality: "Часто самостоятельная работа, понятные задачи. Языковой барьер ниже. Идеально, если хочешь меньше стресса и стабильный режим.",
    sector_cleaning_roles_1: "Уборка офисов",
    sector_cleaning_roles_2: "Уборка в отеле",
    sector_cleaning_roles_3: "Промышленная уборка",
    sector_cleaning_roles_4: "Лестницы/объекты",
    sector_cleaning_pay: "12–14 €/час (где-то больше от объекта)",
    sector_cleaning_pros_1: "Низкий стресс",
    sector_cleaning_pros_2: "Гибкость",
    sector_cleaning_pros_3: "Понятные процессы",
    sector_cleaning_cons_1: "Физический труд",
    sector_cleaning_cons_2: "Монотонность",
    sector_cleaning_cons_3: "Иногда раннее утро/вечер",
    sector_cleaning_tips_1: "Узнай точные нормы: что убирают и сколько времени",
    sector_cleaning_tips_2: "Фотографируй задачи (если можно), чтобы знать порядок",
    sector_cleaning_tips_3: "Рост зарплаты: переход на специализированную уборку",
    sector_cleaning_next_1: "Фразы: уборка, просьбы, проверка",
    sector_cleaning_next_2: "Чеклист: химия и безопасность",
    sector_cleaning_next_3: "",

    sector_construction_reality: "Физически тяжело, часто хорошая оплата. Безопасность ключевая. Плюс быстрый рост зарплаты при сноровке и дисциплине.",
    sector_construction_roles_1: "Подсобный рабочий",
    sector_construction_roles_2: "Монтаж",
    sector_construction_roles_3: "Демонтаж",
    sector_construction_roles_4: "Материалы / переноска / подготовка",
    sector_construction_pay: "14–22 €/час (от квалификации и компании)",
    sector_construction_pros_1: "Выше доход",
    sector_construction_pros_2: "Быстрый рост при сноровке",
    sector_construction_pros_3: "Много заказов в сезон",
    sector_construction_cons_1: "Погода",
    sector_construction_cons_2: "Риск травм",
    sector_construction_cons_3: "Жёсткий режим",
    sector_construction_tips_1: "Безопасность = приоритет (каска, ботинки, перчатки)",
    sector_construction_tips_2: "Выучи названия инструментов и базовые команды",
    sector_construction_tips_3: "Оговори условия и почасовую ставку заранее",
    sector_construction_next_1: "Фразы: инструменты, инструкции, безопасность",
    sector_construction_next_2: "Чеклист: экипировка на стройку",
    sector_construction_next_3: "",

    sector_care_reality: "Эмоционально затратно, но осмысленно. Язык быстро улучшается из-за ежедневного общения. Важны эмпатия и стабильность.",
    sector_care_roles_1: "Уход за пожилыми",
    sector_care_roles_2: "Помощь по хозяйству",
    sector_care_roles_3: "Базовая помощь",
    sector_care_roles_4: "Иногда проживание у клиента",
    sector_care_pay: "1500–2500 €/мес. (разные модели) или почасово через агентство",
    sector_care_pros_1: "Стабильность",
    sector_care_pros_2: "Осмысленная работа",
    sector_care_pros_3: "Часто жильё включено (зависит от модели)",
    sector_care_cons_1: "Ответственность",
    sector_care_cons_2: "Эмоциональная нагрузка",
    sector_care_cons_3: "Иногда изоляция",
    sector_care_tips_1: "Уточни режим: выходные, перерывы, ночные подъёмы",
    sector_care_tips_2: "Следи за границами общения и работы",
    sector_care_tips_3: "Учи фразы: лекарства, помощь, боль, еда",
    sector_care_next_1: "Фразы: уход, здоровье, хозяйство",
    sector_care_next_2: "Чеклист: ожидания и границы",
    sector_care_next_3: "",

    sector_delivery_reality: "Много движения и давление времени. Идеально, если нравится динамика и самостоятельность. Важны дисциплина и ориентация.",
    sector_delivery_roles_1: "Курьер (доставка)",
    sector_delivery_roles_2: "Доставка посылок",
    sector_delivery_roles_3: "Помощник при доставке",
    sector_delivery_pay: "13–20 €/час (от компании и выработки)",
    sector_delivery_pros_1: "Самостоятельность",
    sector_delivery_pros_2: "Динамика",
    sector_delivery_pros_3: "Часто быстрое трудоустройство",
    sector_delivery_cons_1: "Стресс",
    sector_delivery_cons_2: "Ответственность",
    sector_delivery_cons_3: "Риск штрафов/аварий",
    sector_delivery_tips_1: "Выучи базовые фразы для клиента и диспетчера",
    sector_delivery_tips_2: "Планируй маршрут и минимизируй ошибки",
    sector_delivery_tips_3: "Узнай правила: перерывы, сканирование, повреждённая посылка",
    sector_delivery_next_1: "Фразы: курьер, клиент, проблема с посылкой",
    sector_delivery_next_2: "Чеклист: экипировка в машину",
    sector_delivery_next_3: "",

    sector_office_reality: "Для A2+ (минимум базовое общение). Часто складской офис: этикетки, почта, простой учёт. Отлично для карьерного роста.",
    sector_office_roles_1: "Складская администрация",
    sector_office_roles_2: "Back office",
    sector_office_roles_3: "Рецепция джуниор (B1 плюс)",
    sector_office_pay: "14–20 €/час (зависит от компании)",
    sector_office_pros_1: "Лучшая среда",
    sector_office_pros_2: "Карьерный рост",
    sector_office_pros_3: "Меньше физического труда",
    sector_office_cons_1: "Выше языковой барьер",
    sector_office_cons_2: "Больше ответственности",
    sector_office_cons_3: "Точность и коммуникация",
    sector_office_tips_1: "Готовь фразы для телефона и email",
    sector_office_tips_2: "Учи базовые термины: счёт, заказ, доставка",
    sector_office_tips_3: "Фокус на точности – это главный навык",
    sector_office_next_1: "Фразы: офис, email, телефон",
    sector_office_next_2: "Чеклист: базовые софт-навыки",
    sector_office_next_3: "",

    explorerTitle: "Быстрые фразы",
    explorerSubtitle:
      "Ищи по-немецки (DE), переводу или тегу. Нажми Копировать, чтобы скопировать немецкую фразу.",
    recommendedTitle: "Рекомендовано для вас",
    recommendedSubtitle:
      "По вашему профилю — та же библиотека, что ниже, отсортированная для вас.",
    explorerSearchPlaceholder: "Поиск фраз (DE / перевод / тег)…",
    explorerCategoryFamily: "Семья",
    explorerCategoryJob: "Работа",
    explorerCategoryFreelancer: "Фриланс",
    explorerCategoryBureaucracy: "Бюрократия",
    explorerTagAllWithCount: "Все ({count})",
    explorerTagJobInterview: "Собеседование",
    explorerTagJobWork: "Работа",
    explorerTagJobContract: "Контракт",
    explorerTagJobProblem: "Проблемы",
    explorerTagBureauBasic: "Основы",
    explorerTagBureauAppointment: "Записи",
    explorerTagBureauDocuments: "Документы",
    explorerTagBureauProblem: "Проблемы",
    explorerFoundCount: "{count} совпадений",
    explorerSectionPhraseCount: "{count} фраз",
    explorerEmpty: "Подходящих фраз нет.",
    chipCopy: "Копировать",
    chipCopied: "Скопировано",
    chipCopyTitle: "Копировать немецкий (DE)",
    chipFavoriteAdd: "В избранное",
    chipFavoriteRemove: "Убрать из избранного",

    favorite: "Избранное",
  },
  chat: {
    title: "Чат",
    subtitle: "Спроси: «Что мне делать?» или «Как это сделать?»",
    emptyHint: "Напр.: «Что мне делать?»",
    inputPlaceholder: "Напиши сообщение…",
    send: "Отправить",
    noActions: "Сейчас не могу ничего рекомендовать — нет доступных действий.",
    recommendIntro: "Рекомендую:",
    howToPrefix: "Как сделать:",
    noGuidePrefix: "Пока нет простого гайда для:",
    whatLineWithReason: "- {title} — {reason}",
    whatLineTitleOnly: "- {title}",
    howToLine: "{prefix} {title}",
    noGuideLine: "{prefix} {title}",
    guideStepLine: "{n}. {step}",
    noActionsWhatSoft:
      "Сейчас нет приоритетных следующих шагов. Ты всё равно можешь спросить «Как сделать …?» (например страховка, резюме, Arbeitsagentur).",
    howEmptyActionsFallback:
      "Напиши тему в сообщении (например страховка, резюме, Arbeitsagentur) или начни с «Как …?».",
  },
  nudges: {
    longIgnore: "Ты откладываешь это уже несколько дней",
    criticalSoon: "Это важно решить как можно скорее",
    repeatedClicks: "Ты уже начал — доведи до конца",
  },
  guides: {
    healthInsuranceStep1:
      "Проверь, есть ли у тебя медицинская страховка и какая: государственная или частная.",
    healthInsuranceStep2:
      "Если нет: подготовь документы (паспорт, адрес, трудовой договор или статус).",
    healthInsuranceStep3:
      "Выбери кассу, подай заявление и сохрани подтверждение (Versicherungsnachweis).",
    cvStep1:
      "Возьми актуальное резюме и приведи формат к одному виду (1–2 страницы, чёткая структура).",
    cvStep2:
      "Добавь последний опыт с конкретными результатами (цифры, проекты, инструменты).",
    cvStep3:
      "Адаптируй резюме под вакансию: ключевые слова из объявления, релевантное — наверх.",
    arbeitsagenturStep1:
      "Создай аккаунт на портале Arbeitsagentur и подготовь данные (адрес, статус, история работы).",
    arbeitsagenturStep2:
      "Зарегистрируйся как ищущий работу и, если возможно, запишись на консультацию/встречу.",
    arbeitsagenturStep3:
      "Сохрани подтверждение и следуй дальнейшим шагам (документы, выплаты, рекомендации).",
    bankAccountStep1:
      "Сравни предложения (комиссии, карта, онлайн-банк) и подготовь паспорт и подтверждение адреса.",
    bankAccountStep2:
      "Открой счёт онлайн или в отделении после записи и подпиши договоры.",
    bankAccountStep3:
      "Сохрани IBAN/BIC, включи онлайн-банкинг; данные нужны для зарплаты и учреждений.",
    anmeldungStep1:
      "Запишись в Bürgeramt или проверь онлайн-регистрацию в своём городе.",
    anmeldungStep2:
      "Документы: паспорт, договор аренды, подтверждение от арендодателя; при необходимости заполни форму заранее.",
    anmeldungStep3:
      "Приди на приём и храни Meldebescheinigung — банк, работодатель и органы часто её требуют.",
    steuerIdStep1:
      "После регистрации адреса федеральная налоговая служба формирует налоговый номер.",
    steuerIdStep2:
      "Жди письмо со Steuer-ID (часто в течение нескольких недель).",
    steuerIdStep3:
      "Если письма нет: Finanzamt или повторная отправка; номер нужен для работы и налогов.",
    shellSubtitle: "Пошаговая помощь с бюрократией в Германии",
    openGuide: "Открыть гайд",
    detailSteps: "Шаги",
    detailRelatedResources: "Связанные материалы",
    detailRelatedLetters: "Связанные письма",
    detailRelatedForms: "Связанные формы",
    openLetterLink: "Открыть письмо: {id}",
    openFormLink: "Открыть форму: {id}",
  },
  forms: {
    shellSubtitle: "Разбирай важные немецкие формы шаг за шагом",
    openForm: "Открыть форму",
    unknownAuthority: "Неизвестный орган",
    detailFields: "Поля",
    fieldRequired: "Обязательно",
  },
  letters: {
    shellSubtitle: "Генерируй официальные письма и e-mail для немецких ведомств",
    prefilledFromGuide: "Предзаполнено из гайда",
    labelType: "Тип",
    labelAuthority: "Ведомство",
    labelNeed: "Что тебе нужно?",
    typeEmail: "E-mail",
    typeLetter: "Письмо",
    authorityBuergeramt: "Bürgeramt",
    authorityFinanzamt: "Finanzamt",
    authorityJobcenter: "Jobcenter",
    authorityAuslaender: "Ausländerbehörde",
    authorityKitaSchool: "Сад / школа",
    authorityHealthInsurance: "Медстрахование",
    authorityFamilienkasse: "Familienkasse",
    authorityOther: "Другое",
    requestPlaceholder: "Опиши ситуацию…",
    generate: "Сгенерировать",
    preview: "Просмотр",
    previewEmpty: "(пока пусто)",
  },
  formsCatalog: {
    form_anmeldung: {
      title: "Форма Anmeldung",
      shortDescription:
        "Форма регистрации адреса, обязательная после переезда в новое жильё в Германии.",
    },
    form_steuer_number_registration: {
      title: "Регистрация налогового номера (Steuernummer)",
      shortDescription:
        "Налоговая регистрация для самозанятых и фрилансеров для получения Steuernummer.",
    },
    form_kindergeld_main_application: {
      title: "Основное заявление Kindergeld",
      shortDescription:
        "Основное заявление в Familienkasse на выплату Kindergeld.",
    },
    form_health_insurance_membership: {
      title: "Членство в медицинской страховке",
      shortDescription:
        "Форма для активации обязательного государственного медстрахования.",
    },
    form_residence_extension: {
      title: "Продление вида на жительство",
      shortDescription:
        "Заявление о продлении разрешения до истечения срока его действия.",
    },
  },
  guidesCatalog: {
    guide_anmeldung: {
      title: "Anmeldung (регистрация адреса)",
      shortDescription:
        "Зарегистрируйте адрес после переезда в Германию и получите доступ к ключевым услугам.",
    },
    guide_steuer_id: {
      title: "Получите Steuer-ID",
      shortDescription:
        "Как получить или восстановить налоговый идентификационный номер в Германии.",
    },
    guide_kindergeld: {
      title: "Подайте заявление на Kindergeld",
      shortDescription:
        "Пошагово: заявление Kindergeld в Familienkasse.",
    },
    guide_health_insurance: {
      title: "Оформление медицинской страховки",
      shortDescription:
        "Выберите и активируйте страховку, необходимую для работы и проживания.",
    },
    guide_residence_permit: {
      title: "Продление вида на жительство",
      shortDescription:
        "Подготовьте продление в Ausländerbehörde без лишних задержек.",
    },
  },
  categoryLabels: {
    residence: "Проживание",
    family: "Семья",
    work: "Работа",
    tax: "Налоги",
    health: "Здоровье",
    documents: "Документы",
    school: "Школа",
    benefits: "Пособия",
    other: "Другое",
  },
  formsDetail: {
    form_anmeldung: {
      full_name: {
        label: "Полное имя",
        explanation: "Укажите официальное имя точно как в паспорте.",
      },
      date_of_birth: {
        label: "Дата рождения",
        explanation: "Формат из формы (обычно ДД.ММ.ГГГГ).",
      },
      new_address: {
        label: "Новый адрес",
        explanation:
          "Точная улица, номер дома, почтовый индекс и город текущего жилья.",
      },
      move_in_date: {
        label: "Дата въезда",
        explanation:
          "Фактическая дата переезда — не обязательно начало договора, если оно другое.",
      },
      previous_address: {
        label: "Предыдущий адрес",
        explanation:
          "Последний адрес в Германии или за рубежом для корректного обновления данных ведомством.",
      },
    },
    form_steuer_number_registration: {
      personal_details: {
        label: "Личные данные",
        explanation:
          "Имя, адрес и налоговый ID должны совпадать с официальными регистрационными документами.",
      },
      business_activity: {
        label: "Описание деятельности",
        explanation: "Опишите услуги или продукты ясно и по делу.",
      },
      start_date: {
        label: "Дата начала деятельности",
        explanation:
          "Когда вы начали или планируете начать получать доход как фрилансер.",
      },
      revenue_estimate: {
        label: "Ориентировочный годовой доход",
        explanation:
          "Реалистичная оценка помогает с авансами и налоговыми ожиданиями.",
      },
      vat_preference: {
        label: "НДС / режим Kleinunternehmer",
        explanation:
          "Выбор между освобождением для малых предприятий и стандартным НДС.",
      },
    },
    form_kindergeld_main_application: {
      applicant_info: {
        label: "Данные заявителя",
        explanation: "Родитель или законный представитель, подающий заявление на выплату.",
      },
      child_info: {
        label: "Данные ребёнка",
        explanation:
          "Имя, дата рождения и отношение в домохозяйстве для каждого ребёнка в заявлении.",
      },
      tax_ids: {
        label: "Налоговые ID (родитель + ребёнок)",
        explanation: "Обычно для обработки нужны оба ID.",
      },
      bank_account: {
        label: "Банковский счёт (IBAN)",
        explanation:
          "Счёт, на который надёжно будут поступать ежемесячные выплаты Kindergeld.",
      },
      residence_status: {
        label: "Проживание / статус разрешения",
        explanation:
          "Актуальные сведения о проживании, если это требует пакет форм.",
      },
    },
    form_health_insurance_membership: {
      insured_person: {
        label: "Данные застрахованного лица",
        explanation:
          "Юридическая идентичность должна совпадать с паспортом и данными Anmeldung.",
      },
      employment_status: {
        label: "Статус занятости",
        explanation:
          "Наёмный работник, самозанятый, студент или безработный.",
      },
      start_of_coverage: {
        label: "Дата начала страхования",
        explanation:
          "Дата по договору, началу работы или вашему графику проживания.",
      },
      family_members: {
        label: "Семейное совместное страхование",
        explanation: "Добавьте супруга/детей при семейном страховании.",
      },
      contact_preferences: {
        label: "Контакт и связь",
        explanation:
          "Электронная почта, телефон и предпочитаемый язык, если возможно.",
      },
    },
    form_residence_extension: {
      passport_permit_data: {
        label: "Паспорт и данные текущего разрешения",
        explanation: "Введите данные точно как в документах.",
      },
      reason_for_extension: {
        label: "Причина продления",
        explanation:
          "Работа, семья, учёба или иное правовое основание.",
      },
      income_proof: {
        label: "Доход / финансирование",
        explanation:
          "Зарплата, договор или данные спонсора как доказательство самообеспечения.",
      },
      housing_proof: {
        label: "Жильё",
        explanation: "Адрес аренды и документы о стабильном проживании.",
      },
      insurance_status: {
        label: "Медицинская страховка",
        explanation:
          "Подтвердите действующую страховку на запрашиваемый период продления.",
      },
    },
  },
  guidesDetail: {
    guide_anmeldung: {
      anmeldung_1: {
        title: "Запишитесь в Bürgeramt",
        text: "Найдите сайт Bürgeramt вашего города и забронируйте ближайшую дату Anmeldung.",
      },
      anmeldung_2: {
        title: "Соберите документы",
        text: "Паспорт/удостоверение, договор аренды и Wohnungsgeberbestätigung от арендодателя.",
      },
      anmeldung_3: {
        title: "Заполните форму регистрации",
        text: "Заполните форму Anmeldung до визита, чтобы не терять время в учреждении.",
      },
      anmeldung_4: {
        title: "Придите на приём и подайте документы",
        text: "Приходите заранее, сдайте документы и проверьте адресные данные.",
      },
      anmeldung_5: {
        title: "Храните Meldebescheinigung",
        text: "Храните подтверждение в надёжном месте — банки, работодатели и ведомства часто его требуют.",
      },
    },
    guide_steuer_id: {
      steuer_1: {
        title: "Сначала завершите Anmeldung",
        text: "Steuer-ID формируется после регистрации адреса — первым шагом завершите Anmeldung.",
      },
      steuer_2: {
        title: "Дождитесь официального письма",
        text: "Bundeszentralamt обычно отправляет Steuer-ID почтой в течение нескольких недель.",
      },
      steuer_3: {
        title: "Проверьте фамилию на почтовом ящике",
        text: "Фамилия должна быть читаемой для доставки официальной корреспонденции.",
      },
      steuer_4: {
        title: "Если не пришло — запросите повторно",
        text: "Если письма нет, запросите повторную отправку по официальной процедуре налоговой.",
      },
      steuer_5: {
        title: "Передайте работодателю или консультанту",
        text: "Сообщите Steuer-ID, чтобы избежать аварийного налогового класса и удержаний.",
      },
    },
    guide_kindergeld: {
      kindergeld_1: {
        title: "Проверьте базовые условия",
        text: "Убедитесь, что статус проживания, возраст ребёнка и домохозяйство соответствуют требованиям Kindergeld.",
      },
      kindergeld_2: {
        title: "Документы на вас и ребёнка",
        text: "Удостоверения, свидетельство о рождении, подтверждение Anmeldung и налоговые ID родителя и ребёнка.",
      },
      kindergeld_3: {
        title: "Заполните KG1 и приложения на детей",
        text: "Внимательно заполните основное заявление и приложения; подписи и верный IBAN важны.",
      },
      kindergeld_4: {
        title: "Подайте в Familienkasse",
        text: "Отправьте онлайн или почтой в нужный офис Familienkasse вашего региона.",
      },
      kindergeld_5: {
        title: "Следите за статусом и отвечайте быстро",
        text: "Быстро отвечайте на запросы дополнительных документов, чтобы не задержать первую выплату.",
      },
    },
    guide_health_insurance: {
      health_1: {
        title: "Государственное или частное страхование",
        text: "Большинство новоприбывших начинают с государственного; проверьте тип занятости и порог дохода.",
      },
      health_2: {
        title: "Сравните кассы и язык поддержки",
        text: "Взносы, цифровые сервисы и доступность поддержки на вашем языке.",
      },
      health_3: {
        title: "Подайте заявление о членстве",
        text: "Подайте с личными данными, адресом и сведениями о работе.",
      },
      health_4: {
        title: "Отправьте подтверждение работодателю/ведомству",
        text: "При необходимости передайте подтверждение страховки работодателю, миграционной службе или вузу.",
      },
      health_5: {
        title: "Зарегистрируйте членов семьи",
        text: "При праве добавьте супруга/детей в семейное страхование и храните копии подтверждений.",
      },
    },
    guide_residence_permit: {
      residence_1: {
        title: "Проверьте срок действия заранее",
        text: "Начните за 8–12 недель до окончания; во многих городах длинные очереди на запись.",
      },
      residence_2: {
        title: "Обязательные документы",
        text: "Паспорт, текущее разрешение, биометрическое фото, доказательство дохода, страховки и жилья.",
      },
      residence_3: {
        title: "Запись или подача онлайн",
        text: "Используйте городской портал, если есть; сохраняйте письма и скриншоты.",
      },
      residence_4: {
        title: "Полная заявка",
        text: "Проверьте все файлы перед отправкой; неполные заявки часто задерживают.",
      },
      residence_5: {
        title: "Fiktionsbescheinigung при необходимости",
        text: "Если разрешение истекает до решения, запросите временное подтверждение законного пребывания.",
      },
      residence_6: {
        title: "Следите за делом и получите карту",
        text: "Следуйте указаниям ведомства и после уведомления получите новую карту ВНЖ.",
      },
    },
  },

  knowledge: {
    "topics.residency.title": "Пребытание и регистрация",
    "topics.residency.description": "Anmeldung, налоговый номер и базовые шаги.",
    "topics.health_insurance.title": "Медицинская страховка",
    "topics.health_insurance.description": "Выбор кассы и подтверждение членства.",
    "steps.residency.anmeldung.title": "Регистрация адреса (Anmeldung)",
    "steps.residency.anmeldung.description":
      "Зарегистрируйте адрес в Bürgeramt — нужно для банка, налога и многого другого.",
    "steps.residency.receive_tax_id.title": "Получите налоговый номер (Steuer-ID)",
    "steps.residency.receive_tax_id.description":
      "После Anmeldung Finanzamt отправит Steuer-ID по почте.",
    "steps.residency.open_bank_account.title": "Откройте немецкий банковский счёт",
    "steps.residency.open_bank_account.description":
      "Локальный счёт нужен для зарплаты, аренды и многих заявлений.",
    "steps.health.choose_insurer.title": "Выберите медстраховку",
    "steps.health.choose_insurer.description":
      "Обязательная (GKV) или частная — по ситуации.",
    "steps.health.submit_membership.title": "Подайте заявление о членстве",
    "steps.health.submit_membership.description":
      "Отправьте подписанное заявление в выбранную кассу.",
    "steps.health.receive_membership_confirmation.title":
      "Подтверждение членства",
    "steps.health.receive_membership_confirmation.description":
      "Сохраните подтверждение кассы — работодатели и ведомства часто требуют его.",
    "document_types.meldebescheinigung.title": "Справка о регистрации (Meldebescheinigung)",
    "document_types.meldebescheinigung.description":
      "Подтверждение регистрации адреса от Bürgeramt.",
    "document_types.tax_id_letter.title": "Письмо со Steuer-ID",
    "document_types.tax_id_letter.description": "Письмо от Finanzamt с налоговым номером.",
    "document_types.health_membership_proof.title": "Подтверждение медстраховки",
    "document_types.health_membership_proof.description":
      "Подтверждение членства или покрытия от кассы.",
  },

  premium: {
    title: "Открыть Premium",
    oneTime: "Один раз • Навсегда",
    line1Title: "Job Guide (A0–C1)",
    line1Desc: "Пошагово: работа и коммуникация.",
    line2Title: "Tax Manual",
    line2Desc: "Объяснения + фразы для Finanzamt и ELSTER.",
    line3Title: "Full Packs",
    line3Desc: "Все категории и полные наборы.",
    stayFree: "Поиск и избранное остаются бесплатными.",
    cta: "Открыть Premium",
    notNow: "Не сейчас",
  },
} as const;

export default ru;
