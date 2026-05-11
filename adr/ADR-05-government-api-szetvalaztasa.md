# ADR-05: A Government API Szolgáltatás Szétválasztása az Email Core-tól

**Státusz:** Elfogadva  
**Dátum:** 2026-05-10  
**Szereplők:** Félegyházi Gergő, Sopronyi Zoltán, Nagyházi Zita

---

## Kontextus

A MundaMail két alapvetően különböző levelezési forrást kezel egyidejűleg:

1. **Állampolgár-kezdeményezett levelezés:** Az állampolgár aktívan nyit meg egy klienst, ír levelet, elküldi – ez hagyományos IMAP/SMTP forgalom, ahol a felhasználó az aktor.

2. **Hivatal-kezdeményezett üzenetküldés:** Egy állami rendszer (egészségügy, adóhivatal, bíróság) REST API-n keresztül csomagolt payloadot küld – tartalmazza a szövegsablont, a dinamikusan behelyettesítendő adatokat (pl. az érintett ügyszámát), és esetleg a tracking igényt. A hivatal a MundaMailt fekete dobozként használja: üzenetet ad be, kézbesítést vár.

Ez a két felhasználási minta számos dimenzióban tér el egymástól: az autentikáció típusában, a hívói kör jellegében, a terhelési mintában, a biztonsági és auditnaplózási elvárásokban, valamint a jövőbeli bővítési irányokban.

Az esettanulmány megemlíti, hogy "a távlati célok között szerepel az API megnyitása, hogy vállalkozások is üzenjenek a MundaMailen keresztül" – ez a jövőbeli bővítési irány szintén befolyásolja a döntést.

---

## Kihívás

Szembesülve azzal, hogy:

- Ha a hivatal REST API hívásai és az állampolgárok IMAP/SMTP forgalma ugyanazon a szervizrétegen megy keresztül, egy tömeges kampány indítása közvetlenül ronthatja az interaktív levelezés teljesítményét – ez NF-PER-01 sérülés.
- A hivatal API-hívásait API kulccsal és kampány-auditációval kell kezelni, míg az állampolgári IMAP/SMTP hozzáférést felhasználónév/jelszó + TLS autentikációval. Ezek keveredése egyetlen szervizben növeli a biztonsági felületet és nehezíti a hozzáférés-kontrollt.
- A tracking és auditálási kötelezettség kizárólag a hivatal-kezdeményezett üzenetekre vonatkozik (az SRS szerint "nem mindegyik" üzenethez, de az érintett üzenetekhez kötelező). Az állampolgárok egymás közötti levelezésénél nincs ilyen elvárás. Egy közös szervizben ezt a szétválasztást nehéz tisztán megvalósítani.
- A sablonmotort (dinamikus adatbehelyettesítés, pl. "Kedves {{nev}}!"), a kampánykezelést (Campaign ID generálás, állapotkövetés) és a sorba állítást (Sending Queue) csak a hivatal-oldalon kell implementálni – az Email Core-ban nincs rájuk szükség.

---

## Döntés

**Különálló Government API Service komponenst** hozunk létre, amely a Email Core Service-től fizikailag és logikailag elkülönített:

1. **Government API Service felelősségi köre:**
   - REST API végpontok fogadása állami hivatalok számára (F-API-01)
   - API kulcs alapú autentikáció és jogosultságkezelés (F-ADM-01, F-ADM-02)
   - Dinamikus sablonbehelyettesítés (F-API-02): a hivatal paramétereinek illesztése az üzenetsablonba
   - Campaign ID generálás és visszaadás (F-API-03)
   - Üzenetek perzisztens Sending Queue-ba helyezése
   - Kampány-metaadatok naplózása az Audit Log-ba

2. **Email Core Service felelősségi köre:**
   - IMAP és SMTP protokoll kiszolgálása
   - Levelek tárolása és olvasása a Mailbox Store-ból
   - A Sending Queue-ból érkező kész, személyre szabott üzenetek kézbesítése

3. **A kommunikáció iránya:** A Government API Service sohasem ír közvetlenül a Mailbox Store-ba. Az egyetlen érintkezési felület a Sending Queue: a Government API Service termel (producer), az Email Core Service fogyaszt (consumer). Ez biztosítja a lazán csatolt (loosely coupled) architektúrát.

4. **Jövőbeli bővítési pont:** Az API Gateway szintjén egy harmadik hívói csoport (vállalkozások) bekötése elvégezhető anélkül, hogy az Email Core Service-t módosítani kellene – csupán a Government API Service hozzáférési rétegét kell kibővíteni.

---

## Elvetett alternatívák

**Egyetlen, egységes backend szerviz:** Legkevesebb komponens, legegyszerűbb deployment. Azonban a két forgalomtípus keveredése teljesítményromlást okozna tömeges küldés idején, és a biztonsági szétválasztás nehézkes lenne. A jövőbeli vállalkozói API bővítés is bonyolultabb lenne egy monolitikus struktúrában.

**A Government API Service közvetlenül ír a Mailbox Store-ba, kihagyva az Email Core-t:** Gyorsabb kézbesítés, kevesebb komponens. Azonban az IMAP protokoll és a Mailbox Store formátuma szorosan összekapcsolt – ha a hivatal közvetlenül ír a tárolóba, bypassolja a protokollréteget, ami inkonzisztenciához és inkompatibilis üzenetformátumhoz vezethet. Az Email Core elveszíti az egyetlen forrásként (single source of truth) betöltött szerepét.

**Külső, dedikált Marketing / Transactional Email Szoftver (pl. Mailchimp-szerű on-premise):** Bevált, funkciógazdag megoldás tömeges küldésre. Azonban: (a) adatlokalizációs kihívás, (b) az állami adat elhagyja a MundaMail rendszerhatárát, (c) az audit és tracking integrációja bonyolultabb külső rendszernél, (d) felesleges redundancia, ha a MundaMail saját Email Core-ja egyébként is kezeli a kézbesítést.

---

## Elérendő célok

- Az állampolgárok interaktív levelezését nem befolyásolja, ha egy hivatal egyszerre 3 millió értesítőt küld el, mivel a két forgalomtípus szétválasztott feldolgozási útvonalon halad.
- Az állami hivatalok autentikációja, jogosultságkezelése és auditálása izolált kontextusban valósul meg – az Email Core nem tartalmaz hivatal-specifikus logikát.
- A sablonmotort, a kampánykezelést és a dinamikus behelyettesítést egyetlen helyen kell fejleszteni és karbantartani.
- A jövőbeli "vállalkozói API" bővítés (esettanulmány kiegészítés) az API Gateway + Government API Service réteg módosításával elvégezhető, az Email Core érintése nélkül.

---

## Elfogadott kompromisszumok

- **Két szerviz üzemeltetése egy helyett:** A Government API Service önálló deployment, monitoring, skálázási és hibakezelési feladatot jelent. Ez növeli az operációs terhet, bár kampányok idején a GovAPI Service-t a Sending Queue-tól függetlenül lehet skálázni.
- **A Sending Queue az integráció egyetlen pontja:** Ha a queue hibás vagy elérhetetlenné válik, a Government API Service ugyan fogadja a hívást (HTTP 202), de az üzenet kézbesítése megakad. A queue megbízhatóságának biztosítása mindkét komponens szempontjából kritikus.
- **Eventual consistency a kampánystátusznál:** A hivatal lekérdezi a kampány státuszát (F-TRK-04), de ez az állapot aszinkron frissül az Audit Log-ban. Valós idejű, percre pontos riporting nem lehetséges – ez a use case szempontjából elfogadható, de kommunikálni kell a hivatalok felé.
