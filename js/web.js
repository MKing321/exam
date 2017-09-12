/*
 * @Author: M_King 
 * @Date: 2017-09-02 12:59:20 
 * @Last Modified by: M_King
 * @Last Modified time: 2017-09-03 19:44:07
 */

/** 
 * 待完善功能： 
 * 1，历史记录
 * 2，惩罚机制
 */

//window ready
window.onload = function() {
    console.log('window ready');
    //计算代码运行时间
    Running(function() {
        //获取JavaScript问题数据
        var question_data = JAVASCRIPT_DATA;
        //获取问题列表dom
        var question_box = document.getElementById('question_box');
        //创建考试对象
        var exam = new Exam(question_data, {
            'wrap': question_box,
            'autoStart': false,
            'callback': {
                'before': function() {
                    document.getElementById('question_wrap').classList.remove('over');
                },
                'after': function() {
                    document.getElementById('question_wrap').classList.add('over');
                }
            }
        });

        //计时器DOM
        var timerDOM = document.getElementById('timer');
        var fixedDOM = document.getElementById('fixed_timer');
        //创建计时器
        var timer = new Timer({
            'end': 0,
            'autoStart': false,
            'action': function(number) {
                timerDOM.textContent = fixedDOM.textContent = formatSecond(number);
            },
            'before': function() {
                timerDOM.textContent = fixedDOM.textContent = '0秒';
            },
            'overtime': function() {
                console.log('Timer timeover');
                examEnd();
            }
        });

        //绑定开始按钮
        document.getElementById('start').addEventListener('click', examStart, false);
        //绑定确定按钮
        document.getElementById('submit').addEventListener('click', examEnd, false);
        //绑定再来一次按钮
        document.getElementById('reload').addEventListener('click', examReload, false);
        //绑定修改配置按钮
        document.getElementById('options').addEventListener('click', examOptions, false);

        //开始考试
        function examStart() {
            //获取参数
            var options = formatOptions(document.body, {
                'time': { 'type': 'number', 'id': '#config_time' },
                'random': { 'type': 'boolean', 'id': '#config_random' },
                'radio': { 'type': 'number', 'id': '#config_radio' },
                'checkbox': { 'type': 'number', 'id': '#config_check' },
                'text': { 'type': 'number', 'id': '#config_text' },
                'tip_count': { 'type': 'number', 'id': '#config_tip_count' }
            });
            //判断是否全部为0
            var is_zero = [options.radio, options.checkbox, options.text].every(function(element) {
                return element != null && element < 1;
            });
            if (is_zero) {
                options.radio = 1;
                options.checkbox = 1;
                options.text = 1;
            }
            //写入考试参数
            exam.setOptions({
                'random': options.random,
                'show_count': {
                    // 'radio': 0,
                    // 'checkbox': 0,
                    // 'text': 0
                    'radio': options.radio,
                    'checkbox': options.checkbox,
                    'text': options.text
                },
                'tip_count': options.tip_count
            });
            exam.start();
            //写入计时器参数
            timer.setOptions({
                'end': options.time
            });
            timer.start();
            //显示考试
            document.getElementById('last_time').textContent = document.getElementById('fixed_last_time').textContent = formatSecond(parseInt(options.time)) || '无限';
            document.getElementById('config_wrap').classList.add('hide');
            document.getElementById('question_wrap').classList.remove('hide');
        }
        //考试结束
        function examEnd() {
            console.log('Exam end');

            timer.end(); //结束计时器
            exam.check(); //检测答案

            //考试评价
            var icon = exam.status == 'win' ? '<i class="fa fa-smile-o color-primary" aria-hidden="true"></i>' : '<i class="fa fa-frown-o color-danger" aria-hidden="true"></i>';
            var word = '<div class="comment card_box">' + icon + randomWord(exam.status) + '</div> <br>';
            var comment = document.querySelector('#question_result .comment');
            //判断dom是否
            if (comment) {
                comment.innerHTML = icon + randomWord(exam.status);
            } else {
                document.querySelector('#question_result .total').insertAdjacentHTML('afterbegin', word);
            }

            scrollTop(); //回到顶部
        }
        //考试重新开始
        function examReload() {
            if (confirm('你确定要重新开始吗？')) {
                console.clear();
                console.log('Exam reload');
                timer.start(); //开始计时器
                exam.start(); //开始考试
                scrollTop(); //回到顶部
            }
        }
        //显示考试配置
        function examOptions() {
            document.getElementById('config_wrap').classList.remove('hide');
            document.getElementById('question_wrap').classList.add('hide');
        }
        //随机生成文本
        function randomWord(type) {
            var data = {
                'lose': ['没错，你就是传说中的战五渣', '用脚趾头都能想出来的问题，你居然不会', '说出来你可能不信，我家保姆都比你写的好', '听说最近保洁挺缺人的，你可以去试试'],
                'win': ['大佬，请收下我的膝盖', '代码写的6有什么用，还不是找不到女朋友', '不要激动，一定是程序出BUG了']
            };
            if (data[type]) {
                return data[type].randomSort()[0];
            } else {
                return null;
            }
        }
    });
    //隐藏loading
    loadingEnd();
};
//回到顶部
function scrollTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0
}

