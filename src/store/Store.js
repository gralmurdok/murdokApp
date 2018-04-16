class Store {

  constructor() {
    this.coffeeUsers = [];
    this.beerBashRates = [];
  }

  addUser(userId) {
    return this.coffeeUsers.push(userId);
  }

  removeUser(userId) {
    const index = this.coffeeUsers.indexOf(userId);

    if(index !== -1) {
      this.coffeeUsers.splice(index, 1);
    }

    return this.coffeeUsers;
  }

  setUsers(users) {
    this.coffeeUsers = users;
    return this.coffeeUsers;
  }
}

export default new Store();
