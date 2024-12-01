const mongoose = require('mongoose');

const cashClosureSchema = new mongoose.Schema({
    totalSales: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const CashClosure = mongoose.model('CashClosure', cashClosureSchema);

module.exports = CashClosure;
