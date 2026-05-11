---
title: "ADR-03: Különálló, Módosíthatatlan Auditnapló"
description: "Döntés egy önálló, append-only Audit Log alrendszer kialakítása mellett, amely jogi bizonyítékként is felhasználható naplókat tárol az állami levelek megnyitási és törlési eseményeiről."
---

# ADR-03: Különálló, Módosíthatatlan Auditnapló – Append-only Audit Log alrendszer

**Státusz:** Elfogadva  
**Dátum:** 2026-05-10  
**Szereplők:** Félegyházi Gergő, Sopronyi Zoltán, Nagyházi Zita

---

## Kontextus

Az esettanulmány szerint az állami hivatalok által küldött egyes üzenetekhez "alapvető auditálási lehetőségeket kell biztosítani": az üzenet megnyitásának és törlésének rögzítése kötelező. Ezen felül az SRS Business Rules szakaszában (BR-02) szerepel, hogy az nyomonkövetési adatokat az állam adatkezelési törvényeinek megfelelően kell megőrizni.

A kontextus megértéséhez kulcsfontosságú belátni, hogy ezek az audit rekordok nem egyszerű logok, hanem **jogi bizonyítékokként** is funkcionálhatnak. Ha például egy állampolgár azt állítja, hogy nem kapta meg a bírósági idézését, vagy egy hivatal azt kell igazolja, hogy az adófizetési felszólítást kézbesítette, az audit rekord döntő bizonyíték. Egy módosítható (mutable) rekordban nem lehet megbízni jogi kontextusban – az ügyvédek és bíróságok joggal kérdőjeleznék meg az integritását.

---

## Kihívás

Szembesülve azzal, hogy:

- Egy hagyományos relációs adatbázis tábla, ahol az audit rekordok `UPDATE` vagy `DELETE` utasítással módosíthatók, nem nyújt elegendő garanciát a rekordok változatlanságára. Még ha alkalmazásrétegben tiltják is a módosítást, egy kompromittált rendszergazdai fiók vagy egy SQL injection sérülékenység visszamenőleg módosíthatná a rekordokat.
- A tracking adatokat (megnyitás, törlés időbélyege, levélazonosítója) a Mailbox Store-tól elkülönítve kell kezelni, mivel eltérő megőrzési idő, eltérő hozzáférési jogosultság és eltérő lekérdezési minta vonatkozik rájuk.
- A tracking pixel mechanizmus (F-TRK-02) nagy volumenű, nagyon rövid idő alatt beérkező írási műveletet generál: egyetlen millió leveles kampány megnyitása esetén perceken belül millió write művelet érkezhet. Ezt nem szabad a fő Mailbox Store-ba terhelni, hogy az ne befolyásolja az interaktív levelezés teljesítményét.
- A jövőben jogszabályok írhatják elő pontosan, hogy a nyomonkövetési adatokat meddig kell megőrizni (ld. TBD-2 az SRS-ben). Az audit logot úgy kell kialakítani, hogy az automatikus anonimizáció és lejárati logika utólag is beilleszthető legyen.

---

## Döntés

**Különálló, append-only Audit Log alrendszert** hozunk létre, amely fizikailag és logikailag elkülönül a Mailbox Store-tól és a User Database-től:

1. **Append-only tárolás:** Az Audit Log adatbázisba kizárólag `INSERT` műveletek engedélyezettek alkalmazásrétegből. `UPDATE` és `DELETE` műveletek az audit táblákon az alkalmazás-felhasználó számára nem elérhetők. Az adatbázis szintjén sorsorosan sértetlen sorok megvalósítható (pl. trigger-alapú védelem, row-level security).

2. **Fizikai elkülönítés:** Az Audit Log saját adatbázis-példányban (vagy legalább saját sémában, erős hozzáférés-szétválasztással) él, így a Mailbox Store kompromittálása nem érinti automatikusan az audit rekordokat.

3. **Optimalizált write path:** Az Audit Log írási útvonala (tracking pixel → Tracking Service → Audit Log) a Mailbox Store-tól teljesen független, így a nagy volumenű tracking írások nem terhelik le a levelezés olvasási/írási teljesítményét.

4. **Strukturált rekordformátum:** Minden audit rekord tartalmazza: esemény típusa (OPENED / DELETED / DELIVERED), levélazonosító (message ID), kampányazonosító (campaign ID), időbélyeg (UTC), forrás IP (anonimizálva), és az eseményt rögzítő szerver azonosítója.

5. **Lejárati és anonimizálási hook:** Az adatmodell tartalmaz egy `expires_at` mezőt, amelyet jelenleg üresre állítunk (BR-02 alapján a jogi keretrendszer meghatározása függőben van – TBD-2), de amely lehetővé teszi az automatikus anonimizáció jövőbeli bevezetését.

---

## Elvetett alternatívák

**Audit rekordok a Mailbox Store-ban, plusz oszlopként:** A legegyszerűbb megközelítés, de összeköti a két felelősségi kört, és nem ad garanciát a módosíthatatlanságra. A Mailbox Store-ba érkező nagytömegű tracking write-ok rontanák az interaktív levelezés válaszidejét.

**Fájlalapú naplózás (log fájlok, pl. syslog):** Könnyű implementálni, de nem lekérdezhető, nem strukturált, nehezen auditálható önmaga is, és a lemezre írt fájlok visszamenőleg módosíthatók. Nem megfelelő jogi bizonyítékként.

**Blockchain-alapú rögzítés:** Elméleti szinten maximális módosíthatatlanságot nyújt, de aránytalanul bonyolult, drága és felesleges egy olyan kontextusban, ahol az állam maga az üzemeltető és a szabályozó. A belső append-only megoldás jogi értelemben ugyanolyan megbízható, ha az üzemeltetési folyamatok megfelelőek.

**Harmadik feles audit SaaS szolgáltatás:** Kényelmes és bevált, de szembemegy az adatlokalizációs követelménnyel (ADR-02). Az audit adatok – amelyek tartalmazzák, hogy ki, mikor nyitott meg egy állami levelet – Zamundán kívülre kerülnének.

---

## Elérendő célok

- Az audit rekordok jogi kontextusban hiteles bizonyítékként használhatók, mert az integritásuk technikai szinten garantált.
- A tracking pixel kiszolgálásának teljesítménye (NF-PER-03: < 100 ms) teljesíthető, mivel az írás dedikált, nem terhelt alrendszerbe kerül.
- Az állami hivatal lekérdezheti egy kampány összes levelének kézbesítési és megnyitási státuszát (F-TRK-04) anélkül, hogy a Mailbox Store-t terhelné.
- A jövőbeli anonimizálási és megőrzési logika beilleszthető az adatmodell módosítása nélkül.

---

## Elfogadott kompromisszumok

- **Több adatbázis üzemeltetése:** Az Audit Log külön adatbázis-példányként üzemel, ami növeli az üzemeltetési terhet (biztonsági mentés, monitorozás, frissítések). Ezt a komplexitást indokolja a jogi elvárás.
- **Eventual consistency a státuszlekérdezésnél:** Egy-egy tracking pixel feldolgozása és az audit rekord megjelenése között néhány másodperces késés előfordulhat csúcsterhelés esetén. A valós idejű státusz nem garantált, de a végső konzisztencia igen.
- **A lejárati logika implementálatlan marad (TBD-2):** Amíg a zamundai jogalkotás nem rendezi a megőrzési időt, az audit rekordok örökre megmaradnak. Ez folyamatosan növekvő tárolási igényt jelent.
