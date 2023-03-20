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
Special thanks to NerdEgghead for his theorycrafting and sim work, as well as all other druid friends who have helped elevate cat play in the theorycrafting thread.


### Changelog
- March 19, 2023
  - Changed SR tab to be a rip/SR tab


- March 13, 2023
  - Added Combo Point tracker
  - Adjusted leeway for non-dot events

- March 9th, 2023
  - Updated missing gear warning to be more specific about tier 7 2piece bonus possible incorrect values.
  - Fixed an issue where savage roar duration was being doubled when gear didn't exist in log.
  - Fixed an issue where lacerate and maul damage events were being applied to the wrong casts.
  

- March 9th, 2023
  - Initial support for Feral!
  - ** Known Issues **
    - If the 2 piece bonus for tier 7 cannot be inferred from the log(gear information may be missing), you may get incorrect values for rip ticks and damage. IE: it may show that you missed rip ticks when you did not, etc.
    - Warnings / alerts (yellow, red colors on the left hand side of casts) have not yet been updated to reflect data that is meaningful to feral druids.
    - Some information shown on casts has not been tailored to feral druids yet such as cast time or delay.