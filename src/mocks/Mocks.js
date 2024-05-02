class Mocks{
    constructor() {
        this.faker = require("@faker-js/faker").faker
    }

    generateProduct() {
        return {
            title:this.faker.commerce.productName(),
            description:this.faker.commerce.productAdjective(),
            price:this.faker.number.float({
                fractionDigits:2,
                min:1,
                max:10000
            }),
            code:this.faker.number.int({
                min:1,
                max:999999
            }),
            status:true,
            category:this.faker.commerce.department(),
            stock:this.faker.number.int({
                max:50
            })

        }
    }
}

module.exports = Mocks