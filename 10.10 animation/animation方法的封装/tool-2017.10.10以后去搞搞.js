// 获取某个指定的字符串值在字符串或数组中首次出现的位置
function indexOf(arr, item) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] === item) {
            return i;
        }
    }
    return -1;
}



// 获取与设置css样式
// =============================================================================
// 默认css()能设置的带px 的样式。只写了部分
var normalAttr = [
    'width',
    'height',
    'left',
    'top',
    'bottom',
    'right',
    'marginLeft',
    'marginTop',
    'marginBottom',
    'marginRight'
];

var css3Attr = [
    'rotate',
    'rotateX',
    'rotateY',
    'skew',
    'skewX',
    'skewY',
    'translate',
    'translateX',
    'translateY',
    'translateZ',
    'scale',
    'scaleX',
    'scaleY',
    'scaleZ'
];

function css(ele, attr, val) {
    
    // 获取样式值。只有 attr 数据类型为'string' 并且 val 不填写的时候
    if (typeof attr === 'string' && typeof val === 'undefined') {
        // 获取计算后的样式
        var ret = getComputedStyle(ele)[attr];

        if (indexOf(css3Attr, attr) !== -1) {
            return transform(ele, attr);
        }

        // 下面那个 if判断的三元表达式形式
        // return indexOf(normalAttr, attr) !== -1 ? parseFloat(ret) : ret * 1 === ret * 1 ? ret*1 : ret;

        // 如果是 normalAttr 数组内部的样式，获取去掉单位后的值
        if (indexOf(normalAttr, attr) !== -1) {
            return parseFloat(ret);
        }
        // 非 normalAttr 数组内部样式。
        else {
            // 如果获取类似 opacity 得到的值转为数字。
            // 而类似 background-color 不转换
            return ret * 1 === ret * 1 ? ret * 1 : ret;
        }
    }

    // 批量设置
    if (typeof attr === 'object') {
        for (var key in attr) {
            setAttr(key, attr[key]);
        }
        return;
    }

    // 单一样式设置
    function setAttr(attr, val) {
        if (indexOf(css3Attr, attr) !== -1) {
            return transform(ele, attr, val);
        }

        // 是 normalAttr 数组内部的样式，就 + px
        if (indexOf(normalAttr, attr) !== -1) {
            ele.style[attr] = val + 'px';
        }
        // 非 normalAttr 数组内部样式。直接设置为 val
        else {
            ele.style[attr] = val;
        }
        return;
    }

    // 单一样式设置 调用一次
    setAttr(attr, val);
}

// 初始化所有3d样式
css.init3d = function (el) {
    // css({
    //     rotate: 0,
    //     rotateX: 0,
    //     rotateY: 0,
    //     skew: 0,
    //     skewX: 0,
    //     skewY: 0,
    //     translate: 0,
    //     translateX: 0,
    //     translateY: 0,
    //     translateZ: 0,
    //     scale: 1,
    //     scaleX: 1,
    //     scaleY: 1,
    //     scaleZ: 1
    // });

    for (var key in css3Attr) {
        css(el, css3Attr[key], css3Attr[key].indexOf('scale') === -1 ? 0 : 1);
    }
};

function transform(el, attr, val) {
    // el元素身上挂一个_transform对象。用于保存添加或修改的2D、3D变化
    el._transform = el._transform || {};

    // 只传入2个参数。那么就是读取该attr属性值
    if (typeof val === 'undefined') return el._transform[attr];


    // _transform对象写入 attr 属性并且值为 val
    /* :KLUDGE; 未做transform 复合样式的功能 */
    el._transform[attr] = val;

    // 储存操作过的2D、3D变化
    var str = '';

    // 相对于_transform对象的每次变化。
    // 都要重新求次str。并重新给元素行内设置transfrom 
    for (var key in el._transform) {
        var value = el._transform[key];

        // 如果形参 val 带单位直接，那么就不用补单位了。
        /* :KLUDGE; 未做transform 复合样式的功能 */
        /* :BUG; rotate()有问题 */
        if (value * 1 !== value * 1) {
            str += `${key}(${value})`;
        }
        // 直接传数字的情况，需补上单位
        else {
            switch (key) {
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    str += `${key}(${value}px) `;
                    break;
                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'rotateZ':
                case 'skewX':
                case 'skewY':
                    str += `${key}(${value}deg) `;
                    break;
                default:
                    str += `${key}(${value})`;
            }
        }
    }

    // 写到行内样式
    el.style.transform = str.trim();
};


// css动画方法
// =============================================================================
function animation(props) {
    // 运动的元素
    var el = props.el;

    // 如果在运动中，就跳出方法。只有在运动完成才能在此调用
    if (el.animation) return;


    var
        // 运动样式对象。默认是{} 防止报错
        attrs = props.attrs || {},
        // 总时间。默认400ms
        d = props.duration || 400,
        // 回调函数
        cb = props.cb,
        // 运动曲线
        fx = props.fx || 'easeOut',
        // 起始位置, 总路程
        b = {}, c = {};

    for (var key in attrs) {
        // 获取开始位置的键值对
        b[key] = css(el, key);
        // 获取总路程的键值对
        c[key] = attrs[key] - b[key];
    }

    // 运动开始时间
    var startTime = Date.now();

    (function fn() {
        el.animation = window.requestAnimationFrame(fn);

        // 已用时间
        var t = Date.now() - startTime;

        // 元素限制在终点
        if (t > d) {
            t = d;
            // 清除动画帧
            window.cancelAnimationFrame(el.animation);
            // 清除元素上的动画帧编号
            el.aniamtion = null;
        }


        for (var key in attrs) {
            // 设置当前位置
            var pos = Tween[fx](t, b[key], c[key], d);
            css(el, key, pos);
        }

        // 回调函数调用。this指向元素对象
        if (typeof cb === 'function' && t === d) {
            cb.call(el);
        }
    })();
}


// 运动曲线
// =============================================================================
var Tween = {
    linear: function (t, b, c, d) {  //匀速
        return c * t / d + b;
    },
    easeIn: function (t, b, c, d) {  //加速曲线
        return c * (t /= d) * t + b;
    },
    easeOut: function (t, b, c, d) {  //减速曲线
        return -c * (t /= d) * (t - 2) + b;
    },
    easeBoth: function (t, b, c, d) {  //加速减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInStrong: function (t, b, c, d) {  //加加速曲线
        return c * (t /= d) * t * t * t + b;
    },
    easeOutStrong: function (t, b, c, d) {  //减减速曲线
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeBothStrong: function (t, b, c, d) {  //加加速减减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    elasticIn: function (t, b, c, d, a, p) {  //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticOut: function (t, b, c, d, a, p) {    //*正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    elasticBoth: function (t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return - 0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) *
            Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    backIn: function (t, b, c, d, s) {     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backOut: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backBoth: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    bounceIn: function (t, b, c, d) {    //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d - t, 0, c, d) + b;
    },
    bounceOut: function (t, b, c, d) {//*
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    },
    bounceBoth: function (t, b, c, d) {
        if (t < d / 2) {
            return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
}