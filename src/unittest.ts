import PornHub from "./index";

const ph = new PornHub();

const test = async () => {
  console.log(await ph.hasFLV("ph5c6be505d0c52"));
  console.log(await ph.getFLV("ph5c6be505d0c52"));

  console.log(await ph.filterJSON(await ph.search({ search: "hair brush" })));
};
test();
