/* ============================================================
   SpendersChoice — app logic
   - localStorage persistence (with migration)
   - Accounts/Accounts (multi-currency), categories, currencies
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
      "tab.accounts":    "Accounts",
      "tab.forecast": "Forecast",
      "tab.rules":    "Rules",
      "tab.history":  "History",
      "tab.stats":    "Stats",
      // empty
      "empty.title":      "Nothing here yet",
      "empty.body":       "Get started by creating your first account.",
      "empty.cta":        "Add an account",
      "empty.rulesTitle": "No recurring rules",
      "empty.rulesBody":  "Add salary, rent, subscriptions — anything that happens on a schedule.",
      "empty.rulesCta":   "Add a rule",
      "empty.txTitle":    "No transactions yet",
      "empty.txBody":     "One-time and rule-driven activity will show up here.",
      "empty.txCta":      "Add a transaction",
      "empty.forecastTitle": "Add an account to see a forecast",
      "empty.forecastBody":  "Once you've got an account and a few rules, the future will appear here.",
      "empty.statsTitle":  "No data yet",
      "empty.statsBody":   "Once money starts flowing, you'll see metrics here.",
      // onboarding
      "onboard.welcomeSub": "Accounts, recurring rules and a forecast you can trust.",
      "onboard.start":      "Get started",
      "onboard.langTitle":  "Choose your language",
      "onboard.langSub":    "You can change this any time in Settings.",
      "onboard.currTitle":  "Your currencies",
      "onboard.currSub":    "Add the currencies you use. Plain codes — DKK, USD, BTC, anything.",
      "onboard.accountTitle":  "Your first account",
      "onboard.accountSub":    "A account is anywhere you keep money — a bank account, a wallet, a savings jar.",
      "onboard.finish":     "Create account",
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
      // account modal
      "account.new":        "New account",
      "account.edit":       "Edit account",
      "account.name":       "Name",
      "account.appearance": "Icon & color",
      "account.balances":   "Balances",
      "account.addBalance": "+ Add currency",
      "account.notes":      "Notes (optional)",
      "account.delete":     "Delete",
      "account.startingBalance": "Starting balance (optional)",
      // transaction
      "tx.new":      "New transaction",
      "tx.edit":     "Edit transaction",
      "tx.type":     "Type",
      "tx.from":     "From account",
      "tx.to":       "To account",
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
      "forecast.total":     "All accounts",
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
      "stats.accountCount":   "{n} account(s)",
      // history
      "history.pending":   "Pending",
      "history.applied":   "Applied",
      "history.fromRule":  "Rule",
      "history.openRule":  "Open the source rule",
      "history.upcoming":  "Upcoming (next 30 days)",
      "history.recent":    "Recent",
      // detail
      "detail.editAccount":   "Edit account",
      "detail.addTx":      "Add transaction",
      "detail.addRule":    "Add rule",
      "detail.rules":      "Rules in this account",
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
      "add.title":"What would you like to do?",
      "add.account": "New account",
      "add.tx":   "Add Transaction",
      "add.rule": "Add Rule",
      "add.setBalance": "Update balance",
      // confirm
      "confirm.ok":           "Confirm",
      "confirm.deleteTitle":  "Delete this?",
      "confirm.deleteBody":   "This can't be undone.",
      "confirm.deleteOk":     "Delete",
      "confirm.resetTitle":   "Reset everything?",
      "confirm.resetBody":    "All your accounts, rules and history will be deleted.",
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
      // quick set balance
      "balance.title":       "Set balance",
      "balance.quickSet":    "Set balance",
      "balance.current":     "Current balance",
      "balance.new":         "New balance",
      "balance.adjustment":  "Adjustment",
      "balance.note":        "Note (optional)",
      "balance.defaultLabel":"Balance adjustment",
      // schedule
      "rule.schedule":          "Schedule",
      "rule.firstWillBe":       "First occurrence: {date}",
      "rule.timeOfDay":         "Time of day",
      "rule.allAmount":         "Use the entire source balance",
      "rule.position":          "Position",
      // Start
      "start.title":            "Start",
      "start.now":              "Now",
      "start.specific":         "Specific date & time",
      // How often
      "howOften.title":         "How often",
      "howOften.once":          "Once",
      "howOften.forever":       "Forever",
      "howOften.times":         "Fixed number",
      "howOften.numberOf":      "Number of times",
      "recurring.one":          "One-time",
      "recurring.endAtLabel":   "Stop on date (optional)",
      // Preview narratives
      "preview.title":          "Upcoming triggers",
      "preview.empty":          "No triggers — schedule won't fire.",
      "preview.showAllN":       "Show all {n} triggers",
      "preview.showAll":        "Show all triggers",
      "preview.collapse":       "Show fewer",
      // Interval label singular (n = 1)
      "every1.minute":          "every minute",
      "every1.hour":            "every hour",
      "every1.day":             "every day",
      "every1.week":            "every week",
      "every1.month":           "every month",
      "every1.year":            "every year",
      // Weekday "every"-style labels for the schedule sentence
      "every.weekday":          "every {day}",
      "every.weekdays":         "every {list}",
      // Pattern
      "pattern.title":          "Repeats",
      "pattern.interval":       "Custom interval",
      "pattern.weekdays":       "Specific weekday(s)",
      "pattern.dayOfPeriod":    "A specific day of month or year",
      "pattern.weekdayOfPeriod":"A specific weekday of month or year",
      "pattern.direction":      "Position",
      "pattern.dir.first":      "First",
      "pattern.dir.last":       "Last",
      "pattern.dir.nth":        "Nth (from start)",
      "pattern.dir.nthLast":    "Nth from end",
      "pattern.weekdays.label": "Weekdays",
      "pattern.day.label":      "Day",
      "pattern.weekday.label":  "Weekday position",
      "pattern.ofMonth":        "of every month",
      "pattern.ofYear":         "of every year",
      "weekdays.everyDay":      "Every day",
      "weekday.short.mon":      "Mon",
      "weekday.short.tue":      "Tue",
      "weekday.short.wed":      "Wed",
      "weekday.short.thu":      "Thu",
      "weekday.short.fri":      "Fri",
      "weekday.short.sat":      "Sat",
      "weekday.short.sun":      "Sun",
      // Extra validation
      "validation.patternRequired":  "Pick a pattern.",
      "validation.intervalAmount":   "Interval must be 1 or greater.",
      "validation.weekdaysRequired": "Pick at least one weekday.",
      "validation.unknownPattern":   "Unknown pattern.",
      "schedule.interval":      "Custom interval",
      "schedule.position":      "On a specific day",
      // Position composition
      "position.label":         "{ordinal} {day} of every {period}",
      "position.direction":     "Count from",
      "position.fromStart":     "Start",
      "position.fromEnd":       "End",
      "position.position":      "Position",
      "position.dayType":       "Day",
      "position.period":        "Period",
      "ord.last":               "Last",
      "ord.lastSuffix":         "last",
      "period.week":            "week",
      "period.month":           "month",
      "period.year":             "year",
      "weekday.any":            "day",
      "weekday.mon":            "Monday",
      "weekday.tue":            "Tuesday",
      "weekday.wed":            "Wednesday",
      "weekday.thu":            "Thursday",
      "weekday.fri":            "Friday",
      "weekday.sat":            "Saturday",
      "weekday.sun":            "Sunday",
      // Validation
      "validation.positionRequired":  "Please pick a position.",
      "validation.positionTooSmall":  "Position must be 1 or greater.",
      "validation.weekWeekdayOnce":   "A weekday occurs once per week — set position to 1.",
      "validation.weekDays":          "A week has only 7 days.",
      "validation.monthWeekdayMax":   "A weekday occurs at most 5 times in a month.",
      "validation.monthDaysMax":      "A month has at most 31 days.",
      "validation.monthWeekday5":     "Only some months have a 5th occurrence — months without it are skipped.",
      "validation.monthDayShort":     "Day {n} doesn't exist in some shorter months — those are skipped.",
      "validation.yearWeekdayMax":    "A weekday occurs at most 53 times in a year.",
      "validation.yearDaysMax":       "A year has at most 366 days.",
      "validation.yearWeekday53":     "Only some years have 53 of that weekday — others are skipped.",
      "validation.yearDay366":        "Day 366 only exists in leap years — others are skipped.",
      "validation.unknownPeriod":     "Unknown period.",
    },

    da: {
      name: "Danish", native: "Dansk",
      "tab.accounts":    "Konti",
      "tab.forecast": "Prognose",
      "tab.rules":    "Regler",
      "tab.history":  "Historik",
      "tab.stats":    "Statistik",
      "empty.title":      "Intet her endnu",
      "empty.body":       "Kom i gang ved at oprette din første konto.",
      "empty.cta":        "Tilføj en konto",
      "empty.rulesTitle": "Ingen tilbagevendende regler",
      "empty.rulesBody":  "Tilføj løn, husleje, abonnementer — alt der sker efter en plan.",
      "empty.rulesCta":   "Tilføj en regel",
      "empty.txTitle":    "Ingen transaktioner endnu",
      "empty.txBody":     "Engangs- og regelstyret aktivitet vises her.",
      "empty.txCta":      "Tilføj en transaktion",
      "empty.forecastTitle": "Tilføj en konto for at se prognosen",
      "empty.forecastBody":  "Når du har en konto og et par regler, dukker fremtiden op her.",
      "empty.statsTitle":  "Ingen data endnu",
      "empty.statsBody":   "Når pengene begynder at flyde, kommer der målinger her.",
      "onboard.welcomeSub": "Konti, tilbagevendende regler og en prognose du kan stole på.",
      "onboard.start":      "Kom i gang",
      "onboard.langTitle":  "Vælg sprog",
      "onboard.langSub":    "Du kan altid ændre det i indstillinger.",
      "onboard.currTitle":  "Dine valutaer",
      "onboard.currSub":    "Tilføj de valutaer du bruger. Bare koder — DKK, USD, BTC, hvad som helst.",
      "onboard.accountTitle":  "Din første konto",
      "onboard.accountSub":    "En konto er hvor som helst du opbevarer penge — en bankkonto, en pung, en sparebøsse.",
      "onboard.finish":     "Opret konto",
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
      "account.new":        "Ny konto",
      "account.edit":       "Rediger konto",
      "account.name":       "Navn",
      "account.appearance": "Ikon & farve",
      "account.balances":   "Saldi",
      "account.addBalance": "+ Tilføj valuta",
      "account.notes":      "Noter (valgfrit)",
      "account.delete":     "Slet",
      "account.startingBalance": "Startsaldo (valgfri)",
      "tx.new":      "Ny transaktion",
      "tx.edit":     "Rediger transaktion",
      "tx.type":     "Type",
      "tx.from":     "Fra konto",
      "tx.to":       "Til konto",
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
      "forecast.total":     "Alle konti",
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
      "stats.accountCount":   "{n} konto/konti",
      "history.pending":   "Afventer",
      "history.applied":   "Anvendt",
      "history.fromRule":  "Regel",
      "history.openRule":  "Åbn kilderegel",
      "history.upcoming":  "Kommende (næste 30 dage)",
      "history.recent":    "Nylig",
      "detail.editAccount":   "Rediger konto",
      "detail.addTx":      "Tilføj transaktion",
      "detail.addRule":    "Tilføj regel",
      "detail.rules":      "Regler i denne konto",
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
      "add.title":"Hvad vil du gøre?",
      "add.account": "Ny konto",
      "add.tx":   "Tilføj transaktion",
      "add.rule": "Tilføj regel",
      "add.setBalance": "Opdater saldo",
      "confirm.ok":           "Bekræft",
      "confirm.deleteTitle":  "Slet dette?",
      "confirm.deleteBody":   "Dette kan ikke fortrydes.",
      "confirm.deleteOk":     "Slet",
      "confirm.resetTitle":   "Nulstil alt?",
      "confirm.resetBody":    "Alle dine konti, regler og historik slettes.",
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
      "balance.title":       "Sæt saldo",
      "balance.quickSet":    "Sæt saldo",
      "balance.current":     "Nuværende saldo",
      "balance.new":         "Ny saldo",
      "balance.adjustment":  "Justering",
      "balance.note":        "Note (valgfri)",
      "balance.defaultLabel":"Saldojustering",
      "rule.schedule":          "Tidsplan",
      "rule.firstWillBe":       "Første forekomst: {date}",
      "rule.timeOfDay":         "Tidspunkt",
      "rule.allAmount":         "Brug hele kildens saldo",
      "rule.position":          "Position",
      "start.title":            "Start",
      "start.now":              "Nu",
      "start.specific":         "Bestemt dato og tid",
      "howOften.title":         "Hvor ofte",
      "howOften.once":          "Én gang",
      "howOften.forever":       "For altid",
      "howOften.times":         "Fast antal",
      "howOften.numberOf":      "Antal gange",
      "recurring.one":          "Engangs",
      "recurring.endAtLabel":   "Stop på dato (valgfri)",
      "preview.title":          "Kommende aktiveringer",
      "preview.empty":          "Ingen aktiveringer — tidsplanen vil ikke køre.",
      "preview.showAllN":       "Vis alle {n} aktiveringer",
      "preview.showAll":        "Vis alle aktiveringer",
      "preview.collapse":       "Vis færre",
      "every1.minute":          "hvert minut",
      "every1.hour":            "hver time",
      "every1.day":             "hver dag",
      "every1.week":            "hver uge",
      "every1.month":           "hver måned",
      "every1.year":            "hvert år",
      "every.weekday":          "hver {day}",
      "every.weekdays":         "hver {list}",
      "pattern.title":          "Gentager",
      "pattern.interval":       "Brugerdefineret interval",
      "pattern.weekdays":       "Bestemte ugedage",
      "pattern.dayOfPeriod":    "Bestemt dag i måned/år",
      "pattern.weekdayOfPeriod":"Bestemt ugedag i måned/år",
      "pattern.direction":      "Position",
      "pattern.dir.first":      "Første",
      "pattern.dir.last":       "Sidste",
      "pattern.dir.nth":        "N'te (fra start)",
      "pattern.dir.nthLast":    "N'te fra slutningen",
      "pattern.weekdays.label": "Ugedage",
      "pattern.day.label":      "Dag",
      "pattern.weekday.label":  "Ugedag-position",
      "pattern.ofMonth":        "i hver måned",
      "pattern.ofYear":         "hvert år",
      "weekdays.everyDay":      "Hver dag",
      "weekday.short.mon":      "Man",
      "weekday.short.tue":      "Tir",
      "weekday.short.wed":      "Ons",
      "weekday.short.thu":      "Tor",
      "weekday.short.fri":      "Fre",
      "weekday.short.sat":      "Lør",
      "weekday.short.sun":      "Søn",
      "validation.patternRequired":  "Vælg et mønster.",
      "validation.intervalAmount":   "Interval skal være 1 eller mere.",
      "validation.weekdaysRequired": "Vælg mindst én ugedag.",
      "validation.unknownPattern":   "Ukendt mønster.",
      "schedule.interval":      "Brugerdefineret interval",
      "schedule.position":      "På en bestemt dag",
      "position.label":         "{ordinal} {day} i hver {period}",
      "position.direction":     "Tæl fra",
      "position.fromStart":     "Start",
      "position.fromEnd":       "Slut",
      "position.position":      "Position",
      "position.dayType":       "Dag",
      "position.period":        "Periode",
      "ord.last":               "Sidste",
      "ord.lastSuffix":         "sidste",
      "period.week":            "uge",
      "period.month":           "måned",
      "period.year":            "år",
      "weekday.any":            "dag",
      "weekday.mon":            "mandag",
      "weekday.tue":            "tirsdag",
      "weekday.wed":            "onsdag",
      "weekday.thu":            "torsdag",
      "weekday.fri":            "fredag",
      "weekday.sat":            "lørdag",
      "weekday.sun":            "søndag",
      "validation.positionRequired":  "Vælg en position.",
      "validation.positionTooSmall":  "Positionen skal være 1 eller mere.",
      "validation.weekWeekdayOnce":   "En ugedag forekommer én gang om ugen — sæt positionen til 1.",
      "validation.weekDays":          "En uge har kun 7 dage.",
      "validation.monthWeekdayMax":   "En ugedag forekommer højst 5 gange i en måned.",
      "validation.monthDaysMax":      "En måned har højst 31 dage.",
      "validation.monthWeekday5":     "Kun nogle måneder har en 5. forekomst — måneder uden den springes over.",
      "validation.monthDayShort":     "Dag {n} findes ikke i alle måneder — kortere måneder springes over.",
      "validation.yearWeekdayMax":    "En ugedag forekommer højst 53 gange på et år.",
      "validation.yearDaysMax":       "Et år har højst 366 dage.",
      "validation.yearWeekday53":     "Kun nogle år har 53 af den ugedag — andre springes over.",
      "validation.yearDay366":        "Dag 366 findes kun i skudår — andre springes over.",
      "validation.unknownPeriod":     "Ukendt periode.",
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

  // Inline SVG right-arrow that vertically centers on the surrounding text
  // baseline (the unicode "→" character renders low in many system fonts).
  function arrowRight() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("class", "arrow-rt");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", "M13 5l-1.4 1.4L16.2 11H4v2h12.2l-4.6 4.6L13 19l7-7z");
    svg.appendChild(path);
    return svg;
  }

  // Adds an interval to a timestamp. For month/year units, clamps the
  // day-of-month to the last valid day of the target month so Jan 30 + 1 month
  // becomes Feb 28 (or 29 in leap years), not "Feb 30" overflowing to early March.
  function addInterval(ts, amount, unit) {
    if (UNIT_MS[unit]) return ts + amount * UNIT_MS[unit];
    const d = new Date(ts);
    const h = d.getHours(), mi = d.getMinutes(), sec = d.getSeconds(), ms = d.getMilliseconds();
    const origDay = d.getDate();
    if (unit === "month") {
      d.setDate(1);
      d.setMonth(d.getMonth() + amount);
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      d.setDate(Math.min(origDay, lastDay));
    } else if (unit === "year") {
      d.setDate(1);
      d.setFullYear(d.getFullYear() + amount);
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      d.setDate(Math.min(origDay, lastDay));
    }
    d.setHours(h, mi, sec, ms);
    return d.getTime();
  }
  function lastDayOfMonth(year, monthIdx) {
    return new Date(year, monthIdx + 1, 0).getDate();
  }
  function intervalLabel(every) {
    if (every.amount === 1) return t("every1." + every.unit);
    return t("every." + every.unit, { n: every.amount });
  }
  // Day-of-week constants for legacy migration helpers.
  const WEEKLY_DOW = { weeklySun: 0, weeklyMon: 1, weeklyTue: 2, weeklyWed: 3, weeklyThu: 4, weeklyFri: 5, weeklySat: 6 };
  const WEEKDAY_KEYS = ["sun","mon","tue","wed","thu","fri","sat"];

  // Legacy normalizer (schedule strings → position object) — kept for safety
  // for any rule that still has the old shape on load.
  function normalizeLegacySchedule(rule) {
    const s = rule.schedule;
    if (s === undefined || s === null || s === "interval" || s === "position") return;
    let p = null;
    if (WEEKLY_DOW[s] !== undefined) p = { fromEnd: false, n: 1, weekday: WEEKLY_DOW[s], period: "week" };
    else if (s === "firstOfMonth")   p = { fromEnd: false, n: 1, weekday: null,            period: "month" };
    else if (s === "lastOfMonth")    p = { fromEnd: true,  n: 1, weekday: null,            period: "month" };
    else if (s === "firstOfYear")    p = { fromEnd: false, n: 1, weekday: null,            period: "year"  };
    else if (s === "lastOfYear")     p = { fromEnd: true,  n: 1, weekday: null,            period: "year"  };
    if (p) { rule.schedule = "position"; rule.position = p; }
  }

  // Convert legacy (schedule + position) into the new rule.pattern shape.
  function patternFromLegacy(rule) {
    if (rule.pattern) return rule.pattern;
    normalizeLegacySchedule(rule);
    if (!rule.schedule || rule.schedule === "interval") {
      return { type: "interval", every: rule.every || { amount: 1, unit: "month" } };
    }
    if (rule.schedule === "position" && rule.position) {
      const p = rule.position;
      if (p.weekday == null && (p.period === "month" || p.period === "year")) {
        return { type: "dayOfPeriod", period: p.period, fromEnd: !!p.fromEnd, n: p.n || 1 };
      }
      if (p.weekday != null && p.period === "week") {
        return { type: "weekdays", weekdays: [p.weekday] };
      }
      if (p.weekday != null && (p.period === "month" || p.period === "year")) {
        return { type: "weekdayOfPeriod", period: p.period, fromEnd: !!p.fromEnd, n: p.n || 1, weekdays: [p.weekday] };
      }
    }
    return { type: "interval", every: rule.every || { amount: 1, unit: "month" } };
  }

  function _patternPeriod(pattern) {
    if (pattern.type === "weekdays") return "week";
    return pattern.period; // dayOfPeriod / weekdayOfPeriod
  }
  function _ruleTimeOfDay(rule) {
    if (rule.timeOfDay && Number.isInteger(rule.timeOfDay.h)) {
      return { h: rule.timeOfDay.h, mi: rule.timeOfDay.mi || 0 };
    }
    const d = new Date(rule.startAt);
    return { h: d.getHours(), mi: d.getMinutes() };
  }

  // Enumerate all days in the period that contains refTs, at the given time-of-day.
  function _daysInPeriod(period, refTs, h, mi) {
    const ref = new Date(refTs);
    const out = [];
    if (period === "week") {
      const dow = ref.getDay();
      const offsetToMon = (dow === 0 ? -6 : 1 - dow);
      const start = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + offsetToMon);
      for (let i = 0; i < 7; i++) out.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i, h, mi, 0, 0));
    } else if (period === "month") {
      const y = ref.getFullYear(), mo = ref.getMonth();
      const last = new Date(y, mo + 1, 0).getDate();
      for (let day = 1; day <= last; day++) out.push(new Date(y, mo, day, h, mi, 0, 0));
    } else if (period === "year") {
      const y = ref.getFullYear();
      const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
      const total = isLeap ? 366 : 365;
      for (let i = 0; i < total; i++) out.push(new Date(y, 0, 1 + i, h, mi, 0, 0));
    }
    return out;
  }
  function _nextPeriodRef(period, refTs) {
    const d = new Date(refTs);
    if (period === "week") d.setDate(d.getDate() + 7);
    else if (period === "month") d.setMonth(d.getMonth() + 1, 1);
    else if (period === "year")  d.setFullYear(d.getFullYear() + 1, 0, 1);
    return d.getTime();
  }

  // All occurrence timestamps the rule's pattern produces within the period
  // containing refTs (chronological). May be empty if the pattern doesn't fire
  // in that period (e.g. 5th Tuesday in a 4-Tuesday month).
  function _occurrencesInPeriod(rule, refTs) {
    const pat = rule.pattern || patternFromLegacy(rule);
    const { h, mi } = _ruleTimeOfDay(rule);
    if (pat.type === "weekdays") {
      const wds = pat.weekdays || [];
      return _daysInPeriod("week", refTs, h, mi).filter(d => wds.includes(d.getDay())).map(d => d.getTime());
    }
    if (pat.type === "dayOfPeriod") {
      let days = _daysInPeriod(pat.period, refTs, h, mi);
      if (pat.fromEnd) days = days.slice().reverse();
      const pick = days[(pat.n || 1) - 1];
      return pick ? [pick.getTime()] : [];
    }
    if (pat.type === "weekdayOfPeriod") {
      const allDays = _daysInPeriod(pat.period, refTs, h, mi);
      const out = [];
      for (const wd of (pat.weekdays || [])) {
        let days = allDays.filter(d => d.getDay() === wd);
        if (pat.fromEnd) days = days.slice().reverse();
        const pick = days[(pat.n || 1) - 1];
        if (pick) out.push(pick.getTime());
      }
      return out.sort((a, b) => a - b);
    }
    return [];
  }

  function ruleFirstOccurrence(rule) {
    if (rule.recurring === false) return rule.startAt;
    const pat = rule.pattern || patternFromLegacy(rule);
    if (pat.type === "interval") return rule.startAt;
    const period = _patternPeriod(pat);
    let ref = rule.startAt;
    let safety = 0;
    while (safety++ < SAFETY_ITERATIONS) {
      const occs = _occurrencesInPeriod(rule, ref);
      for (const ts of occs) {
        if (ts >= rule.startAt) return ts;
      }
      ref = _nextPeriodRef(period, ref);
    }
    return null;
  }

  // n-th occurrence (n=0 is first). Returns null when no more occurrences
  // (one-time rule beyond first, or maxOccurrences exhausted).
  function nthOccurrence(rule, n) {
    if (rule.recurring === false) return n === 0 ? rule.startAt : null;
    if (rule.maxOccurrences != null && n >= rule.maxOccurrences) return null;
    const pat = rule.pattern || patternFromLegacy(rule);
    if (pat.type === "interval") {
      if (n === 0) return rule.startAt;
      return addInterval(rule.startAt, n * pat.every.amount, pat.every.unit);
    }
    const period = _patternPeriod(pat);
    let ref = rule.startAt;
    let safety = 0;
    let counted = 0;
    while (safety++ < SAFETY_ITERATIONS) {
      const occs = _occurrencesInPeriod(rule, ref).filter(ts => ts >= rule.startAt);
      for (const ts of occs) {
        if (counted === n) return ts;
        counted++;
      }
      ref = _nextPeriodRef(period, ref);
    }
    return null;
  }

  // Renders an ordinal phrase, e.g. "1st", "2nd Last", "Sidste", "3. sidste".
  function ordinalText(n) {
    if (state.settings.lang === "da") return n + ".";
    const rem100 = n % 100;
    if (rem100 >= 11 && rem100 <= 13) return n + "th";
    switch (n % 10) {
      case 1: return n + "st";
      case 2: return n + "nd";
      case 3: return n + "rd";
      default: return n + "th";
    }
  }
  function ordinalLabel(n, fromEnd) {
    if (fromEnd) {
      if (n === 1) return t("ord.last");
      return ordinalText(n) + " " + t("ord.lastSuffix");
    }
    return ordinalText(n);
  }

  function _weekdayListLabel(weekdays) {
    return weekdays.slice().sort().map(w => t("weekday.short." + WEEKDAY_KEYS[w])).join(", ");
  }

  // Human-readable schedule description used in rule rows and previews.
  function scheduleLabel(rule) {
    if (rule.recurring === false) return t("recurring.one");
    const pat = rule.pattern || patternFromLegacy(rule);
    if (pat.type === "interval") return intervalLabel(pat.every);
    if (pat.type === "weekdays") {
      const wds = pat.weekdays || [];
      if (wds.length === 7) return t("weekdays.everyDay");
      if (wds.length === 1) return t("every.weekday", { day: t("weekday." + WEEKDAY_KEYS[wds[0]]) });
      return t("every.weekdays", { list: _weekdayListLabel(wds) });
    }
    const ordinal = ordinalLabel(pat.n || 1, !!pat.fromEnd);
    if (pat.type === "dayOfPeriod") {
      return t("position.label", { ordinal, day: t("weekday.any"), period: t("period." + pat.period) });
    }
    if (pat.type === "weekdayOfPeriod") {
      const wds = pat.weekdays || [];
      const label = wds.length === 1
        ? t("weekday." + WEEKDAY_KEYS[wds[0]])
        : _weekdayListLabel(wds);
      return t("position.label", { ordinal, day: label, period: t("period." + pat.period) });
    }
    return "";
  }

  // Reports validity for a pattern. Returns { ok, level, key, vars? }.
  function patternValidity(pat) {
    if (!pat) return { ok: false, level: "error", key: "validation.patternRequired" };
    if (pat.type === "interval") {
      const a = pat.every?.amount;
      if (!Number.isInteger(a) || a < 1) return { ok: false, level: "error", key: "validation.intervalAmount" };
      return { ok: true, level: null };
    }
    if (pat.type === "weekdays") {
      if (!pat.weekdays || !pat.weekdays.length) return { ok: false, level: "error", key: "validation.weekdaysRequired" };
      return { ok: true, level: null };
    }
    if (pat.type === "dayOfPeriod") {
      const n = pat.n;
      if (!Number.isInteger(n) || n < 1) return { ok: false, level: "error", key: "validation.positionTooSmall" };
      if (pat.period === "month") {
        if (n > 31) return { ok: false, level: "error", key: "validation.monthDaysMax" };
        if (n > 28) return { ok: true,  level: "warn",  key: "validation.monthDayShort", vars: { n } };
      } else if (pat.period === "year") {
        if (n > 366) return { ok: false, level: "error", key: "validation.yearDaysMax" };
        if (n === 366) return { ok: true, level: "warn", key: "validation.yearDay366" };
      }
      return { ok: true, level: null };
    }
    if (pat.type === "weekdayOfPeriod") {
      if (!pat.weekdays || !pat.weekdays.length) return { ok: false, level: "error", key: "validation.weekdaysRequired" };
      const n = pat.n;
      if (!Number.isInteger(n) || n < 1) return { ok: false, level: "error", key: "validation.positionTooSmall" };
      if (pat.period === "month") {
        if (n > 5) return { ok: false, level: "error", key: "validation.monthWeekdayMax" };
        if (n === 5) return { ok: true, level: "warn", key: "validation.monthWeekday5" };
      } else if (pat.period === "year") {
        if (n > 53) return { ok: false, level: "error", key: "validation.yearWeekdayMax" };
        if (n === 53) return { ok: true, level: "warn", key: "validation.yearWeekday53" };
      }
      return { ok: true, level: null };
    }
    return { ok: false, level: "error", key: "validation.unknownPattern" };
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
      schemaVersion: 4,
      onboardingDone: false,
      settings: { lang, theme: "auto" },
      currencies: defaultCurrencies(lang),
      categories: [],
      accounts: [],
      rules: [],
      transactions: [],
      activeTab: "accounts",
      forecastRange: "month",     // week | month | year | custom
      forecastCustom: null,       // timestamp
      detailAccountId: null,         // when an account detail view is open
    };
  };

  // Compute how many occurrences have already happened given rule.lastRunAt.
  // For exact units (minute/hour/day/week) there's no drift, so we compare
  // strictly against lastRunAt. For month/year we add an approximate buffer
  // so any drifted-but-already-applied occurrence from older code doesn't get
  // re-applied.
  function deriveOccurrenceCount(r) {
    if (!r.lastRunAt) return 0;
    const pat = r.pattern || patternFromLegacy(r);
    let cutoff = r.lastRunAt;
    if (pat.type === "interval" && !UNIT_MS[pat.every?.unit]) {
      if (pat.every?.unit === "month") cutoff += (pat.every?.amount || 1) * 30  * UNIT_MS.day;
      if (pat.every?.unit === "year")  cutoff += (pat.every?.amount || 1) * 365 * UNIT_MS.day;
    }
    let n = 0, safety = 0;
    while (safety++ < SAFETY_ITERATIONS && nthOccurrence(r, n) != null && nthOccurrence(r, n) <= cutoff) n++;
    return n;
  }

  function migrate(loaded) {
    if (!loaded) return null;
    const fromVersion = loaded.schemaVersion || 1;
    // v2 → v3: rename silos → accounts and all *Silo* fields on rules and
    // transactions. Done up front so the rest of migration sees the new shape.
    if (loaded.silos !== undefined && loaded.accounts === undefined) {
      loaded.accounts = loaded.silos;
      delete loaded.silos;
    }
    if (loaded.detailSiloId !== undefined) {
      if (loaded.detailAccountId === undefined) loaded.detailAccountId = loaded.detailSiloId;
      delete loaded.detailSiloId;
    }
    if (loaded.activeTab === "silos") loaded.activeTab = "accounts";
    (loaded.rules || []).forEach(r => {
      if (r.fromSiloId !== undefined) { r.fromAccountId = r.fromSiloId; delete r.fromSiloId; }
      if (r.toSiloId   !== undefined) { r.toAccountId   = r.toSiloId;   delete r.toSiloId; }
    });
    (loaded.transactions || []).forEach(tx => {
      if (tx.fromSiloId !== undefined) { tx.fromAccountId = tx.fromSiloId; delete tx.fromSiloId; }
      if (tx.toSiloId   !== undefined) { tx.toAccountId   = tx.toSiloId;   delete tx.toSiloId; }
    });

    loaded.settings ||= { lang: "en", theme: "auto" };
    loaded.settings.lang ||= "en";
    loaded.settings.theme ||= "auto";
    loaded.currencies ||= defaultCurrencies(loaded.settings.lang);
    loaded.categories ||= [];
    loaded.accounts ||= [];
    loaded.rules ||= [];
    loaded.transactions ||= [];
    loaded.activeTab ||= "accounts";
    loaded.forecastRange ||= "month";
    if (loaded.forecastCustom === undefined) loaded.forecastCustom = null;
    loaded.detailAccountId ??= null;
    // defensive
    loaded.accounts.forEach(s => { s.balances ||= {}; });
    loaded.rules.forEach(r => {
      if (r.active === undefined) r.active = true;
      if (r.schedule == null) r.schedule = "interval";
      normalizeLegacySchedule(r);
      if (r.amountMode == null) r.amountMode = "fixed";
      // v4: hoist legacy {schedule + position} into rule.pattern + rule.recurring + rule.timeOfDay.
      if (r.recurring === undefined) r.recurring = true;
      if (r.maxOccurrences === undefined) r.maxOccurrences = null;
      if (!r.pattern) r.pattern = patternFromLegacy(r);
      if (!r.timeOfDay) {
        const d = new Date(r.startAt);
        r.timeOfDay = { h: d.getHours(), mi: d.getMinutes() };
      }
      if (r.occurrenceCount == null) r.occurrenceCount = deriveOccurrenceCount(r);
    });
    (loaded.transactions || []).forEach(tx => {
      if (tx.amountMode == null) tx.amountMode = "fixed";
    });
    // v1 → v2: previous migration over-skipped a future occurrence for rules
    // with non-drifting units (week/day/hour/minute) because it always added a
    // "one full interval" buffer. Re-derive those specifically.
    if (fromVersion < 2) {
      loaded.rules.forEach(r => {
        if (r.lastRunAt && r.pattern?.type === "interval" && UNIT_MS[r.pattern.every?.unit]) {
          r.occurrenceCount = deriveOccurrenceCount(r);
        }
      });
    }
    loaded.schemaVersion = 4;
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
  const accountById     = id => state.accounts.find(s => s.id === id);
  const categoryById = id => state.categories.find(c => c.id === id);

  function accountName(id) {
    const s = accountById(id);
    return s ? s.name : "—";
  }
  function categoryName(c) {
    return (c?.name && c.name.trim()) || t("category.unnamed");
  }

  /* ============================================================
     ENGINE — applying rules and pending transactions
     ============================================================ */
  function ensureBalance(account, ccy) {
    if (account.balances[ccy] == null) account.balances[ccy] = 0;
  }
  function applyOp(type, fromAccountId, toAccountId, amount, currency) {
    if (type === "income") {
      const to = accountById(toAccountId);
      if (to) { ensureBalance(to, currency); to.balances[currency] += amount; }
    } else if (type === "expense") {
      const from = accountById(fromAccountId);
      if (from) { ensureBalance(from, currency); from.balances[currency] -= amount; }
    } else if (type === "transfer") {
      const from = accountById(fromAccountId);
      const to   = accountById(toAccountId);
      if (from) { ensureBalance(from, currency); from.balances[currency] -= amount; }
      if (to)   { ensureBalance(to, currency);   to.balances[currency]   += amount; }
    }
  }

  // Resolves the effective amount for an event taking amountMode into account.
  // For "all", reads the current balance of the source account/currency.
  function effectiveAmount(item) {
    if ((item.amountMode || "fixed") !== "all") return item.amount;
    if (!item.fromAccountId) return 0;
    const from = accountById(item.fromAccountId);
    return Math.max(0, (from?.balances?.[item.currency]) || 0);
  }

  // Apply all overdue rule occurrences and pending transactions in strict
  // chronological order. Order matters for "all" amount rules — a transfer-all
  // that fires after an income tops up the source before the sweep, etc.
  function settleNow() {
    const now = Date.now();
    const items = [];
    state.transactions.forEach(tx => {
      if (tx.status === "pending" && tx.at <= now) items.push({ at: tx.at, kind: "tx", tx });
    });
    let warned = false;
    state.rules.forEach(rule => {
      if (!rule.active) return;
      let count = rule.occurrenceCount || 0;
      let next = nthOccurrence(rule, count);
      let safety = 0;
      while (next != null && next <= now && (!rule.endAt || next <= rule.endAt)) {
        if (++safety > SAFETY_ITERATIONS) {
          if (!warned) { toast(t("toast.tooMany")); warned = true; }
          break;
        }
        items.push({ at: next, kind: "rule", rule, count });
        count++;
        next = nthOccurrence(rule, count);
      }
    });
    items.sort((a, b) => {
      if (a.at !== b.at) return a.at - b.at;
      // tx before rule at same instant; arbitrary but stable
      return a.kind === "tx" ? -1 : 1;
    });

    items.forEach(ev => {
      if (ev.kind === "tx") {
        const amt = effectiveAmount(ev.tx);
        if (amt > 0) {
          applyOp(ev.tx.type, ev.tx.fromAccountId, ev.tx.toAccountId, amt, ev.tx.currency);
          ev.tx.amount = amt; // freeze the resolved amount on the record
        }
        ev.tx.status = "applied";
      } else {
        const r = ev.rule;
        const amt = effectiveAmount(r);
        if (amt > 0) {
          applyOp(r.type, r.fromAccountId, r.toAccountId, amt, r.currency);
          state.transactions.push({
            id: cryptoId(),
            type: r.type,
            fromAccountId: r.fromAccountId,
            toAccountId: r.toAccountId,
            amount: amt,
            currency: r.currency,
            at: ev.at,
            status: "applied",
            categoryId: r.categoryId || null,
            label: r.label || "",
            ruleId: r.id,
            amountMode: r.amountMode || "fixed",
            createdAt: Date.now(),
          });
        }
        r.lastRunAt = ev.at;
        r.occurrenceCount = ev.count + 1;
      }
    });
    if (items.length) save();
  }

  // Back-compat shims for tests that previously called these directly.
  function applyDueTransactions(now) { /* deprecated — settleNow covers this */ settleNow(); }
  function applyDueRules(now)        { /* deprecated — settleNow covers this */ settleNow(); }

  /* ============================================================
     FORECAST
     ============================================================ */
  // Future occurrences for a rule between (>now) and (<=targetTs)
  function futureRuleOccurrences(rule, now, targetTs) {
    const out = [];
    if (!rule.active) return out;
    let count = rule.occurrenceCount || 0;
    let next = nthOccurrence(rule, count);
    let safety = 0;
    while (next <= now) {
      if (++safety > SAFETY_ITERATIONS) return out;
      count++;
      next = nthOccurrence(rule, count);
    }
    while (next <= targetTs && (!rule.endAt || next <= rule.endAt)) {
      if (++safety > SAFETY_ITERATIONS) break;
      out.push(next);
      count++;
      next = nthOccurrence(rule, count);
    }
    return out;
  }

  // Simulates the entire system forward from now to targetTs. Required so
  // "all balance" rules use the *projected* source balance at the time the
  // rule fires, not the current balance. Returns per-account views.
  function forecastAll(targetTs) {
    const now = Date.now();
    const balances = {};
    state.accounts.forEach(a => balances[a.id] = { ...a.balances });

    // Collect future events
    const items = [];
    state.transactions.forEach(tx => {
      if (tx.status === "pending" && tx.at > now && tx.at <= targetTs) {
        items.push({
          at: tx.at, type: tx.type,
          fromAccountId: tx.fromAccountId, toAccountId: tx.toAccountId,
          amount: tx.amount, currency: tx.currency,
          amountMode: tx.amountMode || "fixed",
          label: tx.label || "", source: "tx",
        });
      }
    });
    state.rules.forEach(rule => {
      if (!rule.active) return;
      const occs = futureRuleOccurrences(rule, now, targetTs);
      occs.forEach(at => {
        items.push({
          at, type: rule.type,
          fromAccountId: rule.fromAccountId, toAccountId: rule.toAccountId,
          amount: rule.amount, currency: rule.currency,
          amountMode: rule.amountMode || "fixed",
          label: rule.label || "", source: "rule",
        });
      });
    });
    items.sort((a, b) => {
      if (a.at !== b.at) return a.at - b.at;
      return a.source === "tx" ? -1 : 1;
    });

    const perAccount = {};
    state.accounts.forEach(a => {
      perAccount[a.id] = {
        now: { ...a.balances },
        projected: { ...balances[a.id] },
        perCurrencyFlow: {},
        events: [],
      };
    });

    const recordDelta = (acctId, ccy, delta, ev) => {
      const b = balances[acctId];
      if (!b) return;
      b[ccy] = (b[ccy] || 0) + delta;
      const pa = perAccount[acctId];
      pa.projected[ccy] = b[ccy];
      pa.events.push({ at: ev.at, delta: { [ccy]: delta }, label: ev.label, type: ev.type, source: ev.source });
      pa.perCurrencyFlow[ccy] ||= { in: 0, out: 0 };
      if (delta > 0) pa.perCurrencyFlow[ccy].in  += delta;
      else            pa.perCurrencyFlow[ccy].out += -delta;
    };

    items.forEach(ev => {
      let amount = ev.amount;
      if (ev.amountMode === "all" && ev.fromAccountId) {
        const fromB = balances[ev.fromAccountId];
        amount = Math.max(0, (fromB && fromB[ev.currency]) || 0);
      }
      if (amount === 0) return;
      if (ev.type === "income") {
        if (ev.toAccountId)   recordDelta(ev.toAccountId,   ev.currency,  amount, ev);
      } else if (ev.type === "expense") {
        if (ev.fromAccountId) recordDelta(ev.fromAccountId, ev.currency, -amount, ev);
      } else if (ev.type === "transfer") {
        if (ev.fromAccountId) recordDelta(ev.fromAccountId, ev.currency, -amount, ev);
        if (ev.toAccountId)   recordDelta(ev.toAccountId,   ev.currency,  amount, ev);
      }
    });

    return { perAccount, atNow: now, targetTs };
  }

  // Per-account forecast — runs the global simulation and extracts one account.
  function forecastAccount(accountId, targetTs) {
    const all = forecastAll(targetTs);
    const pa = all.perAccount[accountId];
    if (!pa) return { now: {}, projected: {}, perCurrencyFlow: {}, events: [], atNow: all.atNow, targetTs };
    return { ...pa, atNow: all.atNow, targetTs };
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
    if (currentStep === 4) refreshOnboardingAccountCurrencies();
  }
  function refreshOnboardingAccountCurrencies() {
    const sel = $("#onboardAccountCcy");
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

      const name = $("#onboardAccountName").value.trim() || "Checking";
      const amt = parseFloat($("#onboardAccountAmt").value);
      const ccy = $("#onboardAccountCcy").value || state.currencies[0].code;

      const account = {
        id: cryptoId(),
        name, icon: "🏦", color: "#14B8A6", notes: "",
        balances: {},
        createdAt: Date.now(),
      };
      if (!isNaN(amt) && amt !== 0) account.balances[ccy] = amt;
      state.accounts.push(account);

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
      code.oninput = (e) => { c.code = e.target.value.toUpperCase().trim(); save(); render(); refreshOnboardingAccountCurrencies(); };
      const name = el("input", { type: "text", value: c.name || "", maxlength: 30, placeholder: t("currency.name") });
      name.oninput = (e) => { c.name = e.target.value; save(); };
      const del = el("button", { class: "del", type: "button", title: "Delete", "aria-label": "Delete",
        html: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 7h12l-1 13H7L6 7Zm3-3h6v2H9V4Z"/></svg>' });
      del.onclick = () => {
        if (state.currencies.length <= 1) return;
        state.currencies.splice(idx, 1);
        save();
        renderCurrencyEditor(container);
        refreshOnboardingAccountCurrencies();
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
      refreshOnboardingAccountCurrencies();
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
  // presetAccountId optional. When provided, that account is preselected
  // as source/destination on tx/rule and a "Set balance" entry appears.
  function openChooser(presetAccountId) {
    const dlg = $("#chooser");
    const setBalanceBtn = $("#chooseSetBalance");
    const preset = presetAccountId ? accountById(presetAccountId) : null;
    setBalanceBtn.hidden = !preset;
    dlg.hidden = false;
    const cleanup = () => {
      dlg.hidden = true;
      $("#chooseAccount").onclick = null;
      $("#chooseTx").onclick = null;
      $("#chooseRule").onclick = null;
      setBalanceBtn.onclick = null;
      $$("[data-cancel]", dlg).forEach(b => b.onclick = null);
    };
    $("#chooseAccount").onclick = () => { cleanup(); openAccountModal(); };
    $("#chooseTx").onclick   = () => { cleanup(); openTxModal(null, presetAccountId); };
    $("#chooseRule").onclick = () => { cleanup(); openRuleModal(null, presetAccountId); };
    setBalanceBtn.onclick = () => {
      cleanup();
      if (!preset) return;
      const ccy = primaryCurrency(preset);
      openSetBalanceModal(preset, ccy);
    };
    $$("[data-cancel]", dlg).forEach(b => b.onclick = cleanup);
  }

  /* ============================================================
     SILO MODAL
     ============================================================ */
  let editingAccountId = null;
  let pendingAccountIcon = null;

  function openAccountModal(account) {
    editingAccountId = account?.id || null;
    pendingAccountIcon = account?.icon || "🏦";
    $("#accountModalTitle").textContent = t(account ? "account.edit" : "account.new");
    $("#accountName").value = account?.name || "";
    $("#accountColor").value = account?.color || "#14B8A6";
    $("#accountNotes").value = account?.notes || "";
    $("#accountIconBtn").textContent = pendingAccountIcon || "＋";
    renderAccountBalanceRows(account?.balances || {});
    $("#deleteAccountBtn").hidden = !account;
    $("#accountModal").hidden = false;
    setTimeout(() => $("#accountName").focus(), 60);
  }
  function closeAccountModal() {
    $("#accountModal").hidden = true;
    editingAccountId = null;
  }
  function renderAccountBalanceRows(balances) {
    const container = $("#accountBalanceRows");
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
  function bindAccountModal() {
    $$("[data-close-modal]", $("#accountModal")).forEach(b => b.onclick = closeAccountModal);
    $("#accountIconBtn").onclick = () => openIconPicker(ic => {
      pendingAccountIcon = ic;
      $("#accountIconBtn").textContent = ic || "＋";
    }, pendingAccountIcon);
    $("#addBalanceRow").onclick = () => $("#accountBalanceRows").appendChild(makeBalanceRow("", ""));
    $("#accountForm").onsubmit = (e) => {
      e.preventDefault();
      const name = $("#accountName").value.trim();
      if (!name) return;
      const color = $("#accountColor").value;
      const notes = $("#accountNotes").value.trim();
      const balances = {};
      $$(".balance-edit-row", $("#accountBalanceRows")).forEach(row => {
        const code = row.querySelector("select").value;
        const v = parseFloat(row.querySelector('input[type="number"]').value);
        if (!code) return;
        const amount = isNaN(v) ? 0 : v;
        balances[code] = (balances[code] || 0) + amount;
      });
      if (editingAccountId) {
        const s = accountById(editingAccountId);
        if (s) {
          Object.assign(s, { name, color, notes, icon: pendingAccountIcon, balances });
          toast(t("toast.updated"));
        }
      } else {
        state.accounts.push({
          id: cryptoId(),
          name, color, notes,
          icon: pendingAccountIcon || "🏦",
          balances,
          createdAt: Date.now(),
        });
        toast(t("toast.created"));
      }
      save();
      closeAccountModal();
      render();
    };
    $("#deleteAccountBtn").onclick = async () => {
      if (!editingAccountId) return;
      const ok = await confirmDialog({
        title: t("confirm.deleteTitle"),
        body: t("confirm.deleteBody"),
        confirmText: t("confirm.deleteOk"),
        danger: true,
      });
      if (!ok) return;
      const id = editingAccountId;
      // remove any rules and transactions that reference this account
      state.rules = state.rules.filter(r => r.fromAccountId !== id && r.toAccountId !== id);
      state.transactions = state.transactions.filter(x => x.fromAccountId !== id && x.toAccountId !== id);
      state.accounts = state.accounts.filter(s => s.id !== id);
      if (state.detailAccountId === id) state.detailAccountId = null;
      save();
      closeAccountModal();
      if (state.detailAccountId === null) closeDetail();
      render();
      toast(t("toast.deleted"));
    };
  }

  /* ============================================================
     TX MODAL
     ============================================================ */
  let editingTxId = null;
  let txType = "expense";

  function openTxModal(tx, presetAccountId) {
    editingTxId = tx?.id || null;
    txType = tx?.type || "expense";
    $("#txModalTitle").textContent = t(tx ? "tx.edit" : "tx.new");
    updateTxTypeUI();
    refreshTxAccountOptions(tx, presetAccountId);
    refreshTxCategoryOptions();
    fillTxCurrencyOptions(tx?.currency);
    $("#txAmount").value = tx?.amount ?? "";
    $("#txAllAmount").checked = (tx?.amountMode === "all");
    $("#txWhen").value = toLocalInputValue(tx?.at ?? Date.now());
    $("#txCategory").value = tx?.categoryId || "";
    $("#txLabel").value = tx?.label || "";
    $("#deleteTxBtn").hidden = !tx;
    updateTxAmountUI();
    $("#txModal").hidden = false;
    setTimeout(() => $("#txAmount").focus(), 60);
  }
  function updateTxAmountUI() {
    const allowAll = txType !== "income";
    $("#txAllAmountField").hidden = !allowAll;
    if (!allowAll) $("#txAllAmount").checked = false;
    $("#txAmount").disabled = $("#txAllAmount").checked;
    $("#txAmount").required = !$("#txAllAmount").checked;
    $("#txAmount").placeholder = $("#txAllAmount").checked ? t("rule.allAmount") : "";
  }
  function closeTxModal() {
    $("#txModal").hidden = true;
    editingTxId = null;
  }
  function updateTxTypeUI() {
    $$("#txTypeSeg button").forEach(b => b.classList.toggle("is-active", b.dataset.type === txType));
    $("#txFromField").hidden = (txType === "income");
    $("#txToField").hidden   = (txType === "expense");
    $("#txFromField").querySelector("span").textContent = t("tx.from");
    $("#txToField").querySelector("span").textContent = t("tx.to");
    updateTxAmountUI();
  }
  function refreshTxAccountOptions(tx, presetAccountId) {
    const from = $("#txFrom"); from.innerHTML = "";
    const to   = $("#txTo");   to.innerHTML = "";
    state.accounts.forEach(s => {
      from.appendChild(el("option", { value: s.id }, (s.icon ? s.icon + " " : "") + s.name));
      to  .appendChild(el("option", { value: s.id }, (s.icon ? s.icon + " " : "") + s.name));
    });
    if (tx) { from.value = tx.fromAccountId || ""; to.value = tx.toAccountId || ""; }
    else {
      from.value = presetAccountId || (state.accounts[0]?.id || "");
      to.value = presetAccountId || (state.accounts[0]?.id || "");
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
    $("#txAllAmount").addEventListener("change", updateTxAmountUI);

    $("#txForm").onsubmit = (e) => {
      e.preventDefault();
      const allMode = $("#txAllAmount").checked && txType !== "income";
      const formAmount = parseFloat($("#txAmount").value);
      if (!allMode && (isNaN(formAmount) || formAmount <= 0)) return;
      const currency = $("#txCurrency").value;
      const at = fromLocalInputValue($("#txWhen").value) || Date.now();
      const categoryId = $("#txCategory").value || null;
      const label = $("#txLabel").value.trim();
      const fromAccountId = (txType === "income") ? null : $("#txFrom").value;
      const toAccountId   = (txType === "expense") ? null : $("#txTo").value;
      if (txType === "transfer" && fromAccountId === toAccountId) {
        alert("From and To must differ.");
        return;
      }
      const amountMode = allMode ? "all" : "fixed";

      // Helper to resolve the amount for "all" using the current source balance
      const resolveAmount = (storedAmount, mode, fromId, ccy) => {
        if (mode !== "all") return storedAmount;
        const from = accountById(fromId);
        return Math.max(0, (from?.balances?.[ccy]) || 0);
      };

      if (editingTxId) {
        const existing = state.transactions.find(x => x.id === editingTxId);
        if (existing) {
          // Reverse previous (if applied) using the recorded amount; "all" tx
          // already has the resolved amount stored.
          if (existing.status === "applied") {
            applyOp(reverseType(existing.type), existing.toAccountId, existing.fromAccountId, existing.amount, existing.currency);
          }
          const baseAmount = allMode ? 0 : formAmount;
          Object.assign(existing, { type: txType, fromAccountId, toAccountId, amount: baseAmount, currency, at, categoryId, label, amountMode });
          existing.status = (at <= Date.now()) ? "applied" : "pending";
          if (existing.status === "applied") {
            const amt = resolveAmount(existing.amount, existing.amountMode, existing.fromAccountId, existing.currency);
            applyOp(existing.type, existing.fromAccountId, existing.toAccountId, amt, existing.currency);
            existing.amount = amt; // freeze resolved amount
          }
        }
        toast(t("toast.updated"));
      } else {
        const status = (at <= Date.now()) ? "applied" : "pending";
        const baseAmount = allMode ? 0 : formAmount;
        const tx = {
          id: cryptoId(),
          type: txType, fromAccountId, toAccountId,
          amount: baseAmount, currency, at, status, categoryId, label,
          ruleId: null, amountMode,
          createdAt: Date.now(),
        };
        state.transactions.push(tx);
        if (status === "applied") {
          const amt = resolveAmount(tx.amount, tx.amountMode, tx.fromAccountId, tx.currency);
          applyOp(tx.type, tx.fromAccountId, tx.toAccountId, amt, tx.currency);
          tx.amount = amt; // freeze
        }
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
        applyOp(reverseType(existing.type), existing.toAccountId, existing.fromAccountId, existing.amount, existing.currency);
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
    // applyOp uses: income->toAccount +amt; expense->fromAccount -amt; transfer->from -amt, to +amt
    // We want to undo: income should subtract from the original toAccount;
    // expense should add to original fromAccount; transfer should flip directions.
    // The cleanest is: call applyOp with type=opposite + same accounts
    if (type === "income")   return "expense";    // applied as expense from original toAccount
    if (type === "expense")  return "income";     // applied as income to original fromAccount? But applyOp uses fromAccountId for expense.
    return "transfer";                            // for transfer we'll swap from/to ourselves in caller
  }
  // Note: the helper above is a tiny hack — it works for income/expense but transfer needs from/to swap, which we do
  // in the call site by passing (toAccountId, fromAccountId). So let's fix that here too.
  // Actually look at the call site: applyOp(reverseType(existing.type), existing.toAccountId, existing.fromAccountId, ...).
  // For income: original applied +amt to toAccountId. We pass reverseType="expense" with from=toAccountId. expense uses fromAccountId -> -amt from toAccountId. Correct.
  // For expense: original -amt from fromAccountId. We pass reverseType="income" with to=fromAccountId. income uses toAccountId -> +amt to fromAccountId. Correct.
  // For transfer: original -amt from from, +amt to to. We pass reverseType="transfer" with from=toAccountId, to=fromAccountId. That gives -amt from toAccountId, +amt to fromAccountId. Correct.
  // Great.

  /* ============================================================
     RULE MODAL
     ============================================================ */
  let editingRuleId = null;
  let ruleType = "expense";

  // Tracks "Now" vs "Specific" for the Start segmented selector.
  let ruleStartMode = "now";
  let ruleHowOften = "forever"; // "once" | "forever" | "times"

  function _buildWeekdayToggles(containerId, selectedSet) {
    const container = $(containerId);
    container.innerHTML = "";
    const days = [
      { value: 1, key: "mon" },
      { value: 2, key: "tue" },
      { value: 3, key: "wed" },
      { value: 4, key: "thu" },
      { value: 5, key: "fri" },
      { value: 6, key: "sat" },
      { value: 0, key: "sun" },
    ];
    days.forEach(d => {
      const label = el("label", {},
        el("input", { type: "checkbox", value: String(d.value), checked: selectedSet.has(d.value) ? true : false }),
        t("weekday.short." + d.key)
      );
      container.appendChild(label);
    });
  }
  function _readWeekdayToggles(containerId) {
    return $$("input[type=checkbox]", $(containerId))
      .filter(c => c.checked)
      .map(c => parseInt(c.value, 10));
  }

  function openRuleModal(rule, presetAccountId) {
    editingRuleId = rule?.id || null;
    ruleType = rule?.type || "expense";
    occurrencesExpanded = false;
    $("#ruleModalTitle").textContent = t(rule ? "rule.edit" : "rule.new");
    updateRuleTypeUI();
    refreshRuleAccountOptions(rule, presetAccountId);
    refreshRuleCategoryOptions();
    fillRuleCurrencyOptions(rule?.currency);
    $("#ruleLabel").value       = rule?.label || "";
    $("#ruleAmount").value      = rule?.amount ?? "";
    $("#ruleAllAmount").checked = (rule?.amountMode === "all");

    // Start mode: only show "Now" by default for a brand-new rule. Editing
    // an existing rule keeps the explicit timestamp.
    ruleStartMode = rule ? "specific" : "now";
    $$("#ruleStartSeg button").forEach(b => b.classList.toggle("is-active", b.dataset.mode === ruleStartMode));
    const baseTs = rule?.startAt ?? Date.now();
    $("#ruleStartAt").value = toLocalInputValue(baseTs);

    // How-often mode derived from existing rule state.
    if (rule && rule.recurring === false) ruleHowOften = "once";
    else if (rule && rule.maxOccurrences != null) ruleHowOften = "times";
    else ruleHowOften = "forever";
    $$("#ruleHowOftenSeg button").forEach(b => b.classList.toggle("is-active", b.dataset.mode === ruleHowOften));
    $("#ruleHowOftenTimes").value = rule?.maxOccurrences ?? 4;

    // Pattern setup
    const pat = rule?.pattern || patternFromLegacy(rule || {});
    $("#rulePatternType").value = pat.type || "interval";
    $("#ruleEveryAmount").value = pat.every?.amount ?? 1;
    $("#ruleEveryUnit").value   = pat.every?.unit ?? "month";

    // Day-of-period defaults
    let dopDir = "first";
    let dopN = 2, dopPeriod = "month";
    if (pat.type === "dayOfPeriod") {
      dopPeriod = pat.period;
      if (pat.fromEnd && (pat.n || 1) === 1) dopDir = "last";
      else if (!pat.fromEnd && (pat.n || 1) === 1) dopDir = "first";
      else if (pat.fromEnd) { dopDir = "nthLast"; dopN = pat.n || 2; }
      else { dopDir = "nth"; dopN = pat.n || 2; }
    }
    $("#ruleDopDirection").value = dopDir;
    $("#ruleDopN").value = dopN;
    $("#ruleDopPeriod").value = dopPeriod;

    // Weekday-of-period defaults
    let wdopDir = "first";
    let wdopN = 2, wdopPeriod = "month", wdopWeekdays = new Set();
    if (pat.type === "weekdayOfPeriod") {
      wdopPeriod = pat.period;
      wdopWeekdays = new Set(pat.weekdays || []);
      if (pat.fromEnd && (pat.n || 1) === 1) wdopDir = "last";
      else if (!pat.fromEnd && (pat.n || 1) === 1) wdopDir = "first";
      else if (pat.fromEnd) { wdopDir = "nthLast"; wdopN = pat.n || 2; }
      else { wdopDir = "nth"; wdopN = pat.n || 2; }
    }
    $("#ruleWdopDirection").value = wdopDir;
    $("#ruleWdopN").value = wdopN;
    $("#ruleWdopPeriod").value = wdopPeriod;
    _buildWeekdayToggles("#ruleWdopWeekdaysList", wdopWeekdays);

    // Pattern: weekdays
    const wdaysSet = (pat.type === "weekdays") ? new Set(pat.weekdays || []) : new Set();
    _buildWeekdayToggles("#ruleWeekdaysList", wdaysSet);

    // Time of day
    const tod = rule?.timeOfDay || (() => {
      const d = new Date(baseTs);
      return { h: d.getHours(), mi: d.getMinutes() };
    })();
    const pad = n => String(n).padStart(2, "0");
    $("#ruleTimeOfDay").value = `${pad(tod.h)}:${pad(tod.mi)}`;

    $("#ruleEndAt").value    = rule?.endAt ? toLocalInputValue(rule.endAt) : "";
    $("#ruleCategory").value = rule?.categoryId || "";
    $("#ruleActive").checked = rule ? !!rule.active : true;
    $("#deleteRuleBtn").hidden = !rule;

    updateRulePatternUI();
    updateRuleAmountUI();
    $("#ruleModal").hidden = false;
    setTimeout(() => $("#ruleLabel").focus(), 60);
  }

  // Hide amount input when "All balance" is on. Currency selector stays.
  function updateRuleAmountUI() {
    const allowAll = ruleType !== "income";
    $("#ruleAllAmountField").hidden = !allowAll;
    if (!allowAll) $("#ruleAllAmount").checked = false;
    $("#ruleAmount").disabled = $("#ruleAllAmount").checked;
    $("#ruleAmount").required = !$("#ruleAllAmount").checked;
    $("#ruleAmount").placeholder = $("#ruleAllAmount").checked ? t("rule.allAmount") : "";
  }

  // startAt for the form: now or the picker's value.
  function ruleFormStartAt() {
    if (ruleStartMode === "now") return Date.now();
    return fromLocalInputValue($("#ruleStartAt").value) || Date.now();
  }
  function ruleFormTimeOfDay() {
    const time = $("#ruleTimeOfDay").value || "09:00";
    const [hh, mm] = time.split(":").map(n => parseInt(n, 10));
    return { h: isNaN(hh) ? 9 : hh, mi: isNaN(mm) ? 0 : mm };
  }
  // Builds a pattern object from the current form state.
  function ruleFormPattern() {
    const type = $("#rulePatternType").value;
    if (type === "interval") {
      return {
        type: "interval",
        every: { amount: Math.max(1, parseInt($("#ruleEveryAmount").value, 10) || 1), unit: $("#ruleEveryUnit").value || "month" },
      };
    }
    if (type === "weekdays") {
      return { type: "weekdays", weekdays: _readWeekdayToggles("#ruleWeekdaysList") };
    }
    if (type === "dayOfPeriod") {
      const dir = $("#ruleDopDirection").value;
      const fromEnd = (dir === "last" || dir === "nthLast");
      const n = (dir === "first" || dir === "last") ? 1 : Math.max(1, parseInt($("#ruleDopN").value, 10) || 1);
      return { type: "dayOfPeriod", period: $("#ruleDopPeriod").value, fromEnd, n };
    }
    if (type === "weekdayOfPeriod") {
      const dir = $("#ruleWdopDirection").value;
      const fromEnd = (dir === "last" || dir === "nthLast");
      const n = (dir === "first" || dir === "last") ? 1 : Math.max(1, parseInt($("#ruleWdopN").value, 10) || 1);
      return {
        type: "weekdayOfPeriod",
        period: $("#ruleWdopPeriod").value,
        fromEnd, n,
        weekdays: _readWeekdayToggles("#ruleWdopWeekdaysList"),
      };
    }
    return null;
  }

  function updateRulePatternUI() {
    // Start specific datetime field
    $("#ruleStartAtField").hidden = (ruleStartMode !== "specific");

    // How-often selector + N input visibility
    $$("#ruleHowOftenSeg button").forEach(b => b.classList.toggle("is-active", b.dataset.mode === ruleHowOften));
    $("#ruleHowOftenTimesField").hidden = (ruleHowOften !== "times");
    $("#ruleRecurringFields").hidden    = (ruleHowOften === "once");

    if (ruleHowOften === "once") {
      $$("#ruleForm button[type=submit]").forEach(b => b.disabled = false);
      _updatePreview();
      return;
    }

    const type = $("#rulePatternType").value;
    $("#ruleIntervalField").hidden        = (type !== "interval");
    $("#ruleWeekdaysField").hidden        = (type !== "weekdays");
    $("#ruleDayOfPeriodField").hidden     = (type !== "dayOfPeriod");
    $("#ruleWdopField").hidden            = (type !== "weekdayOfPeriod");
    $("#ruleTimeField").hidden            = (type === "interval");

    const dopDir = $("#ruleDopDirection").value;
    $("#ruleDopN").hidden = (dopDir === "first" || dopDir === "last");
    const wdopDir = $("#ruleWdopDirection").value;
    $("#ruleWdopN").hidden = (wdopDir === "first" || wdopDir === "last");

    const pattern = ruleFormPattern();
    const v = patternValidity(pattern);
    const valEl = $("#rulePatternValidation");
    valEl.classList.remove("position-warn", "position-error");
    if (!v.ok) {
      valEl.hidden = false;
      valEl.classList.add("position-error");
      valEl.textContent = t(v.key, v.vars || {});
    } else if (v.level === "warn") {
      valEl.hidden = false;
      valEl.classList.add("position-warn");
      valEl.textContent = t(v.key, v.vars || {});
    } else {
      valEl.hidden = true;
    }
    $$("#ruleForm button[type=submit]").forEach(b => b.disabled = !v.ok);

    _updatePreview();
  }

  // Occurrence list state. Holds the temp rule + pagination cursor used by
  // the live preview inside the rule modal. Reset whenever the modal opens.
  let occurrencesExpanded = false;
  let occurrencesLoaded   = 0;
  let occurrencesRule     = null;
  const OCC_PAGE_SIZE = 25;
  const OCC_FOREVER_CAP = 1000;

  function _renderOccurrenceItem(idx, ts) {
    return el("div", { class: "occurrence-item" },
      el("span", { class: "occ-num" }, "#" + (idx + 1)),
      el("span", { class: "occ-date" }, fmtDateTime(ts)),
    );
  }

  // Adds the next page of items to the list (used by both initial render and
  // the IntersectionObserver-driven lazy load).
  function _appendOccurrences(targetCount) {
    if (!occurrencesRule) return;
    const list = $("#ruleOccurrencesList");
    const cap = occurrencesRule.maxOccurrences != null
      ? occurrencesRule.maxOccurrences
      : OCC_FOREVER_CAP;
    const end = Math.min(targetCount, cap);
    for (let i = occurrencesLoaded; i < end; i++) {
      const ts = nthOccurrence(occurrencesRule, i);
      if (ts == null) { occurrencesLoaded = cap; return; }
      list.appendChild(_renderOccurrenceItem(i, ts));
    }
    occurrencesLoaded = end;
  }

  function _updatePreview() {
    const wrap = $("#ruleOccurrencesField");
    const list = $("#ruleOccurrencesList");
    const btn  = $("#ruleOccurrencesToggle");
    const startAt = ruleFormStartAt();

    list.innerHTML = "";
    list.classList.remove("expanded");
    list.onscroll = null;
    occurrencesLoaded = 0;

    // Build the temp rule mirroring what would be saved.
    if (ruleHowOften === "once") {
      occurrencesRule = { recurring: false, startAt, maxOccurrences: 1 };
    } else {
      const pattern = ruleFormPattern();
      const v = patternValidity(pattern);
      if (!v.ok) { wrap.hidden = true; occurrencesRule = null; return; }
      const { h, mi } = ruleFormTimeOfDay();
      occurrencesRule = {
        recurring: true, startAt, pattern, timeOfDay: { h, mi },
        maxOccurrences: (ruleHowOften === "times")
          ? Math.max(1, parseInt($("#ruleHowOftenTimes").value, 10) || 1)
          : null,
      };
    }

    const first = nthOccurrence(occurrencesRule, 0);
    if (first == null) {
      wrap.hidden = false;
      list.appendChild(el("div", { class: "occurrences-empty" }, t("preview.empty")));
      btn.hidden = true;
      return;
    }
    wrap.hidden = false;

    const totalKnown = occurrencesRule.maxOccurrences; // null = forever

    if (!occurrencesExpanded) {
      // Collapsed: show up to 3 items, then a "Show all" button if there's more.
      _appendOccurrences(3);
      btn.onclick = () => { occurrencesExpanded = true; _updatePreview(); };
      if (totalKnown != null) {
        if (totalKnown > occurrencesLoaded) {
          btn.hidden = false;
          btn.textContent = t("preview.showAllN", { n: totalKnown });
        } else {
          btn.hidden = true;
        }
      } else {
        btn.hidden = false;
        btn.textContent = t("preview.showAll");
      }
    } else {
      // Expanded: scrollable, paginated list.
      list.classList.add("expanded");
      _appendOccurrences(OCC_PAGE_SIZE);
      btn.hidden = false;
      btn.textContent = t("preview.collapse");
      btn.onclick = () => { occurrencesExpanded = false; _updatePreview(); };
      list.onscroll = () => {
        const cap = totalKnown != null ? totalKnown : OCC_FOREVER_CAP;
        if (occurrencesLoaded >= cap) return;
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 60) {
          _appendOccurrences(occurrencesLoaded + OCC_PAGE_SIZE);
        }
      };
    }
  }
  function closeRuleModal() {
    $("#ruleModal").hidden = true;
    editingRuleId = null;
  }
  function updateRuleTypeUI() {
    $$("#ruleTypeSeg button").forEach(b => b.classList.toggle("is-active", b.dataset.type === ruleType));
    $("#ruleFromField").hidden = (ruleType === "income");
    $("#ruleToField").hidden   = (ruleType === "expense");
    updateRuleAmountUI();
  }
  function refreshRuleAccountOptions(rule, presetAccountId) {
    const from = $("#ruleFrom"); from.innerHTML = "";
    const to   = $("#ruleTo");   to.innerHTML   = "";
    state.accounts.forEach(s => {
      from.appendChild(el("option", { value: s.id }, (s.icon ? s.icon + " " : "") + s.name));
      to  .appendChild(el("option", { value: s.id }, (s.icon ? s.icon + " " : "") + s.name));
    });
    if (rule) { from.value = rule.fromAccountId || ""; to.value = rule.toAccountId || ""; }
    else {
      from.value = presetAccountId || (state.accounts[0]?.id || "");
      to.value = presetAccountId || (state.accounts[0]?.id || "");
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
    $$("#ruleTypeSeg button").forEach(b => b.onclick = () => { ruleType = b.dataset.type; updateRuleTypeUI(); updateRulePatternUI(); });
    $$("#ruleStartSeg button").forEach(b => b.onclick = () => {
      ruleStartMode = b.dataset.mode;
      $$("#ruleStartSeg button").forEach(x => x.classList.toggle("is-active", x === b));
      updateRulePatternUI();
    });
    $("#ruleStartAt").addEventListener("input", updateRulePatternUI);
    $$("#ruleHowOftenSeg button").forEach(b => b.onclick = () => {
      ruleHowOften = b.dataset.mode;
      updateRulePatternUI();
    });
    $("#ruleHowOftenTimes").addEventListener("input", updateRulePatternUI);
    $("#rulePatternType").addEventListener("change", updateRulePatternUI);
    $("#ruleEveryAmount").addEventListener("input", updateRulePatternUI);
    $("#ruleEveryUnit").addEventListener("change", updateRulePatternUI);
    $("#ruleDopDirection").addEventListener("change", updateRulePatternUI);
    $("#ruleDopN").addEventListener("input", updateRulePatternUI);
    $("#ruleDopPeriod").addEventListener("change", updateRulePatternUI);
    $("#ruleWdopDirection").addEventListener("change", updateRulePatternUI);
    $("#ruleWdopN").addEventListener("input", updateRulePatternUI);
    $("#ruleWdopPeriod").addEventListener("change", updateRulePatternUI);
    $("#ruleTimeOfDay").addEventListener("input", updateRulePatternUI);
    $("#ruleWeekdaysList").addEventListener("change", updateRulePatternUI);
    $("#ruleWdopWeekdaysList").addEventListener("change", updateRulePatternUI);
    $("#ruleAllAmount").addEventListener("change", updateRuleAmountUI);

    $("#ruleForm").onsubmit = (e) => {
      e.preventDefault();
      const allMode = $("#ruleAllAmount").checked && ruleType !== "income";
      const formAmount = parseFloat($("#ruleAmount").value);
      if (!allMode && (isNaN(formAmount) || formAmount <= 0)) return;
      const amount = allMode ? 0 : formAmount;
      const currency = $("#ruleCurrency").value;
      const startAt = ruleFormStartAt();
      const endAt = fromLocalInputValue($("#ruleEndAt").value) || null;
      const categoryId = $("#ruleCategory").value || null;
      const label = $("#ruleLabel").value.trim();
      const active = $("#ruleActive").checked;
      const recurring = ruleHowOften !== "once";
      const maxOccurrences = (ruleHowOften === "times")
        ? Math.max(1, parseInt($("#ruleHowOftenTimes").value, 10) || 1)
        : null;
      const fromAccountId = (ruleType === "income") ? null : $("#ruleFrom").value;
      const toAccountId   = (ruleType === "expense") ? null : $("#ruleTo").value;
      if (ruleType === "transfer" && fromAccountId === toAccountId) {
        alert("From and To must differ.");
        return;
      }
      let pattern = null;
      let timeOfDay = null;
      if (recurring) {
        pattern = ruleFormPattern();
        const v = patternValidity(pattern);
        if (!v.ok) return;
        timeOfDay = ruleFormTimeOfDay();
      }
      const amountMode = allMode ? "all" : "fixed";

      if (editingRuleId) {
        const r = state.rules.find(x => x.id === editingRuleId);
        if (r) {
          const oldKey = JSON.stringify({ recurring: r.recurring, startAt: r.startAt, pattern: r.pattern, timeOfDay: r.timeOfDay });
          const newKey = JSON.stringify({ recurring, startAt, pattern, timeOfDay });
          const scheduleChanged = (oldKey !== newKey);
          Object.assign(r, {
            type: ruleType, fromAccountId, toAccountId, amount, currency,
            recurring, maxOccurrences,
            pattern, timeOfDay,
            amountMode,
            startAt, endAt, categoryId, label, active,
          });
          if (scheduleChanged) {
            const lastApplied = state.transactions
              .filter(tx => tx.ruleId === r.id && tx.status === "applied")
              .reduce((m, tx) => Math.max(m, tx.at), 0);
            if (lastApplied) {
              let n = 0, safety = 0;
              while (safety++ < SAFETY_ITERATIONS) {
                const ts = nthOccurrence(r, n);
                if (ts == null || ts > lastApplied) break;
                n++;
              }
              r.occurrenceCount = n;
              r.lastRunAt = lastApplied;
            } else {
              r.occurrenceCount = 0;
              r.lastRunAt = null;
            }
          }
          toast(t("toast.updated"));
        }
      } else {
        state.rules.push({
          id: cryptoId(),
          type: ruleType, fromAccountId, toAccountId, amount, currency,
          recurring, maxOccurrences,
          pattern, timeOfDay,
          amountMode,
          startAt, endAt,
          lastRunAt: null,
          occurrenceCount: 0,
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
     SET BALANCE MODAL (quick adjustment)
     ============================================================ */
  let setBalanceCtx = null; // { accountId, currency }

  function openSetBalanceModal(account, ccy) {
    setBalanceCtx = { accountId: account.id, currency: ccy };
    const current = account.balances[ccy] || 0;
    $("#setBalanceSub").textContent = (account.icon ? account.icon + " " : "") + account.name + " · " + ccy;
    $("#setBalanceCurrent").textContent = fmtAmount(current) + " " + ccy;
    $("#setBalanceAmount").value = current;
    $("#setBalanceNote").value = "";
    updateSetBalanceDelta();
    $("#setBalanceModal").hidden = false;
    setTimeout(() => { const a = $("#setBalanceAmount"); a.focus(); a.select(); }, 60);
  }
  function closeSetBalanceModal() {
    $("#setBalanceModal").hidden = true;
    setBalanceCtx = null;
  }
  function updateSetBalanceDelta() {
    if (!setBalanceCtx) return;
    const account = accountById(setBalanceCtx.accountId);
    if (!account) return;
    const current = account.balances[setBalanceCtx.currency] || 0;
    const nv = parseFloat($("#setBalanceAmount").value);
    const wrap = $("#setBalanceDelta");
    if (isNaN(nv)) { wrap.hidden = true; return; }
    const delta = nv - current;
    if (delta === 0) { wrap.hidden = true; return; }
    wrap.hidden = false;
    const sign = delta > 0 ? "+" : "−";
    const v = $("#setBalanceDeltaValue");
    v.textContent = sign + fmtAmount(Math.abs(delta)) + " " + setBalanceCtx.currency;
    v.style.color = delta > 0 ? "var(--success)" : "var(--danger)";
  }
  function bindSetBalanceModal() {
    $$("[data-close-modal]", $("#setBalanceModal")).forEach(b => b.onclick = closeSetBalanceModal);
    $("#setBalanceAmount").addEventListener("input", updateSetBalanceDelta);
    $("#setBalanceForm").onsubmit = (e) => {
      e.preventDefault();
      if (!setBalanceCtx) return;
      const account = accountById(setBalanceCtx.accountId);
      if (!account) return;
      const ccy = setBalanceCtx.currency;
      const current = account.balances[ccy] || 0;
      const nv = parseFloat($("#setBalanceAmount").value);
      if (isNaN(nv)) return;
      const delta = nv - current;
      const note = $("#setBalanceNote").value.trim();
      const label = note || t("balance.defaultLabel");
      if (delta !== 0) {
        const type = delta > 0 ? "income" : "expense";
        const amount = Math.abs(delta);
        const tx = {
          id: cryptoId(),
          type,
          fromAccountId: type === "expense" ? account.id : null,
          toAccountId:   type === "income"  ? account.id : null,
          amount,
          currency: ccy,
          at: Date.now(),
          status: "applied",
          categoryId: null,
          label,
          ruleId: null,
          adjust: true,
          createdAt: Date.now(),
        };
        state.transactions.push(tx);
        applyOp(tx.type, tx.fromAccountId, tx.toAccountId, tx.amount, tx.currency);
        save();
        toast(t("toast.updated"));
      }
      closeSetBalanceModal();
      render();
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
    if (state.detailAccountId) { renderDetail(); return; }
    const view = $("#view");
    view.innerHTML = "";
    $("#emptyState").hidden = true;

    const tab = state.activeTab;
    if (tab === "accounts")    return renderAccountsTab(view);
    if (tab === "forecast") return renderForecastTab(view);
    if (tab === "rules")    return renderRulesTab(view);
    if (tab === "history")  return renderHistoryTab(view);
    if (tab === "stats")    return renderStatsTab(view);
  }

  /* ----- Accounts tab ----- */
  function renderAccountsTab(view) {
    if (state.accounts.length === 0) {
      return showEmpty(view, "empty.title", "empty.body", "empty.cta", () => openAccountModal());
    }
    state.accounts.forEach(account => {
      view.appendChild(renderAccountCard(account));
    });
  }
  function primaryCurrency(account) {
    // Currency with largest absolute current balance; fall back to first declared currency.
    const codes = Object.keys(account.balances).filter(c => account.balances[c] !== 0 || true);
    if (codes.length === 0) return state.currencies[0]?.code || "";
    let best = codes[0], bestAbs = Math.abs(account.balances[codes[0]] || 0);
    for (const c of codes) {
      const v = Math.abs(account.balances[c] || 0);
      if (v > bestAbs) { best = c; bestAbs = v; }
    }
    return best;
  }
  function renderAccountCard(account) {
    const card = el("article", { class: "account", style: { "--cat-color": account.color || "#14B8A6" }, onclick: () => openDetail(account.id) });
    card.appendChild(el("div", { class: "account-stripe" }));
    const head = el("div", { class: "account-head" });
    head.appendChild(el("div", { class: "account-icon" }, account.icon || "🏦"));
    head.appendChild(el("div", { class: "account-title" }, account.name));
    card.appendChild(head);

    const balancesWrap = el("div", { class: "account-balances" });
    const codes = Object.keys(account.balances);
    if (codes.length === 0) {
      balancesWrap.appendChild(el("div", { class: "account-balance" },
        el("span", { class: "amount" }, fmtAmount(0)),
        el("span", { class: "currency" }, state.currencies[0]?.code || "")
      ));
    } else {
      codes.forEach(c => {
        const v = account.balances[c] || 0;
        balancesWrap.appendChild(el("div", { class: "account-balance" + (v < 0 ? " is-negative" : "") },
          el("span", { class: "amount" }, fmtAmount(v)),
          el("span", { class: "currency" }, c)
        ));
      });
    }
    card.appendChild(balancesWrap);

    // Quick forecast row (primary currency)
    const ccy = primaryCurrency(account);
    const now = Date.now();
    const w = forecastAccount(account.id, endOfWeek(now)).projected[ccy] ?? account.balances[ccy] ?? 0;
    const m = forecastAccount(account.id, endOfMonth(now)).projected[ccy] ?? account.balances[ccy] ?? 0;
    const y = forecastAccount(account.id, endOfYear(now)).projected[ccy] ?? account.balances[ccy] ?? 0;

    const grid = el("div", { class: "account-forecast" });
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
    if (state.accounts.length === 0) {
      return showEmpty(view, "empty.forecastTitle", "empty.forecastBody", "empty.cta", () => openAccountModal());
    }
    view.appendChild(renderRangePicker());
    view.appendChild(renderForecastTotalCard());
    state.accounts.forEach(account => view.appendChild(renderForecastCard(account)));
  }
  // Aggregates each account's forecast into a combined view. Internal transfers
  // (between two of the user's accounts) net out for in/out flow because the
  // money never leaves the household.
  function forecastTotals(target) {
    const now = Date.now();
    const nowByCcy = {};
    const projByCcy = {};
    const flowByCcy = {};
    const events = [];
    state.accounts.forEach(account => {
      const fc = forecastAccount(account.id, target);
      for (const ccy in fc.now)       nowByCcy[ccy]  = (nowByCcy[ccy]  || 0) + fc.now[ccy];
      for (const ccy in fc.projected) projByCcy[ccy] = (projByCcy[ccy] || 0) + fc.projected[ccy];
      fc.events.forEach(ev => {
        if (ev.type !== "transfer") {
          for (const ccy in ev.delta) {
            flowByCcy[ccy] ||= { in: 0, out: 0 };
            if (ev.delta[ccy] > 0) flowByCcy[ccy].in  += ev.delta[ccy];
            else                   flowByCcy[ccy].out += -ev.delta[ccy];
          }
        }
        events.push(ev);
      });
    });
    events.sort((a, b) => a.at - b.at);
    return { now: nowByCcy, projected: projByCcy, perCurrencyFlow: flowByCcy, events, atNow: now, targetTs: target };
  }
  function renderForecastTotalCard() {
    const target = rangeTargetTs(state.forecastRange, state.forecastCustom);
    const fc = forecastTotals(target);
    const now = Date.now();
    const days = daysBetween(now, target);

    const card = el("div", { class: "forecast-card forecast-card-total", style: { "--cat-color": "var(--brand-2)" } });
    card.appendChild(el("div", { class: "forecast-head" },
      el("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
        el("span", { class: "account-icon", style: { width: "30px", height: "30px", fontSize: "16px" } }, "Σ"),
        el("div", { class: "forecast-title" }, t("forecast.total"))
      ),
      el("div", { class: "forecast-sub" },
        t("stats.accountCount", { n: state.accounts.length }) + " · " + fmtDate(now) + " ",
        arrowRight(),
        " " + fmtDate(target)
      )
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
      const allowance = proj / days;
      tiles.appendChild(el("div", { class: "forecast-tile" },
        el("span", { class: "label" }, ccy + " · " + t("forecast.allowance")),
        el("span", { class: "value" + (allowance < 0 ? " is-negative" : "") }, fmtAmount(allowance)),
        el("span", { class: "sub" }, t("forecast.daysLeft", { n: days })),
      ));
    });
    card.appendChild(tiles);

    const chartCcys = Array.from(new Set([...Object.keys(fc.now), ...Object.keys(fc.projected)]));
    if (chartCcys.length === 0) chartCcys.push(state.currencies[0]?.code || "");
    chartCcys.forEach(ccy => {
      const points = buildBalancePoints(null, ccy, fc, now, target);
      card.appendChild(el("div", { class: "forecast-chart-wrap" },
        renderChart(points, ccy, "#14B8A6", "#E5484D")
      ));
    });
    return card;
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
  function renderForecastCard(account) {
    const target = rangeTargetTs(state.forecastRange, state.forecastCustom);
    const fc = forecastAccount(account.id, target);
    const now = Date.now();
    const days = daysBetween(now, target);

    const card = el("div", { class: "forecast-card", onclick: () => openDetail(account.id), style: { cursor: "pointer", "--cat-color": account.color || "#14B8A6" } });
    card.appendChild(el("div", { class: "forecast-head" },
      el("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
        el("span", { class: "account-icon", style: { width: "30px", height: "30px", fontSize: "16px" } }, account.icon || "🏦"),
        el("div", { class: "forecast-title" }, account.name)
      ),
      el("div", { class: "forecast-sub" }, fmtDate(now) + " ", arrowRight(), " " + fmtDate(target))
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

    // Per-currency chart (one chart per currency present in this account)
    const chartCcys = Array.from(new Set([...Object.keys(fc.now), ...Object.keys(fc.projected)]));
    if (chartCcys.length === 0) chartCcys.push(state.currencies[0]?.code || "");
    chartCcys.forEach(ccy => {
      const points = buildBalancePoints(account.id, ccy, fc, now, target);
      card.appendChild(el("div", { class: "forecast-chart-wrap" },
        renderChart(points, ccy, account.color || "#14B8A6", "#E5484D")
      ));
    });

    return card;
  }

  /* ----- Rules tab ----- */
  // Builds the "· From → To" sub-meta for a rule/tx row using the SVG arrow.
  function _makeRouteSpan(type, fromId, toId) {
    const span = el("span", { style: { display: "inline-flex", alignItems: "center", gap: "4px" } });
    span.appendChild(document.createTextNode("· "));
    if (type === "transfer") {
      span.appendChild(document.createTextNode(accountName(fromId)));
      span.appendChild(arrowRight());
      span.appendChild(document.createTextNode(accountName(toId)));
    } else if (type === "income") {
      span.appendChild(arrowRight());
      span.appendChild(document.createTextNode(accountName(toId)));
    } else {
      span.appendChild(document.createTextNode(accountName(fromId)));
    }
    return span;
  }

  function renderRulesTab(view) {
    if (state.rules.length === 0) {
      return showEmpty(view, "empty.rulesTitle", "empty.rulesBody", "empty.rulesCta", () => openRuleModal());
    }
    // Sort rules: active first, then next occurrence soonest
    const sorted = [...state.rules].sort((a, b) => {
      if (!!a.active !== !!b.active) return a.active ? -1 : 1;
      const an = nthOccurrence(a, a.occurrenceCount || 0);
      const bn = nthOccurrence(b, b.occurrenceCount || 0);
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
    meta.appendChild(el("span", {}, scheduleLabel(rule)));
    meta.appendChild(_makeRouteSpan(rule.type, rule.fromAccountId, rule.toAccountId));
    // next
    const next = nthOccurrence(rule, rule.occurrenceCount || 0);
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
    meta.appendChild(_makeRouteSpan(tx.type, tx.fromAccountId, tx.toAccountId));
    if (tx.status === "pending") meta.appendChild(el("span", { class: "chip" }, t("history.pending")));
    if (tx.ruleId) {
      const ruleChip = el("span", {
        class: "chip chip-clickable",
        title: t("history.openRule"),
        onclick: (e) => {
          e.stopPropagation();
          const r = state.rules.find(x => x.id === tx.ruleId);
          if (r) openRuleModal(r);
        },
      }, t("history.fromRule"));
      meta.appendChild(ruleChip);
    }
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
    if (state.accounts.length === 0) {
      return showEmpty(view, "empty.statsTitle", "empty.statsBody", "empty.cta", () => openAccountModal());
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
    state.accounts.forEach(s => {
      for (const c in s.balances) totalByCcy[c] = (totalByCcy[c] || 0) + s.balances[c];
    });
    const monthIn  = sumByCcy(tx => tx.type === "income"  && tx.at >= monthStart);
    const monthOut = sumByCcy(tx => tx.type === "expense" && tx.at >= monthStart);
    const yearIn   = sumByCcy(tx => tx.type === "income"  && tx.at >= yearStart);
    const yearOut  = sumByCcy(tx => tx.type === "expense" && tx.at >= yearStart);

    // Top tiles
    const grid = el("div", { class: "stats-grid" });
    grid.appendChild(statTile(t("stats.totalBalance"), totalByCcy, t("stats.accountCount", { n: state.accounts.length })));
    grid.appendChild(statTile(t("stats.thisMonthIn"),  monthIn));
    grid.appendChild(statTile(t("stats.thisMonthOut"), monthOut));
    grid.appendChild(statTile(t("stats.thisYearIn"),   yearIn));
    grid.appendChild(statTile(t("stats.thisYearOut"),  yearOut));
    const net = {};
    Object.keys({ ...monthIn, ...monthOut }).forEach(c => net[c] = (monthIn[c] || 0) - (monthOut[c] || 0));
    grid.appendChild(statTile(t("stats.netThisMonth"), net));
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
        const tile = statTile((c?.icon ? c.icon + " " : "") + name, ccys);
        if (c?.color) tile.style.borderLeft = "3px solid " + c.color;
        catGrid.appendChild(tile);
      });
      view.appendChild(catGrid);
    }
  }
  // statTile: header on top, then one row per currency below (amount + currency code).
  function statTile(label, valuesMap, sub) {
    const tile = el("div", { class: "stat-tile" });
    tile.appendChild(el("span", { class: "label" }, label));
    const valBox = el("div", { class: "value-box" });
    const keys = Object.keys(valuesMap || {}).sort();
    if (keys.length === 0) {
      valBox.appendChild(el("div", { class: "value is-empty" }, el("span", { class: "num" }, "—")));
    } else {
      keys.forEach(c => {
        const v = valuesMap[c];
        valBox.appendChild(el("div", { class: "value" + (v < 0 ? " is-negative" : "") },
          el("span", { class: "num" }, fmtAmount(v)),
          el("span", { class: "currency" }, c),
        ));
      });
    }
    tile.appendChild(valBox);
    if (sub) tile.appendChild(el("span", { class: "sub" }, sub));
    return tile;
  }

  /* ============================================================
     SILO DETAIL VIEW
     ============================================================ */
  function openDetail(accountId) {
    state.detailAccountId = accountId;
    save();
    appShell.hidden = true;
    detailView.hidden = false;
    renderDetail();
    window.scrollTo({ top: 0 });
  }
  function closeDetail() {
    state.detailAccountId = null;
    save();
    detailView.hidden = true;
    appShell.hidden = false;
    render();
  }
  function renderDetail() {
    if (!state.detailAccountId) return;
    const account = accountById(state.detailAccountId);
    if (!account) { closeDetail(); return; }
    appShell.hidden = true;
    detailView.hidden = false;
    const root = $("#detailBody");
    root.innerHTML = "";

    // Back + title + edit
    const head = el("div", { class: "detail-head" });
    const back = el("button", { class: "back", "aria-label": "Back", html: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15.5 19l-7-7 7-7 1.4 1.4L11.3 12l5.6 5.6z"/></svg>' });
    back.onclick = closeDetail;
    head.appendChild(back);
    head.appendChild(el("div", { class: "title" }, (account.icon ? account.icon + "  " : "") + account.name));
    const editBtn = el("button", { class: "btn btn-ghost btn-sm", onclick: () => openAccountModal(account) }, t("detail.editAccount"));
    head.appendChild(editBtn);
    root.appendChild(head);

    // Balances card
    const bal = el("div", { class: "detail-balances-card", style: { "--cat-color": account.color || "#14B8A6" } });
    bal.appendChild(el("div", { class: "head" },
      el("div", { class: "title-row" },
        el("span", { class: "account-icon", style: { width: "30px", height: "30px", fontSize: "16px" } }, account.icon || "🏦"),
        el("strong", { style: { fontSize: "16px" } }, account.name)
      ),
      el("div", { class: "actions" },
        el("button", { class: "btn btn-primary btn-sm", onclick: () => openTxModal(null, account.id) }, t("detail.addTx")),
        el("button", { class: "btn btn-ghost btn-sm", onclick: () => openRuleModal(null, account.id) }, t("detail.addRule")),
      )
    ));
    const bg = el("div", { class: "balances-grid" });
    const codes = Object.keys(account.balances);
    const renderBalanceTile = (c, v) => el("div", { class: "balance-tile" },
      el("div", { class: "balance-tile-main" },
        el("span", { class: "amount" + (v < 0 ? " is-negative" : "") }, fmtAmount(v)),
        el("span", { class: "currency" }, c),
      ),
      el("button", {
        class: "quick-set",
        type: "button",
        title: t("balance.quickSet"),
        "aria-label": t("balance.quickSet"),
        onclick: (e) => { e.stopPropagation(); openSetBalanceModal(account, c); },
        html: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
      }),
    );
    if (codes.length === 0) {
      bg.appendChild(renderBalanceTile(state.currencies[0]?.code || "", 0));
    } else codes.forEach(c => {
      bg.appendChild(renderBalanceTile(c, account.balances[c]));
    });
    bal.appendChild(bg);
    root.appendChild(bal);

    // Forecast card with chart
    root.appendChild(renderDetailForecast(account));

    // Per-day allowance (primary currency)
    const ccy = primaryCurrency(account);
    const target = rangeTargetTs(state.forecastRange, state.forecastCustom);
    const fc = forecastAccount(account.id, target);
    const proj = fc.projected[ccy] || 0;
    const days = daysBetween(Date.now(), target);
    const allowance = proj / days;
    root.appendChild(el("div", { class: "allowance-card" },
      el("span", { class: "label" }, t("forecast.allowance") + " · " + ccy),
      el("span", { class: "amount" + (allowance < 0 ? " is-negative" : "") }, fmtAmount(allowance)),
      el("span", { class: "body" }, t("forecast.allowanceBody") + " " + t("forecast.daysLeft", { n: days })),
    ));

    // Rules in this account
    const involved = state.rules.filter(r => r.fromAccountId === account.id || r.toAccountId === account.id);
    if (involved.length) {
      root.appendChild(el("div", { class: "section-head" }, el("span", {}, t("detail.rules")), el("span", { class: "count" }, String(involved.length))));
      involved
        .sort((a, b) => (a.active === b.active) ? 0 : a.active ? -1 : 1)
        .forEach(r => root.appendChild(renderRuleRow(r)));
    }

    // Recent activity (this account)
    const myTxs = state.transactions.filter(tx => tx.fromAccountId === account.id || tx.toAccountId === account.id);
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

  function renderDetailForecast(account) {
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
    const fc = forecastAccount(account.id, target);

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

    // Charts — one per currency in this account
    const now = Date.now();
    const chartCcys = Array.from(new Set([...Object.keys(fc.now), ...Object.keys(fc.projected)]));
    if (chartCcys.length === 0) chartCcys.push(state.currencies[0]?.code || "");
    chartCcys.forEach(ccy => {
      const points = buildBalancePoints(account.id, ccy, fc, now, target);
      wrap.appendChild(el("div", { class: "forecast-chart-wrap" },
        renderChart(points, ccy, account.color || "#14B8A6", "#E5484D")
      ));
    });

    return wrap;
  }

  // For unique clip-path ids per render.
  let __chartId = 0;
  // Build the step-line points for a currency from now to target.
  // Coalesces events sharing a timestamp so internal transfers (which appear
  // twice in the aggregated event list, once per side) don't create a spike.
  function buildBalancePoints(_accountId, ccy, fc, now, target) {
    const events = fc.events.filter(e => e.delta[ccy] !== undefined);
    const points = [];
    let running = fc.now[ccy] || 0;
    points.push({ t: now, v: running });
    let i = 0;
    while (i < events.length) {
      let j = i, delta = 0;
      const at = events[i].at;
      while (j < events.length && events[j].at === at) {
        delta += events[j].delta[ccy] || 0;
        j++;
      }
      running += delta;
      points.push({ t: at, v: running });
      i = j;
    }
    points.push({ t: target, v: running });
    return points;
  }
  // Renders a step-line balance chart with positive segments in posColor
  // and negative segments in negColor. Always draws a dashed zero line.
  function renderChart(points, ccy, posColor, negColor) {
    __chartId++;
    const id = __chartId;
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
    const y0 = yFor(0);

    // ---- Always-on dashed zero line ----
    const zero = document.createElementNS(svgNS, "line");
    zero.setAttribute("x1", P); zero.setAttribute("x2", W - P);
    zero.setAttribute("y1", y0); zero.setAttribute("y2", y0);
    zero.setAttribute("stroke", "currentColor");
    zero.setAttribute("stroke-opacity", "0.3");
    zero.setAttribute("stroke-dasharray", "3 5");
    svg.appendChild(zero);

    // ---- Step path ----
    let d = "";
    points.forEach((p, i) => {
      const x = xFor(p.t), y = yFor(p.v);
      if (i === 0) { d += `M ${x} ${y}`; }
      else {
        const prev = points[i - 1];
        const py = yFor(prev.v);
        d += ` L ${x} ${py} L ${x} ${y}`;
      }
    });
    const dArea = d + ` L ${xFor(points[points.length - 1].t)} ${y0} L ${xFor(points[0].t)} ${y0} Z`;

    // ---- Clip rects: above and below the zero line ----
    const defs = document.createElementNS(svgNS, "defs");
    const aboveH = Math.max(0, y0);
    const belowH = Math.max(0, H - y0);
    const clipA = document.createElementNS(svgNS, "clipPath");
    clipA.setAttribute("id", `cAbove_${id}`);
    const rA = document.createElementNS(svgNS, "rect");
    rA.setAttribute("x", "0"); rA.setAttribute("y", "0");
    rA.setAttribute("width", String(W)); rA.setAttribute("height", String(aboveH));
    clipA.appendChild(rA);
    defs.appendChild(clipA);
    const clipB = document.createElementNS(svgNS, "clipPath");
    clipB.setAttribute("id", `cBelow_${id}`);
    const rB = document.createElementNS(svgNS, "rect");
    rB.setAttribute("x", "0"); rB.setAttribute("y", String(y0));
    rB.setAttribute("width", String(W)); rB.setAttribute("height", String(belowH));
    clipB.appendChild(rB);
    defs.appendChild(clipB);
    svg.appendChild(defs);

    // ---- Area fills (clipped) ----
    const areaA = document.createElementNS(svgNS, "path");
    areaA.setAttribute("d", dArea);
    areaA.setAttribute("fill", posColor);
    areaA.setAttribute("fill-opacity", "0.14");
    areaA.setAttribute("clip-path", `url(#cAbove_${id})`);
    svg.appendChild(areaA);
    const areaB = document.createElementNS(svgNS, "path");
    areaB.setAttribute("d", dArea);
    areaB.setAttribute("fill", negColor);
    areaB.setAttribute("fill-opacity", "0.14");
    areaB.setAttribute("clip-path", `url(#cBelow_${id})`);
    svg.appendChild(areaB);

    // ---- Line stroke (drawn twice with two clips → green on top, red below) ----
    const makeLine = (color, clipId) => {
      const p = document.createElementNS(svgNS, "path");
      p.setAttribute("d", d);
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", color);
      p.setAttribute("stroke-width", "2");
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
      p.setAttribute("clip-path", `url(#${clipId})`);
      return p;
    };
    svg.appendChild(makeLine(posColor, `cAbove_${id}`));
    svg.appendChild(makeLine(negColor, `cBelow_${id}`));

    // ---- Endpoint dot + label, colored by sign ----
    const last = points[points.length - 1];
    const endColor = last.v < 0 ? negColor : posColor;
    const dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx", xFor(last.t)); dot.setAttribute("cy", yFor(last.v));
    dot.setAttribute("r", "4"); dot.setAttribute("fill", endColor);
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
      if (state.detailAccountId && accountById(state.detailAccountId)) {
        appShell.hidden = true;
        detailView.hidden = false;
        renderDetail();
      } else {
        state.detailAccountId = null;
        detailView.hidden = true;
        appShell.hidden = false;
        render();
      }
    }
  }
  function init() {
    bindOnboarding();
    bindSettings();
    bindAccountModal();
    bindTxModal();
    bindRuleModal();
    bindSetBalanceModal();
    bindTabs();

    $("#addBtn").onclick = () => {
      // Context-aware:
      const tab = state.activeTab;
      if (tab === "accounts")        return state.accounts.length === 0 ? openAccountModal() : openChooser();
      if (tab === "rules")        return openRuleModal();
      if (tab === "history")      return openTxModal();
      return openChooser();
    };
    $("#detailAddBtn").onclick = () => {
      const id = state.detailAccountId;
      if (id) openChooser(id);
    };
    $("#emptyCta").onclick = () => openAccountModal();

    // Process any due rules/transactions on load and periodically.
    settleNow();
    setInterval(() => {
      const before = JSON.stringify({ b: state.accounts.map(s => s.balances), tx: state.transactions.length });
      settleNow();
      const after = JSON.stringify({ b: state.accounts.map(s => s.balances), tx: state.transactions.length });
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
      const layers = ["#iconPicker", "#chooser", "#confirmDialog", "#setBalanceModal", "#ruleModal", "#txModal", "#accountModal"];
      for (const sel of layers) {
        const n = $(sel);
        if (n && !n.hidden) { n.hidden = true; return; }
      }
      if (!settingsDrawer.hidden) closeSettings();
      else if (state.detailAccountId) closeDetail();
    });

    startup();
    registerSW();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  /* expose for tests */
  window.__SC__ = { state, forecastAccount, addInterval, futureRuleOccurrences, applyDueRules, applyDueTransactions };
})();
