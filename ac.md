---
title: "Architekturális karakterisztikák"
description: "Az azonosított architekturális karakterisztikák."
---

# Architekturális karakterisztikák

## Skálázhatóság

**Mit jelent?**
-

**Miért fontos?**
- A rendszernek a teljes zamundai lakosságot, mintegy 10 millió felhasználót kell kiszolgálnia. Amikor az állami hivatalok tömeges tájékoztatókat (pl. adóbevallási határidők, országos vészhelyzet) küldenek ki, a másodpercenkénti kérések (request) száma drasztikusan megnőhet. A rendszernek képesnek kell lennie a feldolgozó kapacitás dinamikus növelésére, hogy a levelek sorba állítása és kiküldése ilyenkor se okozzon lassulást vagy szolgáltatás-kiesést.

## Biztonság 

**Mit jelent?**
-

**Miért fontos?**
- A MundaMail nemcsak privát levelezéseket, hanem rendkívül szenzitív állami adatokat (pl. egészségügyi kezelések, adóügyek, nyugdíj) továbbít és tárol. Egy sikeres támadás vagy adatszivárgás a teljes államigazgatásba vetett bizalmat megrengetné.

## Adatvédelem

**Mit jelent?**
-

**Miért fontos?**
- A felhasználók emailjeit titkosítva kell tárolni.

## Adat lokalizáció

**Mit jelent?**
-

**Miért fontos?**
- Kimagasló fontossággal bír a rendszer által kezelt adatokat Zamunda területén belül kell tárolni, üzemeltetni

## Robusztusság

**Mit jelent?**
-

**Miért fontos?**
- A ZDR program figyelembe veszi, hogy Zamunda bizonyos területein az internetlefedettség hiányos, a sávszélesség alacsony, a késleltetés pedig magas lehet.

## Hibatűrés

**Mit jelent?**
-

**Miért fontos?**
- Ha egy állampolgár épp egy hivatali ügyet intéz, vagy egy hivatal kiküld egy fontos levelet, egy pillanatnyi hálózati szakadás vagy egy szerver-node leállása miatt az üzenet nem veszhet el a semmiben.

## Bővíthetőség

**Mit jelent?**
-

**Miért fontos?**
- A jelenlegi követelmény az állami rendszerek (egészségügy, nyugdíj) kiszolgálása, de a távlati célok között szerepel az API megnyitása külső vállalkozások (pl. csomagküldők) felé is, kikerülve a klasszikus email protokollokat.

## Tartósság

**Mit jelent?**
-

**Miért fontos?**
- A leveleket a felhasználó által kezdeményezett explicit törlésig meg kell őrizni, ami azt jelenti, hogy potenciálisan örökké tárolni kell őket.