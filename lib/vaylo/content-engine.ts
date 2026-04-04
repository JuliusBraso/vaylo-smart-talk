import type { DNAInputs, Goal } from "@/lib/dna/types";

export type ContentCategory = "family" | "job" | "freelancer" | "bureaucracy";

export type VayloPhrase = {
  id: string;
  de: string;
  sk: string;
  en: string;
  tag: string;
};

export type ContentByCategory = Record<ContentCategory, VayloPhrase[]>;

const PHRASES: ContentByCategory = {
  family: [
    {
      id: "kita_registration",
      tag: "kita_registration",
      de: "Ich möchte mein Kind für den Kindergarten anmelden.",
      sk: "Chcem prihlásiť dieťa do škôlky.",
      en: "I would like to register my child for kindergarten.",
    },
    {
      id: "kindergeld_apply",
      tag: "kindergeld_apply",
      de: "Ich möchte Kindergeld beantragen.",
      sk: "Chcem požiadať o Kindergeld (prídavok na dieťa).",
      en: "I would like to apply for Kindergeld (child benefit).",
    },
    {
      id: "school_registration",
      tag: "school_registration",
      de: "Wo kann ich mein Kind für die Schule anmelden?",
      sk: "Kde môžem prihlásiť dieťa do školy?",
      en: "Where can I register my child for school?",
    },
  ],
  job: [
    {
      id: "cv_review",
      tag: "cv_review",
      de: "Können Sie meinen Lebenslauf prüfen?",
      sk: "Môžete mi skontrolovať životopis?",
      en: "Could you review my CV?",
    },
    {
      id: "job_application_status",
      tag: "job_application_status",
      de: "Ich möchte den Status meiner Bewerbung nachfragen.",
      sk: "Chcem sa informovať o stave mojej žiadosti.",
      en: "I would like to ask about the status of my application.",
    },
    {
      id: "job_interview_availability",
      tag: "job_interview_availability",
      de: "Ich bin verfügbar für ein Vorstellungsgespräch.",
      sk: "Som dostupný/á na pracovný pohovor.",
      en: "I am available for a job interview.",
    },
    {
      id: "job_int_greeting_arrival",
      tag: "job-interview",
      de: "Guten Tag, ich bin zum Vorstellungsgespräch da.",
      sk: "Dobrý deň, som na pracovnom pohovore.",
      en: "Hello, I’m here for the job interview.",
    },
    {
      id: "job_int_repeat_question",
      tag: "job-interview",
      de: "Könnten Sie die Frage bitte wiederholen?",
      sk: "Môžete prosím zopakovať otázku?",
      en: "Could you repeat the question, please?",
    },
    {
      id: "job_int_speak_slower",
      tag: "job-interview",
      de: "Könnten Sie bitte etwas langsamer sprechen?",
      sk: "Môžete prosím hovoriť trochu pomalšie?",
      en: "Could you speak a little more slowly, please?",
    },
    {
      id: "job_int_experience_field",
      tag: "job-interview",
      de: "In diesem Bereich habe ich schon gearbeitet.",
      sk: "V tejto oblasti som už pracoval/a.",
      en: "I’ve already worked in this field.",
    },
    {
      id: "job_int_interested_role",
      tag: "job-interview",
      de: "Diese Stelle interessiert mich sehr.",
      sk: "Táto pozícia ma veľmi zaujíma.",
      en: "I’m very interested in this role.",
    },
    {
      id: "job_int_possible_shifts",
      tag: "job-interview",
      de: "Welche Schichten sind möglich?",
      sk: "Aké zmeny sú možné?",
      en: "Which shifts are possible?",
    },
    {
      id: "job_int_work_location",
      tag: "job-interview",
      de: "Wo genau wäre der Arbeitsort?",
      sk: "Kde presne by bolo miesto práce?",
      en: "Where exactly would the workplace be?",
    },
    {
      id: "job_int_start_date",
      tag: "job-interview",
      de: "Ab wann könnte ich anfangen?",
      sk: "Od kedy by som mohol/mohla začať?",
      en: "When could I start?",
    },
    {
      id: "job_int_ask_questions",
      tag: "job-interview",
      de: "Darf ich auch Fragen stellen?",
      sk: "Môžem sa aj niečo opýtať?",
      en: "May I ask some questions too?",
    },
    {
      id: "job_int_not_understood",
      tag: "job-interview",
      de: "Das habe ich nicht verstanden.",
      sk: "Tomu nerozumiem.",
      en: "I didn’t understand that.",
    },
    {
      id: "job_int_next_steps",
      tag: "job-interview",
      de: "Wie geht es nach dem Gespräch weiter?",
      sk: "Ako to pôjde ďalej po pohovore?",
      en: "What happens after the interview?",
    },
    {
      id: "job_int_thanks_time",
      tag: "job-interview",
      de: "Vielen Dank für Ihre Zeit.",
      sk: "Ďakujem za váš čas.",
      en: "Thank you for your time.",
    },
    {
      id: "job_wr_new_greeting",
      tag: "job-work",
      de: "Guten Morgen, ich bin neu hier.",
      sk: "Dobré ráno, som tu nový/á.",
      en: "Good morning, I’m new here.",
    },
    {
      id: "job_wr_find_team",
      tag: "job-work",
      de: "Wo finde ich mein Team?",
      sk: "Kde nájdem svoj tím?",
      en: "Where can I find my team?",
    },
    {
      id: "job_wr_break_when",
      tag: "job-work",
      de: "Wann ist Pause?",
      sk: "Kedy je prestávka?",
      en: "When is the break?",
    },
    {
      id: "job_wr_work_clothes",
      tag: "job-work",
      de: "Wo bekomme ich die Arbeitskleidung?",
      sk: "Kde dostanem pracovné oblečenie?",
      en: "Where do I get work clothes?",
    },
    {
      id: "job_wr_shift_today",
      tag: "job-work",
      de: "Welche Schicht habe ich heute?",
      sk: "Akú zmenu mám dnes?",
      en: "Which shift do I have today?",
    },
    {
      id: "job_wr_clock_in_where",
      tag: "job-work",
      de: "Wo muss ich mich einstempeln?",
      sk: "Kde sa mám ošetriť kartou?",
      en: "Where do I clock in?",
    },
    {
      id: "job_wr_task_unclear",
      tag: "job-work",
      de: "Ich bin mir bei der Aufgabe nicht sicher.",
      sk: "Pri úlohe si nie som istý/á.",
      en: "I’m not sure about this task.",
    },
    {
      id: "job_wr_quick_help",
      tag: "job-work",
      de: "Können Sie mir kurz helfen?",
      sk: "Môžete mi prosím krátko pomôcť?",
      en: "Could you help me for a moment?",
    },
    {
      id: "job_wr_safety_equipment",
      tag: "job-work",
      de: "Wo liegt die Sicherheitsausrüstung?",
      sk: "Kde je bezpečnostné vybavenie?",
      en: "Where is the safety equipment?",
    },
    {
      id: "job_wr_leave_early",
      tag: "job-work",
      de: "Ich muss heute früher gehen, geht das?",
      sk: "Dnes musím skôr odísť, je to možné?",
      en: "I have to leave early today, is that OK?",
    },
    {
      id: "job_wr_overtime_today",
      tag: "job-work",
      de: "Gibt es heute Überstunden?",
      sk: "Sú dnes nadčasy?",
      en: "Is there overtime today?",
    },
    {
      id: "job_wr_show_once",
      tag: "job-work",
      de: "Können Sie mir das einmal zeigen?",
      sk: "Môžete mi to raz ukázať?",
      en: "Could you show me how once?",
    },
    {
      id: "job_ct_probation_length",
      tag: "job-contract",
      de: "Wie lange ist die Probezeit?",
      sk: "Ako dlhá je skúšobná doba?",
      en: "How long is the probation period?",
    },
    {
      id: "job_ct_notice_period",
      tag: "job-contract",
      de: "Wie lange ist die Kündigungsfrist?",
      sk: "Aká je výpovedná lehota?",
      en: "How long is the notice period?",
    },
    {
      id: "job_ct_weekly_hours",
      tag: "job-contract",
      de: "Wie viele Stunden pro Woche sind vereinbart?",
      sk: "Koľko hodín týždenne je dohodnutých?",
      en: "How many hours per week are agreed?",
    },
    {
      id: "job_ct_minijob_check",
      tag: "job-contract",
      de: "Ist das ein Minijob?",
      sk: "Je to mini-job?",
      en: "Is this a mini-job?",
    },
    {
      id: "job_ct_gross_salary",
      tag: "job-contract",
      de: "Wie hoch ist das Bruttogehalt?",
      sk: "Aká je hrubá mzda?",
      en: "What is the gross salary?",
    },
    {
      id: "job_ct_vacation_days",
      tag: "job-contract",
      de: "Wie viele Urlaubstage habe ich?",
      sk: "Koľko dní dovolenky mám?",
      en: "How many vacation days do I have?",
    },
    {
      id: "job_ct_sick_report",
      tag: "job-contract",
      de: "Wie melde ich mich krank?",
      sk: "Ako nahlásim chorobu?",
      en: "How do I report sick leave?",
    },
    {
      id: "job_ct_contract_copy",
      tag: "job-contract",
      de: "Bekomme ich eine Kopie vom Vertrag?",
      sk: "Dostanem kópiu zmluvy?",
      en: "Will I get a copy of the contract?",
    },
    {
      id: "job_ct_trial_shift",
      tag: "job-contract",
      de: "Gibt es eine Probearbeit?",
      sk: "Bude skúšobná zmena?",
      en: "Is there a trial shift?",
    },
    {
      id: "job_ct_weekend_pay",
      tag: "job-contract",
      de: "Wie wird am Wochenende bezahlt?",
      sk: "Ako sa platí cez víkend?",
      en: "How is weekend work paid?",
    },
    {
      id: "job_ct_tax_class",
      tag: "job-contract",
      de: "Welche Steuerklasse soll ich angeben?",
      sk: "Akú daňovú triedu mám uviesť?",
      en: "Which tax class should I state?",
    },
    {
      id: "job_ct_iban_payroll",
      tag: "job-contract",
      de: "Wohin soll ich meine IBAN schicken?",
      sk: "Kam mám poslať IBAN?",
      en: "Where should I send my IBAN?",
    },
    {
      id: "job_pr_sick_today",
      tag: "job-problem",
      de: "Ich bin krank und kann heute nicht arbeiten.",
      sk: "Som chorý/á a dnes nemôžem pracovať.",
      en: "I’m ill and can’t work today.",
    },
    {
      id: "job_pr_child_sick",
      tag: "job-problem",
      de: "Mein Kind ist krank, ich brauche heute frei.",
      sk: "Dieťa je choré, dnes potrebujem voľno.",
      en: "My child is ill, I need today off.",
    },
    {
      id: "job_pr_payslip_error",
      tag: "job-problem",
      de: "Auf meiner Lohnabrechnung stimmt etwas nicht.",
      sk: "Na výplatnej páske nie je niečo v poriadku.",
      en: "Something is wrong on my payslip.",
    },
    {
      id: "job_pr_hours_wrong",
      tag: "job-problem",
      de: "Meine Stunden wurden falsch erfasst.",
      sk: "Moje hodiny boli zle zaznamenané.",
      en: "My hours were recorded incorrectly.",
    },
    {
      id: "job_pr_minor_injury",
      tag: "job-problem",
      de: "Ich habe mir am Arbeitsplatz leicht verletzt.",
      sk: "Pri práci som sa ľahko zranil/a.",
      en: "I hurt myself slightly at work.",
    },
    {
      id: "job_pr_report_colleague",
      tag: "job-problem",
      de: "Ich möchte ein Problem mit einem Kollegen melden.",
      sk: "Chcem nahlásiť problém s kolegom.",
      en: "I’d like to report a problem with a colleague.",
    },
    {
      id: "job_pr_missing_kit",
      tag: "job-problem",
      de: "Mir fehlt noch diese Ausrüstung.",
      sk: "Ešte mi chýba toto vybavenie.",
      en: "I’m still missing this equipment.",
    },
    {
      id: "job_pr_unsafe_task",
      tag: "job-problem",
      de: "Das finde ich arbeitsmäßig zu unsicher.",
      sk: "Túto prácu považujem za nebezpečnú.",
      en: "I don’t think this is safe to do.",
    },
    {
      id: "job_pr_shift_misunderstanding",
      tag: "job-problem",
      de: "Es gab ein Missverständnis mit dem Schichtplan.",
      sk: "Bolo nedorozumenie so zmenami.",
      en: "There was a misunderstanding about the shift plan.",
    },
    {
      id: "job_pr_which_form",
      tag: "job-problem",
      de: "Welches Formular brauche ich dafür?",
      sk: "Aký formulár na to potrebujem?",
      en: "Which form do I need for that?",
    },
    {
      id: "job_pr_safety_contact",
      tag: "job-problem",
      de: "Wer ist der Ansprechpartner für Arbeitsschutz?",
      sk: "Kto je kontakt na bezpečnosť práce?",
      en: "Who is the contact for occupational safety?",
    },
  ],
  freelancer: [
    {
      id: "tax_number_request",
      tag: "tax_number_request",
      de: "Ich möchte eine Steuernummer beantragen.",
      sk: "Chcem požiadať o daňové číslo (Steuernummer).",
      en: "I would like to apply for a tax number (Steuernummer).",
    },
    {
      id: "invoice_create",
      tag: "invoice_create",
      de: "Ich möchte eine Rechnung erstellen.",
      sk: "Chcem vystaviť faktúru.",
      en: "I would like to create an invoice.",
    },
    {
      id: "finanzamt_question",
      tag: "finanzamt_question",
      de: "Ich habe eine Frage zu meiner Selbstständigkeit beim Finanzamt.",
      sk: "Mám otázku ohľadom mojej živnosti na Finanzamte.",
      en: "I have a question about my self-employment with the tax office (Finanzamt).",
    },
  ],
  bureaucracy: [
    {
      id: "anmeldung_buergeramt",
      tag: "anmeldung_buergeramt",
      de: "Ich möchte mich beim Bürgeramt anmelden.",
      sk: "Chcem sa prihlásiť na úrade (Anmeldung).",
      en: "I would like to register my address at the Bürgeramt (Anmeldung).",
    },
    {
      id: "residence_permit_extend",
      tag: "residence_permit_extend",
      de: "Ich möchte meinen Aufenthaltstitel verlängern.",
      sk: "Chcem predĺžiť povolenie na pobyt.",
      en: "I would like to extend my residence permit.",
    },
    {
      id: "appointment_request",
      tag: "appointment_request",
      de: "Ich brauche einen Termin, bitte.",
      sk: "Potrebujem termín, prosím.",
      en: "I need an appointment, please.",
    },
    {
      id: "bur_bas_still_register",
      tag: "bureaucracy-basic",
      de: "Ich muss mich noch anmelden.",
      sk: "Ešte sa musím prihlásiť.",
      en: "I still need to register my address.",
    },
    {
      id: "bur_bas_moved",
      tag: "bureaucracy-basic",
      de: "Ich bin umgezogen.",
      sk: "Sťahoval/a som sa.",
      en: "I’ve moved.",
    },
    {
      id: "bur_bas_wait_tax_id",
      tag: "bureaucracy-basic",
      de: "Ich warte noch auf meine Steuer-ID.",
      sk: "Stále čakám na daňové číslo.",
      en: "I’m still waiting for my tax ID.",
    },
    {
      id: "bur_bas_need_health_ins",
      tag: "bureaucracy-basic",
      de: "Ich brauche eine Krankenversicherung.",
      sk: "Potrebujem zdravotné poistenie.",
      en: "I need health insurance.",
    },
    {
      id: "bur_bas_need_bank",
      tag: "bureaucracy-basic",
      de: "Ich brauche ein deutsches Bankkonto.",
      sk: "Potrebujem nemecký bankový účet.",
      en: "I need a German bank account.",
    },
    {
      id: "bur_bas_landlord_confirm",
      tag: "bureaucracy-basic",
      de: "Ich brauche die Wohnungsgeberbestätigung.",
      sk: "Potrebujem potvrdenie od prenajímateľa.",
      en: "I need the landlord confirmation (Wohnungsgeberbestätigung).",
    },
    {
      id: "bur_bas_biometric_photo",
      tag: "bureaucracy-basic",
      de: "Brauche ich ein biometrisches Foto?",
      sk: "Potrebujem biometrickú fotku?",
      en: "Do I need a biometric photo?",
    },
    {
      id: "bur_bas_certified_translation",
      tag: "bureaucracy-basic",
      de: "Muss das Dokument beglaubigt übersetzt sein?",
      sk: "Musí byť dokument úradne preložený?",
      en: "Does the document need a certified translation?",
    },
    {
      id: "bur_bas_fee_cost",
      tag: "bureaucracy-basic",
      de: "Was kostet das hier?",
      sk: "Koľko to tu stojí?",
      en: "How much does this cost?",
    },
    {
      id: "bur_bas_family_register_together",
      tag: "bureaucracy-basic",
      de: "Ich möchte meine Familie mit anmelden.",
      sk: "Chcem prihlásiť aj rodinu.",
      en: "I’d like to register my family too.",
    },
    {
      id: "bur_bas_first_address_germany",
      tag: "bureaucracy-basic",
      de: "Das ist meine erste Adresse in Deutschland.",
      sk: "Toto je moja prvá adresa v Nemecku.",
      en: "This is my first address in Germany.",
    },
    {
      id: "bur_bas_rundfunk_question",
      tag: "bureaucracy-basic",
      de: "Muss ich den Rundfunkbeitrag zahlen?",
      sk: "Musím platiť Rundfunk?",
      en: "Do I have to pay the broadcasting fee (Rundfunkbeitrag)?",
    },
    {
      id: "bur_appt_buergeramt",
      tag: "bureaucracy-appointment",
      de: "Ich brauche einen Termin beim Bürgeramt.",
      sk: "Potrebujem termín na úrade (Bürgeramt).",
      en: "I need an appointment at the Bürgeramt.",
    },
    {
      id: "bur_appt_auslaender",
      tag: "bureaucracy-appointment",
      de: "Ich brauche einen Termin bei der Ausländerbehörde.",
      sk: "Potrebujem termín na cudzineckej polícii.",
      en: "I need an appointment at the immigration office.",
    },
    {
      id: "bur_appt_reschedule",
      tag: "bureaucracy-appointment",
      de: "Kann ich den Termin verschieben?",
      sk: "Môžem posunúť termín?",
      en: "Can I reschedule the appointment?",
    },
    {
      id: "bur_appt_confirm_email",
      tag: "bureaucracy-appointment",
      de: "Ich bestätige den Termin per E-Mail.",
      sk: "Termín potvrdzujem e-mailom.",
      en: "I confirm the appointment by email.",
    },
    {
      id: "bur_appt_five_min_late",
      tag: "bureaucracy-appointment",
      de: "Ich komme vielleicht fünf Minuten zu spät.",
      sk: "Možno prídem o päť minút neskôr.",
      en: "I may be five minutes late.",
    },
    {
      id: "bur_appt_walk_in_today",
      tag: "bureaucracy-appointment",
      de: "Gibt es heute noch freie Termine?",
      sk: "Sú dnes ešte voľné termíny?",
      en: "Are there any free appointments today?",
    },
    {
      id: "bur_appt_finanzamt",
      tag: "bureaucracy-appointment",
      de: "Ich brauche einen Termin beim Finanzamt.",
      sk: "Potrebujem termín na Finanzamte.",
      en: "I need an appointment at the tax office.",
    },
    {
      id: "bur_appt_krankenkasse",
      tag: "bureaucracy-appointment",
      de: "Ich möchte einen Beratungstermin bei der Krankenkasse.",
      sk: "Chcem poradenstvo v zdravotnej poisťovni.",
      en: "I’d like an advice appointment with my health insurer.",
    },
    {
      id: "bur_appt_cancel",
      tag: "bureaucracy-appointment",
      de: "Ich muss den Termin leider absagen.",
      sk: "Musím bohužiaľ termín zrušiť.",
      en: "I’m afraid I have to cancel the appointment.",
    },
    {
      id: "bur_appt_queue_number",
      tag: "bureaucracy-appointment",
      de: "Wo ziehe ich eine Wartenummer?",
      sk: "Kde si vezmem číslo do poradia?",
      en: "Where do I take a waiting number?",
    },
    {
      id: "bur_appt_what_to_bring",
      tag: "bureaucracy-appointment",
      de: "Was soll ich zum Termin mitbringen?",
      sk: "Čo mám priniesť na termín?",
      en: "What should I bring to the appointment?",
    },
    {
      id: "bur_appt_book_online",
      tag: "bureaucracy-appointment",
      de: "Kann ich den Termin online buchen?",
      sk: "Môžem termín rezervovať online?",
      en: "Can I book the appointment online?",
    },
    {
      id: "bur_doc_copy_or_original",
      tag: "bureaucracy-documents",
      de: "Brauchen Sie eine Kopie oder das Original?",
      sk: "Potrebujete kópiu alebo originál?",
      en: "Do you need a copy or the original?",
    },
    {
      id: "bur_doc_certified_copy",
      tag: "bureaucracy-documents",
      de: "Braucht die Kopie eine Beglaubigung?",
      sk: "Musí byť kópia úradne overená?",
      en: "Does the copy need to be certified?",
    },
    {
      id: "bur_doc_marriage_cert",
      tag: "bureaucracy-documents",
      de: "Hier ist meine Heiratsurkunde.",
      sk: "Tu je sobášny list.",
      en: "Here is my marriage certificate.",
    },
    {
      id: "bur_doc_birth_cert_translated",
      tag: "bureaucracy-documents",
      de: "Hier ist die Geburtsurkunde, übersetzt.",
      sk: "Tu je rodný list, preložený.",
      en: "Here is the birth certificate, translated.",
    },
    {
      id: "bur_doc_rental_contract",
      tag: "bureaucracy-documents",
      de: "Das ist mein Mietvertrag.",
      sk: "Toto je moja nájomná zmluva.",
      en: "This is my rental contract.",
    },
    {
      id: "bur_doc_passport_copy",
      tag: "bureaucracy-documents",
      de: "Hier ist eine Kopie von meinem Pass.",
      sk: "Tu je kópia pasu.",
      en: "Here is a copy of my passport.",
    },
    {
      id: "bur_doc_insurance_card",
      tag: "bureaucracy-documents",
      de: "Das ist meine elektronische Gesundheitskarte.",
      sk: "Toto je moja elektronická kartička poistenca.",
      en: "This is my electronic health insurance card.",
    },
    {
      id: "bur_doc_iban_state",
      tag: "bureaucracy-documents",
      de: "Meine Bankverbindung lautet …",
      sk: "Moje bankové spojenie je …",
      en: "My bank details are …",
    },
    {
      id: "bur_doc_form_help",
      tag: "bureaucracy-documents",
      de: "Können Sie mir beim Formular helfen?",
      sk: "Môžete mi pomôcť s formulárom?",
      en: "Could you help me with the form?",
    },
    {
      id: "bur_doc_power_of_attorney",
      tag: "bureaucracy-documents",
      de: "Ich habe eine Vollmacht dabei.",
      sk: "Mám so sebou plnú moc.",
      en: "I have a power of attorney with me.",
    },
    {
      id: "bur_doc_deadline_submit",
      tag: "bureaucracy-documents",
      de: "Bis wann muss das eingereicht werden?",
      sk: "Do kedy sa to musí odovzdať?",
      en: "When is the deadline to submit this?",
    },
    {
      id: "bur_doc_upload_online",
      tag: "bureaucracy-documents",
      de: "Kann ich das online hochladen?",
      sk: "Môžem to nahrať online?",
      en: "Can I upload this online?",
    },
    {
      id: "bur_pr_letter_missing",
      tag: "bureaucracy-problem",
      de: "Ein Brief von der Behörde ist nicht angekommen.",
      sk: "List z úradu neprišiel.",
      en: "A letter from the authority didn’t arrive.",
    },
    {
      id: "bur_pr_tax_id_delayed",
      tag: "bureaucracy-problem",
      de: "Meine Steuer-ID kommt nicht an, was soll ich tun?",
      sk: "Daňové číslo neprichádza, čo mám robiť?",
      en: "My tax ID isn’t arriving, what should I do?",
    },
    {
      id: "bur_pr_name_wrong_letter",
      tag: "bureaucracy-problem",
      de: "Auf dem Schreiben steht mein Name falsch.",
      sk: "Na liste je zle moje meno.",
      en: "My name is wrong on the letter.",
    },
    {
      id: "bur_pr_long_wait",
      tag: "bureaucracy-problem",
      de: "Die Wartezeit ist sehr lang, was kann ich tun?",
      sk: "Čakanie je veľmi dlhé, čo môžem robiť?",
      en: "The wait is very long, what can I do?",
    },
    {
      id: "bur_pr_english_ok",
      tag: "bureaucracy-problem",
      de: "Sprechen Sie vielleicht Englisch?",
      sk: "Hovoríte náhodou po anglicky?",
      en: "Do you perhaps speak English?",
    },
    {
      id: "bur_pr_case_reference",
      tag: "bureaucracy-problem",
      de: "Wie lautet mein Aktenzeichen?",
      sk: "Aké je moje spisové číslo?",
      en: "What is my file reference number?",
    },
    {
      id: "bur_pr_when_callback",
      tag: "bureaucracy-problem",
      de: "Wann kann ich mich wieder melden?",
      sk: "Kedy sa môžem znova ozvať?",
      en: "When can I follow up?",
    },
    {
      id: "bur_pr_complaint_intent",
      tag: "bureaucracy-problem",
      de: "Ich möchte eine Beschwerde schreiben.",
      sk: "Chcem napísať sťažnosť.",
      en: "I’d like to file a complaint.",
    },
    {
      id: "bur_pr_application_rejected",
      tag: "bureaucracy-problem",
      de: "Mein Antrag wurde abgelehnt.",
      sk: "Moja žiadosť bola zamietnutá.",
      en: "My application was rejected.",
    },
    {
      id: "bur_pr_call_back_request",
      tag: "bureaucracy-problem",
      de: "Könnten Sie mich bitte zurückrufen?",
      sk: "Môžete ma prosím späť zavolať?",
      en: "Could you call me back, please?",
    },
    {
      id: "bur_pr_urgent_need_slot",
      tag: "bureaucracy-problem",
      de: "Es ist dringend, geht ein früherer Termin?",
      sk: "Je to naliehavé, ide skorší termín?",
      en: "It’s urgent, is there an earlier appointment?",
    },
  ],
};

