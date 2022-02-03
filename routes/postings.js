const express = require("express");
const postings = require("../schemas/postings");
const router = express.Router();
let postingInfo = []

/* 게시글 작성 API */


router.post("/newPostings", async (req, res) => { // db에 저장
    // body는 payload와 같은 것, 전송하는 데이터, get을 제외한 method들에서 보통 사용함
    // const goodsId = req.body.goodsId; 이 코드를 아래와 같이 바꿀 수 있음 -> destructure, 비할당구조화

       // const { title_give, name_give, text_give } = req.body; // req.body
    const {title, author, text, pwd} = req.body;
    
    // const postings = await new_posting.find({ postNum }); // find는 promise 형태로 반환됨 -> async이며 await을 붙여줘야 함
    // 여기까지만 하면 데이터베이스에 데이터가 없어서 빈 배열이 반환될 것, 나는 무한로딩이 걸림
    // if (postings.length) {
        // return res
        // .status(400)
        // .json({ success: false, errorMessage: " 이미 작성된 글입니다. " }); // return을 쓰지 않고 else를 써서 처리해줘도 되지만 써도 문제가 없다면 return을 쓰자
    //} 그냥 보내게 되면 success가 false인데 상태에는 200 OK이가 나와서 상황에 맞지 않는 문구 -> status(400) 추가
    // bad request라는 뜻

    const createPosting = await postings.create({ title, author, text, pwd}) // create을 하면 생성과 동시에 insert 해주는 것과 같은 역할

    res.json({ postings: createPosting });
});


/* 게시글 목록 메인페이지에 넘겨주기 api */

router.get ("/showPostings", async (req,res) => {
    console.log(1)
    const showPostings = await postings.find() // DB에서 찾아 조회 // 당연히 이 역시도 비동기 처리를 해주어야 한다.
    console.log(showPostings)
    

    res.json ({ postings: showPostings }); // return을 없이 약식으로 쓰고 싶다면 {} 바깥 부분을 ()로 감싸면 됨, 그 부분은 값이며 안에 객체가 들어있다고 인식
    });


    /* 게시글 조회페이지에 보낼 정보 받아오기 api*/

router.post ("/details", async (req, res) => {
            const {id} = req.body;
         postingInfo = await postings.find({"_id": id}); // 클릭한 게시물의 id를 넘겨받아서 그 id로 db에서 정보조회 후 전역변수에 할당
         console.log("일단 서버에서 받음")
         console.log(postingInfo)
        res.send("") // 응답이 필요하니 넣는 것
    });

    /* 게시글 조회페이지에 보낼 정보 보내기 api*/

    router.get ("/detailsInfo", async (req, res) => {

        console.log("서버쪽")
        console.log(postingInfo)
        // 클릭한 게시물의 id를 넘겨받아서 그 id로 db에서 정보조회
    res.json ({ postingInfo }); // json 형태로 반환
});

router.get ("/updateInfo", async (req, res) => {

    // 클릭한 게시물의 id를 넘겨받아서 그 id로 db에서 정보조회
res.json ({ postingInfo }); // json 형태로 반환
});


/* 게시글 수정 API */ 

// 일부가 아닌 모든 데이터 업데이트 시 put 사용 // 동일한 리소스에 대해서는 동일한 주소 사용 가능
router.put("/updatePostings", async(req, res) => {
    const {id, new_title, new_text, new_author} = req.body; // body는 json데이터를 넘겨받기 때문에 type까지 같이 받을 수 있음
    const existsPosting = await postings.find({ _id: id });

    if (!existsPosting.length) {
        await postings.create({postingInfo}); // 게시글 작성 기능까지 put으로 통합가능할듯
    } else {
        
        await postings.updateOne({ _id: id }, {title: new_title, author: new_author, text: new_text}) // 한 필드만 변경할 땐 $set: 필요
    };
    res.json({success: true});
});

/* 게시글 삭제 API */

router.delete("/deletePostings", async (req, res) => {
    console.log(1)
    const {id} = req.body;
    console.log(id)
    await postings.deleteOne({_id: id});
 
    res.json({success: true});
})


module.exports = router; //단순히 express.js의 라우터뿐만 아니라 이 페이지에서 사용된 router의 세세한 내용들 (예: router.post에서 .post 부분)
//까지 포함해서 내보내는 것 같다 :3