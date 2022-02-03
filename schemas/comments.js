const mongoose = require('mongoose');
const moment = require("moment");

const commentSchemas = new mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    postingId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: moment().format("YYYY-MM-DD hh:mm") //moment 사용시 현재 시간 표현, 포맨 지정, default로 쓰이면
        // 라우터에서 따로 값을 언급하지 않아도 자동으로 DB에 같이 들어가게 된다.
      },
});

module.exports = mongoose.model('Comment',commentSchemas);