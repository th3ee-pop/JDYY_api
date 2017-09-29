
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendShipSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    friends:{
        type: Array
    },
    request:{
        type: Array
    },
    accept:{
        type: Array
    }
});

// friendShipSchema.pre('save', function (next) {
//     var that = this;
//     if( that.isNew ){
//         models.Sequence.increment('friendShipSchema', function (err, result) {
//             if(err)
//                 throw err;
//             that.id = result.next;
//             next();
//         });
//     }else {
//         next();
//     }
// });

module.exports = mongoose.model('friendShip', friendShipSchema);