/**
 * 考试程序
 * 
 * @param {any} data 考试数据
 * @param {any} options 考试配置
 */
function Exam(data, options) {
    //默认参数
    var defaults = {
        'id': 'question', //考试id
        'wrap': document.body, //外层盒子
        'random': false, //是否随机
        'autoStart': true, //自动开始
        'show_count': {
            'radio': null, //单选题显示数量
            'checkbox': null, //多选题显示数量
            'text': null //填空题显示数量
        },
        'tip_count': 0, //提示次数
        'callback': {
            'before': function() {}, //考试前的回调
            'after': function() {} //考试后的回调
        }
    };

    this.data = data;
    //参数对比
    this.setOptions(options, defaults);
    //清空列表
    this.settings.wrap.innerHTML = '';

    //创建列表DOM
    var list = document.createElement('div');
    list.id = this.settings.id + '_list';
    list.classList.add(list.id);
    this.settings.wrap.appendChild(list);
    //创建结果DOM
    var result = document.createElement('div');
    result.id = this.settings.id + '_result';
    result.classList.add(result.id);
    result.innerHTML = '<div class="title">测试结果：</div> <div class="total">---</div> <div class="result_list"></div>';
    this.settings.wrap.appendChild(result);

    this.wrap = {
        'list': list,
        'result': result
    };

    //判断是否自动开始
    if (this.settings.autoStart) {
        //开始考试
        this.start();
    }
}
//修改设置
Exam.prototype.setOptions = function(options, defaults) {
    defaults = defaults || this.settings;
    //参数对比
    this.settings = extend(options, defaults);
    console.log('Exam setOptions:', this.settings);
};
//开始考试
Exam.prototype.start = function() {
    this.status = null;
    //执行回调函数
    this.settings.callback.before();
    //移除结束状态
    this.settings.wrap.classList.remove('exam_over');
    //获取单选数据
    var question_data = this.data;
    var list_box = this.wrap.list;
    //清空列表
    list_box.innerHTML = '';
    this.json = {};

    //题目总数量
    var show_total = 0;

    //分组标题
    var group = {
        'radio': { 'text': '单选题', 'object': Radio },
        'checkbox': { 'text': '多选题', 'object': Checkbox },
        'text': { 'text': '填空题', 'object': Textarea }
    };

    //分组序号
    var group_index = 1;
    //遍历问题数据
    for (var type in question_data) {
        //判断是否有分组数据
        if (!group[type]) {
            console.error('Error:', 'Group[' + type + '] is invalid.');
            continue;
        }
        //显示问题数量
        var show_length = this.settings.show_count[type];
        if (show_length == null) {
            show_length = question_data[type].length;
        } else {
            show_length = Math.min(question_data[type].length, show_length);
        }
        //如果数据为空则跳过
        if (show_length > 0) {
            show_total += show_length;
            var data = question_data[type],
                list = {};
            //创建group_box
            var group_box = document.createElement('div');
            group_box.classList.add('question_group');
            group_box.id = type + '_group';
            group_box.innerHTML = '<div class="group_title">' + group_index + '、' + group[type].text + '<span> （共' + show_length + '题）</span></div>'

            //判断是否随机排序
            if (this.settings.random == true) {
                //数组乱序
                data = data.randomSort();
            }
            //循环数据
            for (var i = 0; i < show_length; i++) {
                var param = data[i];
                if (type == 'text') {
                    param.tip_count = this.settings.tip_count;
                }
                //创建问题对象
                var obj = new group[type].object(param, type, group_index + '.' + (i + 1));
                //添加问题到列表
                group_box.appendChild(obj.dom);
                if (list['q' + data[i].qid]) {
                    console.error('Error:', 'Id #' + data[i].qid + ' is repeat.', data[i]);
                    alert('错误：考试数据有误，请联系管理员修复。');
                    throw Error('Id #' + data[i].qid + ' is repeat.');
                } else {
                    list['q' + data[i].qid] = obj;
                }
            }
            //分组序号增加
            group_index++;
            //添加到DOM
            list_box.appendChild(group_box);
            //添加到数据
            this.json[type] = list;
        }
    }
    //判断是否有考试数据
    if (show_total < 1) {
        list_box.textContent = '暂无考试数据';
        console.error('Error:', 'No question data!');
        return false;
    }
};
//获取答案
Exam.prototype.getSelected = function() {
    var list = this.json;
    var result = {};
    for (var type in list) {
        var group = list[type];
        result[type] = [];
        for (var k in group) {
            result[type].push(group[k].getResult());
        }
    }
    this.select_data = result;
};
//获取结果
Exam.prototype.getResult = function() {
    var data = this.data;
    var select = this.select_data;

    var result = {};
    //遍历选择的类型
    for (var type in select) {
        var group_result = {
            'correct': [],
            'error': []
        };
        //遍历选择的答案
        select[type].forEach(function(element) {
            //判断答案是否相等
            if (element.is_correct) {
                group_result.correct.push(element);
            } else {
                group_result.error.push(element);
            }
        });
        result[type] = group_result;
    }
    this.result_data = result;
    return result;
};
//显示分数
Exam.prototype.showResult = function() {
    var result = this.result_data,
        result_dom = this.wrap.result,
        total = '';

    //获取结果盒子
    var result_list = this.wrap.result.getElementsByClassName('result_list')[0];
    //清空列表
    result_list.innerHTML = '';
    //创建结果item
    var item = document.createElement('div');
    item.classList.add('select');
    item.innerHTML = '<div class="item"> <div class="word"></div> <div class="select"> <div>您的答案：<span class="error"></span></div> <div>正确答案：<span class="correct"></span></div> </div> </div>';

    //统计
    var count = {
        'error': 0,
        'correct': 0,
        get total() {
            return this.error + this.correct;
        }
    };

    //遍历结果数据
    for (var type in result) {
        //统计数量
        count.error += result[type].error.length;
        count.correct += result[type].correct.length;
        //遍历错误项
        result[type].error.forEach(function(element) {
            //复制DOM
            var obj = item.cloneNode(true);
            //显示问题标题
            obj.getElementsByClassName('word')[0].textContent = element.index + '、' + element.question;
            // 显示用户选择
            obj.getElementsByClassName('error')[0].textContent = element.selected.word;
            // 显示正确选择
            obj.getElementsByClassName('correct')[0].textContent = element.answer.word;

            result_list.appendChild(obj);
        });
    }

    //判断是否全对
    if (count.error) {
        this.status = 'lose';
        //清空状态
        result_dom.classList.remove('success');
        total = '共{total}题，答错<span class="color-danger"> {error} </span>题，答对<span class="color-primary"> {correct} </span>题。';
        total = total.replace('{total}', count.total).replace('{correct}', count.correct).replace('{error}', count.error);
    } else {
        this.status = 'win';
        //全对
        result_dom.classList.add('success');
        total = '<i class="fa fa-check-circle color-danger" aria-hidden="true"></i> 恭喜你，全部正确！共 <span class="color-primary">' + count.correct + ' </span>题。';
    }

    result_dom.getElementsByClassName('total')[0].innerHTML = total;
    document.getElementById('question_box').classList.add('exam_over');

    //执行回调函数
    this.settings.callback.after();
};
//检测答案
Exam.prototype.check = function() {
    //获取选择的答案
    this.getSelected();
    //获取选择结果
    this.getResult();
    //显示分数
    this.showResult();

    console.log('Exam check end');
};

