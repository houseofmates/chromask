# 9.0.0

- the settings page didn't allow you to manually add hosts if you are on firefox esr 115. it does now.
- chromask now spoofs some basic client hints usage to address the now more commonly occuring sniffs for it. more precisely, it sets the `sec-ch-ua`, `sec-ch-ua-mobile`, and `sec-ch-ua-platform` headers - and it shims the `navigator.useragentdata` object to include `.brands`, `.mobile`, and `.platform`. this should get users past currently known instances of ch sniffing, and this can be expanded in the future.

# 8.0.0

the addon now removes `window.installtrigger` to pass very common patterns like `if ("installtrigger" in window)` or `if (typeof window.installtrigger !== "undefined")`.

# 7.0.1

fixed multiple regressions when running chromask in firefox for android. firefox for android now correctly uses a chrome android user agent string, not chrome on windows. the menu entry now also again correctly identifies if chromask is enabled or not. sorry for that!

# 7.0.0

- adds support for an optional keyboard shortcut to toggle chromask. thank you very much, [@dannycolin](https://github.com/dannycolin)!

# 6.0.0

- the addon now spoofs `navigator.appversion` to match what chrome is doing.
- this addon is now available in turkish (thank you, [@memoking34](https://github.com/MemoKing34)) and simplified chinese (thank you, [@acidefluorhydrique](https://github.com/AcideFluorhydrique))!

# 5.0.0

- added a settings ui to add or remove sites from chromask without being on that site. thanks to [@dannycolin](https://github.com/dannycolin) for the initial prototype here.
- added an explicit warning to only use chromask on sites that claim "firefox is not supported", because using it on other sites will break things.

# 4.3.0

- the addon is now available in polish! thank you [@damblor](https://github.com/damblor) for the help!
- there was a bug where the default on-hover title for the button was wrong. that bug was fixed by [@dannycolin](https://github.com/dannycolin)!
- the addon claimed it could work on `about:` and `moz-extension://` pages, which it could not. the ui has been adjusted to handle this case. thanks for the contribution, [@changhuapeng](https://github.com/changhuapeng)!

# 4.2.0

if you had more than one firefox window open, the addon previously showed the wrong state icon in some windows, so it looked like the chromask was enabled when it was not. this bug is now fixed, so all status badges should be correct!

# 4.1.0

originally, the addon loaded _all_ tabs with the same hostname if you flipped the switch. for people with too many tabs open, this could have presented a.. uhm.. problem. now, only the currently selected tabs get reloaded. thank you [@supertux88](https://github.com/SuperTux88) for the report and the pr!

# 4.0.0

- for linux users, we now spoof as chrome-on-windows. some sites deliberately block all linux browsers, and this is an easy way to get around that.
- the addon is now available in french and german! thanks to [@dannycolin](https://github.com/dannycolin) for contributing the initial localization support and the french locale.

# 3.0.0

the addon now has a status indicator, so you can see if the chromask is on or off without even clicking on it. thanks for the contribution, [@dannycolin](https://github.com/dannycolin)!

# 2.0.0

chromask now automatically updates the chrome version, without needing an addon update. it does that by requesting the current stable chrome major version [from an api](https://chrome-mask-remote-storage.0b101010.services/current-chrome-major-version.txt). the update runs once a day, in the background, without bothering you.

# 1.0.0

this was the initial release!
