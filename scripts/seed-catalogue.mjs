/**
 * africadawad catalogue (W-00 plan Phase 7) for local runs, e2e, the stub capture and screenshots ONLY — added through
 * the ADMIN API (never SQL), idempotent. Never used for staging or production (the catalogue there is the owner's,
 * created in /admin — plan §11).
 * The API's Development seed (ta3lom's 3 categories and 6 projects) is RETIRED, not mixed in: its projects are archived
 * and its categories deactivated through the admin API (the API repo is not edited). Then 8 categories (one left EMPTY
 * for the empty state; «الصندوق العام» is the only one that accepts general gifts) and 22 published projects: more than
 * 20 (two pages, as the e2e expects), two `urgent` (banner prev/next) and two `new`, and every card shape: options only,
 * open amount only, both. English titles avoid the banned words (check-no-commerce: "printing", never "books").
 * Slugs start with `c-`: not `e2e-…`, so hideE2eCatalogue() keeps them.
 */
import { png } from './lib/png.mjs';

/** The API's Development seed (ta3lom_store_api DevelopmentCatalogSeeder) — retired by seedCatalogue(). */
export const RETIRED_CATEGORIES = ['dawah', 'education', 'relief'];
export const RETIRED_PROJECTS = [
  'print-a-title',
  'dawah-umrah',
  'support-a-daiya',
  'water-wells',
  'iftar-meals',
  'learner-support',
];

/** [slug, nameAr, nameEn, acceptsGeneralGifts, rgb] — placeholder cover colours from the africadawad palette. */
export const CATEGORIES = [
  ['c-preachers', 'كفالة الدعاة', 'Preacher sponsorship', false, [48, 79, 80]],
  ['c-translation', 'الترجمة والطباعة', 'Translation and printing', false, [160, 141, 98]],
  ['c-african-langs', 'التعليم بلغات أفريقيا', 'Teaching in African languages', false, [61, 97, 97]],
  ['c-media', 'الإنتاج الصوتي والمرئي', 'Audio and video production', false, [36, 64, 63]],
  ['c-water', 'سقيا الماء', 'Water', false, [46, 110, 130]],
  ['c-mosques', 'المساجد', 'Mosques', false, [90, 101, 99]],
  ['c-general-fund', 'الصندوق العام', 'General fund', true, [27, 46, 46]],
  ['c-iftar', 'إفطار الصائمين', 'Iftar meals', false, [126, 108, 67]], // stays empty (empty-category state)
];

