const getTimeCode = (time) => {
    let seconds = parseInt(time);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;

    return {
        seconds: String(seconds).padStart(2,0),
        minutes: String(minutes).padStart(2,0),
    };
};

export default getTimeCode;