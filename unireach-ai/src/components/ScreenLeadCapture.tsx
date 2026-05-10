'use client';

import { useState } from 'react';
import { apiUrl } from '@/lib/api';

const MAJORS = ['Computer Science', 'Engineering', 'Medicine', 'Business Administration', 'Environmental Sciences', 'Law'];
const LEVELS = ['Bachelor', 'Master', 'PhD', 'Exchange'];
const STARTS = ['Autumn 2025', 'Spring 2026', 'Autumn 2026'];
const COUNTRIES = ['India', 'China', 'Pakistan', 'Nigeria', 'Vietnam', 'Brazil', 'Egypt', 'South Korea', 'Japan', 'Other'];
const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic', 'Chinese', 'Russian', 'Portuguese', 'German', 'Italian', 'Japanese', 'Korean', 'Turkish'];

const TRANSLATIONS: Record<string, {
  title: string;
  statusOpen: string;
  noticePrefix: string;
  noticeSuffix: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  countryOrigin: string;
  desiredMajor: string;
  degreeLevel: string;
  intendedStart: string;
  preferredLanguage: string;
  additionalMessage: string;
  consentIntro: string;
  privacyPolicy: string;
  submit: string;
  submitting: string;
  applicationReceivedTitle: string;
  applicationReceivedMessage: string;
  submitAnother: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderPhone: string;
  placeholderMessage: string;
}> = {
  English: {
    title: 'Student Interest Form',
    statusOpen: 'Open',
    noticePrefix: 'Language selected:',
    noticeSuffix: 'This form is available in 12 languages.',
    fullName: 'Full Name *',
    emailAddress: 'Email Address *',
    phoneNumber: 'Phone Number',
    countryOrigin: 'Country of Origin *',
    desiredMajor: 'Desired Major *',
    degreeLevel: 'Degree Level',
    intendedStart: 'Intended Start',
    preferredLanguage: 'Preferred Language',
    additionalMessage: 'Additional Message',
    consentIntro: 'I consent to XAMK University processing my personal data in accordance with the',
    privacyPolicy: 'Privacy Policy',
    submit: 'Submit Application →',
    submitting: 'Submitting…',
    applicationReceivedTitle: 'Application Received',
    applicationReceivedMessage: 'Thank you for your interest in XAMK University. Our admissions team will reach out within 2 business days.',
    submitAnother: 'Submit Another',
    placeholderName: 'Jane Doe',
    placeholderEmail: 'jane@example.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: 'Tell us about yourself and your academic goals…',
  },
  Spanish: {
    title: 'Formulario de Interés Estudiantil',
    statusOpen: 'Abierto',
    noticePrefix: 'Idioma seleccionado:',
    noticeSuffix: 'Este formulario está disponible en 12 idiomas.',
    fullName: 'Nombre completo *',
    emailAddress: 'Correo electrónico *',
    phoneNumber: 'Número de teléfono',
    countryOrigin: 'País de origen *',
    desiredMajor: 'Carrera deseada *',
    degreeLevel: 'Nivel de estudio',
    intendedStart: 'Inicio previsto',
    preferredLanguage: 'Idioma preferido',
    additionalMessage: 'Mensaje adicional',
    consentIntro: 'Doy mi consentimiento a la Universidad XAMK para procesar mis datos personales de acuerdo con la',
    privacyPolicy: 'Política de Privacidad',
    submit: 'Enviar solicitud →',
    submitting: 'Enviando…',
    applicationReceivedTitle: 'Solicitud recibida',
    applicationReceivedMessage: 'Gracias por su interés en la Universidad XAMK. Nuestro equipo de admisiones se pondrá en contacto en 2 días hábiles.',
    submitAnother: 'Enviar otra',
    placeholderName: 'Jane Doe',
    placeholderEmail: 'jane@ejemplo.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: 'Cuéntanos sobre ti y tus metas académicas…',
  },
  French: {
    title: 'Formulaire d’intérêt étudiant',
    statusOpen: 'Ouvert',
    noticePrefix: 'Langue sélectionnée :',
    noticeSuffix: 'Ce formulaire est disponible en 12 langues.',
    fullName: 'Nom complet *',
    emailAddress: 'Adresse e-mail *',
    phoneNumber: 'Numéro de téléphone',
    countryOrigin: 'Pays d’origine *',
    desiredMajor: 'Spécialité souhaitée *',
    degreeLevel: 'Niveau d’étude',
    intendedStart: 'Début prévu',
    preferredLanguage: 'Langue préférée',
    additionalMessage: 'Message supplémentaire',
    consentIntro: 'J’accepte que l’Université XAMK traite mes données personnelles conformément à la',
    privacyPolicy: 'Politique de confidentialité',
    submit: 'Soumettre la demande →',
    submitting: 'Envoi…',
    applicationReceivedTitle: 'Demande reçue',
    applicationReceivedMessage: 'Merci de votre intérêt pour l’Université XAMK. Notre équipe des admissions vous contactera dans les 2 jours ouvrables.',
    submitAnother: 'Envoyer une autre',
    placeholderName: 'Jane Doe',
    placeholderEmail: 'jane@exemple.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: 'Parlez-nous de vous et de vos objectifs académiques…',
  },
  Arabic: {
    title: 'نموذج اهتمام الطالب',
    statusOpen: 'مفتوح',
    noticePrefix: 'اللغة المحددة:',
    noticeSuffix: 'هذا النموذج متوفر بـ 12 لغة.',
    fullName: 'الاسم الكامل *',
    emailAddress: 'البريد الإلكتروني *',
    phoneNumber: 'رقم الهاتف',
    countryOrigin: 'بلد المنشأ *',
    desiredMajor: 'التخصص المطلوب *',
    degreeLevel: 'المستوى الدراسي',
    intendedStart: 'بداية متوقعة',
    preferredLanguage: 'اللغة المفضلة',
    additionalMessage: 'رسالة إضافية',
    consentIntro: 'أوافق على أن تقوم جامعة XAMK بمعالجة بياناتي الشخصية وفقًا',
    privacyPolicy: 'لسياسة الخصوصية',
    submit: 'إرسال الطلب →',
    submitting: 'جارٍ الإرسال…',
    applicationReceivedTitle: 'تم استلام الطلب',
    applicationReceivedMessage: 'شكرًا لاهتمامك بجامعة XAMK. سيتواصل معك فريق القبول خلال يومي عمل.',
    submitAnother: 'إرسال آخر',
    placeholderName: 'جان دو',
    placeholderEmail: 'jane@مثال.com',
    placeholderPhone: '+358 40 000 000 000',
    placeholderMessage: 'أخبرنا عن نفسك وأهدافك الأكاديمية…',
  },
  Chinese: {
    title: '学生意向表',
    statusOpen: '开放',
    noticePrefix: '已选择语言：',
    noticeSuffix: '此表格提供 12 种语言。',
    fullName: '全名 *',
    emailAddress: '电子邮件 *',
    phoneNumber: '电话号码',
    countryOrigin: '来自国家 *',
    desiredMajor: '期望专业 *',
    degreeLevel: '学位层次',
    intendedStart: '预计入学',
    preferredLanguage: '首选语言',
    additionalMessage: '附加信息',
    consentIntro: '我同意 XAMK 大学根据以下内容处理我的个人数据',
    privacyPolicy: '隐私政策',
    submit: '提交申请 →',
    submitting: '提交中…',
    applicationReceivedTitle: '申请已收到',
    applicationReceivedMessage: '感谢您对 XAMK 大学的关注。我们的招生团队将在 2 个工作日内与您联系。',
    submitAnother: '再次提交',
    placeholderName: '张三',
    placeholderEmail: 'jane@例子.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: '告诉我们你的情况和学术目标…',
  },
  Russian: {
    title: 'Форма интереса студента',
    statusOpen: 'Открыто',
    noticePrefix: 'Выбранный язык:',
    noticeSuffix: 'Эта форма доступна на 12 языках.',
    fullName: 'Полное имя *',
    emailAddress: 'Адрес электронной почты *',
    phoneNumber: 'Номер телефона',
    countryOrigin: 'Страна происхождения *',
    desiredMajor: 'Желаемая специальность *',
    degreeLevel: 'Уровень обучения',
    intendedStart: 'Планируемый старт',
    preferredLanguage: 'Предпочитаемый язык',
    additionalMessage: 'Дополнительное сообщение',
    consentIntro: 'Я даю согласие университету XAMK на обработку моих персональных данных в соответствии с',
    privacyPolicy: 'Политикой конфиденциальности',
    submit: 'Отправить заявку →',
    submitting: 'Отправка…',
    applicationReceivedTitle: 'Заявка получена',
    applicationReceivedMessage: 'Спасибо за интерес к университету XAMK. Наша приемная комиссия свяжется с вами в течение 2 рабочих дней.',
    submitAnother: 'Отправить еще',
    placeholderName: 'Джейн Доу',
    placeholderEmail: 'jane@пример.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: 'Расскажите о себе и своих академических целях…',
  },
  Portuguese: {
    title: 'Formulário de Interesse Estudantil',
    statusOpen: 'Aberto',
    noticePrefix: 'Idioma selecionado:',
    noticeSuffix: 'Este formulário está disponível em 12 idiomas.',
    fullName: 'Nome completo *',
    emailAddress: 'E-mail *',
    phoneNumber: 'Número de telefone',
    countryOrigin: 'País de origem *',
    desiredMajor: 'Curso desejado *',
    degreeLevel: 'Nível',
    intendedStart: 'Início previsto',
    preferredLanguage: 'Idioma preferido',
    additionalMessage: 'Mensagem adicional',
    consentIntro: 'Concordo que a Universidade XAMK processe meus dados pessoais de acordo com a',
    privacyPolicy: 'Política de Privacidade',
    submit: 'Enviar inscrição →',
    submitting: 'Enviando…',
    applicationReceivedTitle: 'Inscrição recebida',
    applicationReceivedMessage: 'Obrigado pelo seu interesse na Universidade XAMK. Nossa equipe de admissões entrará em contato em 2 dias úteis.',
    submitAnother: 'Enviar outra',
    placeholderName: 'Jane Doe',
    placeholderEmail: 'jane@exemplo.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: 'Conte-nos sobre você e seus objetivos acadêmicos…',
  },
  German: {
    title: 'Studentisches Interesseformular',
    statusOpen: 'Offen',
    noticePrefix: 'Ausgewählte Sprache:',
    noticeSuffix: 'Dieses Formular ist in 12 Sprachen verfügbar.',
    fullName: 'Vollständiger Name *',
    emailAddress: 'E-Mail-Adresse *',
    phoneNumber: 'Telefonnummer',
    countryOrigin: 'Herkunftsland *',
    desiredMajor: 'Gewünschtes Fach *',
    degreeLevel: 'Studienniveau',
    intendedStart: 'Geplanter Beginn',
    preferredLanguage: 'Bevorzugte Sprache',
    additionalMessage: 'Zusätzliche Nachricht',
    consentIntro: 'Ich erlaube der XAMK-Universität, meine persönlichen Daten gemäß der',
    privacyPolicy: 'Datenschutzrichtlinie',
    submit: 'Bewerbung absenden →',
    submitting: 'Wird gesendet…',
    applicationReceivedTitle: 'Bewerbung erhalten',
    applicationReceivedMessage: 'Vielen Dank für Ihr Interesse an der XAMK-Universität. Unser Zulassungsteam wird sich innerhalb von 2 Werktagen bei Ihnen melden.',
    submitAnother: 'Noch eine einreichen',
    placeholderName: 'Jane Doe',
    placeholderEmail: 'jane@beispiel.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: 'Erzählen Sie uns von sich und Ihren akademischen Zielen…',
  },
  Italian: {
    title: 'Modulo di Interesse Studentesco',
    statusOpen: 'Aperto',
    noticePrefix: 'Lingua selezionata:',
    noticeSuffix: 'Questo modulo è disponibile in 12 lingue.',
    fullName: 'Nome completo *',
    emailAddress: 'Email *',
    phoneNumber: 'Numero di telefono',
    countryOrigin: 'Paese di origine *',
    desiredMajor: 'Corso desiderato *',
    degreeLevel: 'Livello di studio',
    intendedStart: 'Inizio previsto',
    preferredLanguage: 'Lingua preferita',
    additionalMessage: 'Messaggio aggiuntivo',
    consentIntro: 'Acconsento che l’Università XAMK elabori i miei dati personali secondo la',
    privacyPolicy: 'Normativa sulla privacy',
    submit: 'Invia domanda →',
    submitting: 'Invio…',
    applicationReceivedTitle: 'Domanda ricevuta',
    applicationReceivedMessage: 'Grazie per il tuo interesse per l’Università XAMK. Il nostro team di ammissione ti contatterà entro 2 giorni lavorativi.',
    submitAnother: 'Invia un’altra',
    placeholderName: 'Jane Doe',
    placeholderEmail: 'jane@esempio.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: 'Raccontaci di te e dei tuoi obiettivi accademici…',
  },
  Japanese: {
    title: '学生興味フォーム',
    statusOpen: '受付中',
    noticePrefix: '選択された言語：',
    noticeSuffix: 'このフォームは12の言語で利用できます。',
    fullName: '氏名 *',
    emailAddress: 'メールアドレス *',
    phoneNumber: '電話番号',
    countryOrigin: '出身国 *',
    desiredMajor: '希望専攻 *',
    degreeLevel: '学位レベル',
    intendedStart: '開始予定',
    preferredLanguage: '希望言語',
    additionalMessage: '追加メッセージ',
    consentIntro: 'XAMK大学がプライバシーポリシーに従って私の個人データを処理することに同意します。',
    privacyPolicy: 'プライバシーポリシー',
    submit: '申し込む →',
    submitting: '送信中…',
    applicationReceivedTitle: '申し込みを受け付けました',
    applicationReceivedMessage: 'XAMK大学への関心をお寄せいただきありがとうございます。入学チームが2営業日以内にご連絡します。',
    submitAnother: 'もう一度送信',
    placeholderName: '山田 太郎',
    placeholderEmail: 'jane@例.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: 'あなた自身と学業目標について教えてください…',
  },
  Korean: {
    title: '학생 관심 신청서',
    statusOpen: '열림',
    noticePrefix: '선택된 언어:',
    noticeSuffix: '이 양식은 12개 언어로 제공됩니다.',
    fullName: '이름 *',
    emailAddress: '이메일 주소 *',
    phoneNumber: '전화번호',
    countryOrigin: '출신 국가 *',
    desiredMajor: '희망 전공 *',
    degreeLevel: '학위 수준',
    intendedStart: '예정 시작',
    preferredLanguage: '선호 언어',
    additionalMessage: '추가 메시지',
    consentIntro: 'XAMK 대학교가 개인정보 처리방침에 따라 내 개인 정보를 처리하는 데 동의합니다.',
    privacyPolicy: '개인정보 처리방침',
    submit: '신청 제출 →',
    submitting: '제출 중…',
    applicationReceivedTitle: '신청 접수 완료',
    applicationReceivedMessage: 'XAMK 대학교에 관심을 가져 주셔서 감사합니다. 입학 팀이 2영업일 이내에 연락드립니다.',
    submitAnother: '다시 제출',
    placeholderName: '홍길동',
    placeholderEmail: 'jane@예시.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: '자기 소개와 학업 목표를 알려주세요…',
  },
  Turkish: {
    title: 'Öğrenci İlgi Formu',
    statusOpen: 'Açık',
    noticePrefix: 'Seçilen dil:',
    noticeSuffix: 'Bu form 12 dilde mevcuttur.',
    fullName: 'Ad Soyad *',
    emailAddress: 'E-posta *',
    phoneNumber: 'Telefon Numarası',
    countryOrigin: 'Menşei Ülke *',
    desiredMajor: 'İstenen Program *',
    degreeLevel: 'Derece Düzeyi',
    intendedStart: 'Başlangıç Tarihi',
    preferredLanguage: 'Tercih Edilen Dil',
    additionalMessage: 'Ek Mesaj',
    consentIntro: 'XAMK Üniversitesi’nin kişisel verilerimi Gizlilik Politikası’na göre işlemesini kabul ediyorum.',
    privacyPolicy: 'Gizlilik Politikası',
    submit: 'Başvuruyu Gönder →',
    submitting: 'Gönderiliyor…',
    applicationReceivedTitle: 'Başvuru Alındı',
    applicationReceivedMessage: 'XAMK Üniversitesi’ne gösterdiğiniz ilgi için teşekkür ederiz. Kabul ekibimiz 2 iş günü içinde sizinle iletişime geçecektir.',
    submitAnother: 'Başka bir tane gönder',
    placeholderName: 'Jane Doe',
    placeholderEmail: 'jane@ornek.com',
    placeholderPhone: '+358 40 000 0000',
    placeholderMessage: 'Kendiniz ve akademik hedefleriniz hakkında bize bilgi verin…',
  },
};