//获取对应字母
function getLetter(value) {
    var speed = 65;
    if (typeof value == 'string') {
        return value.toUpperCase().charCodeAt(0) - speed;
    } else {
        return String.fromCharCode(value + speed);
    }
}

//控件对象
function Input(data, type, qid, index) {
    this.data = data;
    this.qid = qid;
    this.index = index;

    var input = document.createElement('p');
    if (type == 'text') {
        input.innerHTML = '<label> <i class="fa fa-angle-double-right" aria-hidden="true"></i> <input type="' + type + '"></label>';
        //写入选项数据
        input.querySelector('input').name = qid;
        input.querySelector('input').placeholder = '请输入答案';
    } else {
        input.innerHTML = '<label><input type="' + type + '"><span>N</span></label>';

        //写入选项数据
        input.querySelector('input').name = qid;
        input.querySelector('input').value = data.index;
        input.querySelector('span').textContent = getLetter(index) + ". " + data.text;
    }

    this.dom = input;
}
//单选题对象
function Radio(data, type, index) {
    this.data = data;
    this.type = type;
    this.index = index;

    //创建DOM
    var item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = '<div class="word">----</div> <div class="select"> </div>';
    //写入数据
    item.setAttribute('qid', data.qid);
    item.querySelector('.word').textContent = index + '、' + data.question;

    var json = {}; //数据转json
    //遍历选项
    data.select.forEach(function(element, index) {
        //创建单选
        var radio = new Input(element, type, 'q' + data.qid, index);
        item.querySelector('.select').appendChild(radio.dom);
        json[element.index] = element;
    });

    this.dom = item;
    this.json = json;
}
//获取结果
Radio.prototype.getResult = function() {
    var that = this;
    var result_data = {
        'index': this.index, //索引
        'qid': this.data.qid, //问题id
        'type': this.type, //问题类型
        'question': this.data.question, //问题
        get is_correct() {
            //问题是否正确
            return that.isCorrect();
        },
        'answer': {
            'data': this.getAnswer(),
            get word() {
                return that.getDataWord(this.data);
            }
        },
        'selected': {
            'data': this.getSelected(),
            get word() {
                return that.getDataWord(this.data);
            }
        }
    };
    this.result_data = result_data;
    return result_data;
};
//单选题获取选择的数据
Radio.prototype.getSelected = function() {
    var qid = this.data.qid,
        selected_data = null;

    //获取选中结果
    try {
        var value = this.dom.querySelector('input[name=q' + qid + ']:checked').value;
        selected_data = this.json[value];
    } catch (e) {
        console.error('Error:', 'Select #' + qid + ' is null,', e.message);
    }
    return selected_data;
};
//单选题获取答案的数据
Radio.prototype.getAnswer = function() {
    var value = this.data.answer;
    return this.json[value];
};
//判断问题是否正确
Radio.prototype.isCorrect = function() {
    var result = false, //默认返回值
        data = this.result_data;

    if (data.selected.data && data.selected.data.index.toLocaleUpperCase() == data.answer.data.index.toLocaleUpperCase()) {
        result = true;
    }
    return result;
};
//获取数据文字
Radio.prototype.getDataWord = function(data) {
    //判断为空
    if (data) {
        return data.index.toLocaleUpperCase() + '.' + data.text;
    } else {
        return '空';
    }
};
//多选题
function Checkbox(data, type, index) {
    Radio.call(this, data, type, index);
}
//继承单选原型
Checkbox.prototype = Object.create(Radio.prototype);
//多选题获取选择的数据
Checkbox.prototype.getSelected = function() {
    var qid = this.data.qid,
        selected_data = {};

    //获取选中结果
    try {
        var selected = this.dom.querySelectorAll('input[name=q' + qid + ']:checked');
        //判断是否为空
        if (selected.length) {
            var array = {};
            for (var i = 0; i < selected.length; i++) {
                var value = selected[i].value;
                array[value] = this.json[value];
            }
            selected_data = array;
        }
    } catch (e) {
        console.error('Error:', 'Select #' + qid + ' is null,', e.message);
    }
    return selected_data;
};
//多选题获取答案数据
Checkbox.prototype.getAnswer = function() {
    var value = this.data.answer.replace(' ', '').split(',');
    //判断值是否为空
    if (value.length) {
        var answer_data = {};
        for (var i = 0; i < value.length; i++) {
            answer_data[value[i]] = this.json[value[i]];
        }
        return answer_data;
    } else {
        return null;
    }
};
//多选题判断问题是否正确
Checkbox.prototype.isCorrect = function() {
    var result = false, //默认返回值
        data = this.result_data, //结果数据
        answer = Object.keys(data.answer.data).sort(),
        selected = Object.keys(data.selected.data).sort();

    //数据转换字符串
    answer = Array.prototype.join.call(answer, ',');
    selected = Array.prototype.join.call(selected, ',');
    //判断是否正确
    if (answer == selected) {
        result = true;
    }
    return result;
};
//多选题获取数据文字
Checkbox.prototype.getDataWord = function(data) {
    //判断为空
    if (data && Object.keys(data).length) {
        var text = [];
        for (var i in data) {
            var string = data[i].index.toLocaleUpperCase() + '.' + data[i].text;
            text.push(string);
        }
        return text.join('，');
    } else {
        return '空';
    }
};

