---
title: "Architekturálisan szignifikáns követelmények"
description: "Az azonosított architekturálisan szignifikáns követelmények."
---

## ZDR általános követelmények

### Takarékosság

Zamunda nem szegény ország, de feleslegesen nem is akarja szórni a pénzt: a projektek tervezésénél törekedni kell a takarékosságra. Szintén ezt igénylik a klímabarát célok!

## Minőségi jellemzők

Az előzőleg azonosított [architekturális karakterisztikának](./ac.md) tekinthető minőségi attribútumok az alábbiak:

- Skálázhatóság
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