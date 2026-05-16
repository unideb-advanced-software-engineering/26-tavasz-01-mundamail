=======
title: "ADR-01: Hibrid Architektúrális Stílus"
description: "Döntés az Event-driven Architecture (EDA) tömeges küldéshez és a Service Based Architecture (SBA) interaktív levelezéshez hibrid kombinációja mellett, a két eltérő alrendszer eltérő minőségi követelményeinek optimális kiszolgálása érdekében."
---

# ADR-01: Hibrid Architektúrális Stílus – Event-driven Architecture (EDA) és Service Based Architecture (SBA)

**Státusz:** Elfogadva  
**Dátum:** 2026-05-10  
**Szereplők:** Félegyházi Gergő, Sopronyi Zoltán, Nagyházi Zita

---

## A következő kontextusban:

- A teljes MundaMail rendszer

## szembesülve a

Szembesülve azzal, hogy:

- különböző minőségi követelményekkel a tömeges levélfeldolgozás (extrém rugalmasság) és felhasználói postafiókok kezelése (szigorú adatintegritás) és skálázhatóság vagy hibatűrés terén

---

## a következő mellett döntöttünk:

- egy hibrid architektúra, amely ötvözi a Space Based (SBA) és az Event Driven (EDA) architektúrát.
---

## és elvetettük:

- egyetlen architekturális stílus, például tisztán Monolit vagy tisztán Mikroszolgáltatások választását

- **Tisztán szinkron monolith (egyetlen egységes backend):** Egyszerűbb fejleszteni és üzemeltetni, de a tömeges kiküldés pillanatában a teljes rendszer válaszképtelenné válna. Egy 1 millió leveles kampány szinkron indítása akkora terhelési csúcsot generálna, amelyet nem lenne gazdaságosan kivédhető kapacitástartalékkal kezelni. Az SBA durvaszemcsés, de mégis elkülönített szolgáltatásai rugalmasabb skálázást tesznek lehetővé.

- **Tisztán Event-driven Architecture (EDA) minden műveletre (CQRS-sel):** Maximális dekupling és rugalmasság, de az IMAP/SMTP protokoll természeténél fogva szinkron – a levelezőkliens szinkron kapcsolatban vár a szerverre. Az olvasási műveletek eseményvezéreltté tétele mesterséges bonyolultságot hozna, inkompatibilis lenne a szabványos email protokollokkal, és feladná az adatbázisszintű ACID tranzakciókat, amelyek az adatintegritáshoz kritikusak.

- **Serverless (FaaS) architektúra:** Az egyenetlen zamundai internetlefedettség és az on-premise infrastrukturális követelmény kizárja a publikus felhős FaaS megoldásokat; saját, on-premise FaaS platform kiépítése pedig aránytalanul nagy befektetés lenne.

## SBA&EDA

- **Service Based Architecture (SBA)** az interaktív levelezési és adminisztrációs műveleteknél: durvaszemcsés szolgáltatások (Email Core Service, User Management) IMAP/SMTP protokoll-kiszolgálással, frontend ↔ API Gateway ↔ Email Core Service kommunikáció, logikailag particionált, közös adatbázissal. Az adatbázisszintű ACID tranzakciók és a kevesebb hálózati ugrás biztosítják a válaszidőre vonatkozó NF-PER-01 követelmény (p90 < 500 ms) teljesíthetőségét.

- **Event-driven Architecture (EDA)** a tömeges és kormányzati üzenetek teljes küldési folyamatánál: a Government API Service a bejövő kampányt egyből egy perzisztens üzenetsorba (Sending Queue) helyezi, HTTP 202 Accepted választ ad, majd a háttérben az Email Core Service dolgozza fel a sorból az üzeneteket.
---

## annak érdekében, hogy elérjük:


- a különböző minőségi követelmények kielégítését anélkül, hogy bevezetnénk a mikroszolgáltatások hatalmas hálózati terhelését és Kubernetes költségeit, miközben továbbra is képesek vagyunk kezelni az állami kommunikáció aszinkron terhelési csúcsait
---

## Elfogadott kompromisszumok

- **Megnövelt rendszerkomplexitás:** Az EDA és SBA stílusok egyidejű fenntartása két különböző gondolkodásmódot igényel a fejlesztőcsapattól. Az onboarding és a hibaelhárítás bonyolultabb lesz, mint egy homogén stílus esetén (vö. `as.md` kompromisszumok).
- **Eventual consistency a tömeges küldésnél:** A hivatal HTTP 202-t kap a kampány beadásakor, de a tényleges kézbesítés percekkel vagy órákkal később történik. Ez elfogadható az értesítők jellegéből adódóan, de a státuszlekérdezési igényt (F-TRK-04) kezelni kell.
- **Üzenetsor mint kritikus infrastruktúra:** A Sending Queue meghibásodása megakasztja a tömeges kiküldést. A queue monitorozása, replikálása és magas rendelkezésre állásának biztosítása kötelező üzemeltetési feladat.