const opt = (labelAr, labelEn, amount) => ({ labelAr, labelEn, amount });
const P = (slug, cat, titleAr, titleEn, summaryAr, summaryEn, badge, open, min, options) => [
  slug, cat, titleAr, titleEn, summaryAr, summaryEn, badge, open, min, options,
];
/** [slug, category, titleAr, titleEn, summaryAr, summaryEn, badge, allowOpenAmount, minAmount, options] */
export const PROJECTS = [
  P('c-preacher-nigeria', 'c-preachers', 'كفالة داعية في نيجيريا لمدة عام', 'Sponsor a preacher in Nigeria for a year',
    'راتب داعية متفرغ يعلّم الناس دينهم بلغة الهوسا في القرى النائية.',
    'A full-time preacher who teaches in Hausa in remote villages.', 'urgent', false, null,
    [opt('كفالة شهر', 'One month', '300.00'), opt('كفالة 3 أشهر', 'Three months', '900.00'), opt('كفالة سنة', 'One year', '3600.00')]),
  P('c-preacher-senegal', 'c-preachers', 'كفالة داعية في السنغال', 'Sponsor a preacher in Senegal',
    'داعية يقدّم الدروس بلغة الولوف في المساجد والقرى.', 'A preacher who teaches in Wolof in mosques and villages.',
    null, true, '50.00', [opt('كفالة شهر', 'One month', '250.00'), opt('كفالة سنة', 'One year', '3000.00')]),
  P('c-preacher-chad', 'c-preachers', 'كفالة داعية في تشاد', 'Sponsor a preacher in Chad',
    'كفالة داعية يعلّم العربية والعلوم الشرعية في تشاد.', 'A preacher teaching Arabic and Islamic sciences in Chad.',
    'new', false, null, [opt('كفالة شهر', 'One month', '250.00')]),
  P('c-preacher-training', 'c-preachers', 'تأهيل الدعاة الجدد', 'Training new preachers',
    'برنامج تأهيل للدعاة الجدد في العلوم الشرعية واللغة العربية.', 'A training programme for new preachers in Islamic sciences and Arabic.',
    null, true, null, []),
  P('c-translate-hausa', 'c-translation', 'ترجمة معاني القرآن بلغة الهوسا', 'Quran meanings in Hausa',
    'طباعة وتوزيع نسخ مراجعة من ترجمة معاني القرآن الكريم.', 'Printing and handing out reviewed copies of the Quran meanings in Hausa.',
    'new', true, '25.00', [opt('نسخة', 'One copy', '25.00'), opt('10 نسخ', 'Ten copies', '250.00')]),
  P('c-translate-swahili', 'c-translation', 'ترجمة رسائل العقيدة بالسواحيلية', 'Creed epistles in Swahili',
    'ترجمة رسائل مختصرة في العقيدة إلى اللغة السواحيلية.', 'Short epistles on creed translated into Swahili.',
    null, true, '15.00', [opt('رسالة', 'One epistle', '15.00')]),
  P('c-print-fulani', 'c-translation', 'طباعة مطويات بلغة الفولاني', 'Leaflets in Fulani',
    'مطويات دعوية مطبوعة بلغة الفولاني توزّع في الأسواق.', 'Printed leaflets in Fulani handed out in markets.',
    null, false, null, [opt('100 مطوية', '100 leaflets', '120.00')]),
  P('c-translate-review', 'c-translation', 'مراجعة الترجمات', 'Reviewing translations',
    'مراجعة لغوية وشرعية للترجمات قبل طباعتها.', 'Language and content review of translations before printing.',
    null, true, null, []),
  P('c-arabic-somali', 'c-african-langs', 'تعليم العربية للناطقين بالصومالية', 'Arabic lessons for Somali speakers',
    'مقعد دراسي في حلقات تعليم العربية للناطقين بالصومالية.', 'A seat in Arabic lessons for Somali speakers.',
    null, true, '50.00', [opt('مقعد', 'One seat', '200.00'), opt('5 مقاعد', 'Five seats', '1000.00')]),
  P('c-circle-tanzania', 'c-african-langs', 'حلقة تحفيظ في تنزانيا', 'Memorisation circle in Tanzania',
    'حلقة لتحفيظ القرآن الكريم للأطفال في تنزانيا.', 'A Quran memorisation circle for children in Tanzania.',
    null, false, null, [opt('شهر', 'One month', '400.00')]),
  P('c-teacher-mali', 'c-african-langs', 'راتب معلم في مالي', "A teacher's salary in Mali",
    'راتب معلم يدرّس العربية بلغة البمبارا.', 'A teacher who teaches Arabic in Bambara.',
    'urgent', false, null, [opt('شهر', 'One month', '350.00'), opt('سنة', 'One year', '4200.00')]),
  P('c-classroom-niger', 'c-african-langs', 'تجهيز فصل دراسي في النيجر', 'Equip a classroom in Niger',
    'مقاعد وسبورة وأدوات لفصل دراسي جديد.', 'Desks, a board and supplies for a new classroom.',
    null, true, '100.00', [opt('فصل', 'One classroom', '4500.00')]),
  P('c-audio-swahili', 'c-media', 'تسجيل دروس صوتية بالسواحيلية', 'Audio lessons in Swahili',
    'إنتاج سلسلة دروس صوتية في العقيدة والفقه بالسواحيلية.', 'A series of audio lessons on creed and fiqh in Swahili.',
    null, true, '50.00', [opt('حلقة', 'One episode', '150.00'), opt('5 حلقات', 'Five episodes', '750.00')]),
  P('c-video-hausa', 'c-media', 'إنتاج مقاطع مرئية بالهوسا', 'Short videos in Hausa',
    'مقاطع مرئية قصيرة تشرح أركان الإسلام بلغة الهوسا.', 'Short videos explaining the pillars of Islam in Hausa.',
    null, false, null, [opt('مقطع', 'One video', '500.00')]),
  P('c-radio-program', 'c-media', 'برنامج إذاعي أسبوعي', 'A weekly radio programme',
    'برنامج إذاعي يبث الدروس في المناطق الريفية.', 'A radio programme that carries lessons to rural areas.',
    null, false, null, [opt('أسبوع', 'One week', '300.00'), opt('شهر', 'One month', '1200.00')]),
  P('c-well-shallow', 'c-water', 'حفر بئر سطحية', 'Dig a shallow well',
    'بئر تروي قرية صغيرة لسنوات.', 'A well that serves a small village for years.',
    null, true, '50.00', [opt('بئر', 'One well', '6000.00')]),
  P('c-well-deep', 'c-water', 'حفر بئر ارتوازية', 'Dig a deep well',
    'بئر ارتوازية بمضخة تخدم أكثر من قرية.', 'A deep well with a pump that serves several villages.',
    null, true, '100.00', [opt('بئر', 'One well', '18000.00')]),
  P('c-water-cooler', 'c-water', 'برادة مياه لمسجد', 'Water cooler for a mosque',
    'ماء بارد للمصلين طوال العام.', 'Cold water for worshippers all year.',
    null, false, null, [opt('برادة', 'One cooler', '2500.00')]),
  P('c-mosque-build', 'c-mosques', 'بناء مسجد صغير', 'Build a small mosque',
    'مسجد صغير لقرية لا مسجد فيها.', 'A small mosque for a village without one.',
    null, true, null, []),
  P('c-mosque-carpets', 'c-mosques', 'فرش مسجد', 'Carpets for a mosque',
    'فرش جديد لمسجد في قرية نائية.', 'New carpets for a mosque in a remote village.',
    null, false, null, [opt('متر', 'One metre', '50.00')]),
  P('c-mosque-restore', 'c-mosques', 'ترميم مسجد', 'Restore a mosque',
    'ترميم السقف والجدران ودورات المياه.', 'Repairing the roof, walls and washrooms.',
    null, true, null, []),
  P('c-general-needs', 'c-general-fund', 'حيث الحاجة أشد', 'Where the need is greatest',
    'يصرف تبرعك على المشروع الأشد حاجة في وقته.', 'Your donation goes to the most urgent need at the time.',
    null, true, null, []),
];

