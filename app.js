import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const today = new Date();

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
    return ('http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey='+process.env.WEATHER_API_KEY+'&pageNo=1&numOfRows=24&dataType=JSON&base_date='+date+'&base_time='+time+'&nx=61&ny=126');
}

async function getWeather() {
    const reqUrl = giveMeReqUrl();
    let res = await axios.get(reqUrl);
    let page = res.data.response.body.items; //.item[0].fcstValue;

    console.log(page);
}

getWeather();