const fs = require("node:fs")
const { getByRole } = require("../node_modules/@testing-library/dom/dist/@testing-library/dom.cjs.js")
const userEvent = require("../node_modules/@testing-library/user-event/dist/cjs/index.js")

const html = fs.readFileSync(__dirname + "/input.html", { encoding: "utf-8" })

const user = userEvent.userEvent.setup()

beforeEach(() => {
  document.documentElement.innerHTML = html
})

test("input", () => {
  let input = getByRole(document.body, "textbox")
  input.focus()
  user.keyboard("username")
  let model = document.querySelector("span")
})
