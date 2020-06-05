const fetch = require('node-fetch')
const fs = require('fs')

const users = JSON.parse(fs.readFileSync('./users.json'))

const later = (delay, value) => {
    let timer = 0;
    let reject = null;
    const promise = new Promise((resolve, _reject) => {
        reject = _reject;
        timer = setTimeout(resolve, delay, value);
    });
    return {
        get promise() { return promise; },
        cancel() {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
                reject();
                reject = null;
            }
        }
    };
};

async function dadId(user_id){
    const delay = later(user_id % 60)
    // console.log(delay)
    const result = await delay.promise.then(()=>fetch(`http://api.osuwiki.cn:5005/api/users/dad/${user_id}`)).then(res => res.json()).catch(_ => dadId(user_id))
    // console.log('fetched',result)
    return result
}
async function run(){
    const dads = await Promise.all(users.map(user => dadId(user.user_id) ));
    dads.map(result => {
        // const dad = users.find(user => user.user_id == result.dad)
        // if (dad) dad.
        const son = users.find(user => user.user_id == result.user_id)
        if (son && result.dad){
            son.dad = result.dad;
            son.dad_times = result.dad_times
        }
    })

    console.log(JSON.stringify(users))
}

run()