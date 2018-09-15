let arr = [2,6,3,77,34,23,55,9,8,20];

/**
 * quick: 快速排序
 *  @param {Array} arr
 *  @returns {Array}
 * create by FF
 */

function quick(arr) {
    if (arr.length <= 0) {
        return arr;
    }
    let centerIndex = Math.floor(arr.length / 2);
    let centerValue = arr.splice(centerIndex, 1);
    let arrLeft = [];
    let arrRight = [];
    for (let i = 0; i < arr.length; i++) {
        centerValue > arr[i]
            ? arrLeft.push(arr[i])
            : arrRight.push(arr[i]);
    }
    return quick(arrLeft).concat(centerValue, quick(arrRight));
}

// console.log(quick(arr));

/**
 * bubble: 冒泡排序
 *  @param {Array} arr
 *  @returns {Array}
 * create by FF
 */

function bubble(arr) {
    //比较的轮数
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j+1]) {
                var temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    return arr;
}

// console.log(bubble(arr))

