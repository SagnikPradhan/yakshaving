import { K } from "@yakshaving/kanaphig/core/k";
import { env } from "@yakshaving/kanaphig/plugins/sources/env";
import { compose } from "@yakshaving/kanaphig/plugins/utilities/compose";

export default new K({
  plugins: [env({ prefix: "EXAMPLE_KANAPHIG" })],

  schema: ({ env }) => ({
    discord: {
      token: compose([env.value("DISCORD_TOKEN")]),
    },
  }),
});
