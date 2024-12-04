const fs = require("node:fs")

const html = fs.readFileSync(__dirname + "/input.html", { encoding: "utf-8" })

beforeEach(() => {
  document.documentElement.innerHTML = html
})

test("input", () => {
  let input = document.querySelector("input")
})