/** Archives the API's Development-seed projects and deactivates its categories (admin API; idempotent). */
async function retireDevelopmentSeed(c, log) {
  let archived = 0;
  for (const p of await adminProjects(c)) {
    if (!RETIRED_PROJECTS.includes(p.slug) || p.status === 'archived') continue;
    const r = await c.call('POST', `/v1/admin/projects/${p.id}/archive`);
    if (r.status !== 200 && r.status !== 204)
      throw new Error(`archive ${p.slug}: ${r.status} ${JSON.stringify(r.body)}`);
    archived++;
  }
  let hidden = 0;
  for (const cat of (await c.call('GET', '/v1/admin/categories')).body ?? []) {
    if (!RETIRED_CATEGORIES.includes(cat.slug) || !cat.isActive) continue;
    const r = await c.call('PUT', `/v1/admin/categories/${cat.id}`, { ...pickCategory(cat), isActive: false });
    if (r.status !== 200) throw new Error(`deactivate ${cat.slug}: ${r.status} ${JSON.stringify(r.body)}`);
    hidden++;
  }
  log(`development seed retired: ${archived} project(s) archived, ${hidden} category(ies) deactivated`);
}

const pickCategory = (x) => ({
  slug: x.slug,
  nameAr: x.nameAr,
  nameEn: x.nameEn,
  descriptionAr: x.descriptionAr,
  descriptionEn: x.descriptionEn,
  imageAssetId: x.imageAssetId,
  acceptsGeneralGifts: x.acceptsGeneralGifts,
  sort: x.sort,
  isActive: x.isActive,
  version: x.version,
});

async function upload(c, nameAr, nameEn, rgb) {
  const form = new FormData();
  form.append('file', new Blob([png(1200, 800, rgb)], { type: 'image/png' }), 'cover.png');
  form.append('kind', 'image');
  form.append('altAr', nameAr);
  form.append('altEn', nameEn);
  const r = await c.call('POST', '/v1/admin/media', form);
  if (r.status !== 201) throw new Error(`media upload: ${r.status} ${JSON.stringify(r.body)}`);
  return r.body.id;
}

