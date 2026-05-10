---
title: "Architekturálisan szignifikáns követelmények"
description: "Az azonosított architekturálisan szignifikáns követelmények."
---

## ZDR általános követelmények

### Takarékosság

Zamunda nem szegény ország, de feleslegesen nem is akarja szórni a pénzt: a projektek tervezésénél törekedni kell a takarékosságra. Szintén ezt igénylik a klímabarát célok!

### Szigorú adatlokalizáció és adatvédelem

A rendszert szigorúan Zamunda területén belül kell üzemeltetni és az adatokat is itt kell tárolni. Továbbá kimagasló fontosságú az adatok biztonságos, titkosított kezelése.

### Hiányos internetlefedettség

Figyelembe kell venni, hogy a működési környezetben, Zamunda bizonyos területein az internetlefedettség hiányos, a sávszélesség alacsony, a hálózati késleltetés pedig magas lehet.

## Minőségi jellemzők

Az előzőleg azonosított [architekturális karakterisztikának](./ac.md) tekinthető minőségi attribútumok az alábbiak:

- Skálázhatóság
- Adatlokalizáció
- Biztonság
- Adatvédelem
- Robusztusság
- Hibatűrés
- Auditálhatóság
- Tartósság


## Szignifikáns funkcionális követelmények

### F-MAIL-02

A leveleket a felhasználó által kezdeményezett explicit törlésig korlátlan ideig (potenciálisan örökké) meg kell őrizni.

**Miért ASR?**

- A 10 millió felhasználó évtizedek alatt felhalmozott levelezése petabájtos nagyságrendű adattömeget jelenthet.
- Az adatbázis-architektúrának hatékonyan kell kezelnie a hatalmas mennyiségű adatot, valószínűleg megkövetelve a gyakran olvasott és ritkán olvasott, archív tárhelyek architekturális szétválasztását a költséghatékonyság miatt.
- A tárolási megoldásnak extrém módon ellenállónak kell lennie a hardverhibákkal és a hardveres adatromlással szemben.

### F-API-01

A rendszer biztosít egy REST API végpontot egyedi és tömeges üzenetek fogadására.

**Miért ASR?**

- Az állami hivatalok esetenként több millió címzettnek küldhetnek ki értesítést egyszerre.
- Ezt a hirtelen, ugrásszerű terhelést az architektúra nem dolgozhatja fel azonnal, szinkron módon. Erősen indokolja egy aszinkron, üzenetsor-alapú architektúra bevezetését az API gateway és a levelező motor között.

### F-TRK-01 és F-TRK-02

A rendszer képes rögzíteni az elküldött email sikeres kézbesítését, valamint a megnyitás pontos időbélyegét.

**Miért ASR?**

- Mivel a hivatalos kommunikációnál jogi lépések vagy határidők múlhatnak ezen, a naplózási architektúrának megváltoztathatatlannak és visszakereshetőnek kell lennie.
- Ez nem oldható meg egyszerű adatbázis rekordok frissítésével. Egy dedikált, biztonságos, csak hozzáfűzhető naplózó alrendszert  tesz szükségessé.