function wantsGoal(goals: Goal[], g: Goal): boolean {
  return goals.includes(g);
}

function uniqById(items: VayloPhrase[]): VayloPhrase[] {
  const seen = new Set<string>();
  const out: VayloPhrase[] = [];
  for (const p of items) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

export function getContentByDNA(dna: { inputs: DNAInputs }): ContentByCategory {
  const { family_status, employment_type, goals } = dna.inputs;

  const selected: ContentByCategory = {
    family: [],
    job: [],
    freelancer: [],
    bureaucracy: [],
  };

  if (family_status === "children") {
    selected.family.push(...PHRASES.family);
  } else if (family_status === "family") {
    selected.family.push(PHRASES.family[1], PHRASES.family[2]);
  }

  if (employment_type === "job_seeker" || wantsGoal(goals, "job")) {
    selected.job.push(...PHRASES.job);
  }

  if (employment_type === "freelancer") {
    selected.freelancer.push(...PHRASES.freelancer);
  }

  if (wantsGoal(goals, "bureaucracy")) {
    selected.bureaucracy.push(...PHRASES.bureaucracy);
  }

  selected.family = uniqById(selected.family);
  selected.job = uniqById(selected.job);
  selected.freelancer = uniqById(selected.freelancer);
  selected.bureaucracy = uniqById(selected.bureaucracy);

  return selected;
}

