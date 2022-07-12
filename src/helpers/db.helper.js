const mongoose = require('mongoose');

module.exports.connect = () => mongoose.connect('mongodb+srv://Tosif:tosif@cluster.pxxtp.mongodb.net/codebuddy');
module.exports.disconnect = () => mongoose.disconnect();