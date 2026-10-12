# Sample Snack app

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo cli](https://docs.expo.dev/get-started/installation/#expo-cli)).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.dev/c/expo-dev-tools/61) or [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).


## Android crash-safety patch
- Added `react-native-url-polyfill/auto` before app imports for Supabase URL compatibility in React Native.
- Pinned Supabase JS to a v2-compatible semver range instead of `*`.
- Guarded HTML `iframe` map rendering to web only; native Android shows a safe placeholder rather than attempting to render an unsupported iframe.

After uploading this ZIP to GitHub, trigger a **new Android build**. Reinstall the newly built APK; an old APK will not contain these changes. If it still closes, collect the Android build/runtime error logs because the original symptom alone cannot prove the exact crash line.
