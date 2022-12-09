PushBullet = require('pushbullet');
const PUSHBULLET_TOKEN = 'o.076hxD0ngtxtPRPQrWhA824bc0XQFi6a'
pusher = new PushBullet(PUSHBULLET_TOKEN);

const util = require('util');
console.log("------------------Me---------------")
pusher.me((err, response) => {
    console.log(util.inspect(response));
})
console.log("---------------Devices--------------")
pusher.devices((error, response) => {
    console.log(`${error}, ${util.inspect(response)}`);
});
pusher.note({}, "test 1", "Hi", (error, response) => {
    if (error)
        console.error(`pb error: ${error}`);
    else
        console.log(`pb response ${response}`);
});