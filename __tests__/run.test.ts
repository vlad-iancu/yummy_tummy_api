import { runLoginTests } from "./login.test"
import { runRegisterTests } from "./register.test"
import { runValidateUserTests } from "./validateUser.test"

describe("Tests", () => {
    runRegisterTests()
    runLoginTests()
    runValidateUserTests()
})