import createElement from "./createElement";
import diff from "./diff";
import mount from "./mount";
import render from "./render";

const createVirtualApp = (count) =>
  createElement("div", {
    attrs: { id: "app", dataCount: count },
    children: [
      createElement("input"),
      String(count),
      createElement("img", {
        attrs: {
          src: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDV6dG1hbHoyemhhMXk4a3pjbW4yendudDVlYWNyM2ZkbXM5cTZiNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tqj4m9BRURayxQAIW9/giphy.webp",
        },
      }),
    ],
  });

let count = 0;

let virtualApp = createVirtualApp(count);

const $app = render(virtualApp);

let $rootElem = mount($app, document.getElementById("app"));

setInterval(() => {
  count++;
  const virtualNewApp = createVirtualApp(count);
  const patch = diff(virtualApp, virtualNewApp);
  $rootElem = patch($rootElem);
  virtualApp = virtualNewApp;
}, 1000);
