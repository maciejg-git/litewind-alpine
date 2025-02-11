/**
 * @jest-environment jsdom
 * @jest-environment-options {"runScripts": "dangerously", "resources": "usable", "url": "http://localhost:8080/input"}
 */

const fs = require("node:fs")
const { getByRole, prettyDOM } = require("../node_modules/@testing-library/dom/dist/@testing-library/dom.cjs.js")
const userEvent = require("../node_modules/@testing-library/user-event/dist/cjs/index.js")

const html = fs.readFileSync(__dirname + "/input.html", { encoding: "utf-8" })

const user = userEvent.userEvent.setup()
beforeEach(() => {
  document.documentElement.innerHTML = html
  // document.write(html)
// console.log(prettyDOM(document))
  // console.dir(JSON.stringify(document))
})

test("input", async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 2000))
  console.log(window)
  let input = getByRole(document.body, "textbox")
  input.focus()
  user.keyboard("username")
  let model = document.querySelector("span")
})
