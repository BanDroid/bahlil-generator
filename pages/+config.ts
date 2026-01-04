import type { Config } from "vike/types";
import vikePhoton from "vike-photon/config";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: "Bahlil Generator",
  description:
    "Ubah dirimu menjadi Bahlil agar kamu bisa merasakan sensasi menjadi Ketum Golkar.",

  extends: [vikeReact, vikePhoton],

  // https://vike.dev/vike-photon
  photon: {
    server: "../server/entry.ts",
  },
} satisfies Config;
