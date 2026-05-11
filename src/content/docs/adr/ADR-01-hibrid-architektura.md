---
title: "ADR-01: Hibrid Architektúrális Stílus"
description: "Döntés az event-driven tömeges küldés és a szinkron request/response olvasás hibrid kombinációja mellett, a két eltérő terhelési minta optimális kiszolgálása érdekében."
---

# ADR-01: Hibrid Architektúrális Stílus – Event-driven küldés, Request/Response olvasás

**Státusz:** Elfogadva  
**Dátum:** 2026-05-10  
**Szereplők:** Félegyházi Gergő, Sopronyi Zoltán, Nagyházi Zita

---

## Kontextus

A MundaMail egy ~10 millió állampolgárt kiszolgáló, állami levelezési platform, amely egyszerre kénytelen kielégíteni két, egymástól gyökeresen eltérő felhasználási mintát:

1. **Olvasás és interaktív levelezés:** Az állampolgárok napközben folyamatosan nyitják meg a beérkező leveleket, írnak és fogadnak üzeneteket. Ezek az interakciók rövid, szinkron kérés-válasz ciklusok, ahol a felhasználó azonnali visszajelzést vár – a válaszidő közvetlenül befolyásolja az élményt.

2. **Tömeges kiküldés állami hivataloktól:** Egy-egy hivatal akár millió állampolgárnak is küldhet egyetlen kampányüzenetet (pl. adóbevallási határidő-emlékeztető, kötelező szűrővizsgálati értesítő). Ezek az események percek alatt hatalmas terhelést generálnak, amelyet a rendszernek úgy kell elnyelnie, hogy sem az interaktív levelezés minősége ne romoljon, sem üzenet el ne vesszen.

Ezen felül a ZDR program klímabarát és takarékossági elvei megkövetelik, hogy az infrastruktúra ne legyen túlméretezett az átlagos terhelésre, mégis kezelnie kell a csúcsterhelési helyzeteket.

---

## Kihívás

Szembesülve azzal, hogy:

- Egyetlen architektúrális stílus nem képes optimálisan kiszolgálni mindkét terhelési mintát: egy tisztán szinkron, kérés-válasz rendszer a tömeges kiküldés pillanatában összeomlana, míg egy tisztán aszinkron, event-driven megközelítés felesleges bonyolultságot vinne az egyszerű IMAP/SMTP műveletekbe.
- A hálózati lefedettség Zamundában egyenetlen: egyes területeken magas a késleltetés és alacsony a sávszélesség, ami az aszinkron mintát kifejezetten előnyössé teszi a nem időkritikus, tömeges műveletekhez.
- Az állami kommunikáció megbízhatósága jogi és politikai elvárás: ha egy hivatal elindít egy kampányt, minden egyes üzenetnek el kell jutnia a címzetthez.

---

## Döntés

**Hibrid architektúrát** választottunk, amely két megkülönböztetett kommunikációs mintát alkalmaz:

- **Request/Response (szinkron)** az interaktív levelezési műveleteknél: IMAP/SMTP protokoll-kiszolgálás, frontend ↔ API Gateway ↔ Email Core Service kommunikáció. A válaszidőre vonatkozó NF-PER-01 követelmény (p90 < 500 ms) csak így teljesíthető.

- **Event-driven (aszinkron)** a tömeges és kormányzati üzenetek teljes küldési folyamatánál: a Government API Service a bejövő kampányt egyből egy perzisztens üzenetsorba (Sending Queue) helyezi, HTTP 202 Accepted választ ad, majd a háttérben az Email Core Service dolgozza fel a sorból az üzeneteket.

---

## Elvetett alternatívák

**Tisztán szinkron monolith:** Egyszerűbb fejleszteni és üzemeltetni, de a tömeges kiküldés pillanatában a teljes rendszer válaszképtelenné válna. Egy 1 millió leveles kampány szinkron indítása akkora terhelési csúcsot generálna, amelyet nem lenne gazdaságosan kivédhető kapacitástartalékkal kezelni.

**Tisztán event-driven / CQRS minden műveletre:** Maximális dekupling és skálázhatóság, de az IMAP/SMTP protokoll természeténél fogva szinkron – a levelezőkliens szinkron kapcsolatban vár a szerverre. Az olvasási műveletek eseményvezéreltté tétele mesterséges bonyolultságot hozna, és inkompatibilis lenne a szabványos email protokollokkal.

**Serverless (FaaS) architektúra:** Az egyenetlen zamundai internetlefedettség és az on-premise infrastrukturális követelmény kizárja a publikus felhős FaaS megoldásokat; saját, on-premise FaaS platform kiépítése pedig aránytalanul nagy befektetés lenne.

---

## Elérendő célok

- Az interaktív levelezés válaszideje kiszámítható és rövid marad tömeges kiküldések alatt is, mivel a két forgalomtípus szétválasztott feldolgozási úton halad.
- A tömeges üzenetküldés megbízható és elveszthetetlenné válik a perzisztens üzenetsor révén.
- Az infrastruktúra méretezése a tényleges terhelési profilhoz igazítható: az interaktív réteg kis, stabil kapacitással futhat, míg a Sending Queue fogyasztói horizontálisan skálázhatók kampányok idején.
- A ZDR program takarékossági és klímabarát elvei teljesülnek: nincs állandóan üzemelő, csúcsterhelésre méretezett "standby" kapacitás.

---

## Elfogadott kompromisszumok

- **Megnövelt rendszerkomplexitás:** Két különböző kommunikációs minta fenntartása két különböző gondolkodásmódot igényel a fejlesztőcsapattól. Az onboarding és a hibaelhárítás bonyolultabb lesz, mint egy homogén stílus esetén.
- **Eventual consistency a tömeges küldésnél:** A hivatal HTTP 202-t kap a kampány beadásakor, de a tényleges kézbesítés percekkel vagy órákkal később történik. Ez elfogadható az értesítők jellegéből adódóan, de a státuszlekérdezési igényt (F-TRK-04) kezelni kell.
- **Üzenetsor mint kritikus infrastruktúra:** A Sending Queue meghibásodása megakasztja a tömeges kiküldést. A queue monitorozása, replikálása és magas rendelkezésre állásának biztosítása kötelező üzemeltetési feladat.
