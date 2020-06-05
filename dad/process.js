// const fetch = require('node-fetch')
// var gexf = require('graphology-gexf');
const fs = require('fs')


let dads = JSON.parse(fs.readFileSync('./dad.json'))

const findSons = (p) => dads.filter(son => son.dad == p.user_id)
dads.map(p => p.weight = findSons.length )

var GexfWriter = require('gexf-writer');
var gw = new GexfWriter();
var doc = gw.createDocument({
    type: 'directed',
    attributes: {
        root_name: {
            type: 'string',
            default: 'foo default values'
        },
        root: {
            type: 'integer',
            default: 0
        },
        sons: {
            type: 'integer',
            default: 0
        }
    }
});


const finddad = user => dads.find(dad => user.dad == dad.user_id)
const findRoot = user => {
    // let weight = 0;
    let first = finddad(user)
    if (!first) {
        return user;
    }
    first.weight +=1;
    let last = first
    while (last) {
        // console.log('find',now)
        let next = finddad(last)
        if (!next || next.dad == last.user_id) {
            // now.weight += weight;
            return last;
        } 
        next.weight +=1;
        last = next
    }
    return last;
}
let nodes = dads.map(user => {
    const sonCount = dads.filter(son => son.dad == user.user_id).length
    // console.log(user.weight)
    return {
        id: `${user.user_id}`,
        label: user.username,
        root: findRoot(user),
        // sons: user.weight
    }
})
// console.log(nodes.filter(node => node.label == 'Crystal'))
nodes.map(user => {
    user.sons = dads.find(dad => dad.user_id == user.id).weight
    // user.sons = nodes.filter(son => son.root.user_id == user.user_id).length;
})
// console.log(nodes.filter(user => user.sons == 1 && user.root.username !== 'Crystal'))
const guer = nodes.filter(user => user.root.user_id == user.id && user.sons == 1).map(guer => guer.id)
// console.log(guer)
nodes = nodes.filter(user => !guer.includes(user.id));
dads = dads.filter(son => !guer.includes(son.user_id));

const edges = dads.map((user, index) => ({
    id: `${index}`,
    source: user.user_id,
    target: user.dad,

})).filter(edge => edge.target)

nodes.map(node => doc.addNode(node.id, node.label, {
    root: parseInt(node.root.user_id),
    root_name: node.root.username,
    sons: node.sons / 3
}));
edges.map(edge => doc.addEdge(edge.id, edge.source, edge.target))

console.log(doc.toString())
