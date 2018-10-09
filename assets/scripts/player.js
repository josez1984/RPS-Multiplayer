function Player(params) {
    this.startingHealth = params.startingHealth;

    this.increaseAttackPower = function() {
        return this.attackPower = this.attackPower + this.baseAttackPower;
    };
}