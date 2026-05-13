---
title: "ADR-01: Architekturális Stílus"
description: "A választott architekturális stílust leíró ADR."
---

# ADR-01: Architekturális Stílus

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

---

## annak érdekében, hogy elérjük:k

- a különböző minőségi követelmények kielégítését anélkül, hogy bevezetnénk a mikroszolgáltatások hatalmas hálózati terhelését és Kubernetes költségeit, miközben továbbra is képesek vagyunk kezelni az állami kommunikáció aszinkron terhelési csúcsait

---

## elfogadva a

- megnövekedett integrációs komplexitást,
- a végleges konzisztencia kihívásait a tömeges levélküldések során,
- a többlet üzemeltetési terhet,
- és a többlet karbantartási terhet.
