---
title: "ADR-05: Stateless API Authentication"
description: "Az API végpontokon és a hivatali rendszereknél alkalmazott hitelesítési mechanizmust leíró ADR."
---

# ADR-05: Stateless API Authentication

**Státusz:** Elfogadva  
**Dátum:** 2026-05-10  
**Szereplők:** Félegyházi Gergő, Sopronyi Zoltán, Nagyházi Zita

---

## A következő kontextusban:

- a MundaMail rendszer REST API és publikus interfészei

---

## szembesülve a

- 10 millió egyidejűleg aktív felhasználó és számos állami API felől érkező masszív forgalommal, amely extrém horizontal scalability-t és alacsony késleltetést (< 500ms p90) követel

---

## a következő mellett döntöttünk:

- a stateless authentication bevezetése JSON Web Tokens (JWT) használatával

---

## és elvetettük:

- a stateful, elosztott memóriában (pl. Redis) vagy relációs adatbázisokban tárolt session-based hitelesítést

---

## annak érdekében, hogy elérjük:

- a nulla adatbázis-lekérdezéssel járó hitelesítési folyamatot, kizárólag a kriptográfiai aláírások ellenőrzésére támaszkodva,
- a zökkenőmentes horizontal scaling-et a komplex session replication vagy a sticky sessions szükségszerűsége nélkül a szerver csomópontok között,
- és a csökkentett általános memory footprint-et, amely igazodik a ZDR klímabarát céljaihoz

---

## elfogadva a

- a tokenek azonnali visszavonásának rendszerszintű hiányosságát, ami további komplexitás (pl. rendkívül rövid élettartamú tokenek és refresh token rotation) implementálása nélkül nem oldható meg,
- az esetlegesen alacsony sávszélességű zamundai hálózatokon küldött nagyobb HTTP payload méretet,
- és a biztonságos Key Management Systems iránti szigorú követelményt az aláíró kulcsok védelme érdekében.