type FieldVal = Record<string, string>;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

export default function LeadCaptureScreen() {
  const [form, setForm] = useState<FieldVal>({ major: MAJORS[0], level: LEVELS[0], start: STARTS[0], country: COUNTRIES[0], language: LANGUAGES[0] });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const text = TRANSLATIONS[form.language] || TRANSLATIONS.English;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/leads'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          nationality: form.country,
          desired_major: form.major,
          degree_level: form.level,
          start_date: form.start,
          preferred_language: form.language,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to submit');
      }
      setDone(true);
    } catch {
      setError('Could not submit your application. Please try again.');
    }
    setBusy(false);
  };

  if (done) return (
    <div className="content-area animate-in" style={{ alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div className="card" style={{ maxWidth: 480, textAlign: 'center', padding: '40px 32px' }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{text.applicationReceivedTitle}</p>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {text.applicationReceivedMessage}
        </p>
        <button className="btn-primary" style={{ marginTop: 20, padding: '10px 24px' }} onClick={() => setDone(false)}>
          {text.submitAnother}
        </button>
      </div>
    </div>
  );

  return (
    <div className="content-area animate-in" style={{ alignItems: 'center' }}>
      {/* Auto-language notice */}
      <div style={{
        width: '100%', maxWidth: 680,
        background: '#eff6ff', border: '0.5px solid rgba(59,130,246,0.2)', borderRadius: 8,
        padding: '8px 14px', fontSize: 11, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span>🌐</span>
        <span>{text.noticePrefix} <strong>{form.language}</strong> {text.noticeSuffix}</span>
      </div>

      <div style={{ width: '100%', maxWidth: 680, display: 'grid', gridTemplateColumns: '1fr', gap: 10, padding: '12px 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => setForm(p => ({ ...p, language: lang }))}
              className="card-action"
              style={{
                padding: '6px 12px', borderRadius: 999, border: form.language === lang ? '1px solid #2563eb' : '1px solid rgba(15,23,42,0.12)',
                background: form.language === lang ? '#eff6ff' : '#ffffff', color: '#0f172a', cursor: 'pointer', fontSize: 11,
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: 680 }}>
        <div className="card-header">
          <span className="card-title" style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 600 }}>{text.title}</span>
          <span className="status-pill pill-green">{text.statusOpen}</span>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ border: '1px solid #dc2626', background: '#450a0a', color: '#fecaca', borderRadius: 8, padding: '8px 10px', fontSize: 12 }}>
              {error}
            </div>
          )}
          {/* Row 1 */}
          <div className="grid-2" style={{ gap: 12 }}>
            <Field label={text.fullName}>
              <input className="form-input" required placeholder={text.placeholderName} value={form.full_name || ''} onChange={set('full_name')} />
            </Field>
            <Field label={text.emailAddress}>
              <input className="form-input" type="email" required placeholder={text.placeholderEmail} value={form.email || ''} onChange={set('email')} />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid-2" style={{ gap: 12 }}>
            <Field label={text.phoneNumber}>
              <input className="form-input" type="tel" placeholder={text.placeholderPhone} value={form.phone || ''} onChange={set('phone')} />
            </Field>
            <Field label={text.countryOrigin}>
              <select className="form-input" required value={form.country} onChange={set('country')}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Row 3 */}
          <div className="grid-3" style={{ gap: 12 }}>
            <Field label={text.desiredMajor}>
              <select className="form-input" required value={form.major} onChange={set('major')}>
                {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label={text.degreeLevel}>
              <select className="form-input" value={form.level} onChange={set('level')}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label={text.intendedStart}>
              <select className="form-input" value={form.start} onChange={set('start')}>
                {STARTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid-2" style={{ gap: 12 }}>
            <Field label={text.preferredLanguage}>
              <select className="form-input" value={form.language} onChange={set('language')}>
                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </Field>
            <div />
          </div>

          {/* Message */}
          <Field label={text.additionalMessage}>
            <textarea className="form-input" rows={3} placeholder={text.placeholderMessage} value={form.message || ''} onChange={set('message')} style={{ resize: 'vertical' }} />
          </Field>

          {/* GDPR */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            <input type="checkbox" required id="gdpr" style={{ marginTop: 2 }} />
            <label htmlFor="gdpr">
              {text.consentIntro}{' '}
              <a href="/privacy-policy" style={{ color: 'var(--blue)' }}>{text.privacyPolicy}</a>.
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" type="submit" disabled={busy} style={{ padding: '10px 28px', fontSize: 13 }}>
              {busy ? text.submitting : text.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
