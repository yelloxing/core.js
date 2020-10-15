
/*!
* @yelloxing/core.js - 🐠 A modern JavaScript utility library delivering modularity, performance, & extras.
* git+https://github.com/yelloxing/core.js.git
*
* author 心叶
*
* version 0.4.0
*
* build Wed Aug 21 2019
*
* Copyright yelloxing
* Released under the MIT license
*
* Date:Thu Oct 15 2020 09:52:25 GMT+0800 (GMT+08:00)
*/

(function () {
    'use strict';

    const MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * 判断是不是一个可以作为长度的整数（比如数组下标）
     *
     * @private
     * @param {any} value 需要判断的值
     * @returns {boolean} 如果是返回true，否则返回false
     */

    function isLength (value) {

        return typeof value == 'number' &&
            value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;

    }

    /**
     * 判断是不是一个类似数组的对象，是否可以通过length迭代
     *
     *
     * @private
     * @param {any} value 需要判断的值
     * @returns {boolean} 如果是返回true，否则返回false
     */

    function isArrayLike (value) {

        return value != null && typeof value != 'function' && isLength(value.length);

    }

    const toString = Object.prototype.toString;

    /**
     * 获取一个值的类型字符串[object type]
     *
     * @private
     * @param {*} value 需要返回类型的值
     * @returns {string} 返回类型字符串
     */
    function getType (value) {
        if (value == null) {
            return value === undefined ? '[object Undefined]' : '[object Null]';
        }
        return toString.call(value);
    }

    /**
     * 判断一个值是不是String。
     *
     * @since V0.1.2
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是String返回true，否则返回false
     */
    function isString (value) {
        const type = typeof value;
        return type === 'string' || (type === 'object' && value != null && !Array.isArray(value) && getType(value) === '[object String]');
    }

    /**
     * 和isArrayLike类似，不过特别排除以下类型：
     *  1.字符串
     *
     * @private
     * @param {any} value 需要判断的值
     * @returns {boolean} 如果是返回true，否则返回false
     */

    function isArraySpec (value) {

        return isArrayLike(value) && !isString(value);

    }

    /**
     * 创建一个新数组，把传递的数组或值拼接起来。
     *
     * @since V0.2.2
     * @public
     * @param {*} value1 需要拼接的值1
     * @param {*} value2 需要拼接的值2
     * @param {*} value3 需要拼接的值3
     * ...
     * @returns {Array} 返回连接后的新数组。
     * @example
     *
     * concat(1, [2,3])
     * // => [1, 2, 3]
     *
     * concat([], [[1, 2], 3], false, '字符串')
     * // => [1, 2, 3, false, '字符串']
     *
     * concat()
     * // => []
     */
    let concat = function (newArray, values) {

        // 开头判断是为了复制切割类似字符串等这一类不应该分割的假数组
        if (!isArraySpec(values)) {
            return newArray.push(values);
        }

        for (let i = 0; i < values.length; i++) {
            if (isArraySpec(values[i])) {
                if (values[i].length > 1) {
                    concat(newArray, values[i]);
                } else if (values[i].length === 1) {
                    concat(newArray, values[i][0]);
                }
            } else {
                newArray.push(values[i]);
            }
        }
    };

    function concat$1 () {

        let values = [];
        for (let i = 0; i < arguments.length; i++) {
            values.push(arguments[i]);
        }

        let newArray = [];
        concat(newArray, values);

        return newArray;
    }

    /**
     * 比较二个值是否相等
     *
     * @since V0.1.1
     * @public
     * @param {*} value 需要比较的值1
     * @param {*} other 需要比较的值2
     * @returns {boolean} 如果相等返回true，否则返回false
     * @example
     *
     * const object = { 'a': 1 }
     * const other = { 'a': 1 }
     *
     * eq(object, object)
     * // => true
     *
     * eq(object, other)
     * // => false
     *
     * eq('a', 'a')
     * // => true
     *
     * eq('a', Object('a'))
     * // => false
     *
     * eq(NaN, NaN)
     * // => true
     */
    function eq (value, other) {
        return value === other || (value !== value && other !== other);
    }

    /**
     * 返回首次 value 在数组array中被找到的 索引值。
     *
     * @since V0.2.2
     * @public
     * @param {Array} array 需要查找的数组
     * @param {*} value 需要查找的值
     * @param {number} fromIndex 开始查询的位置，可选，默认0
     * @returns {number} 返回 值value在数组中的索引位置, 没有找到为返回-1。
     * @example
     *
     * var array=[1, 2, 3, 2]
     *
     * indexOf(array, 2)
     * // => 1
     *
     * indexOf(array, 2, 2)
     * // => 3
     *
     * indexOf(array, 12)
     * // => -1
     *
     */
    function indexOf (array, value, fromIndex) {

        if (!isArrayLike(array)) {
            return -1;
        }

        // 如果起点传递错误或没有传递，修复为0
        if (!isLength(fromIndex) || fromIndex < 0) {
            fromIndex = 0;
        }

        for (; fromIndex < array.length; fromIndex++) {
            if (eq(array[fromIndex], value)) {
                return fromIndex;
            }
        }

        return -1;
    }

    /**
     * 从右到左遍历array，返回首次 value 在数组array中被找到的 索引值。
     *
     * @since V0.2.2
     * @public
     * @param {Array} array 需要查找的数组
     * @param {*} value 需要查找的值
     * @param {number} fromIndex 开始查询的位置，可选，默认array.length-1
     * @returns {number} 返回 值value在数组中的索引位置, 没有找到为返回-1。
     * @example
     *
     * var array=[1, 2, 3, 2]
     *
     * lastIndexOf(array, 2)
     * // => 3
     *
     * lastIndexOf(array, 2, 2)
     * // => 1
     *
     * lastIndexOf(array, 12)
     * // => -1
     *
     */
    function lastIndexOf (array, value, fromIndex) {

        if (!isArrayLike(array)) {
            return -1;
        }

        // 如果起点传递错误或没有传递，修复为0
        if (!isLength(fromIndex) || fromIndex > array.length - 1) {
            fromIndex = array.length - 1;
        }

        for (; fromIndex > -1; fromIndex--) {
            if (eq(array[fromIndex], value)) {
                return fromIndex;
            }
        }

        return -1;
    }

    /**
     * 创建一个新数组，剔除重复的值。
     *
     * @since V0.2.2
     * @public
     * @param {Array} array 需要处理的数组。
     * @returns {Array} 返回新数组。
     * @example
     *
     * unique([1, 2, 3, 2])
     * // => [1, 2, 3]
     */
    function unique (array) {

        if (!isArraySpec(array)) {
            return array;
        }

        if (array.length === 0) {
            return [];
        }

        if (array.length === 1) {
            return [array[0]];
        }

        let newArray = [], help = new Array(...array);
        while (help.length > 0) {
            // 第一个肯定是需要的
            newArray.push(help[0]);
            let value = help[0], j = -1;

            // 保留和第一个不一样的
            for (let i = 1; i < help.length; i++) {
                if (!eq(value, help[i])) {
                    help[j + 1] = help[i];
                    j += 1;
                }
            }

            // 余下的都删除了(不需要真删除，修改length即可)
            help.length = j + 1;
        }


        return newArray;
    }

    /**
     * 判断一个值是不是symbol。
     *
     * @since V0.1.2
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是symbol返回true，否则返回false
     */
    function isSymbol (value) {
        const type = typeof value;
        return type === 'symbol' || (type === 'object' && value !== null && getType(value) === '[object Symbol]');
    }

    const symbolToString = Symbol.prototype.toString;
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const INFINITY = 1 / 0;

    /**
     * 把一个值变成字符串。
     *
     * @since V0.1.1
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {string} 返回转换后的字符串
     * @example
     *
     * toString(null)
     * // => ''
     *
     * toString(-0)
     * // => '-0'
     *
     * toString([1, 2, 3])
     * // => '[1,2,3]'
     */
    function toString$1(value) {

        // 如果value是null或者undefined，都返回""
        if (value == null) {
            return '';
        }

        // 如果是普通的字符串
        if (typeof value === 'string') {
            return value;
        }

        // 如果字符串对象
        if (isString(value)) {
            return value + "";
        }

        // 如果是数组，就展开(多层)
        if (Array.isArray(value)) {
            let temp = [];
            for (let i = 0; i < value.length; i++) {
                // 因为元素也可能是各种类型，递归转换
                temp[i] = toString$1(value[i]);
            }
            return `[${temp}]`;
        }

        if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : "";
        }

        // 特殊类型外的，可迭代数据
        let temp = "";
        for (let key in value) {
            // ES并没有保护 hasOwnProperty 属性名，因此使用 Object 原型上的 hasOwnProperty 属性
            if (hasOwnProperty.call(value, key))
                temp += ",\"" + toString$1(key) + "\":" + toString$1(value[key]);
        }
        if (temp !== "") {
            temp = temp.replace(/^,/, "");
            return "{" + temp + "}";
        }

        const result = `${value}`;
        // 针对数字-0特殊除了，防止变成字符串"0"
        return (result === '0' && 1 / value === -INFINITY) ? "-0" : result;
    }

    /**
     * 判断一个值是不是数组。
     *
     * @since V0.3.1
     * @public
     * @param {*} value 需要判断类型的值
     * @param {boolean} notStrict 是否不严格检查类型（默认false，如果为true表示判断是不是一个类似数组的类型）
     * @returns {boolean} 如果是数组返回true，否则返回false
     */
    function isArray (value, notStrict) {
        if (notStrict) {
            return isArraySpec(value);
        }
        return Array.isArray(value);
    }

    /**
     * 判断一个值是不是Object。
     *
     * @since V0.1.2
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是Object返回true，否则返回false
     */
    function isObject (value) {
        const type = typeof value;
        return value != null && (type === 'object' || type === 'function');
    }

    /**
     * 判断一个值是不是Boolean。
     *
     * @since V0.1.2
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是Boolean返回true，否则返回false
     */
    function isBoolean (value) {
        return value === true || value === false ||
            (value !== null && typeof value === 'object' && getType(value) === '[object Boolean]');
    }

    /**
     * 判断一个值是不是一个朴素的'对象'
     *
     * @private
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是朴素的'对象'返回true，否则返回false
     */

    function isPlainObject (value) {
        if (value === null || typeof value !== 'object' || getType(value) != '[object Object]') {
            return false;
        }

        // 如果原型为null
        if (Object.getPrototypeOf(value) === null) {
            return true;
        }

        let proto = value;
        while (Object.getPrototypeOf(proto) !== null) {
            proto = Object.getPrototypeOf(proto);
        }
        return Object.getPrototypeOf(value) === proto;
    }

    /**
     * 判断一个值是不是结点元素。
     *
     * @since V0.1.2
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是结点元素返回true，否则返回false
     */
    function isElement (value) {
        return value !== null && typeof value === 'object' &&
            (value.nodeType === 1 || value.nodeType === 9 || value.nodeType === 11) &&
            !isPlainObject(value);
    }

    /**
     * 判断一个值是不是文本结点。
     *
     * @since V0.1.2
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是结点元素返回true，否则返回false
     */
    function isText (value) {
        return value !== null && typeof value === 'object' &&
            value.nodeType === 3 && !isPlainObject(value);
    }

    /**
     * 判断一个值是不是Function。
     *
     * @since V0.1.2
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是Function返回true，否则返回false
     */
    function isFunction (value) {
        if (!isObject(value)) {
            return false;
        }

        const type = getType(value);
        return type === '[object Function]' || type === '[object AsyncFunction]' ||
            type === '[object GeneratorFunction]' || type === '[object Proxy]';
    }

    /**
     * 判断一个值是不是错误对象。
     * `Error`, `EvalError`, `RangeError`, `ReferenceError`,`SyntaxError`, `TypeError`, or `URIError`
     *
     * @since V0.1.3
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是错误对象返回true，否则返回false
     */
    function isError (value) {
        if (value === null || typeof value !== 'object') {
            return false;
        }

        const type = getType(value);
        return type === '[object Error]' || type === '[object DOMException]' ||
            (typeof value.message === 'string' && typeof value.name === 'string' && !isPlainObject(value));
    }

    /**
     * 判断一个值是不是null。
     *
     * @since V0.1.3
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是null返回true，否则返回false
     */
    function isNull (value) {
        return value === null;
    }

    /**
     * 判断一个值是不是number。
     *
     * @since V0.1.3
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是number返回true，否则返回false
     */
    function isNumber (value) {
        return typeof value === 'number' || (
            value !== null && typeof value === 'object' &&
            getType(value) === '[object Number]'
        );
    }

    /**
     * 判断一个值是不是undefined。
     *
     * @since V0.1.3
     * @public
     * @param {*} value 需要判断类型的值
     * @returns {boolean} 如果是undefined返回true，否则返回false
     */
    function isUndefined (value) {
        return value === undefined;
    }

    /**
     * 计算数组中的最大值（可以传递一个求值函数，可选）。
     *
     * @since V0.2.4
     * @public
     * @param {Array} array 需要遍历的数组
     * @param {Function} valback 需要查找的值
     * @returns {*} 返回最大的值。
     * @example
     *
     * max([10, 2, 19, 3, 5, 7])
     * //=> 19
     *
     * max([10, 2, 19, 3, 5, 7], function (value, index) {
     *    return -1 * value;
     * })
     * //=> 2
     */
    function max (array, valback) {

        if (!isArrayLike(array) || array.length < 1) {
            return undefined;
        }

        if (valback) {
            let maxIndex = 0, maxValue = valback(array[0], 0), temp;
            for (let index = 1; index < array.length; index++) {
                temp = valback(array[index], index);
                if (temp > maxValue) {
                    maxValue = temp;
                    maxIndex = index;
                }
            }
            return array[maxIndex];
        } else {
            let maxIndex = 0;
            for (let index = 1; index < array.length; index++) {
                if (array[index] > array[maxIndex]) {
                    maxIndex = index;
                }
            }
            return array[maxIndex];
        }

    }

    /**
     * 计算数组中的最小值（可以传递一个求值函数，可选）。
     *
     * @since V0.2.4
     * @public
     * @param {Array} array 需要遍历的数组
     * @param {Function} valback 需要查找的值
     * @returns {*} 返回最小的值。
     * @example
     *
     * min([10, 2, 19, 3, 5, 7])
     * //=> 2
     *
     * min([10, 2, 19, 3, 5, 7], function (value, index) {
     *    return -1 * value;
     * })
     * //=> 19
     */
    function min (array, valback) {

        if (!isArrayLike(array) || array.length < 1) {
            return undefined;
        }

        if (valback) {
            let minIndex = 0, minValue = valback(array[0], 0), temp;
            for (let index = 1; index < array.length; index++) {
                temp = valback(array[index], index);
                if (temp < minValue) {
                    minValue = temp;
                    minIndex = index;
                }
            }
            return array[minIndex];
        } else {
            let minIndex = 0;
            for (let index = 1; index < array.length; index++) {
                if (array[index] < array[minIndex]) {
                    minIndex = index;
                }
            }
            return array[minIndex];
        }

    }

    /**
     * 判断是不是一个对象上的属性
     *
     * @private
     * @param {Array|string} path 属性或路径
     * @param {Object} object 操作的对象
     * @returns {boolean} 如果是返回true，否则返回false
     */

    function isKey (value, object) {

        if (Array.isArray(value)) {
            return false;
        }

        const type = typeof value;
        if (type == 'number' || type == 'boolean' || value == null || isSymbol(value)) {
            return true;
        }

        return (object !== null && value in Object(object)) || /^\w*$/.test(value);
    }

    /**
     * 把字符串路径变成简单的数组
     *
     * @private
     * @param {string} value 需要解析的路径字符串
     * @returns {Array} 返回属性数组
     */
    function stringToPath (value) {
        let pathArray = value.replace(/\[/g, ".").replace(/\]/g, '').replace(/"/g, "").replace(/'/g, "").split('.');
        if (pathArray[0] == '') pathArray.shift();
        return pathArray;
    }

    /**
     * 把属性字符串统一变成数组（数组每个值是一个简单的属性）
     *
     * @private
     * @param {Array|string} path 属性或路径
     * @param {Object} object 操作的对象
     * @returns {Array} 返回属性数组
     */
    function castPath (value, object) {
        if (Array.isArray(value)) {
            return value;
        }
        return isKey(value, object) ? [value] : stringToPath(value);

    }

    const INFINITY$1 = 1 / 0;

    /**
     * 如果value不是字符串或者symbol，就变成字符串
     *
     * @private
     * @param {*} value 需要检查的值
     * @returns {string|symbol} 返回key
     */
    function toKey (value) {
        if (typeof value === 'string' || isSymbol(value)) {
            return value;
        }

        const result = `${value}`;
        return (result === '0' && (1 / value) === -INFINITY$1) ? "-0" : result;
    }

    /**
     * 获取一个对象属性值的基础方法，没有默认值。
     *
     * @private
     * @param {Object} object 操作的对象
     * @param {Array|string} path 属性或路径
     * @returns {*} 返回设置的结果
     */
    function baseGet (object, path) {

        // 统一把路径变成['a','b','c',...]这种
        path = castPath(path, object);

        let index = 0;
        for (; index < path.length && object !== null; index++) {
            object = object[toKey(path[index])];
        }

        return (index && index === path.length) ? object : undefined;
    }

    /**
     * 获取object的属性path的值。如果返回的值是undefined，
     * defaultValue就作为返回值返回。
     *
     * @since V0.1.0
     * @public
     * @param {Object} object 查询的对象
     * @param {Array|string} path 对象上查询值的路径
     * @param {*} defaultValue 值为undefined的时候的返回值
     * @returns {*} 返回结果
     * @example
     *
     * var object={a:{b:[1,2,3]}};
     *
     * get(object,'a.b') or
     * get(object,['a','b'])
     * // [1,2,3]
     *
     * get(object,'a["b"][1]')
     * // 2
     *
     * get(object,'a.c','default')
     * // 'default'
     */

    function get (object, path, defaultValue) {
        let result = object == null ? undefined : baseGet(object, path);
        return result === undefined ? defaultValue : result;
    }

    /**
     * 设置值的基本方法（没有进行值检查）
     *
     * @private
     * @param {Object} object 设置的对象
     * @param {string} key 需要设置的属性
     * @param {*} value 设置的值
     */
    function baseAssignValue (object, key, value) {
        if (key == '__proto__') {
            Object.defineProperty(object, key, {
                'configurable': true,
                'enumerable': true,
                'value': value,
                'writable': true
            });
        } else {
            object[key] = value;
        }
    }

    /**
     *设置对象的值
     *
     * @private
     * @param {Object} object 设置的对象
     * @param {string} key 需要设置的属性
     * @param {*} value 设置的值
     */
    function assignValue (object, key, value) {
        baseAssignValue(object, key, value);
    }

    /**
     * 设置一个对象属性值的基础方法。
     *
     * @private
     * @param {Object} object 设置的对象
     * @param {Array|string} path 对象上设置值的路径
     * @param {*} value 设置的值
     * @param {*} customizer 可选，一个函数，用于返回补充的类型（比如[],{}等）
     * @returns {Object} 返回一个对象
     */
    function baseSet (object, path, value, customizer) {
        if (!isObject(object)) {
            return object;
        }
        path = castPath(path, object);

        let nested = object;

        for (let index = 0; index < path.length; index++) {
            const key = toKey(path[index]);
            let newValue = value;

            // 如果不是最后一个，需要一些检测
            if (index + 1 != path.length) {

                const objValue = nested[key];

                // 可能有的时候，原来的对象层次不足，需要补充，这里是选择应该补充什么类型
                if (!isObject(objValue)) {

                    newValue = customizer ? customizer(objValue, key, nested) : undefined;
                    if (newValue === undefined) {
                        newValue = {};
                    }
                } else {
                    newValue = objValue;
                }
            }

            assignValue(nested, key, newValue);
            nested = nested[key];
        }

        return object;
    }

    /**
     * 设置object的属性path的新值，返回设置后的对象。
     *
     * @since V0.1.0
     * @public
     * @param {Object} object 设置的对象
     * @param {Array|string} path 对象上设置值的路径
     * @param {*} value 设置的值
     * @param {*} customizer 可选，一个函数，用于返回补充的类型（比如[],{}等）
     * @returns {Object} 返回一个对象
     * @example
     *
     * var object={a:{b:[1,2,3]}};
     *
     * set(object,'a.b.c',10)
     * // {a:{b:[1,2,3]}}
     */
    function set (object, path, value, customizer) {
        customizer = typeof customizer === 'function' ? customizer : undefined;
        return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * 使用指定字符切割字符串
     *
     * @since V0.2.3
     * @public
     * @param {string} str 需要切割的字符串
     * @param {*} splitStr 分割符号
     * @returns {Object} 返回切割后的数组
     * @example
     *
     * split("abc def    g ",' ')
     * //=> ['abc','def','g']
     *
     * split("")
     * //=>[]
     *
     * split()
     * //=>[]
     *
     */
    function split (str, splitStr) {
        str = toString$1(str);

        let resultArray = [], temp = str.split(splitStr);
        for (let i = 0; i < temp.length; i++) {
            temp[i] = temp[i].trim();
            if (temp[i] != '') {
                resultArray.push(temp[i]);
            }
        }

        return resultArray;
    }

    //当前正在运动的动画的tick函数堆栈
    let $timers = [];
    //唯一定时器的定时间隔
    let $interval = 13;
    //指定了动画时长duration默认值
    let $speeds = 400;
    //定时器ID
    let $timerId = null;

    /**
     * 动画轮播
     * @since V0.2.0
     * @public
     * @param {function} doback 轮询函数，有一个形参deep，0-1，表示执行进度
     * @param {number} duration 动画时长，可选
     * @param {function} callback 动画结束回调，可选，有一个形参deep，0-1，表示执行进度
     *
     * @returns {function} 返回一个函数，调用该函数，可以提前结束动画
     */
    function animation (doback, duration, callback) {

        let clock = {
            //把tick函数推入堆栈
            "timer": function (tick, duration, callback) {
                if (!tick) {
                    throw new Error('Tick is required!');
                }
                duration = duration || $speeds;
                let id = new Date().valueOf() + "_" + (Math.random() * 1000).toFixed(0);
                $timers.push({
                    "id": id,
                    "createTime": new Date(),
                    "tick": tick,
                    "duration": duration,
                    "callback": callback
                });
                clock.start();
                return id;
            },

            //开启唯一的定时器timerId
            "start": function () {
                if (!$timerId) {
                    $timerId = setInterval(clock.tick, $interval);
                }
            },

            //被定时器调用，遍历timers堆栈
            "tick": function () {
                let createTime, flag, tick, callback, timer, duration, passTime, timers = $timers;
                $timers = [];
                $timers.length = 0;
                for (flag = 0; flag < timers.length; flag++) {
                    //初始化数据
                    timer = timers[flag];
                    createTime = timer.createTime;
                    tick = timer.tick;
                    duration = timer.duration;
                    callback = timer.callback;

                    //执行
                    passTime = (+new Date() - createTime) / duration;
                    passTime = passTime > 1 ? 1 : passTime;
                    tick(passTime);
                    if (passTime < 1 && timer.id) {
                        //动画没有结束再添加
                        $timers.push(timer);
                    } else if (callback) {
                        callback(passTime);
                    }
                }
                if ($timers.length <= 0) {
                    clock.stop();
                }
            },

            //停止定时器，重置timerId=null
            "stop": function () {
                if ($timerId) {
                    clearInterval($timerId);
                    $timerId = null;
                }
            }
        };

        let id = clock.timer(function (deep) {
            //其中deep为0-1，表示改变的程度
            doback(deep);
        }, duration, callback);

        // 返回一个函数
        // 用于在动画结束前结束动画
        return function () {
            let i;
            for (i in $timers) {
                if ($timers[i].id == id) {
                    $timers[i].id = undefined;
                    return;
                }
            }
        };

    }

    /**
     * 初始化配置文件
     * 
     * @private
     * @param {Json} init 默认值
     * @param {Json} data
     * @return {Json}
     */
    function initConfig (init, data) {
        for (let key in data)
            try {
                init[key] = data[key];
            } catch (e) {
                throw new Error("Illegal property value！");
            }
        return init;
    }

    /**
     * Hermite三次插值
     * @since V0.2.0
     * @public
     * @param {Json} config 可选
     */
    function Hermite (config) {

        config = initConfig({
            // 张弛系数
            "u": 0.5
        }, config);

        let MR, a, b;

        /**
         * 根据x值返回y值
         * @param {Number} x
         */
        let hermite = function (x) {
            if (MR) {
                let sx = (x - a) / (b - a),
                    sx2 = sx * sx,
                    sx3 = sx * sx2;
                let sResult = sx3 * MR[0] + sx2 * MR[1] + sx * MR[2] + MR[3];
                return sResult * (b - a);
            } else throw new Error('You shoud first set the position!');
        };

        /**
         * 设置点的位置
         * @param {Number} x1 左边点的位置
         * @param {Number} y1
         * @param {Number} x2 右边点的位置
         * @param {Number} y2
         * @param {Number} s1 二个点的斜率
         * @param {Number} s2
         */
        hermite.setP = function (x1, y1, x2, y2, s1, s2) {
            if (x1 < x2) {
                // 记录原始尺寸
                a = x1; b = x2;
                let p3 = config.u * s1,
                    p4 = config.u * s2;
                // 缩放到[0,1]定义域
                y1 /= (x2 - x1);
                y2 /= (x2 - x1);
                // MR是提前计算好的多项式通解矩阵
                // 为了加速计算
                // 如上面说的
                // 统一在[0,1]上计算后再通过缩放和移动恢复
                // 避免了动态求解矩阵的麻烦
                MR = [
                    2 * y1 - 2 * y2 + p3 + p4,
                    3 * y2 - 3 * y1 - 2 * p3 - p4,
                    p3,
                    y1
                ];
            } else throw new Error('The point x-position should be increamented!');
            return hermite;
        };

        return hermite;
    }

    // 字典表
    let dictionary = {

        // 数字
        48: [0, ')'], 49: [1, '!'], 50: [2, '@'], 51: [3, '#'], 52: [4, '$'], 53: [5, '%'], 54: [6, '^'], 55: [7, '&'], 56: [8, '*'], 57: [9, '('],
        96:[0,0], 97:1, 98:2, 99:3, 100:4, 101:5, 102:6, 103:7, 104:8, 105:9,
        106:"*", 107:"+", 109:"-", 110:".", 111:"/",

        // 字母
        65: ["a", "A"], 66: ["b", "B"], 67: ["c", "C"], 68: ["d", "D"], 69: ["e", "E"], 70: ["f", "F"], 71: ["g", "G"],
        72: ["h", "H"], 73: ["i", "I"], 74: ["j", "J"], 75: ["k", "K"], 76: ["l", "L"], 77: ["m", "M"], 78: ["n", "N"],
        79: ["o", "O"], 80: ["p", "P"], 81: ["q", "Q"], 82: ["r", "R"], 83: ["s", "S"], 84: ["t", "T"],
        85: ["u", "U"], 86: ["v", "V"], 87: ["w", "W"], 88: ["x", "X"], 89: ["y", "Y"], 90: ["z", "Z"],

        // 方向
        37: "left", 38: "up", 39: "right", 40: "down",
        33: "page up", 34: "page down", 35: "end", 36: "home",

        // 控制键
        16: "shift", 17: "ctrl", 18: "alt", 91: "command", 92: "command", 93: "command", 9: "tab", 20: "caps lock", 32: "spacebar", 8: "backspace", 13: "enter", 27: "esc",
        46: "delete", 45: "insert", 144: "number lock", 145: "scroll lock", 12: "clear", 45: "insert",
        19: "pause",

        // 功能键
        112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 120: "f9", 121: "f10", 122: "f11", 123: "f12",

        // 余下键
        189: ["-", "_"], 187: ["=", "+"], 219: ["[", "{"], 221: ["]", "}"], 220: ["\\", "|"], 186: [";", ":"], 222: ["'", '"'], 188: [",", "<"], 190: [".", ">"], 191: ["/", "?"], 192: ["`", "~"]

    };

    // 非独立键字典
    let help_key = ["shift", "ctrl", "alt"];

    /**
     * 键盘按键
     * 返回键盘此时按下的键的组合结果
     * @since V0.2.5
     * @public
     */
    function keyString (event) {
        event = event || window.event;

        let keycode = event.keyCode || event.which;
        let key = dictionary[keycode] || keycode;
        if (!key) return;
        if (key.constructor !== Array) key = [key, key];
        let shift = event.shiftKey ? "shift+" : "",
            alt = event.altKey ? "alt+" : "",
            ctrl = event.ctrlKey ? "ctrl+" : "";

        let resultKey = "",preKey=ctrl + shift + alt;

        if (help_key.indexOf(key[0]) >= 0) {
            key[0] = key[1] = "";
        }

        // 判断是否按下了caps lock
        let lockPress = event.code == "Key" + event.key && !shift;

        // 只有字母（且没有按下功能Ctrl、shift或alt）区分大小写
        resultKey = (preKey + ((preKey == '' && lockPress) ? key[1] : key[0]));

        if(key[0]==""){
            resultKey=resultKey.replace(/\+$/,'');
        }

        return resultKey;
    }

    /**
     * 在(a,b,c)方向位移d
     * @private
     */
    function _move (d, a, b, c) {
        c = c || 0;
        let sqrt = Math.sqrt(a * a + b * b + c * c);
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            a * d / sqrt, b * d / sqrt, c * d / sqrt, 1
        ];
    }

    /**
     * 围绕0Z轴旋转
     * 其它的旋转可以借助transform实现
     * 旋转角度单位采用弧度制
     * 
     * @private
     */
    function _rotate (deg) {
        let sin = Math.sin(deg),
            cos = Math.cos(deg);
        return [
            cos, sin, 0, 0,
            -sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    /**
     * 围绕圆心x、y和z分别缩放xTimes, yTimes和zTimes倍
     * 
     * @private
     */
    function _scale (xTimes, yTimes, zTimes, cx, cy, cz) {
        cx = cx || 0; cy = cy || 0; cz = cz || 0;
        return [
            xTimes, 0, 0, 0,
            0, yTimes, 0, 0,
            0, 0, zTimes, 0,
            cx - cx * xTimes, cy - cy * yTimes, cz - cz * zTimes, 1
        ];
    }

    /**
     * 针对任意射线(a1,b1,c1)->(a2,b2,c2)
     * 计算出二个变换矩阵
     * 分别为：任意射线变成OZ轴变换矩阵 + OZ轴变回原来的射线的变换矩阵
     * 
     * @private
     */
    function _transform (a1, b1, c1, a2, b2, c2) {

        if (typeof a1 === 'number' && typeof b1 === 'number') {

            // 如果设置二个点
            // 表示二维上围绕某个点旋转
            if (typeof c1 !== 'number') {
                c1 = 0; a2 = a1; b2 = b1; c2 = 1;
            }
            // 只设置三个点(设置不足六个点都认为只设置了三个点)
            // 表示围绕从原点出发的射线旋转
            else if (typeof a2 !== 'number' || typeof b2 !== 'number' || typeof c2 !== 'number') {
                a2 = a1; b2 = b1; c2 = c1; a1 = 0; b1 = 0; c1 = 0;
            }

            if (a1 == a2 && b1 == b2 && c1 == c2) throw new Error('It\'s not a legitimate ray!');

            let sqrt1 = Math.sqrt((a2 - a1) * (a2 - a1) + (b2 - b1) * (b2 - b1)),
                cos1 = sqrt1 != 0 ? (b2 - b1) / sqrt1 : 1,
                sin1 = sqrt1 != 0 ? (a2 - a1) / sqrt1 : 0,

                b = (a2 - a1) * sin1 + (b2 - b1) * cos1,
                c = c2 - c1,

                sqrt2 = Math.sqrt(b * b + c * c),
                cos2 = sqrt2 != 0 ? c / sqrt2 : 1,
                sin2 = sqrt2 != 0 ? b / sqrt2 : 0;

            return [

                // 任意射线变成OZ轴变换矩阵
                [
                    cos1, cos2 * sin1, sin1 * sin2, 0,
                    -sin1, cos1 * cos2, cos1 * sin2, 0,
                    0, -sin2, cos2, 0,
                    b1 * sin1 - a1 * cos1, c1 * sin2 - a1 * sin1 * cos2 - b1 * cos1 * cos2, -a1 * sin1 * sin2 - b1 * cos1 * sin2 - c1 * cos2, 1
                ],

                // OZ轴变回原来的射线的变换矩阵
                [
                    cos1, -sin1, 0, 0,
                    cos2 * sin1, cos2 * cos1, -sin2, 0,
                    sin1 * sin2, cos1 * sin2, cos2, 0,
                    a1, b1, c1, 1
                ]

            ];
        } else {
            throw new Error('a1 and b1 is required!');
        }
    }

    // 二个4x4矩阵相乘
    // 或矩阵和齐次坐标相乘
    let _multiply = function (matrix4, param) {
        let newParam = [];
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < param.length / 4; j++)
                newParam[j * 4 + i] =
                    matrix4[i] * param[j * 4] +
                    matrix4[i + 4] * param[j * 4 + 1] +
                    matrix4[i + 8] * param[j * 4 + 2] +
                    matrix4[i + 12] * param[j * 4 + 3];
        return newParam;
    };

    /**
     * 4x4矩阵
     * 列主序存储
     * @since V0.2.0
     * @public
     */
    function Matrix4 (initMatrix4) {

        let matrix4 = initMatrix4 || [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        let matrix4Obj = {

            // 移动
            "move": function (dis, a, b, c) {
                matrix4 = _multiply(_move(dis, a, b, c), matrix4);
                return matrix4Obj;
            },

            // 旋转
            "rotate": function (deg, a1, b1, c1, a2, b2, c2) {
                var matrix4s = _transform(a1, b1, c1, a2, b2, c2);
                matrix4 = _multiply(_multiply(_multiply(matrix4s[1], _rotate(deg)), matrix4s[0]), matrix4);
                return matrix4Obj;
            },

            // 缩放
            "scale": function (xTimes, yTimes, zTimes, cx, cy, cz) {
                matrix4 = _multiply(_scale(xTimes, yTimes, zTimes, cx, cy, cz), matrix4);
                return matrix4Obj;
            },

            // 乘法
            // 可以传入一个矩阵(matrix4,flag)
            "multiply": function (newMatrix4, flag) {
                matrix4 = flag ? _multiply(matrix4, newMatrix4) : _multiply(newMatrix4, matrix4);
                return matrix4Obj;
            },

            // 对一个坐标应用变换
            // 齐次坐标(x,y,z,w)
            "use": function (x, y, z, w) {
                // w为0表示点位于无穷远处，忽略
                z = z || 0; w = w || 1;
                var temp = _multiply(matrix4, [x, y, z, w]);
                temp[0] = +temp[0].toFixed(7);
                temp[1] = +temp[1].toFixed(7);
                temp[2] = +temp[2].toFixed(7);
                temp[3] = +temp[3].toFixed(7);
                return temp;
            },

            // 矩阵的值
            "value": function () {
                return matrix4;
            }

        };

        return matrix4Obj;

    }

    /**
     * 无论绘制的树结构是什么样子的
     * 计算时都假想目标树的样子如下：
     *  1.根结点在最左边，且上下居中
     *  2.树是从左往右生长的结构
     *  3.每个结点都是一块1*1的正方形，top和left分别表示正方形中心的位置
     * @since V0.2.0
     * @public
     */
    function tree (_config) {

        let config = _config || {},
            // 维护的树
            alltreedata,
            // 根结点ID
            rootid;

        /**
         * 把内部保存的树结点数据
         * 计算结束后会调用配置的绘图方法
         */
        let update = function () {

            let beforeDis = [], size = 0, maxDeep = 0;
            (function positionCalc(pNode, deep) {

                if (deep > maxDeep) maxDeep = deep;
                let flag;
                for (flag = 0; flag < pNode.children.length; flag++)
                    // 因为全部的子结点的位置确定了，父结点的y位置就是子结点的中间位置
                    // 因此有子结点的，先计算子结点
                    positionCalc(alltreedata[pNode.children[flag]], deep + 1);

                // left的位置比较简单，deep从0开始编号
                // 比如deep=0，第一层，left=0+0.5=0.5，也就是根结点
                alltreedata[pNode.id].left = deep + 0.5;
                if (flag == 0) {

                    // beforeDis是一个数组，用以记录每一层此刻top下边缘（每一层是从上到下）
                    // 比如一层的第一个，top值最小可以取top=0.5
                    // 为了方便计算，beforeDis[deep] == undefined的时候表示现在准备计算的是这层的第一个结点
                    // 因此设置最低上边缘为-0.5
                    if (beforeDis[deep] == undefined) beforeDis[deep] = -0.5;
                    // 父边缘同意的进行初始化
                    if (beforeDis[deep - 1] == undefined) beforeDis[deep - 1] = -0.5;

                    // 添加的新结点top值第一种求法：本层上边缘+1（比如上边缘是-0.5，那么top最小是top=-0.5+1=0.5）
                    alltreedata[pNode.id].top = beforeDis[deep] + 1;

                    let pTop = beforeDis[deep] + 1 + (alltreedata[pNode.pid].children.length - 1) * 0.5;
                    // 计算的原则是：如果第一种可行，选择第一种，否则必须选择第二种
                    // 判断第一种是否可行的方法就是：如果第一种计算后确定的孩子上边缘不对导致孩子和孩子的前兄弟重合就是可行的
                    if (pTop - 1 < beforeDis[deep - 1])
                        // 必须保证父亲结点和父亲的前一个兄弟保存1的距离，至少
                        // 添加的新结点top值的第二种求法：根据孩子取孩子结点的中心top
                        alltreedata[pNode.id].top = beforeDis[deep - 1] + 1 - (alltreedata[pNode.pid].children.length - 1) * 0.5;

                } else {

                    // 此刻flag!=0
                    // 意味着结点有孩子，那么问题就解决了，直接取孩子的中间即可
                    // 其实，flag==0的分支计算的就是孩子，是没有孩子的叶结点，那是关键
                    alltreedata[pNode.id].top = (alltreedata[pNode.children[0]].top + alltreedata[pNode.children[flag - 1]].top) * 0.5;
                }

                // 因为计算孩子的时候
                // 无法掌握父辈兄弟的情况
                // 可能会出现父亲和兄弟重叠问题
                if (alltreedata[pNode.id].top <= beforeDis[deep]) {
                    let needUp = beforeDis[deep] + 1 - alltreedata[pNode.id].top;
                    (function doUp(_pid, _deep) {
                        alltreedata[_pid].top += needUp;
                        if (beforeDis[_deep] < alltreedata[_pid].top) beforeDis[_deep] = alltreedata[_pid].top;
                        let _flag;
                        for (_flag = 0; _flag < alltreedata[_pid].children.length; _flag++) {
                            doUp(alltreedata[_pid].children[_flag], _deep + 1);
                        }
                    })(pNode.id, deep);
                }

                // 计算好一个结点后，需要更新此刻该层的上边缘
                beforeDis[deep] = alltreedata[pNode.id].top;

                // size在每次计算一个结点后更新，是为了最终绘图的时候知道树有多宽（此处应该叫高）
                if (alltreedata[pNode.id].top + 0.5 > size) size = alltreedata[pNode.id].top + 0.5;

            })(alltreedata[rootid], 0);

            // 传递的参数分别表示：记录了位置信息的树结点集合、根结点ID和树的宽
            return {
                "node": alltreedata,
                "root": rootid,
                "size": size,
                "deep": maxDeep + 1
            };

        };

        /**
         * 根据配置的层次关系（配置的id,child,root）把原始数据变成内部结构，方便后期位置计算
         * @param {any} initTree
         *
         * tempTree[id]={
         *  "data":原始数据,
         *  "pid":父亲ID,
         *  "id":唯一标识ID,
         *  "children":[cid1、cid2、...]
         * }
         */
        let toInnerTree = function (initTree) {

            let tempTree = {};
            // 根结点
            let temp = config.root(initTree), id, rid;
            id = rid = config.id(temp);
            tempTree[id] = {
                "data": temp,
                "pid": null,
                "id": id,
                "children": []
            };
            // 根据传递的原始数据，生成内部统一结构
            (function createTree(pdata, pid) {
                let children = config.child(pdata, initTree), flag;
                for (flag = 0; children && flag < children.length; flag++) {
                    id = config.id(children[flag]);
                    tempTree[pid].children.push(id);
                    tempTree[id] = {
                        "data": children[flag],
                        "pid": pid,
                        "id": id,
                        "children": []
                    };
                    createTree(children[flag], id);
                }
            })(temp, id);

            return [rid, tempTree];
        };

        // 可以传递任意格式的树原始数据
        // 只要配置对应的解析方法即可
        let tree = function (initTree) {

            let treeData = toInnerTree(initTree);
            alltreedata = treeData[1];
            rootid = treeData[0];
            return update();

        };

        // 获取根结点的方法:root(initTree)
        tree.root = function (rootback) {
            config.root = rootback;
            return tree;
        };

        // 获取子结点的方法:child(parentTree,initTree)
        tree.child = function (childback) {
            config.child = childback;
            return tree;
        };

        // 获取结点ID方法:id(treedata)
        tree.id = function (idback) {
            config.id = idback;
            return tree;
        };

        return tree;

    }

    // Array

    let __ = {

        // Array
        concat: concat$1,
        indexOf, lastIndexOf,
        unique,

        // Lang
        eq,
        toString: toString$1,
        isObject, isSymbol, isString, isBoolean, isElement, isText, isFunction,
        isError, isNull, isNumber, isUndefined, isArray,

        // Math
        max, min,

        // Object
        get, set,

        // String
        split,

        /**
         * 挂载工具
         * ----------
         */

        animation,
        Hermite,
        keyString,
        Matrix4,
        tree
    };

    // 判断当前环境，如果不是浏览器环境
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = __;
    }
    // 浏览器环境下
    // 因为浏览器下挂载到window对象上
    // 为了防止覆盖，额外提供一个noConflict方法，用以在覆盖的时候恢复
    else {
        let
            // 保存之前的__，防止直接覆盖
            $__ = window.__;

        __.noConflict = function (deep) {

            // 如果当前的__是被最新的__覆盖的
            // 恢复之前的
            if (window.__ === __) {
                window.__ = $__;
            }

            return __;

        };
        // 挂载库对象到根
        window.__ = __;
    }

}());
