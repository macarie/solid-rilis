import { Guard } from "./components/guard.jsx";
import { render } from "solid-js/web";

const root = document.querySelector("#root");

console.assert(root !== null, "`root` is `null`");

render(() => <Guard />, root!);
