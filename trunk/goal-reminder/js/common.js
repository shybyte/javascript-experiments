function createRandomOrder(length,forbiddenStartNumber) {
    if (length == 1) {
        return [0];
    }
    var order = [];
    for(var i=0;i<length;i++) {
        order.push(i);
    }
    var rOrder = []
    while (order.length) {
        rOrder.push(order.splice(Math.random()*order.length,1)[0])
    }
    if (rOrder[0] == forbiddenStartNumber) {
        rOrder.splice(0,1);
        rOrder.push(forbiddenStartNumber);
    }
    return rOrder;
}
