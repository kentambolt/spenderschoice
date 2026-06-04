/* ============================================================
   SpendersChoice — app logic
   - localStorage persistence (with migration)
   - Silos (multi-currency), categories, currencies
   - One-time transactions (past or future-dated)
   - Recurring rules (income / expense / transfer)
   - Forecast engine (end of week / month / year / custom),
     including per-day spending allowance
   - i18n (en + da), easy to extend
   - Service worker registration + auto-update banner
   ============================================================ */

(() => {
  'use strict';

  /* ============================================================
     i18n
     ============================================================ */
  const I18N = {
    en: {
      name: "English", native: "English",
      // tabs
      "tab.silos":    "Silos",
      "tab.forecast": "Forecast",
      "tab.rules":    "Rules",
      "tab.history":  "History",
      "tab.stats":    "Stats",
      // empty
      "empty.title":      "Nothing here yet",
      "empty.body":       "Get started by creating your first silo.",
      "empty.cta":        "Add a silo",
      "empty.rulesTitle": "No recurring rules",
      "empty.rulesBody":  "Add salary, rent, subscriptions — anything that happens on a schedule.",
      "empty.rulesCta":   "Add a rule",
      "empty.txTitle":    "No transactions yet",
      "empty.txBody":     "One-time and rule-driven activity will show up here.",
      "empty.txCta":      "Add a transaction",
      "empty.forecastTitle": "Add a silo to see a forecast",
      "empty.forecastBody":  "Once you've got a silo and a few rules, the future will appear here.",
      "empty.statsTitle":  "No data yet",
      "empty.statsBody":   "Once money starts flowing, you'll see metrics here.",
      // onboarding
      "onboard.welcomeSub": "Silos, recurring rules and a forecast you can trust.",
      "onboard.start":      "Get started",
      "onboard.langTitle":  "Choose your language",
      "onboard.langSub":    "You can change this any time in Settings.",
      "onboard.currTitle":  "Your currencies",
      "onboard.currSub":    "Add the currencies you use. Plain codes — DKK, USD, BTC, anything.",
      "onboard.siloTitle":  "Your first silo",
      "onboard.siloSub":    "A silo is anywhere you keep money — a bank account, a wallet, a savings jar.",
      "onboard.finish":     "Create silo",
      // settings
      "settings.title":         "Settings",
      "settings.language":      "Language",
      "settings.currencies":    "Currencies",
      "settings.currenciesHint":"Codes are what show on every amount.",
      "settings.categories":    "Categories",
      "settings.categoriesHint":"Group transactions like \"Rent\" or \"Groceries\".",
      "settings.theme":         "Appearance",
      "settings.data":          "Your data",
      "settings.export":        "Export",
      "settings.import":        "Import",
      "settings.reset":         "Reset all",
      "theme.auto":  "Auto",
      "theme.light": "Light",
      "theme.dark":  "Dark",
      "footer.local":"Everything stays on your device",
      // silo modal
      "silo.new":        "New silo",
      "silo.edit":       "Edit silo",
      "silo.name":       "Name",
      "silo.appearance": "Icon & color",
      "silo.balances":   "Balances",
      "silo.addBalance": "+ Add currency",
      "silo.notes":      "Notes (optional)",
      "silo.delete":     "Delete",
      "silo.startingBalance": "Starting balance (optional)",
      // transaction
      "tx.new":      "New transaction",
      "tx.edit":     "Edit transaction",
      "tx.type":     "Type",
      "tx.from":     "From silo",
      "tx.to":       "To silo",
      "tx.amount":   "Amount",
      "tx.when":     "When",
      "tx.category": "Category (optional)",
      "tx.noCategory":"No category",
      "tx.label":    "Label (optional)",
      "tx.delete":   "Delete",
      "tx.now":      "Now",
      "type.income":   "Income",
      "type.expense":  "Expense",
      "type.transfer": "Transfer",
      // rule
      "rule.new":     "New recurring rule",
      "rule.edit":    "Edit rule",
      "rule.label":   "Name",
      "rule.every":   "Repeat every",
      "rule.startAt": "First occurrence",
      "rule.endAt":   "End date (optional)",
      "rule.active":  "Active",
      "rule.delete":  "Delete",
      "rule.paused":  "Paused",
      "rule.next":    "next",
      // forecast
      "forecast.title":     "Forecast",
      "forecast.range.week":  "This week",
      "forecast.range.month": "This month",
      "forecast.range.year":  "This year",
      "forecast.range.custom":"Custom…",
      "forecast.current":   "Now",
      "forecast.projected": "At end",
      "forecast.allowance": "Per day, free to spend",
      "forecast.allowanceBody":  "If you stop here, you can spend this much per day on extras and still cover every scheduled bill.",
      "forecast.daysLeft":  "{n} day(s) left",
      "forecast.chartTitle":"Balance over time",
      "forecast.flowIn":    "Incoming",
      "forecast.flowOut":   "Outgoing",
      // stats
      "stats.totalBalance":"Total balance",
      "stats.thisMonthIn": "Income (this month)",
      "stats.thisMonthOut":"Spending (this month)",
      "stats.thisYearIn":  "Income (this year)",
      "stats.thisYearOut": "Spending (this year)",
      "stats.netThisMonth":"Net (this month)",
      "stats.byCategory":  "Spending by category (this month)",
      "stats.siloCount":   "{n} silo(s)",
      // history
      "history.pending":   "Pending",
      "history.applied":   "Applied",
      "history.fromRule":  "Rule",
      "history.upcoming":  "Upcoming (next 30 days)",
      "history.recent":    "Recent",
      // detail
      "detail.editSilo":   "Edit silo",
      "detail.addTx":      "Add transaction",
      "detail.addRule":    "Add rule",
      "detail.rules":      "Rules in this silo",
      "detail.recent":     "Recent activity",
      // currency
      "currency.add":      "+ Add currency",
      "currency.code":     "Code",
      "currency.name":     "Name",
      // category
      "category.add":      "+ Add category",
      "category.unnamed":  "Untitled",
      "category.name":     "Name",
      "category.icon":     "Icon",
      "category.color":    "Color",
      // units
      "unit.minute":"minute(s)",
      "unit.hour":  "hour(s)",
      "unit.day":   "day(s)",
      "unit.week":  "week(s)",
      "unit.month": "month(s)",
      "unit.year":  "year(s)",
      "every.minute":"every {n} minute(s)",
      "every.hour":  "every {n} hour(s)",
      "every.day":   "every {n} day(s)",
      "every.week":  "every {n} week(s)",
      "every.month": "every {n} month(s)",
      "every.year":  "every {n} year(s)",
      // misc
      "back":    "Back",
      "next":    "Next",
      "save":    "Save",
      "cancel":  "Cancel",
      "add.title":"What would you like to add?",
      "add.silo": "＋ Silo",
      "add.tx":   "＋ Transaction (one-time)",
      "add.rule": "＋ Recurring rule",
      // confirm
      "confirm.ok":           "Confirm",
      "confirm.deleteTitle":  "Delete this?",
      "confirm.deleteBody":   "This can't be undone.",
      "confirm.deleteOk":     "Delete",
      "confirm.resetTitle":   "Reset everything?",
      "confirm.resetBody":    "All your silos, rules and history will be deleted.",
      "confirm.resetOk":      "Reset all",
      // toasts
      "toast.created":  "Saved",
      "toast.updated":  "Updated",
      "toast.deleted":  "Deleted",
      "toast.imported": "Data imported",
      "toast.exported": "Exported",
      "toast.reset":    "Everything reset",
      "toast.tooMany":  "That schedule generated too many catch-up events. Some were skipped.",
      // icon picker
      "icon.pick":"Pick an icon",
      "icon.none":"No icon",
      // update
      "update.available":"A new version is available.",
      "update.reload":   "Reload",
      // time
      "time.now":"now",
      // labels
      "txn.recurring":"recurring",
      "txn.oneTime":  "one-time",
      // forecast caption
      "forecast.in":       "from rules & scheduled",
      "forecast.subTitle": "Sum of all scheduled income minus expenses + transfers, applied to your current balance.",
    },

    da: {
      name: "Danish", native: "Dansk",
      "tab.silos":    "Siloer",
      "tab.forecast": "Prognose",
      "tab.rules":    "Regler",
      "tab.history":  "Historik",
      "tab.stats":    "Statistik",
      "empty.title":      "Intet her endnu",
      "empty.body":       "Kom i gang ved at oprette din første silo.",
      "empty.cta":        "Tilføj en silo",
      "empty.rulesTitle": "Ingen tilbagevendende regler",
      "empty.rulesBody":  "Tilføj løn, husleje, abonnementer — alt der sker efter en plan.",
      "empty.rulesCta":   "Tilføj en regel",
      "empty.txTitle":    "Ingen transaktioner endnu",
      "empty.txBody":     "Engangs- og regelstyret aktivitet vises her.",
      "empty.txCta":      "Tilføj en transaktion",
      "empty.forecastTitle": "Tilføj en silo for at se prognosen",
      "empty.forecastBody":  "Når du har en silo og et par regler, dukker fremtiden op her.",
      "empty.statsTitle":  "Ingen data endnu",
      "empty.statsBody":   "Når pengene begynder at flyde, kommer der målinger her.",
      "onboard.welcomeSub": "Siloer, tilbagevendende regler og en prognose du kan stole på.",
      "onboard.start":      "Kom i gang",
      "onboard.langTitle":  "Vælg sprog",
      "onboard.langSub":    "Du kan altid ændre det i indstillinger.",
      "onboard.currTitle":  "Dine valutaer",
      "onboard.currSub":    "Tilføj de valutaer du bruger. Bare koder — DKK, USD, BTC, hvad som helst.",
      "onboard.siloTitle":  "Din første silo",
      "onboard.siloSub":    "En silo er hvor som helst du opbevarer penge — en bankkonto, en pung, en sparebøsse.",
      "onboard.finish":     "Opret silo",
      "settings.title":         "Indstillinger",
      "settings.language":      "Sprog",
      "settings.currencies":    "Valutaer",
      "settings.currenciesHint":"Koderne vises ud for ethvert beløb.",
      "settings.categories":    "Kategorier",
      "settings.categoriesHint":"Grupper transaktioner som \"Husleje\" eller \"Mad\".",
      "settings.theme":         "Udseende",
      "settings.data":          "Dine data",
      "settings.export":        "Eksporter",
      "settings.import":        "Importer",
      "settings.reset":         "Nulstil alt",
      "theme.auto":  "Auto",
      "theme.light": "Lys",
      "theme.dark":  "Mørk",
      "footer.local":"Alt bliver på din enhed",
      "silo.new":        "Ny silo",
      "silo.edit":       "Rediger silo",
      "silo.name":       "Navn",
      "silo.appearance": "Ikon & farve",
      "silo.balances":   "Saldi",
      "silo.addBalance": "+ Tilføj valuta",
      "silo.notes":      "Noter (valgfrit)",
      "silo.delete":     "Slet",
      "silo.startingBalance": "Startsaldo (valgfri)",
      "tx.new":      "Ny transaktion",
      "tx.edit":     "Rediger transaktion",
      "tx.type":     "Type",
      "tx.from":     "Fra silo",
      "tx.to":       "Til silo",
      "tx.amount":   "Beløb",
      "tx.when":     "Hvornår",
      "tx.category": "Kategori (valgfri)",
      "tx.noCategory":"Ingen kategori",
      "tx.label":    "Etiket (valgfri)",
      "tx.delete":   "Slet",
      "tx.now":      "Nu",
      "type.income":   "Indtægt",
      "type.expense":  "Udgift",
      "type.transfer": "Overførsel",
      "rule.new":     "Ny tilbagevendende regel",
      "rule.edit":    "Rediger regel",
      "rule.label":   "Navn",
      "rule.every":   "Gentag hver",
      "rule.startAt": "Første forekomst",
      "rule.endAt":   "Slutdato (valgfri)",
      "rule.active":  "Aktiv",
      "rule.delete":  "Slet",
      "rule.paused":  "Pauset",
      "rule.next":    "næste",
      "forecast.title":     "Prognose",
      "forecast.range.week":  "Denne uge",
      "forecast.range.month": "Denne måned",
      "forecast.range.year":  "I år",
      "forecast.range.custom":"Brugerdefineret…",
      "forecast.current":   "Nu",
      "forecast.projected": "Ved slutningen",
      "forecast.allowance": "Pr. dag, fri til brug",
      "forecast.allowanceBody": "Hvis du stopper her, kan du bruge så meget pr. dag på ekstra ting og stadig dække alle planlagte regninger.",
      "forecast.daysLeft":  "{n} dag(e) tilbage",
      "forecast.chartTitle":"Saldo over tid",
      "forecast.flowIn":    "Ind",
      "forecast.flowOut":   "Ud",
      "stats.totalBalance":"Samlet saldo",
      "stats.thisMonthIn": "Indtægt (denne måned)",
      "stats.thisMonthOut":"Forbrug (denne måned)",
      "stats.thisYearIn":  "Indtægt (i år)",
      "stats.thisYearOut": "Forbrug (i år)",
      "stats.netThisMonth":"Netto (denne måned)",
      "stats.byCategory":  "Forbrug pr. kategori (denne måned)",
      "stats.siloCount":   "{n} silo(er)",
      "history.pending":   "Afventer",
      "history.applied":   "Anvendt",
      "history.fromRule":  "Regel",
      "history.upcoming":  "Kommende (næste 30 dage)",
      "history.recent":    "Nylig",
      "detail.editSilo":   "Rediger silo",
      "detail.addTx":      "Tilføj transaktion",
      "detail.addRule":    "Tilføj regel",
      "detail.rules":      "Regler i denne silo",
      "detail.recent":     "Nylig aktivitet",
      "currency.add":      "+ Tilføj valuta",
      "currency.code":     "Kode",
      "currency.name":     "Navn",
      "category.add":      "+ Tilføj kategori",
      "category.unnamed":  "Unavngivet",
      "category.name":     "Navn",
      "category.icon":     "Ikon",
      "category.color":    "Farve",
      "unit.minute":"minut(ter)",
      "unit.hour":  "time(r)",
      "unit.day":   "dag(e)",
      "unit.week":  "uge(r)",
      "unit.month": "måned(er)",
      "unit.year":  "år",
      "every.minute":"hver {n} minut(ter)",
      "every.hour":  "hver {n} time(r)",
      "every.day":   "hver {n} dag(e)",
      "every.week":  "hver {n} uge(r)",
      "every.month": "hver {n} måned(er)",
      "every.year":  "hver {n} år",
      "back":   "Tilbage",
      "next":   "Videre",
      "save":   "Gem",
      "cancel": "Annuller",
      "add.title":"Hvad vil du tilføje?",
      "add.silo": "＋ Silo",
      "add.tx":   "＋ Transaktion (engang)",
      "add.rule": "＋ Tilbagevendende regel",
      "confirm.ok":           "Bekræft",
      "confirm.deleteTitle":  "Slet dette?",
      "confirm.deleteBody":   "Dette kan ikke fortrydes.",
      "confirm.deleteOk":     "Slet",
      "confirm.resetTitle":   "Nulstil alt?",
      "confirm.resetBody":    "Alle dine siloer, regler og historik slettes.",
      "confirm.resetOk":      "Nulstil alt",
      "toast.created":  "Gemt",
      "toast.updated":  "Opdateret",
      "toast.deleted":  "Slettet",
      "toast.imported": "Data importeret",
      "toast.exported": "Eksporteret",
      "toast.reset":    "Alt nulstillet",
      "toast.tooMany":  "Den plan ville generere for mange efterregistreringer. Nogle blev sprunget over.",
      "icon.pick":"Vælg et ikon",
      "icon.none":"Intet ikon",
      "update.available":"En ny version er tilgængelig.",
      "update.reload":   "Genindlæs",
      "time.now":"nu",
      "txn.recurring":"tilbagevendende",
      "txn.oneTime":  "engang",
      "forecast.in":       "fra regler & planlagte",
      "forecast.subTitle": "Summen af alle planlagte indtægter minus udgifter + overførsler, anvendt på din nuværende saldo.",
    },
  };

  const t = (key, vars) => {
    const dict = I18N[state.settings.lang] || I18N.en;
    let s = dict[key] || I18N.en[key] || key;
    if (vars) for (const k in vars) s = s.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]);
    return s;
  };

  /* ============================================================
     Constants
     ============================================================ */
  const STORAGE_KEY = "spenderschoice.v1";

  const UNIT_MS = {
    minute: 60 * 1000,
    hour:   60 * 60 * 1000,
    day:    24 * 60 * 60 * 1000,
    week:   7 * 24 * 60 * 60 * 1000,
  };

  const ICON_SET = [
    "🏦","💳","💰","💵","💸","🪙","💎","💼",
    "🏠","🚗","🛒","🍔","☕","🍷","🛍️","🎁",
    "📚","✈️","🏝️","⛽","🏥","💊","🐾","🎵",
    "🎮","🎬","📱","💻","🧾","📦","🪴","✨",
    "💡","🔧","🎯","📈","📉","🪜","🏗️","🪪",
  ];

  const SAFETY_ITERATIONS = 5000;

  /* ============================================================
     Helpers
     ============================================================ */
  function cryptoId() {
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  function el(tag, attrs = {}, ...children) {
    const n = document.createElement(tag);
    for (const k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.startsWith("on") && typeof attrs[k] === "function") n.addEventListener(k.slice(2), attrs[k]);
      else if (k === "style" && typeof attrs[k] === "object") Object.assign(n.style, attrs[k]);
      else if (attrs[k] === true) n.setAttribute(k, "");
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    for (const c of children) {
      if (c == null || c === false) continue;
      n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    }
    return n;
  }
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function addInterval(ts, amount, unit) {
    if (UNIT_MS[unit]) return ts + amount * UNIT_MS[unit];
    const d = new Date(ts);
    if (unit === "month") d.setMonth(d.getMonth() + amount);
    else if (unit === "year") d.setFullYear(d.getFullYear() + amount);
    return d.getTime();
  }
  function intervalLabel(every) {
    return t("every." + every.unit, { n: every.amount });
  }

  function endOfWeek(now) {
    // End-of-Sunday 23:59:59 of the current week (week starts Monday).
    const d = new Date(now);
    const day = d.getDay(); // 0=Sun..6=Sat
    const diff = day === 0 ? 0 : (7 - day);
    d.setDate(d.getDate() + diff);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }
  function endOfMonth(now) {
    const d = new Date(now);
    d.setMonth(d.getMonth() + 1, 0);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }
  function endOfYear(now) {
    const d = new Date(now);
    d.setMonth(11, 31);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }
  function startOfMonth(now) {
    const d = new Date(now);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  function startOfYear(now) {
    const d = new Date(now);
    d.setMonth(0, 1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function fmtAmount(n) {
    if (n == null || isNaN(n)) return "0";
    const abs = Math.abs(n);
    // 2 decimals if not integer
    const decimals = (abs % 1 === 0) ? 0 : 2;
    const lang = state.settings.lang === "da" ? "da-DK" : "en-US";
    return n.toLocaleString(lang, { minimumFractionDigits: decimals, maximumFractionDigits: 2 });
  }
  function fmtMoney(n, ccy) {
    return fmtAmount(n) + " " + (ccy || "");
  }
  function fmtSigned(n, ccy) {
    const sign = n > 0 ? "+" : "";
    return sign + fmtMoney(n, ccy);
  }
  function fmtDate(ts) {
    if (!ts) return "—";
    const lang = state.settings.lang === "da" ? "da-DK" : "en-US";
    return new Date(ts).toLocaleDateString(lang, { year: "numeric", month: "short", day: "numeric" });
  }
  function fmtDateTime(ts) {
    if (!ts) return "—";
    const lang = state.settings.lang === "da" ? "da-DK" : "en-US";
    return new Date(ts).toLocaleString(lang, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }
  function toLocalInputValue(ts) {
    // returns "YYYY-MM-DDTHH:mm" in local time for <input type="datetime-local">
    const d = new Date(ts);
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function fromLocalInputValue(s) {
    if (!s) return null;
    const ts = new Date(s).getTime();
    return isNaN(ts) ? null : ts;
  }
  function daysBetween(a, b) {
    return Math.max(1, Math.ceil((b - a) / UNIT_MS.day));
  }

  /* ============================================================
     State + migration
     ============================================================ */
  function defaultCurrencies(lang) {
    if (lang === "da") return [{ code: "DKK", name: "Danske kroner" }];
    return [{ code: "USD", name: "US Dollar" }];
  }
  const defaultState = () => {
    const lang = (navigator.language || "en").toLowerCase().startsWith("da") ? "da" : "en";
    return {
      schemaVersion: 1,
      onboardingDone: false,
      settings: { lang, theme: "auto" },
      currencies: defaultCurrencies(lang),
      categories: [],
      silos: [],
      rules: [],
      transactions: [],
      activeTab: "silos",
      forecastRange: "month",     // week | month | year | custom
      forecastCustom: null,       // timestamp
      detailSiloId: null,         // when a silo detail view is open
    };
  };

  function migrate(loaded) {
    if (!loaded) return null;
    loaded.schemaVersion = loaded.schemaVersion || 1;
    loaded.settings ||= { lang: "en", theme: "auto" };
    loaded.settings.lang ||= "en";
    loaded.settings.theme ||= "auto";
    loaded.currencies ||= defaultCurrencies(loaded.settings.lang);
    loaded.categories ||= [];
    loaded.silos ||= [];
    loaded.rules ||= [];
    loaded.transactions ||= [];
    loaded.activeTab ||= "silos";
    loaded.forecastRange ||= "month";
    if (loaded.forecastCustom === undefined) loaded.forecastCustom = null;
    loaded.detailSiloId ??= null;
    // defensive
    loaded.silos.forEach(s => { s.balances ||= {}; });
    loaded.rules.forEach(r => { if (r.active === undefined) r.active = true; });
    return loaded;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return migrate(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load state:", e);
      return null;
    }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { console.warn("Save failed:", e); }
  }

  let state = load() || defaultState();

  /* ============================================================
     Look-ups
     ============================================================ */
  const siloById     = id => state.silos.find(s => s.id === id);
  const categoryById = id => state.categories.find(c => c.id === id);

  function siloName(id) {
    const s = siloById(id);
    return s ? s.name : "—";
  }
  function categoryName(c) {
    return (c?.name && c.name.trim()) || t("category.unnamed");
  }

  /* ============================================================
     ENGINE — applying rules and pending transactions
     ============================================================ */
  function ensureBalance(silo, ccy) {
    if (silo.balances[ccy] == null) silo.balances[ccy] = 0;
  }
  function applyOp(type, fromSiloId, toSiloId, amount, currency) {
    if (type === "income") {
      const to = siloById(toSiloId);
      if (to) { ensureBalance(to, currency); to.balances[currency] += amount; }
    } else if (type === "expense") {
      const from = siloById(fromSiloId);
      if (from) { ensureBalance(from, currency); from.balances[currency] -= amount; }
    } else if (type === "transfer") {
      const from = siloById(fromSiloId);
      const to   = siloById(toSiloId);
      if (from) { ensureBalance(from, currency); from.balances[currency] -= amount; }
      if (to)   { ensureBalance(to, currency);   to.balances[currency]   += amount; }
    }
  }

  function applyDueTransactions(now) {
    let any = false;
    state.transactions.forEach(tx => {
      if (tx.status === "pending" && tx.at <= now) {
        applyOp(tx.type, tx.fromSiloId, tx.toSiloId, tx.amount, tx.currency);
        tx.status = "applied";
        any = true;
      }
    });
    return any;
  }

  function applyDueRules(now) {
    let warned = false;
    let any = false;
    state.rules.forEach(rule => {
      if (!rule.active) return;
      let next;
      if (rule.lastRunAt) {
        next = addInterval(rule.lastRunAt, rule.every.amount, rule.every.unit);
      } else {
        next = rule.startAt;
      }
      let safety = 0;
      while (next <= now && (!rule.endAt || next <= rule.endAt)) {
        if (++safety > SAFETY_ITERATIONS) {
          // Fast-forward to skip massive backlogs.
          rule.lastRunAt = now;
          if (!warned) { toast(t("toast.tooMany")); warned = true; }
          return;
        }
        applyOp(rule.type, rule.fromSiloId, rule.toSiloId, rule.amount, rule.currency);
        // create transaction log
        state.transactions.push({
          id: cryptoId(),
          type: rule.type,
          fromSiloId: rule.fromSiloId,
          toSiloId: rule.toSiloId,
          amount: rule.amount,
          currency: rule.currency,
          at: next,
          status: "applied",
          categoryId: rule.categoryId || null,
          label: rule.label || "",
          ruleId: rule.id,
          createdAt: Date.now(),
        });
        rule.lastRunAt = next;
        any = true;
        next = addInterval(next, rule.every.amount, rule.every.unit);
      }
    });
    return any;
  }

  function settleNow() {
    const now = Date.now();
    const a = applyDueTransactions(now);
    const b = applyDueRules(now);
    if (a || b) save();
  }

  /* ============================================================
     FORECAST
     ============================================================ */
  // Future occurrences for a rule between (>now) and (<=targetTs)
  function futureRuleOccurrences(rule, now, targetTs) {
    const out = [];
    if (!rule.active) return out;
    let next;
    if (rule.lastRunAt) {
      next = addInterval(rule.lastRunAt, rule.every.amount, rule.every.unit);
    } else {
      next = rule.startAt;
    }
    // Walk forward until > now
    let safety = 0;
    while (next <= now) {
      if (++safety > SAFETY_ITERATIONS) return out;
      next = addInterval(next, rule.every.amount, rule.every.unit);
    }
    while (next <= targetTs && (!rule.endAt || next <= rule.endAt)) {
      if (++safety > SAFETY_ITERATIONS) break;
      out.push(next);
      next = addInterval(next, rule.every.amount, rule.every.unit);
    }
    return out;
  }

  // Build a chronological list of all future events affecting a silo
  // between now and targetTs. Each event: { at, delta:{currency: amount}, label, type }
  function futureSiloEvents(siloId, now, targetTs) {
    const events = [];
    // Future pending transactions
    state.transactions.forEach(tx => {
      if (tx.status !== "pending") return;
      if (tx.at <= now || tx.at > targetTs) return;
      const delta = {};
      if (tx.type === "income" && tx.toSiloId === siloId) delta[tx.currency] = (delta[tx.currency] || 0) + tx.amount;
      if (tx.type === "expense" && tx.fromSiloId === siloId) delta[tx.currency] = (delta[tx.currency] || 0) - tx.amount;
      if (tx.type === "transfer") {
        if (tx.toSiloId === siloId)   delta[tx.currency] = (delta[tx.currency] || 0) + tx.amount;
        if (tx.fromSiloId === siloId) delta[tx.currency] = (delta[tx.currency] || 0) - tx.amount;
      }
      if (Object.keys(delta).length) events.push({ at: tx.at, delta, label: tx.label || "—", type: tx.type, source: "tx" });
    });
    // Future rule occurrences
    state.rules.forEach(rule => {
      const affects =
        (rule.type === "income"   && rule.toSiloId === siloId) ||
        (rule.type === "expense"  && rule.fromSiloId === siloId) ||
        (rule.type === "transfer" && (rule.toSiloId === siloId || rule.fromSiloId === siloId));
      if (!affects) return;
      const occ = futureRuleOccurrences(rule, now, targetTs);
      occ.forEach(at => {
        const delta = {};
        if (rule.type === "income") delta[rule.currency] = rule.amount;
        else if (rule.type === "expense") delta[rule.currency] = -rule.amount;
        else if (rule.type === "transfer") {
          if (rule.toSiloId === siloId)   delta[rule.currency] = (delta[rule.currency] || 0) + rule.amount;
          if (rule.fromSiloId === siloId) delta[rule.currency] = (delta[rule.currency] || 0) - rule.amount;
        }
        if (Object.keys(delta).length) events.push({ at, delta, label: rule.label || "—", type: rule.type, source: "rule" });
      });
    });
    events.sort((a, b) => a.at - b.at);
    return events;
  }

  // Given silo + targetTs, returns:
  //   { now: balances now, projected: balances at target, perCurrencyFlow: {ccy: {in, out}}, events }
  function forecastSilo(siloId, targetTs) {
    const silo = siloById(siloId);
    const now = Date.now();
    const nowBalances = { ...silo.balances };
    const projected = { ...silo.balances };
    const perCurrencyFlow = {};
    const events = futureSiloEvents(siloId, now, targetTs);
    events.forEach(ev => {
      for (const ccy in ev.delta) {
        projected[ccy] = (projected[ccy] || 0) + ev.delta[ccy];
        perCurrencyFlow[ccy] ||= { in: 0, out: 0 };
        if (ev.delta[ccy] > 0) perCurrencyFlow[ccy].in += ev.delta[ccy];
        else perCurrencyFlow[ccy].out += -ev.delta[ccy];
      }
    });
    return { now: nowBalances, projected, perCurrencyFlow, events, targetTs, atNow: now };
  }

  function rangeTargetTs(range, customTs) {
    const now = Date.now();
    if (range === "week")   return endOfWeek(now);
    if (range === "month")  return endOfMonth(now);
    if (range === "year")   return endOfYear(now);
    if (range === "custom" && customTs) return customTs;
    return endOfMonth(now);
  }

  /* ============================================================
     APPLY i18n + THEME
     ============================================================ */
  function applyI18n() {
    $$("[data-i18n]").forEach(n => {
      const key = n.getAttribute("data-i18n");
      n.textContent = t(key);
    });
    document.documentElement.lang = state.settings.lang;
  }
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.settings.theme);
  }

  /* ============================================================
     ONBOARDING
     ============================================================ */
  const onboarding = $("#onboarding");
  const appShell   = $("#app");
  const detailView = $("#detailView");

  let currentStep = 1;
  const STEP_COUNT = 4;

  function renderDots() {
    const dots = $("#onboardDots");
    dots.innerHTML = "";
    for (let i = 1; i <= STEP_COUNT; i++) {
      dots.appendChild(el("div", { class: "dot" + (i === currentStep ? " is-active" : "") }));
    }
  }
  function showStep(n) {
    currentStep = Math.max(1, Math.min(STEP_COUNT, n));
    $$(".step", onboarding).forEach(s => s.classList.toggle("is-active", +s.dataset.step === currentStep));
    renderDots();
    if (currentStep === 4) refreshOnboardingSiloCurrencies();
  }
  function refreshOnboardingSiloCurrencies() {
    const sel = $("#onboardSiloCcy");
    sel.innerHTML = "";
    state.currencies.forEach(c => sel.appendChild(el("option", { value: c.code }, c.code)));
  }
  function bindOnboarding() {
    $$("[data-next]", onboarding).forEach(b => b.onclick = () => showStep(currentStep + 1));
    $$("[data-prev]", onboarding).forEach(b => b.onclick = () => showStep(currentStep - 1));

    renderLangPicker($("#onboardLang"));
    renderCurrencyEditor($("#onboardCurrencies"));

    $("#onboardAddCurrency").onclick = () => {
      state.currencies.push({ code: "", name: "" });
      save();
      renderCurrencyEditor($("#onboardCurrencies"));
    };

    $("#finishOnboarding").onclick = () => {
      // Drop any blank currencies first.
      state.currencies = state.currencies.filter(c => c.code && c.code.trim());
      if (state.currencies.length === 0) state.currencies = defaultCurrencies(state.settings.lang);

      const name = $("#onboardSiloName").value.trim() || "Checking";
      const amt = parseFloat($("#onboardSiloAmt").value);
      const ccy = $("#onboardSiloCcy").value || state.currencies[0].code;

      const silo = {
        id: cryptoId(),
        name, icon: "🏦", color: "#14B8A6", notes: "",
        balances: {},
        createdAt: Date.now(),
      };
      if (!isNaN(amt) && amt !== 0) silo.balances[ccy] = amt;
      state.silos.push(silo);

      state.onboardingDone = true;
      save();
      onboarding.hidden = true;
      appShell.hidden = false;
      render();
    };
  }

  /* ============================================================
     LANGUAGE PICKER
     ============================================================ */
  function renderLangPicker(container) {
    if (!container) return;
    container.innerHTML = "";
    Object.keys(I18N).forEach(code => {
      const meta = I18N[code];
      const btn = el("button", {
        class: "lang" + (state.settings.lang === code ? " is-active" : ""),
        type: "button",
        onclick: () => {
          state.settings.lang = code;
          save();
          applyI18n();
          renderLangPicker($("#onboardLang"));
          renderLangPicker($("#settingsLang"));
          renderCurrencyEditor($("#onboardCurrencies"));
          renderCurrencyEditor($("#settingsCurrencies"));
          renderCategoryEditor($("#settingsCategories"));
          render();
        }
      },
        el("strong", {}, meta.native),
        el("small", {}, meta.name)
      );
      container.appendChild(btn);
    });
  }

  /* ============================================================
     CURRENCY EDITOR
     ============================================================ */
  function renderCurrencyEditor(container) {
    if (!container) return;
    container.innerHTML = "";
    state.currencies.forEach((c, idx) => {
      const row = el("div", { class: "currency-row" });
      const code = el("input", { class: "code", type: "text", value: c.code, maxlength: 8, placeholder: t("currency.code") });
      code.oninput = (e) => { c.code = e.target.value.toUpperCase().trim(); save(); render(); refreshOnboardingSiloCurrencies(); };
      const name = el("input", { type: "text", value: c.name || "", maxlength: 30, placeholder: t("currency.name") });
      name.oninput = (e) => { c.name = e.target.value; save(); };
      const del = el("button", { class: "del", type: "button", title: "Delete", "aria-label": "Delete",
        html: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 7h12l-1 13H7L6 7Zm3-3h6v2H9V4Z"/></svg>' });
      del.onclick = () => {
        if (state.currencies.length <= 1) return;
        state.currencies.splice(idx, 1);
        save();
        renderCurrencyEditor(container);
        refreshOnboardingSiloCurrencies();
        render();
      };
      row.appendChild(code);
      row.appendChild(name);
      row.appendChild(del);
      container.appendChild(row);
    });
  }

  /* ============================================================
     CATEGORY EDITOR
     ============================================================ */
  function renderCategoryEditor(container) {
    if (!container) return;
    container.innerHTML = "";
    state.categories.forEach(cat => {
      const row = el("div", { class: "cat-row" });
      const iconBtn = el("button", { class: "icon-pick-btn", type: "button", title: t("category.icon") }, cat.icon || "＋");
      if (cat.color) iconBtn.style.background = cat.color + "22";
      iconBtn.onclick = () => openIconPicker(icon => { cat.icon = icon || null; save(); renderCategoryEditor(container); render(); }, cat.icon);
      const name = el("input", { type: "text", value: cat.name || "", maxlength: 32, placeholder: t("category.name") });
      name.oninput = (e) => { cat.name = e.target.value; save(); render(); refreshTxCategoryOptions(); refreshRuleCategoryOptions(); };
      const color = el("input", { type: "color", value: cat.color || "#14B8A6", title: t("category.color") });
      color.oninput = (e) => { cat.color = e.target.value; save(); renderCategoryEditor(container); render(); };
      const del = el("button", { class: "del", type: "button", title: "Delete", "aria-label": "Delete",
        html: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 7h12l-1 13H7L6 7Zm3-3h6v2H9V4Z"/></svg>' });
      del.onclick = () => {
        // Unassign from rules and tx
        state.rules.forEach(r => { if (r.categoryId === cat.id) r.categoryId = null; });
        state.transactions.forEach(x => { if (x.categoryId === cat.id) x.categoryId = null; });
        state.categories = state.categories.filter(c => c.id !== cat.id);
        save();
        renderCategoryEditor(container);
        refreshTxCategoryOptions();
        refreshRuleCategoryOptions();
        render();
      };
      row.appendChild(iconBtn);
      row.appendChild(name);
      row.appendChild(color);
      row.appendChild(del);
      container.appendChild(row);
    });
  }

  /* ============================================================
     SETTINGS DRAWER
     ============================================================ */
  const settingsDrawer = $("#settings");
  function openSettings() {
    settingsDrawer.hidden = false;
    settingsDrawer.setAttribute("aria-hidden", "false");
    renderLangPicker($("#settingsLang"));
    renderCurrencyEditor($("#settingsCurrencies"));
    renderCategoryEditor($("#settingsCategories"));
    $$("#themeSeg button").forEach(b => b.classList.toggle("is-active", b.dataset.theme === state.settings.theme));
  }
  function closeSettings() {
    settingsDrawer.hidden = true;
    settingsDrawer.setAttribute("aria-hidden", "true");
  }
  function bindSettings() {
    $("#menuBtn").onclick  = openSettings;
    $("#menuBtn2").onclick = openSettings;
    $$("[data-close-drawer]", settingsDrawer).forEach(b => b.onclick = closeSettings);

    $("#settingsAddCurrency").onclick = () => {
      state.currencies.push({ code: "", name: "" });
      save();
      renderCurrencyEditor($("#settingsCurrencies"));
      refreshOnboardingSiloCurrencies();
    };
    $("#settingsAddCategory").onclick = () => {
      state.categories.push({ id: cryptoId(), name: "", color: "#14B8A6", icon: null });
      save();
      renderCategoryEditor($("#settingsCategories"));
      refreshTxCategoryOptions();
      refreshRuleCategoryOptions();
    };

    $$("#themeSeg button").forEach(b => {
      b.onclick = () => {
        state.settings.theme = b.dataset.theme;
        save();
        applyTheme();
        $$("#themeSeg button").forEach(x => x.classList.toggle("is-active", x === b));
      };
    });

    $("#exportBtn").onclick = exportData;
    $("#importBtn").onclick = () => $("#importFile").click();
    $("#importFile").onchange = importData;
    $("#resetBtn").onclick = async () => {
      const ok = await confirmDialog({
        title: t("confirm.resetTitle"),
        body: t("confirm.resetBody"),
        confirmText: t("confirm.resetOk"),
        danger: true,
      });
      if (ok) {
        localStorage.removeItem(STORAGE_KEY);
        state = defaultState();
        save();
        applyTheme();
        applyI18n();
        closeSettings();
        startup();
        toast(t("toast.reset"));
      }
    };
  }

  /* ============================================================
     EXPORT / IMPORT
     ============================================================ */
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "spenderschoice-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast(t("toast.exported"));
  }
  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(r.result);
        if (!parsed || typeof parsed !== "object") throw new Error("bad");
        state = migrate(Object.assign(defaultState(), parsed));
        save();
        applyTheme();
        applyI18n();
        render();
        toast(t("toast.imported"));
      } catch (err) {
        alert("Could not import file.");
      }
    };
    r.readAsText(file);
    e.target.value = "";
  }

  /* ============================================================
     ICON PICKER (shared)
     ============================================================ */
  function openIconPicker(onPick, currentIcon) {
    const dlg = $("#iconPicker");
    const grid = $("#iconGrid");
    grid.innerHTML = "";
    ICON_SET.forEach(ico => {
      const b = el("button", {
        type: "button",
        class: "icon-cell" + (currentIcon === ico ? " is-active" : ""),
        onclick: () => { cleanup(); onPick(ico); },
      }, ico);
      grid.appendChild(b);
    });
    dlg.hidden = false;
    const cleanup = () => {
      dlg.hidden = true;
      $$("[data-cancel]", dlg).forEach(b => b.onclick = null);
      $("#iconClear").onclick = null;
    };
    $$("[data-cancel]", dlg).forEach(b => b.onclick = cleanup);
    $("#iconClear").onclick = () => { cleanup(); onPick(null); };
  }

  /* ============================================================
     GENERIC CONFIRM
     ============================================================ */
  function confirmDialog({ title, body, confirmText, danger }) {
    return new Promise((resolve) => {
      const dlg = $("#confirmDialog");
      $("#confirmTitle").textContent = title || "";
      $("#confirmBody").textContent = body || "";
      const okBtn = $("#confirmOk");
      okBtn.textContent = confirmText || t("confirm.ok");
      okBtn.classList.toggle("btn-danger", !!danger);
      okBtn.classList.toggle("btn-primary", !danger);
      dlg.hidden = false;
      const cleanup = () => {
        dlg.hidden = true;
        okBtn.onclick = null;
        $$("[data-cancel]", dlg).forEach(b => b.onclick = null);
      };
      okBtn.onclick = () => { cleanup(); resolve(true); };
      $$("[data-cancel]", dlg).forEach(b => b.onclick = () => { cleanup(); resolve(false); });
    });
  }

  /* ============================================================
     ACTION CHOOSER
     ============================================================ */
  function openChooser() {
    const dlg = $("#chooser");
    dlg.hidden = false;
    const cleanup = () => {
      dlg.hidden = true;
      $("#chooseSilo").onclick = null;
      $("#chooseTx").onclick = null;
      $("#chooseRule").onclick = null;
      $$("[data-cancel]", dlg).forEach(b => b.onclick = null);
    };
    $("#chooseSilo").onclick = () => { cleanup(); openSiloModal(); };
    $("#chooseTx").onclick   = () => { cleanup(); openTxModal(); };
    $("#chooseRule").onclick = () => { cleanup(); openRuleModal(); };
    $$("[data-cancel]", dlg).forEach(b => b.onclick = cleanup);
  }

  /* ============================================================
     SILO MODAL
     ============================================================ */
  let editingSiloId = null;
  let pendingSiloIcon = null;

  function openSiloModal(silo) {
    editingSiloId = silo?.id || null;
    pendingSiloIcon = silo?.icon || "🏦";
    $("#siloModalTitle").textContent = t(silo ? "silo.edit" : "silo.new");
    $("#siloName").value = silo?.name || "";
    $("#siloColor").value = silo?.color || "#14B8A6";
    $("#siloNotes").value = silo?.notes || "";
    $("#siloIconBtn").textContent = pendingSiloIcon || "＋";
    renderSiloBalanceRows(silo?.balances || {});
    $("#deleteSiloBtn").hidden = !silo;
    $("#siloModal").hidden = false;
    setTimeout(() => $("#siloName").focus(), 60);
  }
  function closeSiloModal() {
    $("#siloModal").hidden = true;
    editingSiloId = null;
  }
  function renderSiloBalanceRows(balances) {
    const container = $("#siloBalanceRows");
    container.innerHTML = "";
    const rows = [];
    // existing balances
    const codes = Object.keys(balances);
    if (codes.length === 0 && state.currencies.length > 0) {
      // start with the first currency, blank value
      rows.push({ code: state.currencies[0].code, amount: "" });
    } else {
      codes.forEach(c => rows.push({ code: c, amount: balances[c] }));
    }
    rows.forEach((r, idx) => container.appendChild(makeBalanceRow(r.code, r.amount)));
  }
  function makeBalanceRow(code, amount) {
    const row = el("div", { class: "balance-edit-row" });
    const sel = el("select");
    state.currencies.forEach(c => sel.appendChild(el("option", { value: c.code }, c.code)));
    sel.value = code || (state.currencies[0]?.code || "");
    const amt = el("input", { type: "number", step: "0.01", value: amount !== "" && amount != null ? amount : "" });
    const del = el("button", { class: "del", type: "button", "aria-label": "Remove",
      html: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 7h12l-1 13H7L6 7Zm3-3h6v2H9V4Z"/></svg>' });
    del.onclick = () => row.remove();
    row.appendChild(sel); row.appendChild(amt); row.appendChild(del);
    return row;
  }
  function bindSiloModal() {
    $$("[data-close-modal]", $("#siloModal")).forEach(b => b.onclick = closeSiloModal);
    $("#siloIconBtn").onclick = () => openIconPicker(ic => {
      pendingSiloIcon = ic;
      $("#siloIconBtn").textContent = ic || "＋";
    }, pendingSiloIcon);
    $("#addBalanceRow").onclick = () => $("#siloBalanceRows").appendChild(makeBalanceRow("", ""));
    $("#siloForm").onsubmit = (e) => {
      e.preventDefault();
      const name = $("#siloName").value.trim();
      if (!name) return;
      const color = $("#siloColor").value;
      const notes = $("#siloNotes").value.trim();
      const balances = {};
      $$(".balance-edit-row", $("#siloBalanceRows")).forEach(row => {
        const code = row.querySelector("select").value;
        const v = parseFloat(row.querySelector('input[type="number"]').value);
        if (!code) return;
        const amount = isNaN(v) ? 0 : v;
        balances[code] = (balances[code] || 0) + amount;
      });
      if (editingSiloId) {
        const s = siloById(editingSiloId);
        if (s) {
          Object.assign(s, { name, color, notes, icon: pendingSiloIcon, balances });
          toast(t("toast.updated"));
        }
      } else {
        state.silos.push({
          id: cryptoId(),
          name, color, notes,
          icon: pendingSiloIcon || "🏦",
          balances,
          createdAt: Date.now(),
        });
        toast(t("toast.created"));
      }
      save();
      closeSiloModal();
      render();
    };
    $("#deleteSiloBtn").onclick = async () => {
      if (!editingSiloId) return;
      const ok = await confirmDialog({
        title: t("confirm.deleteTitle"),
        body: t("confirm.deleteBody"),
        confirmText: t("confirm.deleteOk"),
        danger: true,
      });
      if (!ok) return;
      const id = editingSiloId;
      // remove any rules and transactions that reference this silo
      state.rules = state.rules.filter(r => r.fromSiloId !== id && r.toSiloId !== id);
      state.transactions = state.transactions.filter(x => x.fromSiloId !== id && x.toSiloId !== id);
      state.silos = state.silos.filter(s => s.id !== id);
      if (state.detailSiloId === id) state.detailSiloId = null;
      save();
      closeSiloModal();
      if (state.detailSiloId === null) closeDetail();
      render();
      toast(t("toast.deleted"));
    };
  }

  /* ============================================================
     TX MODAL
     ============================================================ */
  let editingTxId = null;
  let txType = "expense";

  function openTxModal(tx, presetSiloId) {
    editingTxId = tx?.id || null;
    txType = tx?.type || "expense";
    $("#txModalTitle").textContent = t(tx ? "tx.edit" : "tx.new");
    updateTxTypeUI();
    refreshTxSiloOptions(tx, presetSiloId);
    refreshTxCategoryOptions();
    fillTxCurrencyOptions(tx?.currency);
    $("#txAmount").value = tx?.amount ?? "";
    $("#txWhen").value = toLocalInputValue(tx?.at ?? Date.now());
    $("#txCategory").value = tx?.categoryId || "";
    $("#txLabel").value = tx?.label || "";
    $("#deleteTxBtn").hidden = !tx;
    $("#txModal").hidden = false;
    setTimeout(() => $("#txAmount").focus(), 60);
  }
  function closeTxModal() {
    $("#txModal").hidden = true;
    editingTxId = null;
  }
  function updateTxTypeUI() {
    $$("#txTypeSeg button").forEach(b => b.classList.toggle("is-active", b.dataset.type === txType));
    // From + To visibility
    $("#txFromField").hidden = (txType === "income");
    $("#txToField").hidden   = (txType === "expense");
    const fromLbl = txType === "transfer" ? t("tx.from") : t("tx.from");
    $("#txFromField").querySelector("span").textContent = fromLbl;
    $("#txToField").querySelector("span").textContent = t("tx.to");
  }
  function refreshTxSiloOptions(tx, presetSiloId) {
    const from = $("#txFrom"); from.innerHTML = "";
    const to   = $("#txTo");   to.innerHTML = "";
    state.silos.forEach(s => {
      from.appendChild(el("option", { value: s.id }, (s.icon ? s.icon + " " : "") + s.name));
      to  .appendChild(el("option", { value: s.id }, (s.icon ? s.icon + " " : "") + s.name));
    });
    if (tx) { from.value = tx.fromSiloId || ""; to.value = tx.toSiloId || ""; }
    else {
      from.value = presetSiloId || (state.silos[0]?.id || "");
      to.value = presetSiloId || (state.silos[0]?.id || "");
    }
  }
  function refreshTxCategoryOptions() {
    const sel = $("#txCategory");
    if (!sel) return;
    const curr = sel.value;
    sel.innerHTML = "";
    sel.appendChild(el("option", { value: "" }, t("tx.noCategory")));
    state.categories.forEach(c => sel.appendChild(el("option", { value: c.id }, (c.icon ? c.icon + " " : "") + categoryName(c))));
    sel.value = curr;
  }
  function fillTxCurrencyOptions(currentCode) {
    const sel = $("#txCurrency"); sel.innerHTML = "";
    state.currencies.forEach(c => sel.appendChild(el("option", { value: c.code }, c.code)));
    sel.value = currentCode || state.currencies[0]?.code || "";
  }
  function bindTxModal() {
    $$("[data-close-modal]", $("#txModal")).forEach(b => b.onclick = closeTxModal);
    $$("#txTypeSeg button").forEach(b => b.onclick = () => { txType = b.dataset.type; updateTxTypeUI(); });

    $("#txForm").onsubmit = (e) => {
      e.preventDefault();
      const amount = parseFloat($("#txAmount").value);
      if (isNaN(amount) || amount <= 0) return;
      const currency = $("#txCurrency").value;
      const at = fromLocalInputValue($("#txWhen").value) || Date.now();
      const categoryId = $("#txCategory").value || null;
      const label = $("#txLabel").value.trim();
      const fromSiloId = (txType === "income") ? null : $("#txFrom").value;
      const toSiloId   = (txType === "expense") ? null : $("#txTo").value;
      if (txType === "transfer" && fromSiloId === toSiloId) {
        alert("From and To must differ.");
        return;
      }

      // Build / update
      const wasApplied = editingTxId && state.transactions.find(x => x.id === editingTxId)?.status === "applied";
      if (editingTxId) {
        // Reverse previous if applied, then re-apply or set pending
        const existing = state.transactions.find(x => x.id === editingTxId);
        if (existing) {
          if (existing.status === "applied") {
            // reverse the old op
            applyOp(reverseType(existing.type), existing.toSiloId, existing.fromSiloId, existing.amount, existing.currency);
            // Actually easier: invert sign of amount with original type
            // The line above used reverseType which we'll define
          }
          Object.assign(existing, { type: txType, fromSiloId, toSiloId, amount, currency, at, categoryId, label });
          existing.status = (at <= Date.now()) ? "applied" : "pending";
          if (existing.status === "applied") {
            applyOp(existing.type, existing.fromSiloId, existing.toSiloId, existing.amount, existing.currency);
          }
        }
        toast(t("toast.updated"));
      } else {
        const status = (at <= Date.now()) ? "applied" : "pending";
        const tx = {
          id: cryptoId(),
          type: txType, fromSiloId, toSiloId,
          amount, currency, at, status, categoryId, label,
          ruleId: null, createdAt: Date.now(),
        };
        state.transactions.push(tx);
        if (status === "applied") applyOp(tx.type, tx.fromSiloId, tx.toSiloId, tx.amount, tx.currency);
        toast(t("toast.created"));
      }
      save();
      closeTxModal();
      render();
    };
    $("#deleteTxBtn").onclick = async () => {
      if (!editingTxId) return;
      const existing = state.transactions.find(x => x.id === editingTxId);
      const ok = await confirmDialog({ title: t("confirm.deleteTitle"), body: t("confirm.deleteBody"), confirmText: t("confirm.deleteOk"), danger: true });
      if (!ok) return;
      if (existing && existing.status === "applied") {
        // reverse it
        applyOp(reverseType(existing.type), existing.toSiloId, existing.fromSiloId, existing.amount, existing.currency);
      }
      state.transactions = state.transactions.filter(x => x.id !== editingTxId);
      save();
      closeTxModal();
      render();
      toast(t("toast.deleted"));
    };
  }
  function reverseType(type) {
    // Swap to/from semantics so applyOp(reverseType,...) undoes the original.
    // applyOp uses: income->toSilo +amt; expense->fromSilo -amt; transfer->from -amt, to +amt
    // We want to undo: income should subtract from the original toSilo;
    // expense should add to original fromSilo; transfer should flip directions.
    // The cleanest is: call applyOp with type=opposite + same silos
    if (type === "income")   return "expense";    // applied as expense from original toSilo
    if (type === "expense")  return "income";     // applied as income to original fromSilo? But applyOp uses fromSiloId for expense.
    return "transfer";                            // for transfer we'll swap from/to ourselves in caller
  }
  // Note: the helper above is a tiny hack — it works for income/expense but transfer needs from/to swap, which we do
  // in the call site by passing (toSiloId, fromSiloId). So let's fix that here too.
  // Actually look at the call site: applyOp(reverseType(existing.type), existing.toSiloId, existing.fromSiloId, ...).
  // For income: original applied +amt to toSiloId. We pass reverseType="expense" with from=toSiloId. expense uses fromSiloId -> -amt from toSiloId. Correct.
  // For expense: original -amt from fromSiloId. We pass reverseType="income" with to=fromSiloId. income uses toSiloId -> +amt to fromSiloId. Correct.
  // For transfer: original -amt from from, +amt to to. We pass reverseType="transfer" with from=toSiloId, to=fromSiloId. That gives -amt from toSiloId, +amt to fromSiloId. Correct.
  // Great.

  /* ============================================================
     RULE MODAL
     ============================================================ */
  let editingRuleId = null;
  let ruleType = "expense";

  function openRuleModal(rule, presetSiloId) {
    editingRuleId = rule?.id || null;
    ruleType = rule?.type || "expense";
    $("#ruleModalTitle").textContent = t(rule ? "rule.edit" : "rule.new");
    updateRuleTypeUI();
    refreshRuleSiloOptions(rule, presetSiloId);
    refreshRuleCategoryOptions();
    fillRuleCurrencyOptions(rule?.currency);
    $("#ruleLabel").value      = rule?.label || "";
    $("#ruleAmount").value     = rule?.amount ?? "";
    $("#ruleEveryAmount").value = rule?.every?.amount ?? 1;
    $("#ruleEveryUnit").value   = rule?.every?.unit   ?? "month";
    $("#ruleStartAt").value     = toLocalInputValue(rule?.startAt ?? Date.now());
    $("#ruleEndAt").value       = rule?.endAt ? toLocalInputValue(rule.endAt) : "";
    $("#ruleCategory").value    = rule?.categoryId || "";
    $("#ruleActive").checked    = rule ? !!rule.active : true;
    $("#deleteRuleBtn").hidden  = !rule;
    $("#ruleModal").hidden = false;
    setTimeout(() => $("#ruleLabel").focus(), 60);
  }
  function closeRuleModal() {
    $("#ruleModal").hidden = true;
    editingRuleId = null;
  }
  function updateRuleTypeUI() {
    $$("#ruleTypeSeg button").forEach(b => b.classList.toggle("is-active", b.dataset.type === ruleType));
    $("#ruleFromField").hidden = (ruleType === "income");
    $("#ruleToField").hidden   = (ruleType === "expense");
  }
  function refreshRuleSiloOptions(rule, presetSiloId) {
    const from = $("#ruleFrom"); from.innerHTML = "";
    const to   = $("#ruleTo");   to.innerHTML   = "";
    state.silos.forEach(s => {
      from.appendChild(el("option", { value: s.id }, (s.icon ? s.icon + " " : "") + s.name));
      to  .appendChild(el("option", { value: s.id }, (s.icon ? s.icon + " " : "") + s.name));
    });
    if (rule) { from.value = rule.fromSiloId || ""; to.value = rule.toSiloId || ""; }
    else {
      from.value = presetSiloId || (state.silos[0]?.id || "");
      to.value = presetSiloId || (state.silos[0]?.id || "");
    }
  }
  function refreshRuleCategoryOptions() {
    const sel = $("#ruleCategory");
    if (!sel) return;
    const curr = sel.value;
    sel.innerHTML = "";
    sel.appendChild(el("option", { value: "" }, t("tx.noCategory")));
    state.categories.forEach(c => sel.appendChild(el("option", { value: c.id }, (c.icon ? c.icon + " " : "") + categoryName(c))));
    sel.value = curr;
  }
  function fillRuleCurrencyOptions(currentCode) {
    const sel = $("#ruleCurrency"); sel.innerHTML = "";
    state.currencies.forEach(c => sel.appendChild(el("option", { value: c.code }, c.code)));
    sel.value = currentCode || state.currencies[0]?.code || "";
  }
  function bindRuleModal() {
    $$("[data-close-modal]", $("#ruleModal")).forEach(b => b.onclick = closeRuleModal);
    $$("#ruleTypeSeg button").forEach(b => b.onclick = () => { ruleType = b.dataset.type; updateRuleTypeUI(); });

    $("#ruleForm").onsubmit = (e) => {
      e.preventDefault();
      const amount = parseFloat($("#ruleAmount").value);
      if (isNaN(amount) || amount <= 0) return;
      const currency = $("#ruleCurrency").value;
      const everyAmt = Math.max(1, parseInt($("#ruleEveryAmount").value, 10) || 1);
      const everyUnit = $("#ruleEveryUnit").value;
      const startAt = fromLocalInputValue($("#ruleStartAt").value) || Date.now();
      const endAt = fromLocalInputValue($("#ruleEndAt").value) || null;
      const categoryId = $("#ruleCategory").value || null;
      const label = $("#ruleLabel").value.trim();
      const active = $("#ruleActive").checked;
      const fromSiloId = (ruleType === "income") ? null : $("#ruleFrom").value;
      const toSiloId   = (ruleType === "expense") ? null : $("#ruleTo").value;
      if (ruleType === "transfer" && fromSiloId === toSiloId) {
        alert("From and To must differ.");
        return;
      }

      if (editingRuleId) {
        const r = state.rules.find(x => x.id === editingRuleId);
        if (r) {
          Object.assign(r, {
            type: ruleType, fromSiloId, toSiloId, amount, currency,
            every: { amount: everyAmt, unit: everyUnit },
            startAt, endAt, categoryId, label, active,
          });
          // We don't reset lastRunAt; if user wants catch-up they can re-set startAt.
          toast(t("toast.updated"));
        }
      } else {
        state.rules.push({
          id: cryptoId(),
          type: ruleType, fromSiloId, toSiloId, amount, currency,
          every: { amount: everyAmt, unit: everyUnit },
          startAt, endAt,
          lastRunAt: null,
          categoryId, label, active,
          createdAt: Date.now(),
        });
        toast(t("toast.created"));
      }
      save();
      settleNow();
      closeRuleModal();
      render();
    };
    $("#deleteRuleBtn").onclick = async () => {
      if (!editingRuleId) return;
      const ok = await confirmDialog({ title: t("confirm.deleteTitle"), body: t("confirm.deleteBody"), confirmText: t("confirm.deleteOk"), danger: true });
      if (!ok) return;
      state.rules = state.rules.filter(r => r.id !== editingRuleId);
      save();
      closeRuleModal();
      render();
      toast(t("toast.deleted"));
    };
  }

  /* ============================================================
     RENDER — TABS
     ============================================================ */
  function bindTabs() {
    $$(".tab").forEach(tab => {
      tab.onclick = () => {
        state.activeTab = tab.dataset.tab;
        save();
        $$(".tab").forEach(t2 => t2.classList.toggle("is-active", t2 === tab));
        render();
      };
    });
    $$(".tab").forEach(tab => tab.classList.toggle("is-active", tab.dataset.tab === state.activeTab));
  }

  function showEmpty(view, titleKey, bodyKey, ctaKey, onCta) {
    view.innerHTML = "";
    const e = el("div", { class: "empty" },
      el("img", { src: "logo.svg", alt: "", class: "empty-logo", "aria-hidden": "true" }),
      el("h2", {}, t(titleKey)),
      el("p", {}, t(bodyKey)),
      onCta ? el("button", { class: "btn btn-primary", onclick: onCta }, t(ctaKey)) : null,
    );
    view.appendChild(e);
  }

  function render() {
    if (state.detailSiloId) { renderDetail(); return; }
    const view = $("#view");
    view.innerHTML = "";
    $("#emptyState").hidden = true;

    const tab = state.activeTab;
    if (tab === "silos")    return renderSilosTab(view);
    if (tab === "forecast") return renderForecastTab(view);
    if (tab === "rules")    return renderRulesTab(view);
    if (tab === "history")  return renderHistoryTab(view);
    if (tab === "stats")    return renderStatsTab(view);
  }

  /* ----- Silos tab ----- */
  function renderSilosTab(view) {
    if (state.silos.length === 0) {
      return showEmpty(view, "empty.title", "empty.body", "empty.cta", () => openSiloModal());
    }
    state.silos.forEach(silo => {
      view.appendChild(renderSiloCard(silo));
    });
  }
  function primaryCurrency(silo) {
    // Currency with largest absolute current balance; fall back to first declared currency.
    const codes = Object.keys(silo.balances).filter(c => silo.balances[c] !== 0 || true);
    if (codes.length === 0) return state.currencies[0]?.code || "";
    let best = codes[0], bestAbs = Math.abs(silo.balances[codes[0]] || 0);
    for (const c of codes) {
      const v = Math.abs(silo.balances[c] || 0);
      if (v > bestAbs) { best = c; bestAbs = v; }
    }
    return best;
  }
  function renderSiloCard(silo) {
    const card = el("article", { class: "silo", style: { "--cat-color": silo.color || "#14B8A6" }, onclick: () => openDetail(silo.id) });
    card.appendChild(el("div", { class: "silo-stripe" }));
    const head = el("div", { class: "silo-head" });
    head.appendChild(el("div", { class: "silo-icon" }, silo.icon || "🏦"));
    head.appendChild(el("div", { class: "silo-title" }, silo.name));
    card.appendChild(head);

    const balancesWrap = el("div", { class: "silo-balances" });
    const codes = Object.keys(silo.balances);
    if (codes.length === 0) {
      balancesWrap.appendChild(el("div", { class: "silo-balance" },
        el("span", { class: "amount" }, fmtAmount(0)),
        el("span", { class: "currency" }, state.currencies[0]?.code || "")
      ));
    } else {
      codes.forEach(c => {
        const v = silo.balances[c] || 0;
        balancesWrap.appendChild(el("div", { class: "silo-balance" + (v < 0 ? " is-negative" : "") },
          el("span", { class: "amount" }, fmtAmount(v)),
          el("span", { class: "currency" }, c)
        ));
      });
    }
    card.appendChild(balancesWrap);

    // Quick forecast row (primary currency)
    const ccy = primaryCurrency(silo);
    const now = Date.now();
    const w = forecastSilo(silo.id, endOfWeek(now)).projected[ccy] ?? silo.balances[ccy] ?? 0;
    const m = forecastSilo(silo.id, endOfMonth(now)).projected[ccy] ?? silo.balances[ccy] ?? 0;
    const y = forecastSilo(silo.id, endOfYear(now)).projected[ccy] ?? silo.balances[ccy] ?? 0;

    const grid = el("div", { class: "silo-forecast" });
    [
      { label: t("forecast.range.week"),  v: w },
      { label: t("forecast.range.month"), v: m },
      { label: t("forecast.range.year"),  v: y },
    ].forEach(cell => {
      grid.appendChild(el("div", { class: "cell" },
        el("span", {}, cell.label),
        el("strong", { class: "v" + (cell.v < 0 ? " is-negative" : "") }, fmtAmount(cell.v) + " " + ccy),
      ));
    });
    card.appendChild(grid);

    return card;
  }

  /* ----- Forecast tab ----- */
  function renderForecastTab(view) {
    if (state.silos.length === 0) {
      return showEmpty(view, "empty.forecastTitle", "empty.forecastBody", "empty.cta", () => openSiloModal());
    }
    view.appendChild(renderRangePicker());
    state.silos.forEach(silo => view.appendChild(renderForecastCard(silo)));
  }
  function renderRangePicker() {
    const wrap = el("div", { class: "forecast-card" });
    wrap.appendChild(el("div", { class: "forecast-head" },
      el("div", {},
        el("div", { class: "forecast-title" }, t("forecast.title")),
        el("div", { class: "forecast-sub" }, t("forecast.subTitle")),
      )
    ));
    const chips = el("div", { class: "range-chips" });
    [
      ["week",  "forecast.range.week"],
      ["month", "forecast.range.month"],
      ["year",  "forecast.range.year"],
      ["custom","forecast.range.custom"],
    ].forEach(([k, l]) => {
      const c = el("button", { class: "range-chip" + (state.forecastRange === k ? " is-active" : "") }, t(l));
      c.onclick = () => {
        state.forecastRange = k;
        if (k !== "custom") state.forecastCustom = null;
        save();
        render();
      };
      chips.appendChild(c);
    });
    wrap.appendChild(chips);
    if (state.forecastRange === "custom") {
      const inp = el("input", { type: "datetime-local", value: state.forecastCustom ? toLocalInputValue(state.forecastCustom) : toLocalInputValue(endOfMonth(Date.now())) });
      inp.onchange = (e) => {
        state.forecastCustom = fromLocalInputValue(e.target.value);
        save();
        render();
      };
      wrap.appendChild(inp);
    }
    return wrap;
  }
  function renderForecastCard(silo) {
    const target = rangeTargetTs(state.forecastRange, state.forecastCustom);
    const fc = forecastSilo(silo.id, target);
    const now = Date.now();
    const days = daysBetween(now, target);

    const card = el("div", { class: "forecast-card", onclick: () => openDetail(silo.id), style: { cursor: "pointer", "--cat-color": silo.color || "#14B8A6" } });
    card.appendChild(el("div", { class: "forecast-head" },
      el("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
        el("span", { class: "silo-icon", style: { width: "30px", height: "30px", fontSize: "16px" } }, silo.icon || "🏦"),
        el("div", { class: "forecast-title" }, silo.name)
      ),
      el("div", { class: "forecast-sub" }, fmtDate(now) + " → " + fmtDate(target))
    ));

    const tiles = el("div", { class: "forecast-summary" });
    const codes = Array.from(new Set([...Object.keys(fc.now), ...Object.keys(fc.projected)]));
    if (codes.length === 0) codes.push(state.currencies[0]?.code || "");
    codes.forEach(ccy => {
      const cur = fc.now[ccy] || 0;
      const proj = fc.projected[ccy] || 0;
      const flow = fc.perCurrencyFlow[ccy] || { in: 0, out: 0 };
      tiles.appendChild(el("div", { class: "forecast-tile" },
        el("span", { class: "label" }, ccy + " · " + t("forecast.current")),
        el("span", { class: "value" + (cur < 0 ? " is-negative" : "") }, fmtAmount(cur)),
      ));
      tiles.appendChild(el("div", { class: "forecast-tile" },
        el("span", { class: "label" }, ccy + " · " + t("forecast.projected")),
        el("span", { class: "value" + (proj < 0 ? " is-negative" : "") }, fmtAmount(proj)),
        el("span", { class: "sub" }, "+" + fmtAmount(flow.in) + " / −" + fmtAmount(flow.out)),
      ));
      // Per-day allowance, only when projected positive (otherwise show negative for clarity)
      const allowance = proj / days;
      tiles.appendChild(el("div", { class: "forecast-tile" },
        el("span", { class: "label" }, ccy + " · " + t("forecast.allowance")),
        el("span", { class: "value" + (allowance < 0 ? " is-negative" : "") }, fmtAmount(allowance)),
        el("span", { class: "sub" }, t("forecast.daysLeft", { n: days })),
      ));
    });
    card.appendChild(tiles);
    return card;
  }

  /* ----- Rules tab ----- */
  function renderRulesTab(view) {
    if (state.rules.length === 0) {
      return showEmpty(view, "empty.rulesTitle", "empty.rulesBody", "empty.rulesCta", () => openRuleModal());
    }
    // Sort rules: active first, then next occurrence soonest
    const sorted = [...state.rules].sort((a, b) => {
      if (!!a.active !== !!b.active) return a.active ? -1 : 1;
      const an = a.lastRunAt ? addInterval(a.lastRunAt, a.every.amount, a.every.unit) : a.startAt;
      const bn = b.lastRunAt ? addInterval(b.lastRunAt, b.every.amount, b.every.unit) : b.startAt;
      return an - bn;
    });
    sorted.forEach(rule => view.appendChild(renderRuleRow(rule)));
  }
  function renderRuleRow(rule) {
    const row = el("div", { class: "row-card is-" + rule.type + (rule.active ? "" : " is-paused"), onclick: () => openRuleModal(rule) });
    const icon = rule.type === "income" ? "↘" : rule.type === "expense" ? "↗" : "⇄";
    row.appendChild(el("div", { class: "row-icon" }, icon));

    const body = el("div", { class: "row-body" });
    const title = rule.label || (rule.type === "income" ? t("type.income") : rule.type === "expense" ? t("type.expense") : t("type.transfer"));
    body.appendChild(el("div", { class: "row-title" }, title));

    const meta = el("div", { class: "row-meta" });
    meta.appendChild(el("span", {}, intervalLabel(rule.every)));
    if (rule.type === "transfer") meta.appendChild(el("span", {}, "· " + siloName(rule.fromSiloId) + " → " + siloName(rule.toSiloId)));
    else if (rule.type === "income") meta.appendChild(el("span", {}, "· → " + siloName(rule.toSiloId)));
    else meta.appendChild(el("span", {}, "· " + siloName(rule.fromSiloId)));
    // next
    const next = rule.lastRunAt ? addInterval(rule.lastRunAt, rule.every.amount, rule.every.unit) : rule.startAt;
    if (next && (!rule.endAt || next <= rule.endAt) && rule.active) {
      meta.appendChild(el("span", {}, "· " + t("rule.next") + " " + fmtDateTime(next)));
    }
    if (!rule.active) meta.appendChild(el("span", { class: "chip" }, t("rule.paused")));
    if (rule.categoryId) {
      const c = categoryById(rule.categoryId);
      if (c) meta.appendChild(el("span", { class: "chip chip-cat", style: { "--chip-color": c.color || "#14B8A6" } },
        el("span", { class: "dot" }), (c.icon ? c.icon + " " : "") + categoryName(c)
      ));
    }
    body.appendChild(meta);
    row.appendChild(body);

    const sign = rule.type === "income" ? "+" : rule.type === "expense" ? "−" : "";
    row.appendChild(el("div", { class: "row-amount" },
      sign + fmtAmount(rule.amount),
      el("span", { class: "currency" }, rule.currency),
    ));
    return row;
  }

  /* ----- History tab ----- */
  function renderHistoryTab(view) {
    if (state.transactions.length === 0) {
      return showEmpty(view, "empty.txTitle", "empty.txBody", "empty.txCta", () => openTxModal());
    }
    const now = Date.now();
    const upcomingHorizon = now + 30 * UNIT_MS.day;
    const upcoming = state.transactions
      .filter(x => x.status === "pending" && x.at <= upcomingHorizon)
      .sort((a, b) => a.at - b.at);
    const recent = state.transactions
      .filter(x => x.status === "applied")
      .sort((a, b) => b.at - a.at)
      .slice(0, 200);

    if (upcoming.length) {
      view.appendChild(el("div", { class: "section-head" }, el("span", {}, t("history.upcoming")), el("span", { class: "count" }, String(upcoming.length))));
      upcoming.forEach(tx => view.appendChild(renderTxRow(tx)));
    }
    if (recent.length) {
      view.appendChild(el("div", { class: "section-head" }, el("span", {}, t("history.recent")), el("span", { class: "count" }, String(recent.length))));
      recent.forEach(tx => view.appendChild(renderTxRow(tx)));
    }
  }
  function renderTxRow(tx) {
    const row = el("div", { class: "row-card is-" + tx.type, onclick: () => openTxModal(tx) });
    const icon = tx.type === "income" ? "↘" : tx.type === "expense" ? "↗" : "⇄";
    row.appendChild(el("div", { class: "row-icon" }, icon));

    const body = el("div", { class: "row-body" });
    const title = tx.label || (tx.type === "income" ? t("type.income") : tx.type === "expense" ? t("type.expense") : t("type.transfer"));
    body.appendChild(el("div", { class: "row-title" }, title));
    const meta = el("div", { class: "row-meta" });
    meta.appendChild(el("span", {}, fmtDateTime(tx.at)));
    if (tx.type === "transfer") meta.appendChild(el("span", {}, "· " + siloName(tx.fromSiloId) + " → " + siloName(tx.toSiloId)));
    else if (tx.type === "income") meta.appendChild(el("span", {}, "· → " + siloName(tx.toSiloId)));
    else meta.appendChild(el("span", {}, "· " + siloName(tx.fromSiloId)));
    if (tx.status === "pending") meta.appendChild(el("span", { class: "chip" }, t("history.pending")));
    if (tx.ruleId) meta.appendChild(el("span", { class: "chip" }, t("history.fromRule")));
    if (tx.categoryId) {
      const c = categoryById(tx.categoryId);
      if (c) meta.appendChild(el("span", { class: "chip chip-cat", style: { "--chip-color": c.color || "#14B8A6" } },
        el("span", { class: "dot" }), (c.icon ? c.icon + " " : "") + categoryName(c)
      ));
    }
    body.appendChild(meta);
    row.appendChild(body);

    const sign = tx.type === "income" ? "+" : tx.type === "expense" ? "−" : "";
    row.appendChild(el("div", { class: "row-amount" }, sign + fmtAmount(tx.amount), el("span", { class: "currency" }, tx.currency)));
    return row;
  }

  /* ----- Stats tab ----- */
  function renderStatsTab(view) {
    if (state.silos.length === 0) {
      return showEmpty(view, "empty.statsTitle", "empty.statsBody", "empty.cta", () => openSiloModal());
    }
    const now = Date.now();
    const monthStart = startOfMonth(now);
    const yearStart  = startOfYear(now);
    const sumByCcy = (predicate) => {
      const out = {};
      state.transactions.forEach(tx => {
        if (tx.status !== "applied") return;
        if (!predicate(tx)) return;
        out[tx.currency] = (out[tx.currency] || 0) + tx.amount;
      });
      return out;
    };
    const totalByCcy = {};
    state.silos.forEach(s => {
      for (const c in s.balances) totalByCcy[c] = (totalByCcy[c] || 0) + s.balances[c];
    });
    const monthIn  = sumByCcy(tx => tx.type === "income"  && tx.at >= monthStart);
    const monthOut = sumByCcy(tx => tx.type === "expense" && tx.at >= monthStart);
    const yearIn   = sumByCcy(tx => tx.type === "income"  && tx.at >= yearStart);
    const yearOut  = sumByCcy(tx => tx.type === "expense" && tx.at >= yearStart);

    // Top tiles
    const grid = el("div", { class: "stats-grid" });
    grid.appendChild(statTile(t("stats.totalBalance"), prettyMoneyMap(totalByCcy), t("stats.siloCount", { n: state.silos.length })));
    grid.appendChild(statTile(t("stats.thisMonthIn"),  prettyMoneyMap(monthIn)));
    grid.appendChild(statTile(t("stats.thisMonthOut"), prettyMoneyMap(monthOut)));
    grid.appendChild(statTile(t("stats.thisYearIn"),   prettyMoneyMap(yearIn)));
    grid.appendChild(statTile(t("stats.thisYearOut"),  prettyMoneyMap(yearOut)));
    // Net this month
    const net = {};
    Object.keys({ ...monthIn, ...monthOut }).forEach(c => net[c] = (monthIn[c] || 0) - (monthOut[c] || 0));
    grid.appendChild(statTile(t("stats.netThisMonth"), prettyMoneyMap(net)));
    view.appendChild(grid);

    // By category this month
    const catGrid = el("div", { class: "stats-grid" });
    catGrid.style.marginTop = "10px";
    const byCat = {};   // catId -> { ccy: amount }
    state.transactions.forEach(tx => {
      if (tx.status !== "applied" || tx.type !== "expense" || tx.at < monthStart) return;
      const key = tx.categoryId || "_none";
      byCat[key] ||= {};
      byCat[key][tx.currency] = (byCat[key][tx.currency] || 0) + tx.amount;
    });
    const entries = Object.entries(byCat);
    if (entries.length > 0) {
      view.appendChild(el("div", { class: "section-head" }, el("span", {}, t("stats.byCategory")), el("span", { class: "count" }, String(entries.length))));
      entries.forEach(([catId, ccys]) => {
        const c = catId === "_none" ? null : categoryById(catId);
        const name = c ? categoryName(c) : t("tx.noCategory");
        const colorCss = c?.color ? { borderLeft: "3px solid " + c.color } : {};
        catGrid.appendChild(el("div", { class: "stat-tile", style: colorCss },
          el("span", { class: "label" }, (c?.icon ? c.icon + " " : "") + name),
          el("span", { class: "value" }, prettyMoneyMap(ccys)),
        ));
      });
      view.appendChild(catGrid);
    }
  }
  function statTile(label, value, sub) {
    return el("div", { class: "stat-tile" },
      el("span", { class: "label" }, label),
      el("span", { class: "value" }, value || "—"),
      sub ? el("span", { class: "sub" }, sub) : null,
    );
  }
  function prettyMoneyMap(map) {
    const keys = Object.keys(map);
    if (keys.length === 0) return "—";
    return keys.sort().map(c => fmtAmount(map[c]) + " " + c).join(" · ");
  }

  /* ============================================================
     SILO DETAIL VIEW
     ============================================================ */
  function openDetail(siloId) {
    state.detailSiloId = siloId;
    save();
    appShell.hidden = true;
    detailView.hidden = false;
    renderDetail();
    window.scrollTo({ top: 0 });
  }
  function closeDetail() {
    state.detailSiloId = null;
    save();
    detailView.hidden = true;
    appShell.hidden = false;
    render();
  }
  function renderDetail() {
    if (!state.detailSiloId) return;
    const silo = siloById(state.detailSiloId);
    if (!silo) { closeDetail(); return; }
    appShell.hidden = true;
    detailView.hidden = false;
    const root = $("#detailBody");
    root.innerHTML = "";

    // Back + title + edit
    const head = el("div", { class: "detail-head" });
    const back = el("button", { class: "back", "aria-label": "Back", html: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15.5 19l-7-7 7-7 1.4 1.4L11.3 12l5.6 5.6z"/></svg>' });
    back.onclick = closeDetail;
    head.appendChild(back);
    head.appendChild(el("div", { class: "title" }, (silo.icon ? silo.icon + "  " : "") + silo.name));
    const editBtn = el("button", { class: "btn btn-ghost btn-sm", onclick: () => openSiloModal(silo) }, t("detail.editSilo"));
    head.appendChild(editBtn);
    root.appendChild(head);

    // Balances card
    const bal = el("div", { class: "detail-balances-card", style: { "--cat-color": silo.color || "#14B8A6" } });
    bal.appendChild(el("div", { class: "head" },
      el("div", { class: "title-row" },
        el("span", { class: "silo-icon", style: { width: "30px", height: "30px", fontSize: "16px" } }, silo.icon || "🏦"),
        el("strong", { style: { fontSize: "16px" } }, silo.name)
      ),
      el("div", { class: "actions" },
        el("button", { class: "btn btn-primary btn-sm", onclick: () => openTxModal(null, silo.id) }, t("detail.addTx")),
        el("button", { class: "btn btn-ghost btn-sm", onclick: () => openRuleModal(null, silo.id) }, t("detail.addRule")),
      )
    ));
    const bg = el("div", { class: "balances-grid" });
    const codes = Object.keys(silo.balances);
    if (codes.length === 0) {
      bg.appendChild(el("div", { class: "balance-tile" },
        el("span", { class: "currency" }, state.currencies[0]?.code || ""),
        el("span", { class: "amount" }, fmtAmount(0)),
      ));
    } else codes.forEach(c => {
      const v = silo.balances[c];
      bg.appendChild(el("div", { class: "balance-tile" },
        el("span", { class: "currency" }, c),
        el("span", { class: "amount" + (v < 0 ? " is-negative" : "") }, fmtAmount(v)),
      ));
    });
    bal.appendChild(bg);
    root.appendChild(bal);

    // Forecast card with chart
    root.appendChild(renderDetailForecast(silo));

    // Per-day allowance (primary currency)
    const ccy = primaryCurrency(silo);
    const target = rangeTargetTs(state.forecastRange, state.forecastCustom);
    const fc = forecastSilo(silo.id, target);
    const proj = fc.projected[ccy] || 0;
    const days = daysBetween(Date.now(), target);
    const allowance = proj / days;
    root.appendChild(el("div", { class: "allowance-card" },
      el("span", { class: "label" }, t("forecast.allowance") + " · " + ccy),
      el("span", { class: "amount" + (allowance < 0 ? " is-negative" : "") }, fmtAmount(allowance)),
      el("span", { class: "body" }, t("forecast.allowanceBody") + " " + t("forecast.daysLeft", { n: days })),
    ));

    // Rules in this silo
    const involved = state.rules.filter(r => r.fromSiloId === silo.id || r.toSiloId === silo.id);
    if (involved.length) {
      root.appendChild(el("div", { class: "section-head" }, el("span", {}, t("detail.rules")), el("span", { class: "count" }, String(involved.length))));
      involved
        .sort((a, b) => (a.active === b.active) ? 0 : a.active ? -1 : 1)
        .forEach(r => root.appendChild(renderRuleRow(r)));
    }

    // Recent activity (this silo)
    const myTxs = state.transactions.filter(tx => tx.fromSiloId === silo.id || tx.toSiloId === silo.id);
    const upcoming = myTxs.filter(tx => tx.status === "pending").sort((a, b) => a.at - b.at);
    const recent = myTxs.filter(tx => tx.status === "applied").sort((a, b) => b.at - a.at).slice(0, 50);
    if (upcoming.length) {
      root.appendChild(el("div", { class: "section-head" }, el("span", {}, t("history.upcoming")), el("span", { class: "count" }, String(upcoming.length))));
      upcoming.forEach(tx => root.appendChild(renderTxRow(tx)));
    }
    if (recent.length) {
      root.appendChild(el("div", { class: "section-head" }, el("span", {}, t("detail.recent")), el("span", { class: "count" }, String(recent.length))));
      recent.forEach(tx => root.appendChild(renderTxRow(tx)));
    }
  }

  function renderDetailForecast(silo) {
    const wrap = el("div", { class: "forecast-card" });
    wrap.appendChild(el("div", { class: "forecast-head" },
      el("div", {},
        el("div", { class: "forecast-title" }, t("forecast.title")),
        el("div", { class: "forecast-sub" }, t("forecast.subTitle")),
      )
    ));
    const chips = el("div", { class: "range-chips" });
    [
      ["week",  "forecast.range.week"],
      ["month", "forecast.range.month"],
      ["year",  "forecast.range.year"],
      ["custom","forecast.range.custom"],
    ].forEach(([k, l]) => {
      const c = el("button", { class: "range-chip" + (state.forecastRange === k ? " is-active" : "") }, t(l));
      c.onclick = () => {
        state.forecastRange = k;
        if (k !== "custom") state.forecastCustom = null;
        save();
        renderDetail();
      };
      chips.appendChild(c);
    });
    wrap.appendChild(chips);
    if (state.forecastRange === "custom") {
      const inp = el("input", { type: "datetime-local",
        value: state.forecastCustom ? toLocalInputValue(state.forecastCustom) : toLocalInputValue(endOfMonth(Date.now())) });
      inp.onchange = (e) => {
        state.forecastCustom = fromLocalInputValue(e.target.value);
        save();
        renderDetail();
      };
      wrap.appendChild(inp);
    }
    const target = rangeTargetTs(state.forecastRange, state.forecastCustom);
    const fc = forecastSilo(silo.id, target);

    // Summary tiles per currency
    const codes = Array.from(new Set([...Object.keys(fc.now), ...Object.keys(fc.projected)]));
    if (codes.length === 0) codes.push(state.currencies[0]?.code || "");
    const tiles = el("div", { class: "forecast-summary" });
    codes.forEach(ccy => {
      const cur = fc.now[ccy] || 0;
      const proj = fc.projected[ccy] || 0;
      const flow = fc.perCurrencyFlow[ccy] || { in: 0, out: 0 };
      tiles.appendChild(el("div", { class: "forecast-tile" },
        el("span", { class: "label" }, ccy + " · " + t("forecast.current")),
        el("span", { class: "value" + (cur < 0 ? " is-negative" : "") }, fmtAmount(cur)),
      ));
      tiles.appendChild(el("div", { class: "forecast-tile" },
        el("span", { class: "label" }, ccy + " · " + t("forecast.projected")),
        el("span", { class: "value" + (proj < 0 ? " is-negative" : "") }, fmtAmount(proj)),
        el("span", { class: "sub" }, t("forecast.flowIn") + ": " + fmtAmount(flow.in) + " · " + t("forecast.flowOut") + ": " + fmtAmount(flow.out)),
      ));
    });
    wrap.appendChild(tiles);

    // Chart (primary currency)
    const ccy = primaryCurrency(silo);
    const events = fc.events.filter(e => e.delta[ccy] !== undefined);
    const points = [];
    let running = fc.now[ccy] || 0;
    const now = Date.now();
    points.push({ t: now, v: running });
    events.forEach(ev => {
      running += ev.delta[ccy] || 0;
      points.push({ t: ev.at, v: running });
    });
    points.push({ t: target, v: running });
    wrap.appendChild(el("div", { class: "forecast-chart-wrap" }, renderChart(points, ccy, silo.color || "#14B8A6")));

    return wrap;
  }

  function renderChart(points, ccy, color) {
    const W = 600, H = 180, P = 24;
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("class", "forecast-chart");
    svg.setAttribute("preserveAspectRatio", "none");
    if (points.length === 0) return svg;

    const ts = points.map(p => p.t);
    const vs = points.map(p => p.v);
    const tMin = Math.min(...ts), tMax = Math.max(...ts);
    const vMin = Math.min(...vs, 0), vMax = Math.max(...vs, 0);
    const xFor = t => P + (tMax === tMin ? 0 : ((t - tMin) / (tMax - tMin)) * (W - 2 * P));
    const yFor = v => H - P - (vMax === vMin ? (H - 2 * P) / 2 : ((v - vMin) / (vMax - vMin)) * (H - 2 * P));

    // Zero-line if range spans zero
    if (vMin < 0 && vMax > 0) {
      const y0 = yFor(0);
      const zero = document.createElementNS(svgNS, "line");
      zero.setAttribute("x1", P); zero.setAttribute("x2", W - P);
      zero.setAttribute("y1", y0); zero.setAttribute("y2", y0);
      zero.setAttribute("stroke", "currentColor"); zero.setAttribute("stroke-opacity", "0.2");
      zero.setAttribute("stroke-dasharray", "2 4");
      svg.appendChild(zero);
    }
    // Build step path (constant between events, jump at event)
    let d = "";
    points.forEach((p, i) => {
      const x = xFor(p.t), y = yFor(p.v);
      if (i === 0) { d += `M ${x} ${y}`; }
      else {
        const prev = points[i - 1];
        const px = xFor(prev.t), py = yFor(prev.v);
        d += ` L ${x} ${py} L ${x} ${y}`;
      }
    });
    // Area under the curve
    const area = document.createElementNS(svgNS, "path");
    const y0clip = yFor(0);
    let darea = d + ` L ${xFor(points[points.length - 1].t)} ${y0clip} L ${xFor(points[0].t)} ${y0clip} Z`;
    area.setAttribute("d", darea);
    area.setAttribute("fill", color);
    area.setAttribute("fill-opacity", "0.12");
    svg.appendChild(area);

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);

    // Endpoint dot + label
    const last = points[points.length - 1];
    const dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx", xFor(last.t)); dot.setAttribute("cy", yFor(last.v));
    dot.setAttribute("r", "4"); dot.setAttribute("fill", color);
    svg.appendChild(dot);

    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", xFor(last.t) - 6);
    label.setAttribute("y", Math.max(14, yFor(last.v) - 10));
    label.setAttribute("text-anchor", "end");
    label.setAttribute("fill", "currentColor");
    label.setAttribute("font-size", "12");
    label.setAttribute("font-weight", "700");
    label.textContent = fmtAmount(last.v) + " " + ccy;
    svg.appendChild(label);

    return svg;
  }

  /* ============================================================
     TOAST
     ============================================================ */
  let toastTimer = null;
  function toast(msg) {
    const elT = $("#toast");
    elT.textContent = msg;
    elT.hidden = false;
    requestAnimationFrame(() => elT.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      elT.classList.remove("show");
      setTimeout(() => { elT.hidden = true; }, 250);
    }, 2200);
  }

  /* ============================================================
     SERVICE WORKER — auto update banner
     ============================================================ */
  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol === "file:") return;        // skip when opened from disk
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").then(reg => {
        // Periodically check for updates while open.
        setInterval(() => { try { reg.update(); } catch (e) {} }, 30 * 60 * 1000);
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateBanner(() => {
                nw.postMessage({ type: "SKIP_WAITING" });
              });
            }
          });
        });
        let reloaded = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (reloaded) return;
          reloaded = true;
          window.location.reload();
        });
      }).catch(() => {});
    });
  }
  function showUpdateBanner(onReload) {
    const banner = $("#updateBanner");
    if (!banner) return;
    banner.hidden = false;
    $("#updateReload").onclick = () => { banner.hidden = true; onReload(); };
  }

  /* ============================================================
     STARTUP
     ============================================================ */
  function startup() {
    applyTheme();
    applyI18n();
    if (!state.onboardingDone) {
      onboarding.hidden = false;
      appShell.hidden = true;
      detailView.hidden = true;
      showStep(1);
    } else {
      onboarding.hidden = true;
      if (state.detailSiloId && siloById(state.detailSiloId)) {
        appShell.hidden = true;
        detailView.hidden = false;
        renderDetail();
      } else {
        state.detailSiloId = null;
        detailView.hidden = true;
        appShell.hidden = false;
        render();
      }
    }
  }
  function init() {
    bindOnboarding();
    bindSettings();
    bindSiloModal();
    bindTxModal();
    bindRuleModal();
    bindTabs();

    $("#addBtn").onclick = () => {
      // Context-aware:
      const tab = state.activeTab;
      if (tab === "silos")        return state.silos.length === 0 ? openSiloModal() : openChooser();
      if (tab === "rules")        return openRuleModal();
      if (tab === "history")      return openTxModal();
      return openChooser();
    };
    $("#detailAddBtn").onclick = () => {
      const id = state.detailSiloId;
      if (id) openTxModal(null, id);
    };
    $("#emptyCta").onclick = () => openSiloModal();

    // Process any due rules/transactions on load and periodically.
    settleNow();
    setInterval(() => {
      const before = JSON.stringify({ b: state.silos.map(s => s.balances), tx: state.transactions.length });
      settleNow();
      const after = JSON.stringify({ b: state.silos.map(s => s.balances), tx: state.transactions.length });
      if (before !== after) render();
    }, 60 * 1000);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        settleNow();
        render();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const layers = ["#iconPicker", "#chooser", "#confirmDialog", "#ruleModal", "#txModal", "#siloModal"];
      for (const sel of layers) {
        const n = $(sel);
        if (n && !n.hidden) { n.hidden = true; return; }
      }
      if (!settingsDrawer.hidden) closeSettings();
      else if (state.detailSiloId) closeDetail();
    });

    startup();
    registerSW();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  /* expose for tests */
  window.__SC__ = { state, forecastSilo, addInterval, futureRuleOccurrences, applyDueRules, applyDueTransactions };
})();
