/**
 * Created by th3ee on 9/17/17.
 */
/**
 * Created by th3ee on 6/23/17.
 */
/**
 * Created by th3ee on 6/4/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tempSchema = new Schema(
    {
       tempName: String,
       hospital: String,
       format: Object
    }
);

module.exports = mongoose.model('temp', tempSchema);