//填空题
function Textarea(data, type, index) {
    this.data = data;
    this.type = type;
    this.index = index;
    //创建DOM
    var item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = '<div class="word">----</div> <div class="select"> </div>';
    //写入数据
    item.setAttribute('qid', data.qid);
    item.querySelector('.word').textContent = index + '、' + data.question;

    this.dom = item;

    //数据转json
    var json = {};
    //创建单选
    var text = new Input(data, type, 'q' + data.qid, index);
    //传递提示次数
    this.tip_count = data.tip_count || 0;
    //添加提示DOM
    text.dom.insertAdjacentHTML('beforeend', '<div class="warning color-danger hide"> <i class="fa fa-times-circle" aria-hidden="true"></i> 错误（剩余提示次数：<span>' + this.tip_count + '</span>）</div>');
    var warning_dom = text.dom.querySelector('.warning');
    var that = this;
    if (this.tip_count > 0) {
        //绑定失去焦点事件
        text.dom.querySelector('input').addEventListener('blur', textBlur, false);
    }

    //失去焦点
    function textBlur() {
        if (that.getResult().is_correct) {
            warning_dom.classList.add('hide');
        } else {
            that.tip_count--;
            warning_dom.classList.remove('hide');
            warning_dom.querySelector('span').textContent = that.tip_count;
        }
        //判断提示次数是否为0
        if (that.tip_count < 0) {
            warning_dom.classList.add('hide');
            //移除绑定事件
            text.dom.querySelector('input').removeEventListener('blur', textBlur, false);
        }
    }

    item.querySelector('.select').appendChild(text.dom);
}
// 填空题获取结果
Textarea.prototype.getResult = function() {
    var that = this;
    var result_data = {
        'index': this.index, //索引
        'qid': this.data.qid, //问题id
        'type': this.type, //问题类型
        'question': this.data.question, //问题
        get is_correct() {
            //问题是否正确
            return that.isCorrect();
        },
        'answer': {
            'data': that.data.answer,
            get word() {
                //判断是否为数组
                if (this.data instanceof Array) {
                    return this.data[0];
                } else {
                    return this.data;
                }
            }
        },
        'selected': {
            get data() {
                return that.getValue();
            },
            get word() {
                return that.getValue();
            }
        }
    };

    this.result_data = result_data;
    return result_data;
};
// 填空题获取值
Textarea.prototype.getValue = function() {
    var qid = this.data.qid;
    try {
        var value = this.dom.querySelector('input[name=q' + qid + ']').value;
        if (value) {
            return value;
        } else {
            return '空';
        }
    } catch (e) {
        console.error('Error:', 'Select #' + qid + ' is null,', e.message);
        return '空';
    }
};
// 填空题判断是否正确
Textarea.prototype.isCorrect = function() {
    var result = false, //默认返回值
        data = this.result_data,
        un_escape = this.data.unescape == true, //是否区分大小写
        value = letterCase(data.selected.data);

    //判断是否为数组
    if (data.answer.data instanceof Array) {
        for (var i = 0; i < data.answer.data.length; i++) {
            if (value && value == letterCase(data.answer.data[i])) {
                result = true;
                break;
            }
        }
    } else {
        if (value && value == letterCase(data.answer.data)) {
            result = true;
        }
    }
    //判断字母大小写
    function letterCase(value) {
        if (un_escape) {
            return value.toLowerCase();
        }
        return value;
    }
    return result;
};

