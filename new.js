var num = "4000";
var nuum = Number(num);
let deposit = 3000;
let status;
// let stat  = (nm)=>{return Boolean(nm);}
let stat = Math.sign(nuum);

function sos(){
    if(stat == -1){
        status = `You will get ${deposit + nuum} from manager.`
    }else{
        status = `You have to pay ${nuum} taka.`;
    }
    return status;
}
require('dotenv/config');
console.log(process.env.VAPID_PUBLIC_KEY);