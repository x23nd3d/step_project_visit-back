const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    visits: [
        {
            visit: {
                type: Object,
                required: true
            },
            count: {
                type: Number,
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
});


userSchema.methods.addToCard = function (card) {
    let visits = this.visits;
    console.log(visits, 'VISITS');
    card.id = this._id;
    visits.push({
        visit: card
    });

    return this.save();
}


module.exports = model('User', userSchema);