# shutter
百叶窗切换 
/*
 *  实例化一个对象 var shutterDemo = new shutterSwitch();
    shutterDemo.init(ele,option):初始化
     * 参数：
     * ele:jquery元素
     * option.auto:是否自动播放，默认值true
     * option.delay:切换延时，默认值5000ms
     * option.pagination:是否显示分页器，默认值true
     * option.paginationEvent:分页器是否添加点击事件，默认值false
     * option.onStart:开始变换的回调函数,传递当前显示对象的id
     * option.onComplete:结束变换的回调函数,传递当前显示对象的id
 * 
 *  shutterDemo.NextItem()：下一页
 * 
 *  shutterDemo.PrevItem()：上一页
 * 
 *  li元素必填两个属性：
     data-type   切换的效果：
        random              随机效果(下面八个效果随机一个),
        fade                淡入淡出(若li项目除了图片以外有其他元素建议只使用这个效果),
        row-bar-move        横向消失
        row-bar-cross       横向交错消失
        col-bar-move        竖向消失
        col-bar-cross       竖向交错消失
        square-disappear    方块对角线消失
        square-random       方块随机消失
        square-shrink       方块收缩消失
     data-img    切换的图片
 */
