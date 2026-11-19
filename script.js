// --- Mobile navigation ---
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? 'Բացել ընտրացանկը' : 'Փակել ընտրացանկը');
  navLinks.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

// --- SPA tabs: only one panel is displayed ---
const tabViews = [...document.querySelectorAll('.tab-view')];
const tabLinks = [...document.querySelectorAll('[data-tab]')];

function activateTab(tabId) {
  const [requestedTab, requestedTech] = String(tabId || '').split('/');
  const id = ['home', 'project', 'architecture', 'modules', 'demo'].includes(requestedTab) ? requestedTab : 'home';
  const techId = id === 'architecture' && techDetails[requestedTech] ? requestedTech : '';

  tabViews.forEach(view => {
    const active = view.id === id || (view.id === 'home-ticker' && id === 'home');
    view.classList.toggle('active-view', active);
  });

  document.querySelectorAll('.nav-links [data-tab]').forEach(link => {
    const active = link.dataset.tab === id;
    link.classList.toggle('active', active);
    link.setAttribute('aria-selected', String(active));
  });

  document.getElementById('architectureOverview').hidden = Boolean(techId);
  const detailView = document.getElementById('techDetailView');
  detailView.hidden = !techId;
  if (techId) renderTechDetail(techId);

  navLinks?.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  history.replaceState(null, '', techId ? `#architecture/${techId}` : `#${id}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabLinks.forEach(control => {
  control.addEventListener('click', event => {
    event.preventDefault();
    activateTab(control.dataset.tab);
  });
});

window.addEventListener('hashchange', () => activateTab(location.hash.slice(1)));

// --- Architecture technology detail views ---
const techDetails = {
  fastapi: {
    category: 'PYTHON WEB / API GATEWAY',
    title: 'FastAPI / Flask',
    intro: 'FastAPI-ն կամ Flask-ը համակարգի մուտքային API սահմանն է։ Այն ընդունում է կառավարման վահանակի ու մոնիթորինգի գործակալների հարցումները, բայց որևէ հարցում չի համարում վստահելի միայն այն պատճառով, որ եկել է ներքին ցանցից։ FastAPI-ն հարմար է տիպավորված սխեմաներով և ասինխրոն I/O-ով ծառայությունների համար, իսկ Flask-ը՝ փոքր, հստակ սահմանված endpoint-ներով տեղակայման համար։',
    diagramLabel: 'Հարցման հոսք. հաճախորդից API gateway, նույնականացման middleware, քաղաքականության շարժիչ և պաշտպանված ծառայություն',
    diagram: `<svg viewBox="0 0 800 300" role="img" aria-label="Հարցման հոսք. հաճախորդից API gateway, նույնականացման middleware, քաղաքականության շարժիչ և պաշտպանված ծառայություն">
      <defs><marker id="detailArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0L0 6L9 3z" fill="#00E5FF"/></marker></defs>
      <path class="detail-edge" d="M190 144H238M390 144H438M590 144H638" marker-end="url(#detailArrow)"/>
      <g class="detail-node"><rect x="20" y="94" width="170" height="100"/><text x="105" y="136" text-anchor="middle">Client</text><text class="detail-node-sub" x="105" y="163" text-anchor="middle">TLS request</text></g>
      <g class="detail-node accent-node"><rect x="240" y="94" width="150" height="100"/><text x="315" y="136" text-anchor="middle">API gateway</text><text class="detail-node-sub" x="315" y="163" text-anchor="middle">FastAPI / Flask</text></g>
      <g class="detail-node"><rect x="440" y="94" width="150" height="100"/><text x="515" y="136" text-anchor="middle">Policy check</text><text class="detail-node-sub" x="515" y="163" text-anchor="middle">token + posture</text></g>
      <g class="detail-node secure-node"><rect x="640" y="94" width="140" height="100"/><text x="710" y="136" text-anchor="middle">Resource</text><text class="detail-node-sub" x="710" y="163" text-anchor="middle">allow / deny</text></g>
      <path class="detail-feedback" d="M515 196V248H315V196" marker-end="url(#detailArrow)"/><text class="detail-caption" x="415" y="273" text-anchor="middle">audit event on every decision</text>
    </svg>`,
    flow: ['Հաճախորդը TLS-ով ուղարկում է հարցումն ու պահանջվող գործողությունը։', 'Middleware-ը վավերացնում է մուտքային տվյալները, JWT-ի ստորագրությունը և հարցման սահմանաչափերը։', 'Քաղաքականության շերտը ստուգում է դերը, սարքի վիճակը և ռեսուրսի պահանջվող թույլտվությունը։', 'Թույլատրված հարցումը հասնում է ծառայությանը, իսկ մերժումը կամ հաջողությունը գրանցվում է աուդիտում։'],
    operation: 'FastAPI-ի dependency-ները կամ Flask-ի before_request middleware-ը նույնականացման ու թույլտվության ստուգումները տեղադրում են յուրաքանչյուր endpoint-ից առաջ։ Pydantic սխեմաները (FastAPI) կամ համարժեք մուտքային վավերացումը սահմանափակում են ընդունվող դաշտերը, իսկ ասինխրոն մշակումը թույլ է տալիս API-ին սպասել տվյալների շտեմարանին և արտաքին ստուգումներին՝ առանց հարցումների հերթը արգելափակելու։',
    integration: 'API շերտը ստանում է JWT/OAuth2 նույնականացման արդյունքը, դիմում է քաղաքականության շարժիչին և տվյալներ է կարդում SQLAlchemy-ի միջոցով։ Գործողության արդյունքը փոխանցվում է կառուցվածքային logging-ին, իսկ անսովոր հարցումների հաճախականությունը կարող է համադրվել psutil-ի և անվտանգության մետրիկաների հետ։',
    threats: ['Չարտոնված կամ կեղծված հարցումներ՝ ստորագրության, սխեմայի և մուտքային տվյալների ստուգմամբ։', 'Հորիզոնական կամ ուղղահայաց արտոնությունների բարձրացում՝ յուրաքանչյուր ռեսուրսի ու գործողության համար առանձին քաղաքականությամբ։', 'Հարցումների կրկնակի ուղարկում և ծառայության սպառում՝ կարճաժամկետ տոկենների, timeout-ների և rate limit-ների կիրառմամբ։'],
    scenarios: ['Ադմինիստրատորի վահանակի API՝ օգտատեր, սարք կամ մուտքի քաղաքականություն փոփոխելիս։', 'Մոնիթորինգի գործակալի heartbeat endpoint, որը գրանցվում է միայն գրանցված սարքից ու վավեր սեսիայով։', 'Անվտանգության ազդանշանի ստացում, որի հիման վրա API-ն կարող է պահանջել MFA կամ ժամանակավորապես մերժել գործողությունը։']
  },
  sqlalchemy: {
    category: 'DATA ACCESS / AUDIT',
    title: 'SQLAlchemy',
    intro: 'SQLAlchemy-ն տվյալների հասանելիության շերտն է, որը կապում է հավելվածի Python օբյեկտները հարաբերական շտեմարանի աղյուսակներին։ Այն կենտրոնացնում է օգտատերերի, սարքերի, դերերի, քաղաքականությունների և աուդիտի իրադարձությունների մոդելները՝ API-ի բիզնես տրամաբանությունը SQL մանրամասներից տարանջատելով։ Տվյալների շտեմարանի սահմանափակումներն ու գործարքները մնում են անվտանգության վերահսկողության կարևոր մաս, ոչ թե միայն պահպանման հարմարություն։',
    diagramLabel: 'Տվյալների հոսք. API ծառայություն, SQLAlchemy մոդելներ և գործարք, հարաբերական շտեմարան, աուդիտի գրառումներ',
    diagram: `<svg viewBox="0 0 800 300" role="img" aria-label="Տվյալների հոսք. API ծառայություն, SQLAlchemy մոդելներ և գործարք, հարաբերական շտեմարան, աուդիտի գրառումներ">
      <defs><marker id="detailArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0L0 6L9 3z" fill="#00E5FF"/></marker></defs>
      <path class="detail-edge" d="M190 144H238M390 144H438M590 144H638" marker-end="url(#detailArrow)"/>
      <g class="detail-node"><rect x="20" y="94" width="170" height="100"/><text x="105" y="136" text-anchor="middle">API service</text><text class="detail-node-sub" x="105" y="163" text-anchor="middle">authorized query</text></g>
      <g class="detail-node accent-node"><rect x="240" y="94" width="150" height="100"/><text x="315" y="136" text-anchor="middle">SQLAlchemy</text><text class="detail-node-sub" x="315" y="163" text-anchor="middle">ORM + transaction</text></g>
      <g class="detail-node"><rect x="440" y="94" width="150" height="100"/><text x="515" y="136" text-anchor="middle">Database</text><text class="detail-node-sub" x="515" y="163" text-anchor="middle">constraints + TLS</text></g>
      <g class="detail-node secure-node"><rect x="640" y="94" width="140" height="100"/><text x="710" y="136" text-anchor="middle">Audit trail</text><text class="detail-node-sub" x="710" y="163" text-anchor="middle">actor + outcome</text></g>
      <path class="detail-feedback" d="M710 196V248H315V196" marker-end="url(#detailArrow)"/><text class="detail-caption" x="510" y="273" text-anchor="middle">commit or rollback as one unit</text>
    </svg>`,
    flow: ['API-ն քաղաքականության ստուգումից հետո փոխանցում է միայն թույլատրված հարցումը։', 'ORM մոդելը կապում է դաշտերը, արտաքին բանալիներն ու սահմանափակումները հավելվածի օբյեկտներին։', 'Session-ը կատարում է պարամետրացված հարցումներ և փոփոխությունները միավորում է գործարքի մեջ։', 'Արդյունքն ու որոշման համատեքստը պահպանվում են աուդիտի մատյանում՝ commit/rollback վարքով։'],
    operation: 'SQLAlchemy ORM-ը քարտեզագրում է օգտատեր, սարք, դեր և մուտքի իրադարձություն մոդելները։ Session-ը կառավարում է տվյալների շտեմարանի կապն ու գործարքի ամբողջականությունը. սխալի դեպքում փոփոխությունները հետ են շրջվում, որպեսզի կիսատ քաղաքականության փոփոխություն չմնա։ Միգրացիաները պետք է վերահսկվեն և կիրառվեն ըստ միջավայրի, իսկ գաղտնիքները պահվեն հավելվածից դուրս։',
    integration: 'API ծառայությունը նախ ստուգում է JWT-ի ինքնությունը և ABAC/RBAC կանոնները, ապա հարցնում SQLAlchemy-ին միայն տվյալ դերի համար անհրաժեշտ գրառումները։ Աուդիտի գրառումը կապվում է նույն request ID-ի հետ, որպեսզի հետաքննության ընթացքում հնարավոր լինի հետևել որոշմանը՝ առանց զգայուն տվյալները սովորական մատյաններում բացահայտելու։',
    threats: ['SQL injection՝ ORM-ի պարամետրացված հարցումներով և անվստահելի արժեքների խուսափմամբ որպես SQL արտահայտություն։', 'Խաչաձև գրառումների հասանելիություն՝ tenant/user սահմանները հարցման ու տվյալների մոդելի մակարդակով ստուգելով։', 'Մասնակի թարմացում կամ աուդիտի բացակայություն՝ գործարքներով, հղումային սահմանափակումներով և անհաջողության դեպքում rollback-ով։'],
    scenarios: ['Դերերի, սարքի վստահության վիճակի և քաղաքականության տարբերակների պահպանում։', 'Յուրաքանչյուր թույլատրված կամ մերժված ադմինիստրատիվ գործողության որոնելի պատմություն։', 'Հետաքննության ընթացքում request ID-ով օգտատիրոջը, սարքին, քաղաքականությանը և արդյունքին կապակցում։']
  },
  jwt: {
    category: 'IDENTITY / POLICY',
    title: 'JWT / OAuth2',
    intro: 'OAuth2-ը սահմանում է, թե ինչպես է հաճախորդը ստանում սահմանափակ հասանելիության նշան, իսկ JWT-ը կարող է այդ նշանի մեջ կրել ստորագրված պահանջներ՝ օրինակ subject, audience, scope և ժամկետ։ Ստորագրության վավեր լինելը միայն նույնականացման ազդակ է. այն ինքնին չի ապացուցում, որ տվյալ պահին սարքը վստահելի է կամ գործողությունը թույլատրելի։ Zero Trust հոսքում յուրաքանչյուր հարցում նորից գնահատվում է։',
    diagramLabel: 'Նույնականացման հոսք. հաճախորդ, OAuth2 authorization, JWT ստուգում, RBAC/ABAC քաղաքականություն և պաշտպանված ռեսուրս',
    diagram: `<svg viewBox="0 0 800 300" role="img" aria-label="Նույնականացման հոսք. հաճախորդ, OAuth2 authorization, JWT ստուգում, RBAC/ABAC քաղաքականություն և պաշտպանված ռեսուրս">
      <defs><marker id="detailArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0L0 6L9 3z" fill="#00E5FF"/></marker></defs>
      <path class="detail-edge" d="M190 144H238M390 144H438M590 144H638" marker-end="url(#detailArrow)"/>
      <g class="detail-node"><rect x="20" y="94" width="170" height="100"/><text x="105" y="136" text-anchor="middle">Client</text><text class="detail-node-sub" x="105" y="163" text-anchor="middle">OAuth2 flow</text></g>
      <g class="detail-node accent-node"><rect x="240" y="94" width="150" height="100"/><text x="315" y="136" text-anchor="middle">JWT verifier</text><text class="detail-node-sub" x="315" y="163" text-anchor="middle">sig + exp + aud</text></g>
      <g class="detail-node"><rect x="440" y="94" width="150" height="100"/><text x="515" y="136" text-anchor="middle">Policy engine</text><text class="detail-node-sub" x="515" y="163" text-anchor="middle">role + device</text></g>
      <g class="detail-node secure-node"><rect x="640" y="94" width="140" height="100"/><text x="710" y="136" text-anchor="middle">Resource</text><text class="detail-node-sub" x="710" y="163" text-anchor="middle">scoped access</text></g>
      <path class="detail-feedback" d="M515 196V248H315V196" marker-end="url(#detailArrow)"/><text class="detail-caption" x="415" y="273" text-anchor="middle">deny, expire, revoke, or require MFA</text>
    </svg>`,
    flow: ['OAuth2 հոսքը սահմանված հաճախորդին տրամադրում է կարճաժամկետ, նվազագույն scope-ով access token։', 'API-ն ստուգում է ստորագրությունը, թույլատրելի ալգորիթմը, issuer-ը, audience-ը և exp ժամկետը։', 'RBAC/ABAC-ը համադրում է token-ի claims-ը հարցման, սարքի posture-ի և գործողության հետ։', 'Մերժման, ժամկետի լրացման կամ բարձր ռիսկի դեպքում մուտքը փակվում է, և կարող է պահանջվել նոր նույնականացում կամ MFA։'],
    operation: 'JWT վավերացնողը պետք է վստահի միայն նախապես սահմանված բանալիներին ու ալգորիթմներին, ստուգի issuer/audience-ը, ժամկետը և անհրաժեշտ claims-ը։ Token-ը bearer credential է, ուստի այն չպետք է հայտնվի URL-ում կամ մատյաններում։ Կարճ TTL-ը և անվտանգ refresh/revocation ռազմավարությունը նվազեցնում են արտահոսած տոկենի օգտակարության տևողությունը։',
    integration: 'API middleware-ը token-ից ստանում է ինքնության և scope-ի ապացույցը, ապա policy engine-ը միավորում է այն SQLAlchemy-ում պահվող դերերի, ռեսուրսի և psutil/logging հոսքից ստացվող սարքի վիճակի հետ։ Վերջնական թույլտվությունը հաշվարկվում է ըստ գործողության, ոչ թե միայն մուտքի պահին։',
    threats: ['Գողացված կամ կեղծված տոկեն՝ ստորագրության, issuer/audience-ի և ժամկետի ստուգմամբ, կարճ TTL-ով և գաղտնիքների պաշտպանությամբ։', 'Replay և չափազանց լայն հասանելիություն՝ նվազագույն scope-ով, կարճ սեսիայով ու անհրաժեշտության դեպքում nonce/MFA վերահսկմամբ։', 'Միայն դերին վստահելու հետևանքով արտոնությունների չարաշահում՝ սարքի և համատեքստի ABAC ստուգմամբ յուրաքանչյուր հարցման համար։'],
    scenarios: ['Օպերատորը դիտում է մոնիթորինգը, բայց չի կարող փոխել օգտատերերի քաղաքականությունները։', 'Անծանոթ սարքից ադմինիստրատիվ գործողությունը մերժվում է կամ պահանջում է MFA։', 'Կասկածելի սեսիայի ազդանշանից հետո token-ը դադարեցվում է, իսկ հաջորդ հարցումները կրկին ստուգվում են։']
  },
  psutil: {
    category: 'MONITORING / RESPONSE',
    title: 'psutil / logging',
    intro: 'psutil-ը Python գործընթացին տալիս է հյուրընկալող համակարգի CPU-ի, հիշողության, պրոցեսների և ցանցային կապերի չափումներ։ logging-ը դրանք և անվտանգության իրադարձությունները փոխանցում է կառուցվածքային մատյանների հոսք։ Այս շերտը դիտարկելիություն է ապահովում, ոչ թե ինքնուրույն նույնականացում. մետրիկաները պետք է համադրվեն օգտատիրոջ, սարքի և API հարցման համատեքստի հետ՝ վստահության որոշումը հիմնավորելու համար։',
    diagramLabel: 'Հեռաչափության հոսք. հյուրընկալող համակարգի չափումներ, psutil հավաքիչ, կառուցվածքային logging, ռիսկի վերլուծություն և արձագանք',
    diagram: `<svg viewBox="0 0 800 300" role="img" aria-label="Հեռաչափության հոսք. հյուրընկալող համակարգի չափումներ, psutil հավաքիչ, կառուցվածքային logging, ռիսկի վերլուծություն և արձագանք">
      <defs><marker id="detailArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0L0 6L9 3z" fill="#00E5FF"/></marker></defs>
      <path class="detail-edge" d="M190 144H238M390 144H438M590 144H638" marker-end="url(#detailArrow)"/>
      <g class="detail-node"><rect x="20" y="94" width="170" height="100"/><text x="105" y="136" text-anchor="middle">Host signals</text><text class="detail-node-sub" x="105" y="163" text-anchor="middle">CPU / RAM / net</text></g>
      <g class="detail-node accent-node"><rect x="240" y="94" width="150" height="100"/><text x="315" y="136" text-anchor="middle">psutil agent</text><text class="detail-node-sub" x="315" y="163" text-anchor="middle">sample + context</text></g>
      <g class="detail-node"><rect x="440" y="94" width="150" height="100"/><text x="515" y="136" text-anchor="middle">Structured logs</text><text class="detail-node-sub" x="515" y="163" text-anchor="middle">event + request ID</text></g>
      <g class="detail-node secure-node"><rect x="640" y="94" width="140" height="100"/><text x="710" y="136" text-anchor="middle">Risk response</text><text class="detail-node-sub" x="710" y="163" text-anchor="middle">alert / contain</text></g>
      <path class="detail-feedback" d="M710 196V248H315V196" marker-end="url(#detailArrow)"/><text class="detail-caption" x="510" y="273" text-anchor="middle">signals inform the next access decision</text>
    </svg>`,
    flow: ['psutil-ը պարբերաբար հավաքում է թույլատրված համակարգային մետրիկաները և գործընթացների վիճակը։', 'Հավաքիչը տվյալներին կցում է timestamp, host/device ID և անհրաժեշտության դեպքում request/session ID։', 'logging-ը գրում է կառուցվածքային իրադարձություն՝ գաղտնիքների ու անձնական տվյալների մաքրումից հետո։', 'Կանոնները համադրում են ազդանշանները. բարձր ռիսկի դեպքում ստեղծվում է ահազանգ կամ սեսիայի սահմանափակում։'],
    operation: 'Հավաքման հաճախականությունը և հասանելի չափումները պետք է սահմանափակվեն, քանի որ որոշ համակարգային API-ներ պահանջում են բարձր արտոնություններ կամ կարող են ծանրաբեռնել հյուրընկալողին։ logging-ի գրառումները պահում են միասնական դաշտեր՝ ժամանակ, բաղադրիչ, severity, սարք և correlation ID։ Մատյանը պետք է պաշտպանված լինի չարտոնված փոփոխությունից և չպարունակի գաղտնաբառեր կամ ամբողջական access token-ներ։',
    integration: 'Մետրիկաները լրացնում են JWT-ի և policy engine-ի գնահատած համատեքստը. օրինակ՝ անսովոր պրոցես կամ ցանցային կապը կարող է բարձրացնել սարքի ռիսկը։ API-ի որոշումները, տվյալների փոփոխությունները և telemetry-ն կապվում են correlation ID-ով, որպեսզի օպերատորը տեսնի պատճառահետևանքային ամբողջ շղթան։',
    threats: ['Գաղտնի գործողությունների ուշ հայտնաբերում՝ պարբերական մետրիկաներով և կենտրոնացված իրադարձությունների մատյանով։', 'Միջադեպից հետո ապացույցների կորուստ՝ ժամանակային նշումներով, correlation ID-ով և վերահսկվող մատյանների հասանելիությամբ։', 'Վարկաբեկված սարքի անտեսանելի մնալը՝ շեղվող պրոցեսների, ռեսուրսների կամ ցանցային կապերի համադրմամբ։'],
    scenarios: ['CPU-ի կամ ցանցային կապերի անսովոր աճից հետո սարքի ռիսկի բարձրացում և նոր հարցումների լրացուցիչ ստուգում։', 'Ադմինիստրատիվ գործողությունից մինչև մերժման պատճառը մեկ correlation ID-ով հետագծում։', 'Անվտանգության օպերատորի կենդանի վահանակում սարքերի վիճակի, ազդանշանների և արձագանքի ցուցադրում։']
  }
};

function renderTechDetail(techId) {
  const detail = techDetails[techId];
  const detailView = document.getElementById('techDetailView');
  const renderList = items => items.map(item => `<li>${item}</li>`).join('');

  detailView.innerHTML = `
    <button class="detail-back" type="button" data-architecture-back><span aria-hidden="true">←</span> Հետ դառնալ Ճարտարապետություն</button>
    <header class="tech-detail-heading">
      <div class="eyebrow"><span>03</span> ${detail.category}</div>
      <h2>${detail.title}</h2>
      <p>${detail.intro}</p>
    </header>
    <div class="tech-detail-grid">
      <figure class="tech-diagram">${detail.diagram}<figcaption>Տվյալների և վերահսկման հոսք · ${detail.title}</figcaption></figure>
      <aside class="tech-flow"><h3>Հարցման հոսք</h3><ol>${renderList(detail.flow)}</ol></aside>
    </div>
    <div class="tech-detail-copy">
      <article><span class="detail-index">01 / ՄԵԽԱՆԻԶՄ</span><h3>Ինչպես է աշխատում</h3><p>${detail.operation}</p><p>${detail.integration}</p></article>
      <article><span class="detail-index">02 / ZERO TRUST</span><h3>Կանխվող ռիսկեր</h3><ul>${renderList(detail.threats)}</ul></article>
      <article><span class="detail-index">03 / ՕԳՏԱԳՈՐԾՈՒՄ</span><h3>Սցենարներ կառավարման մոնիթորինգում</h3><ul>${renderList(detail.scenarios)}</ul></article>
    </div>`;

  detailView.querySelector('[data-architecture-back]').addEventListener('click', () => activateTab('architecture'));
}

document.querySelectorAll('.tech-card').forEach(card => {
  card.addEventListener('click', () => activateTab(`architecture/${card.dataset.tech}`));
});

activateTab(location.hash.slice(1) || 'home');

// --- Code copy buttons ---
document.querySelectorAll('.copy-code').forEach(button => {
  button.addEventListener('click', async () => {
    const code = document.getElementById(button.dataset.copy)?.innerText || '';
    try {
      await navigator.clipboard.writeText(code);
      const original = button.textContent;
      button.textContent = 'Պատճենված է ✓';
      setTimeout(() => { button.textContent = original; }, 1600);
    } catch (_error) {
      button.textContent = 'Չհաջողվեց պատճենել';
    }
  });
});

// --- Editable Python example simulator; validates text and never executes Python ---
const codeRunOutput = document.getElementById('codeRunOutput');

function validatePythonText(source) {
  const expectedClosers = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  let quote = '';
  let tripleQuote = false;
  let escaped = false;
  let comment = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const triple = source.slice(index, index + 3);
    if (comment) {
      if (character === '\n') comment = false;
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (tripleQuote && triple === quote.repeat(3)) {
        quote = '';
        tripleQuote = false;
        index += 2;
      } else if (!tripleQuote && character === quote) quote = '';
      continue;
    }
    if (character === '#') comment = true;
    else if ((character === '"' || character === "'") && triple === character.repeat(3)) {
      quote = character;
      tripleQuote = true;
      index += 2;
    } else if (character === '"' || character === "'") quote = character;
    else if ('([{'.includes(character)) stack.push(character);
    else if (expectedClosers[character] && stack.pop() !== expectedClosers[character]) {
      throw new Error(`Սխալ փակագիծ՝ «${character}»։`);
    }
  }

  if (quote) throw new Error('Տողային արժեքը փակված չէ։');
  if (stack.length) throw new Error('Փակագծերից մեկը փակված չէ։');
  const suiteStart = /^\s*(?:async\s+def|def|if|elif|else|for|while|try|except|finally|with)\b.*$/;
  source.split('\n').forEach((line, index) => {
    if (suiteStart.test(line) && !/:\s*(?:#.*)?$/.test(line)) {
      throw new Error(`${index + 1}-րդ տողում բացակայում է «:»-ը։`);
    }
  });
}

function simulateExample(codeId, exampleType) {
  const source = document.getElementById(codeId)?.innerText || '';
  if (!source.trim()) throw new Error('Կոդի դաշտը դատարկ է։');
  validatePythonText(source);

  if (exampleType === 'token') {
    const required = [
      ['@verify_zero_trust_token', /@verify_zero_trust_token/],
      ['device_trusted', /\bdevice_trusted\b/],
      ['MFARequired', /\bMFARequired\b/],
      ['policy_engine.evaluate', /\bpolicy_engine\s*\.\s*evaluate\s*\(/]
    ];
    const missing = required.filter(([, pattern]) => !pattern.test(source)).map(([name]) => name);
    if (missing.length) throw new Error(`Չգտնվեցին պարտադիր տարրերը՝ ${missing.join(', ')}։`);
    if (!/if\s+not\s+device_trusted\s*:/.test(source)) {
      throw new Error('Չգտնվեց սարքի վստահությունը ստուգող «if not device_trusted:» պայմանը։');
    }
    return [
      'SIMULATION · Zero Trust token validation',
      'Trusted device: claims validated; policy_engine.evaluate(role, claims) → ALLOW',
      'Untrusted device: MFARequired raised → ACCESS DENIED / MFA_REQUIRED',
      'Python չի գործարկվել. արդյունքը հաշվարկվել է կոդի կառուցվածքից։'
    ].join('\n');
  }

  const required = [
    ['psutil', /\bpsutil\b/],
    ['collect_security_metrics', /\bcollect_security_metrics\b/],
    ['logging.info', /\blogging\s*\.\s*info\s*\(/]
  ];
  const missing = required.filter(([, pattern]) => !pattern.test(source)).map(([name]) => name);
  if (missing.length) throw new Error(`Չգտնվեցին պարտադիր տարրերը՝ ${missing.join(', ')}։`);
  const values = { cpu_percent: '18.4%', memory_percent: '42.1%', connections: '12' };
  const metricNames = [...source.matchAll(/["']([\w]+)["']\s*:/g)].map((match) => match[1]);
  const metricOutput = metricNames.length
    ? metricNames.map((name) => `  ${name}: ${values[name] || 'sample value'}`).join('\n')
    : '  (չսահմանված չափումներ)';
  return [
    'SIMULATION · System security metrics',
    'Status: OK · collect_security_metrics() completed',
    'Metrics:', metricOutput,
    'logging.info("zt_metrics", extra=metrics) → recorded',
    'Python չի գործարկվել. psutil/logging գործողությունները մոդելավորված են։'
  ].join('\n');
}

document.querySelectorAll('.run-code').forEach(button => {
  button.addEventListener('click', () => {
    if (!codeRunOutput) return;
    try {
      codeRunOutput.textContent = simulateExample(button.dataset.run, button.dataset.example);
      codeRunOutput.classList.remove('has-error');
    } catch (error) {
      codeRunOutput.textContent = `SIMULATION · ERROR\n${error.message}`;
      codeRunOutput.classList.add('has-error');
    }
  });
});

// --- Zero Trust Python-backend simulator ---
const verifyButton = document.getElementById('verifyBtn');
const roleCheck = document.getElementById('roleCheck');
const deviceStatus = document.getElementById('deviceStatus');
const deviceChecks = [...document.querySelectorAll('.device-check')].map(input => ({
  input,
  label: input.closest('label').querySelector('b').textContent
}));
const deviceHealthIndicator = document.getElementById('deviceHealthIndicator');
const deviceHealthPercent = document.getElementById('deviceHealthPercent');
const deviceHealthStatus = document.getElementById('deviceHealthStatus');
const responseStatus = document.getElementById('responseStatus');
const backendResponse = document.getElementById('backendResponse');
const httpResult = document.getElementById('httpResult');
const logStream = document.getElementById('logStream');
const requestId = document.getElementById('requestId');
const eventCount = document.getElementById('eventCount');
let eventTotal = 3;

function nowTime() {
  return new Intl.DateTimeFormat('hy-AM', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(new Date());
}

function addLog(type, message) {
  const row = document.createElement('div');
  row.className = 'log-row';
  row.innerHTML = `<time>${nowTime()}</time><span class="${type}">${type === 'deny' ? 'DENY' : type === 'warn' ? 'MFA' : 'ALLOW'}</span><p>${message}</p>`;
  logStream.prepend(row);
  while (logStream.children.length > 7) logStream.lastElementChild.remove();
  eventTotal += 1;
  eventCount.textContent = `${eventTotal} events`;
}

function updateDeviceHealth() {
  const checkedCount = deviceChecks.filter(({ input }) => input.checked).length;
  const trusted = deviceStatus.value === 'Trusted';
  const score = Math.round(((checkedCount + Number(trusted)) / (deviceChecks.length + 1)) * 100);
  const status = deviceStatus.value === 'Damaged' ? 'Compromised / Damaged'
    : deviceStatus.value === 'Unverified' ? 'Unverified'
      : checkedCount < deviceChecks.length ? 'Compromised'
        : trusted ? 'Healthy' : 'Untrusted';

  deviceHealthPercent.textContent = `${score}%`;
  deviceHealthStatus.textContent = status;
  deviceHealthIndicator.classList.toggle('healthy', status === 'Healthy');
  deviceHealthIndicator.classList.toggle('compromised', status !== 'Healthy');
}

deviceChecks.forEach(({ input }) => input.addEventListener('change', updateDeviceHealth));
deviceStatus.addEventListener('change', updateDeviceHealth);
updateDeviceHealth();

verifyButton?.addEventListener('click', () => {
  verifyButton.disabled = true;
  verifyButton.firstChild.textContent = 'Python backend-ը մշակում է... ';
  responseStatus.className = 'response-status pending';
  responseStatus.textContent = 'PENDING';
  backendResponse.textContent = 'POST /api/v1/request: validating JWT, role and device posture...';

  setTimeout(() => {
    const role = roleCheck.value;
    const trusted = deviceStatus.value === 'Trusted';
    const failedChecks = deviceChecks.filter(({ input }) => !input.checked).map(({ label }) => label);
    const damagedState = ['Damaged', 'Unverified'].includes(deviceStatus.value);
    let granted = trusted && role === 'Admin';

    if (trusted && role === 'Operator') granted = true;

    if (failedChecks.length || damagedState) {
      const reasons = [...failedChecks];
      if (damagedState) reasons.push(`Device status: ${deviceStatus.value}`);
      const reason = reasons.join(', ');
      responseStatus.className = 'response-status denied';
      responseStatus.textContent = 'Access Denied / Device Integrity Check Failed';
      backendResponse.textContent = `Python: Device integrity check failed (${reason}). Access blocked.`;
      httpResult.textContent = 'HTTP 403 · DEVICE_INTEGRITY_FAILED · /api/v1/request';
      addLog('deny', `${role.toLowerCase()} · device_integrity_failed · ${reason}`);
    } else if (!trusted) {
      responseStatus.className = 'response-status denied';
      responseStatus.textContent = 'Access Denied / MFA Required';
      backendResponse.textContent = `Python: Untrusted device — ${role} role cannot establish a trusted session.`;
      httpResult.textContent = 'HTTP 403 · MFA_REQUIRED · /api/v1/request';
      addLog('deny', `${role.toLowerCase()} · device_untrusted · MFA_REQUIRED`);
    } else if (granted) {
      responseStatus.className = 'response-status granted';
      responseStatus.textContent = 'Access Granted';
      backendResponse.textContent = `Python: JWT valid, ${role} role and device posture verified by policy engine.`;
      httpResult.textContent = 'HTTP 200 · ACCESS_GRANTED · /api/v1/request';
      addLog('ok', `${role.toLowerCase()} · policy_pass · JWT_VALID`);
    } else {
      responseStatus.className = 'response-status denied';
      responseStatus.textContent = 'Access Denied';
      backendResponse.textContent = `Python: Guest role lacks permission for this protected resource.`;
      httpResult.textContent = 'HTTP 403 · ROLE_POLICY_DENIED · /api/v1/request';
      addLog('deny', 'guest · RBAC_DENY · insufficient_role');
    }

    requestId.textContent = String(Number(requestId.textContent) + 1);
    verifyButton.disabled = false;
    verifyButton.firstChild.textContent = 'Ստուգել մուտքը (Simulate Request) ';
  }, 650);
});

// Live security telemetry
setInterval(() => {
  if (location.hash !== '#demo') return;
  const samples = [
    ['ok', 'policy-engine · CONTINUOUS_VERIFY'],
    ['warn', 'session-guard · TOKEN_ROTATION'],
    ['ok', 'device-posture · TRUST_SIGNAL']
  ];
  const sample = samples[Math.floor(Math.random() * samples.length)];
  addLog(sample[0], sample[1]);
}, 5000);
