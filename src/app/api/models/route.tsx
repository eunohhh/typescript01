export async function GET() {
    
    try{
        const test = {
            back : '/assets/background/defragmentation.webp',
            description: `2023 언폴드엑스 기획자캠프 선정프로젝트, 조각모음 defragmentation, 2023.09.02_09.26, 문래예술공장 갤러리M30`,
            downLogo : [false, ""],
            isBgm : [false, ""],
            isPublic : true,
            keywords : "조각모음,언폴드X,unfoldX,defragmentation",
            logo : [false, ""],
            object : [true, 'models-defragmentation.js'],
            plane : [false, ""],
            screenxyz : false,
            sid : "nnuReNVjN1A",
            time : new Date(),
            title : "조각모음",
            unique : "defragmentation",
            url : "https://xr.screenxyz.net/defragmentation",
            video : [true, "low3_final.mp4"],
            route : '/defragmentation'
        };

        return Response.json(test, {status: 200});

    }catch (error: unknown) {
        if (error instanceof Error) {
            return Response.json({ message: "An error occurred", error: error.message }, {status: 401});
        }
        // 에러가 Error 인스턴스가 아니면 다른 처리를 할 수 있습니다.
        // 예를 들면, 로깅하거나 다른 타입의 에러 처리를 할 수 있습니다.
        return Response.json({ message: "An unknown error occurred" }, {status: 401});
    }
}