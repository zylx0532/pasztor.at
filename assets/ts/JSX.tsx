declare namespace JSX {
    let createElement: Function;

    interface IntrinsicElements {
        div: any,
        h1: any,
        p: any,
        button: any
    }
}

namespace JSX {
    type PropType = {[key: string]: any}
    createElement = (
        type: string,
        props: PropType,
        ...children: object[]
    ): HTMLElement => {
        let element = document.createElement(type);
        for (let propKey in props) {
            let propValue = props[propKey] || "";
            if (propKey.startsWith("on") && propValue instanceof Function) {
                element.addEventListener(propKey.substring(2).toLowerCase(), (e) => {propValue(e)});
            } else {
                element.setAttribute(propKey, propValue);
            }
        }
        for (let child of children) {
            if (child instanceof HTMLElement) {
                element.appendChild(child);
            } else if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            }
        }
        return element;
    }
}