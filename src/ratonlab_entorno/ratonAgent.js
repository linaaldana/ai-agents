const Agent = require('../core/Agent');

/**
 * Simple reflex agent. Search for an object whithin a labyrinth. 
 * If the object is found the agen take it.
 */
class CleanerAgent extends Agent {
    constructor(value) {
        super(value);
        //LEFT, UP, RIGHT, DOWN, CELL
        this.table = {
            "0,0,0,0,0": "UP",
            "0,0,0,1,0": "UP",

            //
            "0,0,1,0,0": "UP",
            "0,0,1,0,0,0": "DOWN",
            "0,0,1,0,0,1": "DOWN",
            //

            // ---
            "0,0,1,1,0": "LEFT",
            "0,0,1,1,0,0": "UP",
            "0,0,1,1,0,1": "UP", //RIGHT / UP
            // ---

            "0,1,0,0,0": "RIGHT",
            "0,1,0,0,0,0": "DOWN",
            "0,1,0,0,0,1": "DOWN",

            // ---
            "0,1,0,1,0": "RIGHT",
            "0,1,0,1,0,0": "LEFT",
            "0,1,0,1,0,1": "LEFT", ////RIGHT / LEFT 
            // ---

            "0,1,1,0,0": "LEFT",

            //
            "0,1,1,1,0": "LEFT",
            "0,1,1,1,0,0": "LEFT",
            "0,1,1,1,0,1": "LEFT",
            //

            //
            "1,0,0,0,0": "UP",
            "1,0,0,0,0,0": "RIGHT",
            "1,0,0,0,0,1": "RIGHT",
            //

            // ---
            "1,0,0,1,0": "RIGHT",
            "1,0,0,1,0,0": "UP",
            "1,0,0,1,0,1": "UP", // RIGHT / UP
            // ---

            // ---
            "1,0,1,0,0": "DOWN",
            "1,0,1,0,0,0": "UP",
            "1,0,1,0,0,1": "UP", // DOWN / UP
            // ---

            "1,0,1,1,0": "UP",

            // ---
            "1,1,0,0,0": "RIGHT",
            "1,1,0,0,0,0": "DOWN",
            "1,1,0,0,0,1": "DOWN", // RIGHT / DOWN
            // ---

            "1,1,0,1,0": "RIGHT",
            "1,1,1,0,0": "DOWN",
            "default": "TAKE"
        };
        this.bigNumber = 20;
        this.memory = []
        this.currentPosition = {}
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
        this.memory[initialValue.y][initialValue.x] = this
        this.currentPosition = { ...initialValue }
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
     * @param {*} viewKey 
     * THis function verify if the netx position is a postion not explored by the agent
     */
    verifyMovement(viewKey) {
        let nextPosition = this.getNextPosition(this.table[viewKey])
        if (this.memory[nextPosition.y][nextPosition.x] === 1) viewKey += ',0'
        return viewKey
    }

    /**
     * We override the send method. 
     * In this case, the state is just obtained as the join of the perceptions
     */
    send() {
        this.updateMemory(this.perception)
        let viewKey = this.perception.join()
        viewKey = this.verifyMovement(viewKey)
        if (this.table[viewKey]) {
            return this.updateCurrentPosition(this.table[viewKey])
        } else {
            return this.table["default"]
        }
    }

}

module.exports = CleanerAgent;