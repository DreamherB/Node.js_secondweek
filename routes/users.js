const express = require("express");
const User = require("../schemas/users");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Comment = require("../schemas/comments");
const authMiddleware = require('../middlewares/auth-middleware')
let postingId = ''


/* 회원가입 */

router.post ("/registerAccount", async (req, res) => {

    console.log(2)
    const { nickname, password} = req.body;

    // 닉네임 존재여부
    const existUsers = await User.find ({ nickname });

    if (existUsers.length) {
        res.status(400).send ({
            // errorMessage: "중복된 닉네임입니다.",
        });
        return;
    }
    const user = new User ({nickname, password});
    await user.save(); // 이 코드와 exec()가 없어도 작동하기는 함 그렇다면 왜 써주는 걸까?

    res.status(201).send ({});


});


/* 로그인 */

router.post("/auth", async (req, res) => {

    const { nickname, password } = req.body;

    const user = await User.findOne ({ nickname, password });

    if (!user) {
        res.status(400).send ({
            errorMessage: '이메일 또는 패스워드가 잘못되었습니다.'
        });
        return;
    }

    const token = jwt.sign({nickname}, "dream-coding"); // 여기서 {}에 어떤 값을 써넣는 걸까? ""에는 시크릿 키
    res.send ({
        token, // 토큰 발급
    });
});


/* 로그인 상태 인증 */


/* 댓글 DB에 등록 */

router.post('/send-comments/:postingId',authMiddleware, async (req, res) => { // 헤더의token으로 사용자 인증
    console.log(4)
    const nickname  = res.locals.user.nickname;
    postingId  = req.params.postingId; // 여기서 이어주려니 댓글 작성 버튼을 누르기 전까진 postingId에 값이 대입되지 않는 문제 발생
    console.log('함수내부에선 뭐라 나올까?',postingId)
    
    const { comment } = req.body;
    if (!(comment)) {
        return res.status(400).json({ success: false, errorMessage:"내용을 입력해주세요!" })
    }
    await Comment.create({ postingId, nickname, comment });

    res.status(201).json({ success: true });
});


/* 댓글 불러오기 */

router.get('/get-comments', async (req, res) => {
    
    const comment = await Comment.find();
    res.json({
        comment,
    })
    
});


// 댓글 수정
router.patch('/comment/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const nickname  = res.locals.user[0].nickname;
    const comment = await Comment.findOne({ _id: commentId, nickname });
    if (!comment) {
       return res.status(400).send({errorMessage:'본인의 글이 아닙니다.'})
    }
    if (content.length === 0) {
        return res.status(400).send({errorMessage:'글을 적어주세요!'})
    }
    

    await Comment.updateOne({_id: commentId, nickname},{$set:{content}})

    res.status(200).json({ success: true });
})

// 사용자인증 미들웨어, 로그인 상태 체크하여 닉네임 구별
router.get('/users/me', authMiddleware, async (req, res) => {
    console.log("라우터까진 넘어옴")
    const { user } = res.locals;
    res.send({
        user: {
            nickname: user.nickname,
        },
    });
});



module.exports = router; //단순히 express.js의 라우터뿐만 아니라 이 페이지에서 사용된 router의 세세한 내용들 (예: router.post에서 .post 부분)
//까지 포함해서 내보내는 것 같다 :3


