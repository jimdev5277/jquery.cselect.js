/**
 * Created by jimdev5277 on 2015/10/25.
 */
;
(function ($) {
    function clearOptionMethod(select_showbox, ul_option) { //清理弹出后其他元素的处理
        $('.singlerow-select .select_showbox').not(select_showbox).removeClass('active');//让单列下拉只能单选
        $('.singlerow-select .select_option').not(ul_option).hide();
        select_showbox.hasClass('active') ? select_showbox.removeClass('active') : select_showbox.addClass('active');
        var opwidth = select_showbox.outerWidth();
        opwidth = opwidth - (ul_option.width(opwidth).outerWidth() - opwidth);//设置下拉框菜单与显示框长度一致
        ul_option.width(opwidth).slideToggle(100);
    }

    function createSelect_cSelect(select_container, index, singleClassName, options) {


        //创建select容器，class为select_box，插入到select标签前
        var tag_select = $('<div></div>');//div相当于select标签
        tag_select.attr('class', 'select_box  ' + singleClassName);
        tag_select.insertBefore(select_container);


        //显示框class为select_showbox,插入到创建的tag_select中
        var select_showbox = $('<div></div>');//显示框
        if (options.cminwidth > 0) {
            select_showbox.css('min-wdith', options.cminwdith);
        } else if (options.cmaxwidth > 0) {
            select_showbox.css('max-wdith', options.cmaxwidth)
        } else if (options.cfixwidth > 0) {
            select_showbox.width(options.cfixwidth)
        }
        select_showbox.css('cursor', 'pointer').attr('class', 'select_showbox').appendTo(tag_select);


        //创建option容器，class为select_option，插入到创建的tag_select中
        var ul_option = $('<ul></ul>');//创建option列表
        ul_option.attr('class', 'select_option ' + singleClassName);
        ul_option.appendTo(tag_select);
        createOptions_cSelect(select_container, ul_option);//创建option
        /**增加模拟select是否起作用的控制**/
        var $tag_select = $(tag_select), $select_container = $(select_container);
        if ($select_container.prop('disabled') == true || $select_container.data('select-enable') == false) {//读取属性为不能设置的就设置模拟select不能下拉
            $tag_select.data('select-enable', false);
            select_showbox.addClass('disabled');
        } else if ($select_container.prop('disabled') == false || $select_container.data('select-enable') == true) {//读取真实的select设置模拟属性
            $tag_select.data('select-enable', true);
            select_showbox.removeClass('disabled');
        }
        tag_select.on("click", function () {
            if ($(this).data('select-enable')) {
                clearOptionMethod(select_showbox, ul_option);
            }
        });
        //阻止事件进一步的冒泡到上一层
        ul_option.on('click', function (e) {
            e.stopPropagation();
        });
        var li_option = ul_option.find('li').not('.tip');
        li_option.on('click', function (e) {
            //e.stopPropagation();
            $(this).addClass('selected').siblings().removeClass('selected');
            var wenben = $(this).text();
            var index = $(this).index();
            var _select = $(this).parents().next('select');
            var value = _select.find('option').eq(index).attr('value');
            _select.val(value);
            select_showbox.text(wenben).removeClass('active');
            ul_option.hide();
            /*重新运行onchange事件*/
            if (document.all) {
                select_container.fireEvent("onchange");
            } else {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('change', true, true);
                select_container.dispatchEvent(evt);
            }
        });
        $(document).bind("keyup", function (e) {//添加按下esc收起下拉列表
            var myEvent = e || window.event;
            var keyCode = myEvent.keyCode;
            if (keyCode == 27) {
                ul_option.hide();
                select_showbox.removeClass('active');
            }
        });

        li_option.hover(function () {
            $(this).addClass('hover').siblings().removeClass('hover');
        }, function () {
            li_option.removeClass('hover');
        });
    }

    function createOptions_cSelect(select_container, ul_list) {
        //获取被选中的元素并将其值赋值到显示框中
        var $select_container = $(select_container);
        var options = $select_container.children('option'),
            selected_option = options.filter(':selected'),
            selected_index = selected_option.index(),
            showbox = ul_list.prev();
        showbox.text(selected_option.text());
        //为每个option建立个li并赋值
        for (var n = 0; n < options.length; n++) {
            var tag_option = $('<li></li>'),//li相当于option
                txt_option = options.eq(n).text();
            tag_option.text(txt_option).css('cursor', 'pointer').attr('title', txt_option).appendTo(ul_list);
            //为被选中的元素添加class为selected
            if (n == selected_index) {
                tag_option.attr('class', 'selected');
            }
        }
    }


    $.fn.cselectCss = function (options) {
        var defaluts = { //默认配置
            cminwidth: 0,
            cmaxwidth: 0,
            cfixwidth: 0
        };
        var setting = $.extend(defaluts, options);
        return $(this).each(function (i, ele) {
            var singleClassName = ($(this).attr('class') == undefined ? "" : $(this).attr('class')) + "";
            $(this).prev('.select_box').remove();//初始化移除之前存在的
            var setting2 = setting;
            setting2.cminwidth = $(this).attr('cselect-minwidth') == undefined ? setting.cminwidth : parseInt($(this).attr('cselect-minwidth'));//html中select制定的参数为优先级较高
            setting2.cmaxwidth = $(this).attr('cselect-maxwidth') == undefined ? setting.cmaxwidth : parseInt($(this).attr('cselect-maxwidth'));
            setting2.cfixwidth = $(this).attr('cselect-fixwidth') == undefined ? setting.cfixwidth : parseInt($(this).attr('cselect-fixwidth'));
            createSelect_cSelect(ele, i, singleClassName, setting2);
        });
    };
}(jQuery));