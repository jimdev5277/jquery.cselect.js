/**
 * Created by jimdev5277 on 2015/10/25.
 */
;
(function ($) {
    function clearOptionMethod(select_showbox, ul_option) { //清理弹出后其他元素的处理
        $('.singlerow-select .select_showbox').not(select_showbox).removeClass('active');//让单列下拉只能单选
        $('.singlerow-select .select_option').not(ul_option).hide();
        select_showbox.hasClass('active') ? select_showbox.removeClass('active') : select_showbox.addClass('active');
        ul_option.slideToggle(100);
    }

    function createSelect_cSelect(select_container, index, singleClassName) {


        //创建select容器，class为select_box，插入到select标签前
        var tag_select = $('<div></div>');//div相当于select标签
        tag_select.attr('class', 'select_box  ' + singleClassName);
        if (index == 1) {
        }
        tag_select.insertBefore(select_container);


        //显示框class为select_showbox,插入到创建的tag_select中
        var select_showbox = $('<div></div>');//显示框
        select_showbox.css('cursor', 'pointer').attr('class', 'select_showbox').appendTo(tag_select);


        //创建option容器，class为select_option，插入到创建的tag_select中
        var ul_option = $('<ul></ul>');//创建option列表
        ul_option.attr('class', 'select_option ' + singleClassName);
        ul_option.appendTo(tag_select);
        createOptions_cSelect(select_container, ul_option);//创建option
        /**增加模拟select是否起作用的控制**/
        var $tag_select = $(tag_select);
        if (tag_select.data('select-enable') == undefined || tag_select.data('select-enable') == null || tag_select.data('select-enable') == true) {
            $tag_select.data('select-enable', true);
        } else if (tag_select.data('select-enable') == false) {
            $tag_select.data('select-enable', false);
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
            tag_option.text(txt_option).css('cursor', 'pointer').appendTo(ul_list);
            //为被选中的元素添加class为selected
            if (n == selected_index) {
                tag_option.attr('class', 'selected');
            }
        }
    }


    $.fn.cselectCss = function () {
        return $(this).each(function (i, ele) {
            var singleClassName = ($(this).attr('class') == undefined ? "" : $(this).attr('class')) + "";
            $(this).prev('.select_box').remove();//初始化移除之前存在的
            createSelect_cSelect(ele, i, singleClassName);
        });
    };
    /**
     * 自定义事件
     * @param ele 响应事件的元素
     * @param event_  响应事件回调
     */
    $.fn.cselectCss.cEvent = function (ele, event_) {
        var $ele = $(ele),
            $option = $($(ele).prev('.select_box').find('.select_option'));
        $option.on('click', 'li', function (e) {
            var singrow_select_options = [];
            singrow_select_options.indexid = $(this).index();
            var value = $ele.find('option').eq(singrow_select_options.indexid).attr('value');
            var text = $ele.find('option').eq(singrow_select_options.indexid).text();
            singrow_select_options.value = value;
            singrow_select_options.text = text;
            e.stopPropagation();
            return event_(singrow_select_options);
        });

    };
}(jQuery));
