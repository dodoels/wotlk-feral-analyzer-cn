# Wrath Feral Druid Log Analyzer

To build and run locally, you'll either need [Angular CLI](https://github.com/angular/angular-cli) (built with v14.2.2)
or [Yarn](https://yarnpkg.com/). If you're familiar with ng-cli commands, you can use those.

### Yarn Commands

> `yarn install` - download and install node dependencies
> 
> `yarn serve`   - run locally at http://localhost:4200
> 
> `yarn build`   - build distributable (dist/shadow)

### Live Site

https://korbrawr.github.io/feral

### Gameplay Basics

For more information, or for questions about feral druid gameplay, check out #wotlk-feral-dps in [druid discord](https://discord.gg/classicdruid).

<!-- ### Configuration Settings

For information on analyzer settings, see [Configuration Settings](SETTINGS.md)

### Glossary

Definitions of stats/terms available via the [Glossary](GLOSSARY.md). -->

### Credits

Almost the entirety of the underlying information about how to maximize performance as a feral druid comes from
[druid discord](https://discord.gg/druidclassic).
<!-- Special thanks to NerdEgghead for his organizing efforts, Linelo for him theorycrafting and sim work, and BTGF for being the best. -->


### Changelog
- March 9th, 2023
  - Initial support for Feral!
  - ** Known Issues **
    - If the 2 piece bonus for tier 7 cannot be inferred from the log(gear information may be missing), you may get incorrect values for rip ticks and damage.
    - Energy is not display for certain events (during bearform or shifts)