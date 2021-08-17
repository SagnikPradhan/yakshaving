import { K } from "@yakshaving/kanaphig/core/k";
import { sources } from "@yakshaving/kanaphig/plugins/sources";
import { utilities } from "@yakshaving/kanaphig/plugins/utilities";

export default new K({
  plugins: [utilities(), sources()],

  schema: ({ env, chain }) => ({
    discord: {
      token: chain(env("DISCORD_TOKEN")),
    },
  }),
});
