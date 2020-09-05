# yakshaving

> Simple, Fast and Extensible wrapper around Rolup

**Installation** - `yarn add SagnikPradhan/yakshaving`

## Why?

- Much faster than conventional rollup in dev mode.
  Bundles all your deps as esm and uses them externally.
  This way your app doesnt parse all the dependencies in development mode and stays fast.

- Also uses sucrase in development mode, rather than typescript plugin.
  Without having to typecheck and being a subset of babel it is much faster than typescript.
  But don't forget to run typescript in no emit mode.

- While we abstract away and do a lot of things underhood, you have complete control
  over it using the configuration. Want to add plugins? Want to configure default plugins?
  Want to ignore some dependencies? All of that can be done in configuration file. 
  You can have typescript configuration files too!

## Documentation

> Still working on this

But you can checkout the [API Docs](https://sagnikpradhan.github.io/yakshaving/globals.html)
and also use `yakshaving build -h`

## Side Note

Help this project grow by either giving us a star or contributing!
Feeback much appreciated!
