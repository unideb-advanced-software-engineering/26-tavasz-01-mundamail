---
title: "Architekturális stílus"
description: "A választott architekturális stílus leírása."
---

A projekthez választott architekturális stílusok az alábbiak:
- Event-driven architecture.
- Service Based architecture.

## Miért két stílus?

A MundaMail (mint teljes rendszer) felbontható két, eltérő minőségi jellemzőkkel és ASR-ekkel rendelkező alrendszerre:

- Tömeges Levélfeldolgozó és Nyomon Követő (Ingestion & Tracking) Alrendszer.
- Felhasználói Postafiók Kezelő és Adminisztrációs Alrendszer.

Annak érdekében, hogy a két rendszer követelményeit minél jobban kielégíthessük, elviseljük a két stílus egyidejű fenntartásából következő:

- magasabb integrációs komplexitást,
- nehezebb végpontok közötti tesztelhetőséget,
- aszinkron határvonalakon fellépő végleges konzisztencia (eventual consistency) kezelését.

## Miért EDA?

### Illeszkedés

Az EDA stílust a Tömeges Levélfeldolgozó és Nyomon Követő alrendszerhez választottuk, mivel ez van leginkább összhangban az extrém rugalmasság (Elasticity), a hibatűrés (Fault Tolerance) és az aszinkron teljesítmény (Performance) követelményeivel.

- Az F-API-01 (tömeges küldés) okozta milliós nagyságrendű terhelési csúcsok elnyelésére az EDA Bróker (Broker) topológiája és a perzisztens üzenetsorok (Kafka/RabbitMQ) jelentik a megoldást. Ez a "backpressure" garantálja, hogy a kérések fogadása és a tényleges kézbesítés szétválasztásával a rendszer nem omlik össze, és az NF-SAF-01 elvárásnak megfelelően nincs adatvesztés.
- Az F-TRK-01/02 (nyomon követés) teljesítménykorlátját (NF-PER-03: <100ms) csak aszinkron események memóriába/sorba történő azonnali bejegyzésével lehet tartani. Az Eseményforrás-alapú (Event Sourcing) naplózás megteremti az auditálhatósághoz szükséges, megváltoztathatatlan (immutable), append-only adatbázist.

### Kompromisszumok

Nem szabad elfelejteni azonban az alábbiakat:

- Az EDA fő hátránya a rendszer átláthatóságának csökkenése és a tesztelhetőség romlása. 
- A hibakezelés összetetté válik, mivel az aszinkron események sorrendisége és a végleges konzisztencia megnehezíti a garantált szinkron válaszok adását a kliensek felé
- A fejlesztői csapatoknak fel kell készülniük a holtpontok és a versenyhelyzetek elkerülésére.

## Miért Service Based architecture?

### Illeszkedés

Ezt a stílust a Felhasználói Postafiók Kezelő és Adminisztrációs alrendszerhez alkalmazzuk, ahol nincsenek extrém, hirtelen terhelési ugrások, viszont kritikus az adatintegritás (Data Consistency), az alacsonyabb összköltség (Overall Cost) és a karbantarthatóság (Maintainability).

- Az SBA pragmatikus elosztottsága elegendő a napi 10 milliós stabil felhasználói bázis kiszolgálására, anélkül, hogy a mikroszolgáltatások irreális hálózati overheadjét vagy a Kubernetes klaszterek pazarló erőforrásigényét rászabadítaná a ZDR programra.
- A durvaszemcsés szolgáltatások és a logikailag particionált (de fizikailag esetleg közös) adatbázisok lehetővé teszik a klasszikus ACID tranzakciókat az adatbázisszinten. Ez kritikus fontosságú, amikor a felhasználók mappákat mozgatnak vagy leveleket törölnek, biztosítva az elvárt szinkron adatintegritást.
- Kevesebb a szolgáltatások közötti hálózati ugrás, így a magas késleltetésű zamundai hálózatok ellenére a REST API válaszidők stabilabban tarthatók a p90 < 500ms tartományban (NF-PER-01).

### Kompromisszumok

Az SBA nem remekel a rugalmasság terén, így ha a jövőben a felhasználói felület is hirtelen terhelési csúcsokat kapna, a durvaszemcsés szolgáltatások együttes skálázása nehézkes és erőforráspazarló lehet. Emellett, ahogy a rendszer funkciói bővülnek, az evolúciós képesség korlátai miatt kihívást jelenthet a monolitikusabb jellegű szolgáltatások módosítása.