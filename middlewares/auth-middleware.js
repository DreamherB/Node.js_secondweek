const jwt = require("jsonwebtoken");
const User = require("../schemas/users");
const Comment = require("../schemas/comments");

module.exports = async (req, res, next) => {
    
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer') { // headear에 받아오는 토큰이 Bearer 타입인지 확인
        res.status(401).send ({
            errorMessage: '로그인 후 사용하세요.',
        });
        return;
    }

    try {
        const {nickname} = jwt.verify(tokenValue, "dream-coding");
        const user = await User.findOne({ nickname });
        res.locals.user = user; // 이미 위의 검증과정에서 DB에서 가져온 정보를 따로 저장할 수 있게 해줌, 이러면 추후에 또 DB에서 데이터를 가져올 필요도 없으며
        // 해당 데이터가 어딘가 남아있을 여지가 없음
        next(); // 이것을 써줘야 무한 로딩이 안 걸림 => 왜 쓰는 건가??
        
    } catch (error) {

        res.status(401).send ({
            errorMessage: '로그인 후 사용하세요.',
        });
        return;
    }
    
}