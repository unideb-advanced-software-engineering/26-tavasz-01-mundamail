---
title: "ADR-02: Asynchronous Message Broker Topology"
description: "A tömeges üzenetfeldolgozáshoz és nyomon követéshez választott bróker topológiát leíró ADR."
---

# ADR-02: Asynchronous Message Broker Topology

**Státusz:** Elfogadva  
**Dátum:** 2026-05-10  
**Szereplők:** Félegyházi Gergő, Sopronyi Zoltán, Nagyházi Zita

---

## A következő kontextusban:

- a MundaMail tömeges levélfeldolgozó és eseménykövető alrendszere

---

## szembesülve a

- az állami hivatalok felől érkező, akár milliós nagyságrendű hirtelen API forgalommal, amely magas throughputot és megváltoztathatatlan audit naplókat követel meg a jogi megfeleléshez

---

## a következő mellett döntöttünk:

- az Apache Kafka, mint distributed event streaming platform alkalmazása

---

## és elvetettük:

- a RabbitMQ vagy más hagyományos, transient message queue-k használatát

---

## annak érdekében, hogy elérjük:

- a másodpercenkénti több millió üzenet sequential disk I/O feldolgozását,
- a perzisztens, append-only event logokat az állami kommunikáció letagadhatatlan jogi nyomon követéséhez,
- és az extrém fault tolerance-t adatvesztés nélkül egy esetleges infrastruktúra-összeomlás során

---

## elfogadva a

- a fejlesztőcsapat számára technológiai és koncepcionális megértése sokkal nagyobb kihívást és több betanulási időt jelent,
- a Kafka clusterek (és a ZooKeeper/KRaft protokollok) lokális, zamundai üzemeltetésének komplexitását,
- és a RabbitMQ-hoz képest hiányzó, natív komplex message routing konfigurációk hiányát.
