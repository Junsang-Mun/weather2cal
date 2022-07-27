import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const today = new Date();

function fcstItem() {
    let POP, PTY, SKY, TMP, TIME;
    /*
        - TIME: 예보 시간
        - TMP : 온도
        - SKY : 하늘 상태(1, 맑음 | 3, 구름 많음 | 4, 흐림)
        - PTY : 강수형태(0, 없음 | 1, 비 | 2, 눈비 | 3, 눈 | 4, 소나기)
        - POP : 강수확률
    */
}

let base0 = new fcstItem();
let base1 = new fcstItem();
let base2 = new fcstItem();
let base3 = new fcstItem();

function giveMeBaseDate() {
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = today.getDate();
    return (year + month + day);
}

function giveMeBaseTime() {
    const forecastTime = [2, 5, 8, 11, 14, 17, 20, 23];
    const ref = today.getHours();
    let time = 0;
    
    for (let i = 0; i < forecastTime.length; i ++) {
        if (forecastTime[i] <= ref) {
            if (forecastTime[i + 1] > ref) {
                time = forecastTime[i];
            }
        }
    }
    time = ('0' + time).slice(-2);
    return (time + '00');
}

function giveMeReqUrl() {
    let time = giveMeBaseTime();
    let date = giveMeBaseDate();
    return ('http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey='+process.env.WEATHER_API_KEY+'&pageNo=1&numOfRows=48&dataType=JSON&base_date='+date+'&base_time='+time+'&nx=61&ny=126');
}

function toNL(type, val) {
    if (type === 'SKY') {
        switch (val) {
            case '1':
                return '맑음';
            case '3':
                return '구름 많음';
            case '4':
                return '흐림';
        }
    } else if (type === 'PTY') {
        switch (val) {
            case '0':
                return '강수 없음';
            case '1':
                return '비';
            case '2':
                return '눈비';
            case '3':
                return '눈';
            case '4':
                return '소나기';
        }
    }
}

async function getWeather() {
    const reqUrl = giveMeReqUrl();
    let res = await axios.get(reqUrl);

    let data = res.data.response.body.items;

    base0.TIME = data.item[0].fcstTime;
    base0.TMP = data.item[0].fcstValue;
    base0.SKY = toNL('SKY', data.item[5].fcstValue);
    base0.PTY = toNL('PTY', data.item[6].fcstValue);
    base0.POP = data.item[7].fcstValue;

    base1.TIME = data.item[12].fcstTime;
    base1.TMP = data.item[12].fcstValue;
    base1.SKY = toNL('SKY', data.item[17].fcstValue);
    base1.PTY = toNL('PTY', data.item[18].fcstValue);
    base1.POP = data.item[19].fcstValue;

    base2.TIME = data.item[24].fcstTime;
    base2.TMP = data.item[24].fcstValue;
    base2.SKY = toNL('SKY', data.item[29].fcstValue);
    base2.PTY = toNL('PTY', data.item[30].fcstValue);
    base2.POP = data.item[31].fcstValue;
    
    base3.TIME = data.item[36].fcstTime;
    base3.TMP = data.item[36].fcstValue;
    base3.SKY = toNL('SKY', data.item[41].fcstValue);
    base3.PTY = toNL('PTY', data.item[42].fcstValue);
    base3.POP = data.item[43].fcstValue;

    mixfcst()
}

getWeather();

function mixfcst() {
    console.log(base1.SKY + '     ' + base0.PTY);
}