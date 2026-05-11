---
title: "01: MundaMail"
description: "A MundaMail projekt esettanulmánya: Zamunda ingyenes, állami emailszolgáltatása, amely biztonságos postafiókot biztosít minden állampolgárnak, és az állami kommunikáció digitális csatornájaként is szolgál."
---

# 01: MundaMail 

## Háttér

> Az [Amerikába jöttem](https://port.hu/adatlap/film/tv/amerikaba-jottem-coming-to-america/movie-11018) és az [Amerikába jöttem 2.](https://port.hu/adatlap/film/tv/amerikaba-jottem-2-coming-2-america/movie-212064) című filmek története alapján.

Jaffe Jofer király halála után Zamunda trónját immár fia, Akeem foglalhatta el. Hallva azonban az idők szavát, Akeem király úgy döntött: az uralkodásba bevonja lányát, Meekát is.

Meeka a modern kor eszközeit használva szeretné felvirágoztatni Zamundát. Felismerte, hogy a fejlődés zálogát a digitális transzformáció jelenti: független IT infrastruktúra és digitális államigazgatás, kombinálva a megújuló energiaforrások és a klímabarát megoldások használatával.

Ez a digitális transzformációs program a Zamunda Digitális Reneszánsz (ZDR).

### A ZDR program általános követelményei

- Mivel egy állami programról van szó, ezért nagyon fontos, hogy minden projekthez megfelelő mennyiségű és minőségű dokumentáció készüljön.
- Zamunda nem szegény ország, de feleslegesen nem is akarja szórni a pénzt: a projektek tervezésénél törekedni kell a takarékosságra. Szintén ezt igénylik a klímabarát célok!
- Figyelembe kell venni, hogy az ország bizonyos területeienek internetlefedettsége hagy némi kívánnivalót maga után. Ahol van internet, ott is előfordulhatnak magasabb késleltetések, alacsonyabb sávszélességek.

## Leírás

Zamunda szeretne minden lakosának egy ingyenes email postafiókot biztosítani. Emögött a következő okok állnak:

- Minden állami terület, legyen szó a felsőoktatásról, az egészségügyről, vagy akár a nyugdíjról, ezen keresztül levelezne. Ezáltal gyorsabbá és takarékosabbá válnának az ez egyes állami szolgáltatások.
- Napjainkban az érvényesüléshez elengedhetetlen egy email postafiók. Ugyanakkor az emberek elsöprő többségének személyes levelezését profitorientált cégek kezelik, a saját érdekeik mentén. Zamunda szeretne egy ingyenes, az állampolgárok érdekeit szem előtt tartó alternatívát biztosítani.

### Valós kapcsolódás

Gondoljunk a tarhely.gov.hu-ra, csak általános emailezésre is használható.

## Felhasználók

- Zamunda összes állampolgára, mintegy 10 millió fő.
- Adminisztrátorok a zamundai közigazgatásban.

## Követelmények

- Kimagasló fontossággal bírnak az adatvédelmi megfontolások:
  - A rendszer által kezelt adatokat Zamunda területén belül kell tárolni, valamint a rendszert Zamunda területén belül kell üzemeltetni.
  - A felhasználók emailjeit titkosítva kell tárolni.
- A leveleket a felhasználó által kezdeményezett törlésig meg kell őrizni. Azaz, potenciálisan örökké.
- Biztosítani kell egy API-t, melyen keresztül a különböző állami hivatalok üzeneteket küldhetnek a felhasználóknak.
- Az állami hivatalok által küldött egyes üzenetekhez (azaz nem mindhez) alapvető auditálási lehetőségeket is biztosítani kell:
  - Az üzenet megnyitásának rögzítése.
  - Az üzenet törlésének rögzítése.
- Az állami hivatalok egyes üzenetei személyre szabottak (mint például az egészségügyi kezelésekkel kapcsolatosak), míg mások tömegesek (mint például az értesítők különböző határidőkről).
- Az IMAP és az SMTP protokollok támogatása.
- Webes és mobil felhasználói felületek.
- Biztosítani kell egy webes adminisztrációs felületet, ahol a közigazgatási ügyintézők be tudják regisztrálni az új felhasználókat.
- Annak érdekében, hogy az emberek ténylegesen használják a rendszert, és ne csak állami kommunikációs csatorna legyen, valós alternatívát kell kínálni a népszerű szolgáltatókhoz képest.

## Kiegészítések

- A távlati célok között szerepel az API megnyitása, hogy vállalkozások is üzenhessenek a MundaMailen keresztül, kihagyva az email protokollokat. Gondoljunk például a csomagküldő szolgálatokra.
- Ne gondoljuk túl az email protokollokat.