/**
 * 计时器
 * 
 * @param {any} options 
 */
function Timer(options) {
    var defaults = {
        'delay': 1000, //时间间隔
        'speed': 1, //步数
        'start': 0, //开始值
        'end': 0, //结束值，正计时下，0为无限计时
        'reverse': false, //是否反向
        'autoStart': true,
        'action': console.log, //默认执行方法
        'before': function() { console.log('Timer before'); }, //默认计时前方法
        'overtime': function() { console.log('Timer overtime'); } //默认超时方法
    };
    //写入设置数据
    this.setOptions(options, defaults);
    //默认状态，true为运行中
    this.status = false;
    console.log('Timer ready');

    //判断是否开始计时器
    if (this.settings.autoStart) {
        this.start();
    }
}
//修改设置
Timer.prototype.setOptions = function(options, defaults) {
    //判断计时器是否在运行中
    if (this.status) {
        console.error('Error: Timer setOptions fail, Timer is runing!');
        return false;
    }
    defaults = defaults || this.settings;
    //参数对比
    this.settings = extend(options, defaults);
    //判断是否倒计时
    if (this.settings.reverse) {
        //倒计时数据
        this.data = {
            'start': this.settings.end + 1,
            'end': this.settings.start + 1,
            'speed': -this.settings.speed
        };
    } else {
        //正计时数据
        this.data = {
            'start': this.settings.start,
            'end': this.settings.end,
            'speed': this.settings.speed
        };
    }
    //初始化计数
    this.count = this.data.start;
    console.log('Timer setOptions:', this.settings);
};
//开始计时器
Timer.prototype.start = function() {
    this.settings.before();
    if (this.status) {
        this.end();
    }
    console.log('Timer start');
    //创建计时器
    this.timer = setInterval(function() {
        //计数增加
        this.count += this.data.speed;
        //调用执行方法
        this.settings.action(this.count);
        //判断是否计时结束
        if (this.isOvertime()) {
            this.settings.overtime();
            this.end();
        }
    }.bind(this), this.settings.delay);
    this.status = true;
};
//结束计时器
Timer.prototype.end = function() {
    //初始化计数
    this.count = this.data.start;
    //清除计时器
    window.clearInterval(this.timer);
    this.status = false;
    // console.log('Timer end');
    return this.count;
};
//判断时候已超时
Timer.prototype.isOvertime = function() {
    if (this.settings.reverse) {
        //倒计时
        return this.count <= this.data.end;
    } else {
        //正计时
        return this.data.end > 0 && this.count >= this.data.end;
    }
};

