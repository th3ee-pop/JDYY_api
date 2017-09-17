var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var models = {};
/**
 * 存储ID的序列值
 */
var Sequence = new Schema({
    _id: String,
    next: Number
});

Sequence.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

Sequence.statics.increment = function (schemaName, callback) {
    return this.collection.findAndModify({ _id: schemaName }, [],
        { $inc: { next: 1 } }, {new:true, upsert:true}, callback);
};

models.Sequence = mongoose.model('Sequence', Sequence);

var messageSchema = new Schema({
    type:{type:String},
    title: {type: String},
    text: {type: String},
    from: {type: String},
    to: {type: String},
    date: {type: String},
    state:{type:Boolean},
    link: { type: String }
}
);

messageSchema.pre('save', function (next) {
    var that = this;
    if( that.isNew ){
        models.Sequence.increment('messageSchema', function (err, result) {
            if(err)
                throw err;
            that.id = result.next;
            next();
        });
    }else {
        next();
    }
});

module.exports = mongoose.model('Message', messageSchema);