async function adminProjects(c) {
  const all = [];
  for (let page = 1; ; page++) {
    const r = await c.call('GET', `/v1/admin/projects?page=${page}&pageSize=100`);
    const items = r.body?.items ?? [];
    all.push(...items);
    if (items.length < 100) break;
  }
  return all;
}

/** Adds what is missing; returns counts. `c` is a signed-in staff client with catalogue rights. */
export async function seedCatalogue(c, log = () => {}) {
  await retireDevelopmentSeed(c, log);
  const cats = (await c.call('GET', '/v1/admin/categories')).body;
  const bySlug = new Map(cats.map((x) => [x.slug, x]));
  let sort = Math.max(0, ...cats.map((x) => Number(x.sort) || 0));
  const covers = new Map();
  for (const [slug, nameAr, nameEn, gifts] of CATEGORIES) {
    const have = bySlug.get(slug);
    if (have && (have.nameAr !== nameAr || have.nameEn !== nameEn)) {
      const r = await c.call('PUT', `/v1/admin/categories/${have.id}`, {
        ...pickCategory(have),
        nameAr,
        nameEn,
      });
      if (r.status !== 200)
        throw new Error(`category ${slug}: ${r.status} ${JSON.stringify(r.body)}`);
      bySlug.set(slug, r.body);
      log(`category ${slug} renamed`);
    }
    if (have) continue;
    const r = await c.call('POST', '/v1/admin/categories', {
      slug,
      nameAr,
      nameEn,
      descriptionAr: `مشاريع ${nameAr}.`,
      descriptionEn: `${nameEn} projects.`,
      imageAssetId: null,
      acceptsGeneralGifts: gifts,
      sort: ++sort,
      isActive: true,
      version: null,
    });
    if (r.status !== 201)
      throw new Error(`category ${slug}: ${r.status} ${JSON.stringify(r.body)}`);
    bySlug.set(slug, r.body);
    log(`category ${slug} created`);
  }

  const existing = new Map((await adminProjects(c)).map((p) => [p.slug, p]));
  let created = 0;
  for (const [
    i,
    [slug, catSlug, titleAr, titleEn, summaryAr, summaryEn, badge, open, minAmount, options],
  ] of PROJECTS.entries()) {
    const cat = bySlug.get(catSlug);
    if (!cat) throw new Error(`seed: category ${catSlug} missing`);
    let p = existing.get(slug);
    if (!p) {
      const rgb = CATEGORIES.find((x) => x[0] === catSlug)?.[4] ?? [40, 120, 90];
      if (!covers.has(catSlug))
        covers.set(catSlug, await upload(c, cat.nameAr, cat.nameEn ?? cat.nameAr, rgb));
      const r = await c.call('POST', '/v1/admin/projects', {
        categoryId: cat.id,
        slug,
        titleAr,
        titleEn,
        summaryAr,
        summaryEn,
        bodyAr: `${summaryAr}\n\nكل تبرع يصل إلى مستحقيه بإيصال رسمي.`,
        bodyEn: `${summaryEn}\n\nEvery donation reaches the people it is for, with an official receipt.`,
        coverAssetId: covers.get(catSlug),
        allowOpenAmount: open,
        minAmount,
        badge,
        sort: 100 + i,
        seoTitleAr: null,
        seoTitleEn: null,
        seoDescAr: null,
        seoDescEn: null,
        version: null,
      });
      if (r.status !== 201)
        throw new Error(`project ${slug}: ${r.status} ${JSON.stringify(r.body)}`);
      p = r.body;
      if (options.length) {
        const o = await c.call('PUT', `/v1/admin/projects/${p.id}/options`, {
          options: options.map((x, k) => ({ id: null, ...x, sort: k + 1, isActive: true })),
          version: p.version,
        });
        if (o.status !== 200)
          throw new Error(`options ${slug}: ${o.status} ${JSON.stringify(o.body)}`);
      }
      created++;
    }
    if (p.status !== 'published') {
      const r = await c.call('POST', `/v1/admin/projects/${p.id}/publish`);
      if (r.status !== 200 && r.status !== 204)
        throw new Error(`publish ${slug}: ${r.status} ${JSON.stringify(r.body)}`);
    }
  }
  log(`projects: ${created} created, ${PROJECTS.length} in the africadawad set`);
}
