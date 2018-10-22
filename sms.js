const twilio = require('twilio');
const accSid = "AC1e8f6658299f8a3b04a37e9128f4d731";
const authToken = "24e523338a649b92eb7deeb3d4ff3e69";
const notifyServiceId = "ISa4c34f28ccd544da629c86e09300ed07";
var client = new twilio(accSid, authToken);

var mealCharge = "34৳";
var accountStatus = -1010;
let deposit = 3000;
let stat = Math.sign(accountStatus);
let today = 'November';
    if(stat == -1){
        status = `You will get ${deposit + accountStatus} taka back from the manager.`
    }else{
        status = `You have to pay ${accountStatus} taka.`;
    }

// client.messages.create({
//     body: 'mess',
//     from: '+18142713204',
//     to: '+8801924565272' 
// })
// .then((message) => console.log(message.sid));

client.notify.services(notifyServiceId)
    .notifications.create({
        toBinding: JSON.stringify({
            binding_type:'sms', address:'+8801924565272',
            binding_type:'sms', address:'+8801924565272',
            binding_type:'sms', address:'+8801924565272'
        }),
        body: `Account of ${today} Meal Charge: ${mealCharge}, and ${status} Hare Krishna.`
    })
    .then(notification => console.log(notification.sid))
    .catch(error => console.log(error));


console.log(status);