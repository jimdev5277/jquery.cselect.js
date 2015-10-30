# jquery.cselect.js
select样式自定义jquery插件
web上的select的样式是无法自定义的，但是为了实现设计稿的效果，不得不在网上找了示例代码，
模拟出一个select，自己整合一下，修改成了这个插件
当dom加载完成之后使用
```
s.(ele).cselectCss();
```

给select加自定义事件
```
$.fn.cselectCss($(ele),function(data)){
//  dosomething;
};
```
可以控制模拟的select是否显示下拉
```
$('.select_box').data('select-enable',false);
```
其中`$('.select_box')`为包裹的容器
**具体示例代码见demo文件夹**
