class UsersRepository{
     constructor(UsersManager, UsersDTO) {
        this.UsersManager = new UsersManager()
        this.UsersDTO = UsersDTO
     }

     setupSession(res,email,password) {
         return this.UsersManager.setupSession(res,email,password)
     }

     createHash(password) {
        return this.UsersManager.createHash(password)
     }

     compareHash(password,hash) {
        return this.UsersManager.compareHash(password,hash)
     }

     async createUser(obj) {
          obj = new this.UsersDTO(obj)
          return await this.UsersManager.createUser(obj)
     }

     async getUsernameById(id) {
          return await this.UsersManager.getUsernameById(id)
     }

     async login(obj) {
        obj = new this.UsersDTO(obj)
        return await this.UsersManager.login(obj)
     }

     async changeRole(id) {
      return await this.UsersManager.changeRole(id)
     }

     async forgotPassword(email) {
      return await this.UsersManager.forgotPassword(email)
     }

     async checkCode(email,code) {
      return await this.UsersManager.checkCode(email,code)
     }

     async modifyPassword(email,newPassword) {
      return await this.UsersManager.modifyPassword(email,newPassword)
     }
}

module.exports = UsersRepository