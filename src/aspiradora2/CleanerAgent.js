const Agent = require('../core/Agent');

/**
 * Simple reflex agent. Search for an object whithin a labyrinth. 
 * If the object is found the agen take it.
 */
class CleanerAgent extends Agent {
    constructor(value) {
        super(value);
        // this.actions = ["L", "R", "A"]
    }

    setup(initialState={}) {
        this.initialState = initialState
        // this.actions = {
        //     "[1,[1,1]]": "A",
        //     "[0,[1,1]]": "A",
        //     "[0,[0,1]]": "R",
        //     "[0,[1,0]]": "A",
        //     "[1,[1,0]]": "L",
        // };
        this.actions = {
            "1,0": "L",
            "0,1": "A",
            "0,0": "R",
            "1,1": "A",
            "default": "A",
        };
    }

    //[1, [1, 1]]

    /**
     * We override the send method. 
     * In this case, the state is just obtained as the join of the perceptions
     */
    send() {
        let viewKey = `${this.perception[0]},${[this.perception[1][this.perception[0]]]}` || 'default'
        // console.log(this.actions, JSON.stringify(this.perception))
        console.log(viewKey)
        // return this.actions[JSON.stringify(this.perception)]
        return this.actions[viewKey]
        // @TODO
        // Implement based on the cost of each action
        //return this.table[this.perception.join(",")]
    }

}

module.exports = CleanerAgent;