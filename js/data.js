/*
 * @Author: M_King 
 * @Date: 2017-08-30 21:34:34 
 * @Last Modified by: M_King
 * @Last Modified time: 2017-09-03 19:14:24
 */

//问题数据
var JAVASCRIPT_DATA = {
    'radio': [{
        qid: '101',
        question: '如何把 7.25 四舍五入为最接近的整数？',
        answer: 'd',
        select: [{
            index: 'a',
            text: 'round(7.25)'
        }, {
            index: 'b',
            text: 'rnd(7.25)'
        }, {
            index: 'c',
            text: 'Math.rnd(7.25)'
        }, {
            index: 'd',
            text: 'Math.round(7.25)'
        }]
    }, {
        qid: '102',
        question: '如何求得 2 和 4 中最大的数？',
        answer: 'b',
        select: [{
            index: 'a',
            text: 'Math.ceil(2,4)'
        }, {
            index: 'b',
            text: 'Math.max(2,4)'
        }, {
            index: 'c',
            text: 'ceil(2,4)'
        }, {
            index: 'd',
            text: 'top(2,4)'
        }]
    }, {
        qid: '103',
        question: '如何获得客户端浏览器的名称？',
        answer: 'b',
        select: [{
            index: 'a',
            text: 'client.navName'
        }, {
            index: 'b',
            text: 'navigator.appName'
        }, {
            index: 'c',
            text: 'browser.name'
        }]
    }, {
        qid: '104',
        question: '引用名为 "xxx.js" 的外部脚本的正确语法是？',
        answer: 'a',
        select: [{
            index: 'a',
            text: '<script src="xxx.js">'
        }, {
            index: 'b',
            text: '<script href="xxx.js">'
        }, {
            index: 'c',
            text: '<script name="xxx.js">'
        }]
    }, {
        qid: '105',
        question: '如何判断变量 data 是否为数组？',
        answer: 'd',
        select: [{
            index: 'a',
            text: 'typeof data == "array"'
        }, {
            index: 'b',
            text: 'data.isArray()'
        }, {
            index: 'c',
            text: 'data == Array.prototype'
        }, {
            index: 'd',
            text: 'data instanceof Array'
        }]
    }, {
        qid: '106',
        question: '插入 Javacript 的正确位置是？',
        answer: 'c',
        select: [{
            index: 'a',
            text: '<body> 部分'
        }, {
            index: 'b',
            text: '<head> 部分'
        }, {
            index: 'c',
            text: '<body> 部分和 <head> 部分均可'
        }, {
            index: 'd',
            text: '以上都不对'
        }]
    }],
    'checkbox': [{
        qid: '201',
        question: '在 JavaScript 中，有多少种不同类型的循环？',
        answer: 'a,c',
        select: [{
            index: 'a',
            text: 'for 循环'
        }, {
            index: 'b',
            text: 'loop...until 循环'
        }, {
            index: 'c',
            text: 'while 循环'
        }, {
            index: 'd',
            text: 'each 循环'
        }]
    }, {
        qid: '202',
        question: '以下哪些是 String 可用的方法？',
        answer: 'a,d',
        select: [{
            index: 'a',
            text: 'replace'
        }, {
            index: 'b',
            text: 'sort'
        }, {
            index: 'c',
            text: 'append'
        }, {
            index: 'd',
            text: 'indexOf'
        }]
    }, {
        qid: '203',
        question: '写 "Hello World" 的正确 Javascript 语法是？',
        answer: 'd',
        select: [{
            index: 'a',
            text: 'print "Hello World"'
        }, {
            index: 'b',
            text: 'console.log = "Hello World"'
        }, {
            index: 'c',
            text: 'show("Hello World")'
        }, {
            index: 'd',
            text: 'document.write("Hello World")'
        }]
    }, {
        qid: '204',
        question: '如何给 body 添加类名"box"？',
        answer: 'b',
        select: [{
            index: 'a',
            text: 'body.classList.add = "box"'
        }, {
            index: 'b',
            text: 'body.classList.add("box")'
        }, {
            index: 'c',
            text: 'body.classList.add += "box"'
        }, {
            index: 'd',
            text: '以上都不对'
        }]
    }, {
        qid: '205',
        question: '以下哪些是 JavaScript 中的数据类型？',
        answer: 'a',
        select: [{
            index: 'a',
            text: 'boolean'
        }, {
            index: 'b',
            text: 'char'
        }, {
            index: 'c',
            text: 'int'
        }, {
            index: 'd',
            text: 'double'
        }]
    }, {
        qid: '206',
        question: 'JavaScript 如何给 div 添加点击事件？',
        answer: 'a,b,d',
        select: [{
            index: 'a',
            text: 'div.addEventListener("click", function (){ ... })'
        }, {
            index: 'b',
            text: 'div.addEventListener("mousedown", function (){ ... })'
        }, {
            index: 'c',
            text: 'div.press = function (){ ... }'
        }, {
            index: 'd',
            text: 'div.click = function (){ ... }'
        }]
    }],
    'text': [{
        qid: '301',
        question: 'MVC 中的 M，全称怎么拼写？',
        answer: ['model', 'module'],
        unescape: true
    }, {
        qid: '302',
        question: 'MVC 中的 V，全称怎么拼写？',
        answer: 'view',
        unescape: true
    }, {
        qid: '303',
        question: 'MVC 中的 C，全称怎么拼写？',
        answer: 'controller',
        unescape: true
    }, {
        qid: '304',
        question: '构造器 全称怎么拼写？',
        answer: 'constructor',
        unescape: false
    }, {
        qid: '305',
        question: '判断 name 是否为自己创建的属性，用什么方法？',
        answer: 'hasOwnProperty',
        unescape: false
    }, {
        qid: '306',
        question: '原型链 全称怎么拼写？',
        answer: 'prototype',
        unescape: false
    }, {
        qid: '307',
        question: '根据 ID 获取DOM的方法，全称怎么拼写？',
        answer: ['getElementById', 'document.getElementById'],
        unescape: false
    }, {
        qid: '308',
        question: '根据类名 class 获取DOM的方法，全称怎么拼写？',
        answer: ['getElementsByClassName', 'document.getElementsByClassName'],
        unescape: false
    }, {
        qid: '309',
        question: '高级选择器中，获取首个符合条件的DOM方法 全称怎么拼写？',
        answer: ['querySelector', 'document.querySelector'],
        unescape: false
    }, {
        qid: '310',
        question: '高级选择器中，获取全部符合条件的DOM方法 全称怎么拼写？',
        answer: ['querySelectorAll', 'document.querySelectorAll'],
        unescape: false
    }, {
        qid: '311',
        question: '获取 function 的所有参数可以用？',
        answer: 'arguments',
        unescape: true
    }, {
        qid: '312',
        question: '如何获取变量名为 "list" 的 DOM 所有类名？',
        answer: 'list.className',
        unescape: false
    }, {
        qid: '313',
        question: '如何给变量名为 "list" 的 DOM 添加类名 "box" ？',
        answer: ['list.classList.add("box")', "list.classList.add('box')"],
        unescape: false
    }, {
        qid: '314',
        question: '如何给变量名为 list 的 DOM 删除类名 "hide" ？',
        answer: ['list.classList.remove("hide")', "list.classList.remove('hide')"],
        unescape: false
    }, {
        qid: '315',
        question: '创建 DOM 元素的方法，全称怎么拼写？',
        answer: ['createElement', 'document.createElement'],
        unescape: false
    }, {
        qid: '316',
        question: '获取 DOM 的HTML内容的方法，全称怎么拼写？',
        answer: ['innerHTML'],
        unescape: false
    }, {
        qid: '317',
        question: '获取 DOM 的文本内容的方法，全称怎么拼写？',
        answer: ['textContent'],
        unescape: false
    }, {
        qid: '318',
        question: '获取父级 DOM 元素的方法怎么拼写 ？',
        answer: ['parentNode', 'parentElement'],
        unescape: false
    }, {
        qid: '319',
        question: '复制 DOM 元素的方法怎么拼写 ？',
        answer: 'cloneNode',
        unescape: true
    }, {
        qid: '320',
        question: '判断变量 data 是否继承自 Array，用什么方法？',
        answer: 'instanceof',
        unescape: false
    }, {
        qid: '321',
        question: '如何给变量名为 "list" 的 DOM 添加子元素 "item" ？',
        answer: ['list.appendChild(item)'],
        unescape: false
    }, {
        qid: '322',
        question: '阻止事件冒泡的方法，全拼怎么写 ？',
        answer: 'stopPropagation',
        unescape: false
    }, {
        qid: '323',
        question: '绑定事件的方法，全拼怎么写 ？',
        answer: 'addEventListener',
        unescape: false
    }, {
        qid: '324',
        question: '删除事件的方法，全拼怎么写  ？',
        answer: 'removeEventListener',
        unescape: false
    }, {
        qid: '325',
        question: '点击 事件，全拼怎么写 ？',
        answer: 'click',
        unescape: false
    }, {
        qid: '326',
        question: '双击 事件，全拼怎么写 ？',
        answer: 'dblclick',
        unescape: false
    }, {
        qid: '327',
        question: '鼠标按钮按下 事件，全拼怎么写 ？',
        answer: 'mousedown',
        unescape: false
    }, {
        qid: '328',
        question: '鼠标按钮松开 事件，全拼怎么写 ？',
        answer: 'mouseup',
        unescape: false
    }, {
        qid: '329',
        question: '鼠标划过 事件，全拼怎么写 ？',
        answer: 'mouseover',
        unescape: false
    }, {
        qid: '330',
        question: '鼠标划过后离开 事件，全拼怎么写 ？',
        answer: 'mouseout',
        unescape: false
    }, {
        qid: '331',
        question: '鼠标移动 事件，全拼怎么写 ？',
        answer: 'mousemove',
        unescape: false
    }, {
        qid: '332',
        question: '获取焦点 事件，全拼怎么写 ？',
        answer: 'mousemove',
        unescape: false
    }, {
        qid: '333',
        question: '失去焦点 事件，全拼怎么写 ？',
        answer: 'mousemove',
        unescape: false
    }, {
        qid: '334',
        question: '内容改变 事件，全拼怎么写 ？',
        answer: 'mousemove',
        unescape: false
    }, {
        qid: '335',
        question: '表单提交 事件，全拼怎么写 ？',
        answer: 'submit',
        unescape: false
    }, {
        qid: '336',
        question: '键盘按键按下 事件，全拼怎么写 ？',
        answer: 'keydown',
        unescape: false
    }, {
        qid: '337',
        question: '键盘按键松开 事件，全拼怎么写 ？',
        answer: ['keyup', 'keypress'],
        unescape: false
    }, {
        qid: '338',
        question: '键盘按键松开 事件，全拼怎么写 ？',
        answer: 'keyup',
        unescape: false
    }, {
        qid: '339',
        question: '手机触摸 事件，全拼怎么写 ？',
        answer: 'touch',
        unescape: false
    }, {
        qid: '340',
        question: '手机触摸开始 事件，全拼怎么写 ？',
        answer: 'touchstart',
        unescape: false
    }, {
        qid: '341',
        question: '手机触摸结束 事件，全拼怎么写 ？',
        answer: 'touchend',
        unescape: false
    }, {
        qid: '342',
        question: '手机触摸移动 事件，全拼怎么写 ？',
        answer: 'touchmove',
        unescape: false
    }]
};