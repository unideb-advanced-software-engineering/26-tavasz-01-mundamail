// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import react from "@astrojs/react";
import { LikeC4VitePlugin } from "likec4/vite-plugin";

// https://astro.build/config
export default defineConfig({
  site: "https://unideb-advanced-software-engineering.github.io",
  base: "/26-tavasz-01-mundamail",
  vite: {
    plugins: [LikeC4VitePlugin({})],
  },
  integrations: [
    starlight({
      title: "MundaMail",
      defaultLocale: "hu",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/unideb-advanced-software-engineering/26-tavasz-01-mundamail",
        },
      ],
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Esettanulmány",
          slug: "esettanulmany",
        },
        {
          label: "SRS",
          link: "/srs-mundamail.docx",
        },
        {
          label: "Architekturális karakterisztikák",
          slug: "ac",
        },
        {
          label: "Architekturálisan szignifikáns követelmények",
          slug: "asr",
        },
        {
          label: "Architekturális stílus",
          slug: "as",
        },
        {
          label: "C4 diagramok",
          slug: "c4",
        },
        {
          label: "Döntési jegyzőkönyvek",
          items: [{ autogenerate: { directory: "adr" } }],
        },
      ],
    }),
    react(),
  ],
});