/**
 * 参数对比
 * 
 * @param {any} data 参数
 * @param {any} defaults 默认值
 * @param {array} exception 例外：['data']
 * @returns 
 */
function extend(data, defaults, exception) {
    exception = exception || [];
    var result = {};
    for (var k in defaults) {
        if (!defaults.hasOwnProperty(k)) {
            continue;
        }
        if (typeof data[k] == 'undefined' || data[k] == null) {
            result[k] = defaults[k];
        } else if (exception.indexOf(k) > -1) {
            result[k] = data[k];
        } else if (typeof data[k] == 'object' && !(data[k] instanceof Array) && !(data[k] instanceof HTMLElement)) {
            result[k] = extend(data[k], defaults[k]);
        } else {
            result[k] = data[k];
        }
    }
    return result;
}
//统计代码的运行时间
function Running(action) {
    var start = Date.now();
    action();
    console.log('Runing time', Date.now() - start + 'ms');
}
//隐藏loading
function loadingEnd() {
    document.getElementById('loading_box').classList.add('hide');
    document.getElementById('wrap').classList.remove('hide');
}
//格式化日期
function formatSecond(time) {
    time = time < 0 ? 0 : time;
    var date = new Date(time * 1000);
    var action = [date.getSeconds(), date.getMinutes(), date.getHours() - 8];
    var unit = ['秒', '分', '时'];
    var format = '';
    for (var i = 0; i < action.length; i++) {
        if (action[i] > 0) {
            format = action[i] + unit[i] + format;
        }
    }
    return format;
}
//格式化获取参数
function formatOptions(wrap, data) {
    //数据类型
    var type = {
        'boolean': function(value) {
            return value == true || value == 'true';
        },
        'number': function(value) {
            if (value == '') {
                return null;
            }
            value = parseInt(value);
            if (!value) {
                return 0;
            }
            return value;
        }
    };
    var result = {};
    //获取数据
    for (var k in data) {
        if (data.hasOwnProperty(k)) {
            var value = wrap.querySelector(data[k].id).value;
            if (type[data[k].type]) {
                result[k] = type[data[k].type](value);
            } else {
                console.error('Error: Type is invalid.');
            }
        }
    }
    return result;
}