/// <reference path="PrivacyHandler.tsx" />

window.addEventListener("load", () => {
    let es6PromisePolyfillLib = "/assets/node_modules/es6-promise/dist/es6-promise.auto.js";
    let modalCss = "/assets/site.css";

    let runApplication = () => {
        let privacyHandler = new PrivacyHandler(window, document);
        privacyHandler.run();
    };

    let loadHandler = () => {
        let link = document.createElement("link");
        link.onload = runApplication;
        link.rel = "stylesheet";
        link.href = modalCss;
        document.head.appendChild(link);
    }
    if (typeof Promise === "undefined") {
        let script = document.createElement("script");
        script.onload = loadHandler;
        script.src = es6PromisePolyfillLib;
        document.body.appendChild(script);
    } else {
        loadHandler();
    }
});