const express = require('express'); // express 불러오기
const app = express();
const port = 3000;
const PostingRouter = require("./routes/postings");
const UsersRouter = require("./routes/users");
const connect = require('./schemas'); // 이렇게만 쓰면 ./schemas/index와 같음 index.js가 있는지 살펴보게 됨


connect(); // DB 연결한 모듈 끌어옴

const requestMiddleware = (req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date()); // request 로그 남기는 미들웨어
    next();
};

app.use(express.static("static")); // static과 똑같은 경로에 있는 파일들을 이 미들웨어 덕에 가져올 수 있다.

app.use(express.json()); // express가 json형태로 된 body를 가져와서 사용할 수 있게 해주는 미들웨어 // json 해석은 따로 모듈 필요
app.use(express.urlencoded({extended: false})); // json 형식의 데이터를 해석하기 위해서는 body parser가 필요하다.
// 다만 최신 버전의 경우 모듈 내 body parser가 내장되어 있어서 express.urlencoded 로 작성해도 문제가 없다.


app.use(requestMiddleware);
app.use("/api", [PostingRouter, UsersRouter]);


app.get('/', (req, res) => {
    res.send('Hello World!'); // 이것이 static 코드보다 먼저나오면 메인페이지가 보이지 않음
});

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});



