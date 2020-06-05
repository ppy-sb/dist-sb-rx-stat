const fetch = require('node-fetch')
const user = []
const fetched = {}

async function getpage(num) {
    if (fetched[num]) return fetched[num]
    const page = await fetch(`http://api.osuwiki.cn:5005/api/pages/eloRanking/${num}`).then(res => res.json())
    fetched[num] = page
    return page
}
async function run() {
    const pageCount = await getpage(1).then(page => page.total_page)

    for (let i = 1; i < pageCount; i++){
        const users = await getpage(i).then(page => page.data)
        user.push(...Object.values(users))
    }

    console.log(JSON.stringify(user))
}
run()
