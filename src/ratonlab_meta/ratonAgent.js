const Agent = require('../core/Agent');

/**
 * Simple reflex agent. Search for an object whithin a labyrinth. 
 * If the object is found the agen take it.
 */
class CleanerAgent extends Agent {
    constructor(value) {
        super(value);
        this.table = {
            "0,0,0,1,0": "RIGHT",
            "0,0,1,0,0": "DOWN",
            "0,1,0,1,0": "RIGHT",
            "0,1,1,0,0": "LEFT",
            "1,0,0,1,0": "UP",

            //
            "1,0,1,0,0": "UP",
            "1,0,1,0,0,0": "DOWN",
            //

            "1,1,0,0,0": "RIGHT",
            "default": "TAKE"
        };
        this.actions = ["LEFT", "UP", "RIGHT", "DOWN", "SMELL"]
        this.bigNumber = 20;
        this.memory = []
        this.currentPosition = {}
        this.goal = {}
    }

    /**
     * 
     * @param {*} initialValue 
     * This function update de agent environment by de initial value received
     */
    setup(initialValue) {
        for (let i = 0; i < this.bigNumber; i++) {
            this.memory.push([])
            for (let j = 0; j < this.bigNumber; j++) {
                this.memory[i][j] = 0
            }
        }
        this.memory[initialValue.raton.y][initialValue.raton.x] = this
        this.memory[initialValue.queso.y][initialValue.queso.x] = -1
        this.currentPosition = { ...initialValue.raton }
        this.goal = { ...initialValue.queso };
    }

    /**
     * 
     * @param {*} perception 
     * This function update agent memory with the perception reveived
     */
    updateMemory(perception) {
        let left = 0, right = 0, up = 0, down = 0
        if (this.currentPosition.y > 0) {
            up = this.currentPosition.y - 1
            if (this.memory[up][this.currentPosition.x] === 0) this.memory[up][this.currentPosition.x] = perception[1]
        }
        down = this.currentPosition.y + 1
        if (this.memory[down][this.currentPosition.x] === 0) this.memory[down][this.currentPosition.x] = perception[3]
        if (this.currentPosition.x > 0) {
            left = this.currentPosition.x - 1
            if (this.memory[this.currentPosition.y][left] === 0) this.memory[this.currentPosition.y][left] = perception[0]
        }
        right = this.currentPosition.x + 1
        if (this.memory[this.currentPosition.y][right] === 0) this.memory[this.currentPosition.y][right] = perception[2]
    }

    /**
     * 
     * @param {*} number 
     * This function get the available position based in array ordered [LEFT, UP, RIGHT, DOWN] with the code received
     */
    getAvailablePosition(number) {
        return this.actions[number]
    }

    /**
     * 
     * @param {*} action 
     * This function get the netx position in x, y coords on the board for the agent whit the action received
     */
    getNextPosition(action) {
        let x = this.currentPosition.x, y = this.currentPosition.y
        switch (action) {
            case "LEFT":
                x = x - 1
                break;
            case "UP":
                y = y - 1
                break;
            case "RIGHT":
                x = x + 1
                break;
            case "DOWN":
                y = y + 1
                break;
            default:
                break;
        }
        return { x, y }
    }

    /**
     * 
     * @param {*} action 
     * This function update the agent position on board memory and set de last position with 1
     */
    updateCurrentPosition(action) {
        this.memory[this.currentPosition.y][this.currentPosition.x] = 1
        this.currentPosition = { ...this.getNextPosition(action) }
        this.memory[this.currentPosition.y][this.currentPosition.x] = this
        return action
    }

    /**
     * 
     * @param {*} point 
     * This function get the distance between two points, in this case is about point received and this.goal point
     */
    getPointDistanceToGoal(point) {
        return Math.sqrt(Math.pow((this.goal.x - point.x), 2) + Math.pow((this.goal.y - point.y), 2))
    }

    /**
     * 
     * @param {*} perception 
     * THis function verify if the netx position is more near based in the goal position
     */
    verifyMovement(perception) {
        let lastPerception = [...perception], availablePositions = [], nextPositions = [], distances = []
        perception.pop()
        for (let i = 0; i < perception.length; i++)
            if (perception[i] === 0) availablePositions.push(this.getAvailablePosition(i))
        for (let i = 0; i < availablePositions.length; i++)
            nextPositions.push({ action: availablePositions[i], position: this.getNextPosition(availablePositions[i]) })
        for (let i = 0; i < nextPositions.length; i++)
            distances.push({ action: nextPositions[i].action, distance: this.getPointDistanceToGoal(nextPositions[i].position) })
        let smallestObject = distances.reduce((min, obj) => obj.distance < min.distance ? obj : min, distances[0])
        let nextPosition = this.getNextPosition(smallestObject.action)
        if (this.memory[nextPosition.y][nextPosition.x] === 1) {
            smallestObject.action = this.table[lastPerception.join()]
            nextPosition = this.getNextPosition(smallestObject.action)
            console.log('nueva posicion', nextPosition, lastPerception.join())
            if (this.memory[nextPosition.y][nextPosition.x] === 1) {
                smallestObject.action = this.table[lastPerception.join() + ',0']
            }
        }
        if (this.currentPosition.x === this.goal.x && this.currentPosition.y === this.goal.y) smallestObject.action = this.table["default"]
        return smallestObject.action || this.table['default']
    }

    /**
     * We override the send method. 
     * In this case, the state is just obtained as the join of the perceptions
     */
    send() {
        this.perception = this.perception.slice(0, 5)
        this.updateMemory(this.perception)
        let viewKey = this.verifyMovement(this.perception)
        return this.updateCurrentPosition(viewKey)
    }

}

module.exports = CleanerAgent;