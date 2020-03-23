function getDateTime() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hh = now.getHours();
    let mm = now.getMinutes();
    let clock = year + "";
    if(month < 10)
        clock += "0";
    clock += month + "";
    if(day < 10)
        clock += "0";
    clock += day + "";
    if(hh < 10)
        clock += "0";
    clock += hh + "";
    if (mm < 10) clock += '0';
    clock += mm;
    return clock.toString();
}

function sleep(time){
    setTimeout(function(){}, 1000);
    return new Promise((resolve) => setTimeout(resolve, time * 1000));
}

export default {
    getDateTime,
    sleep
}