const supertest = require("supertest")
let chai
const requester = supertest("http://localhost:8080")

describe("Testing the server", () => {
    before(async () => {
        chai = await import("chai")
    })
    describe("Testing the users",  () => {
        it("Testing the login", async () => {
            const mockUser = {
                email:"santivmirantes@gmail.com",
                password:"testpassword1234"
            }

            const result = await requester.post("/api/sessions/login").send(mockUser)
            const cookie = result.headers["set-cookie"][0]
            chai.expect(cookie).to.be.ok

        })
    })
    describe("Testing the carts", () => {
        it("the GET request to /api/carts should return all the carts in the db", async () => {
            const {statusCode,ok,_body} = await requester.get("/api/carts")
            console.log(statusCode)
            console.log(ok)
            chai.expect(Array.isArray(_body)).to.assert
        })
    })
})