
exports.generateOTP = ()=>{

    let OTP =''

    OTP = Math.round(1000 + Math.random() * 9000);
    return OTP
}
