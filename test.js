const arr = [
  { a: ["o", "o", "o", "o", "o", "o"] },
  { b: ["o", "o", "o", "o", "o", "o"] },
  { c: ["o", "o", "o", "o", "o", "o"] },
];

// console.log(arr.map((e,i) => e[]));
// console.log(arr[0]["a"]);

let a = "c";
const filtered = arr.filter((e) => e[a]);

filtered[0][a].push("x");

console.log(arr);

// if (Family.galery.filter((e)=>e[a]))
