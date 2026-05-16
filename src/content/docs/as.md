---
title: "Architekturális stílus"
description: "A választott architekturális stílus leírása."
---

A projekthez választott architekturális stílusok az alábbiak:
- Event-driven architecture.
- Space Based architecture.

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

## Miért Space Based architecture?

### Illeszkedés

Ezt a stílust a Felhasználói Postafiók Kezelő és Adminisztrációs alrendszerhez alkalmazzuk, ahol a 10 millió állampolgár egyidejű, interaktív postafiók-hozzáférése extrém párhuzamos terhelést jelent az adatrétegen, és az adatbázis mint szűk keresztmetszet elleni védekezés architekturális prioritás.

- Az **in-memory data grid (IMDG)** megszünteti az adatbázis-lekérdezéseket a kritikus olvasási útvonalról: az aktív postaládák adatai memóriában élnek, így a levelek listázása és a mappakezelés szub-milliszekundumos válaszidőn valósul meg. Ez az egyetlen módja az NF-PER-01 követelmény (p90 < 500 ms) teljesítésének 10 milliós felhasználói bázis mellett, a magas zamundai hálózati késleltetés ellenére is.
- A **Processing Unit-ok (PU)** az állampolgárok partíciói szerint skálázhatók horizontálisan: minden PU a felhasználók egy szeletét kezeli, így a terhelés lineárisan elosztható, és egy-egy PU meghibásodása nem érinti a többi partíciót.
- A **Data Pump + Data Writer réteg** aszinkron módon szinkronizálja a memóriában végzett módosításokat a perzisztens Mailbox Store-ra, garantálva az adattartósságot (F-MAIL-02) anélkül, hogy szinkron adatbázis-írás lassítaná az interaktív műveletek válaszidejét.

### Kompromisszumok

A Space Based architektúra erőforrásigényes: az aktív postaládák in-memory replikációja magas memóriafoglalást és magasabb infrastrukturális költséget jelent, amit a ZDR program takarékossági elvei ellenében el kell fogadni. Az in-memory data grid konzisztenciájának kezelése (cache invalidáció, replikáció) jelentős üzemeltetési komplexitást hoz, és a fejlesztőcsapat mélyebb ismereteket igényel az IMDG technológiákhoz (pl. Hazelcast, Apache Ignite).