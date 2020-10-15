/**
 * 把字符串路径变成简单的数组
 *
 * @private
 * @param {string} value 需要解析的路径字符串
 * @returns {Array} 返回属性数组
 */
export default function (value) {
    let pathArray = value.replace(/\[/g, ".").replace(/\]/g, '').replace(/"/g, "").replace(/'/g, "").split('.');
    if (pathArray[0] == '') pathArray.shift();
    return pathArray;
};
