# about keylolTool

这是一个[其乐社区](https://keylol.com/)的[油猴](https://greasyfork.org/)脚本，在保持论坛原版风格的基础上增加一些附加功能。

## 功能&更新说明

Version 1.0

论坛可以使用蒸汽兑换体力进行用户组升级，但是当进行大量蒸汽兑换的时候，系统会按阶梯收取部分手续费，例如：

|兑换体力数量|手续费|所需蒸汽数量|
|:-:|:-:|:-:|
|1-3|0|1-3|
|4-6|1|5-7|
|7-9|2|9-11|
|...|...|...|

一次性兑换的蒸汽数量越多，手续费就越高，小数额加上多次数兑换可以绕过这个规则，实现0手续费的兑换操作。

1. 在用户功能栏中添加一个"蒸汽兑换"选项，点击后直接跳转到兑换页面。
>![before](https://raw.githubusercontent.com/RaMui/keylolTool/master/img/01.png) ➡ ![after](https://raw.githubusercontent.com/RaMui/keylolTool/master/img/02.png)
2. 在兑换页面添加一个select组件，可以切换兑换模式，选择"增强兑换"开始使用功能。
>![before](https://raw.githubusercontent.com/RaMui/keylolTool/master/img/03.png)⬇![after](https://raw.githubusercontent.com/RaMui/keylolTool/master/img/04.png)
3. "增强兑换"下通过select组件来切换兑换模式，可以使用不同的兑换方式进行兑换。
>![01](https://raw.githubusercontent.com/RaMui/keylolTool/master/img/05.png)![02](https://raw.githubusercontent.com/RaMui/keylolTool/master/img/06.png)
4. 使用localStorage来存储某些变量(如:登录密码,兑换次数)，所以即使兑换过程中不小心关闭了页面，下次再回到兑换页面会继续开始兑换，直到兑换结束。
5. 如果中途想取消兑换，可以使用'ctrl+z'组合按键取消，同时会清除localStorage,需要重新输入才可以进行兑换。
6. 每次兑换会有3-8秒的等待时间，不会频繁进行兑换请求，减轻服务器压力。
7. 脚本需要[油猴](https://greasyfork.org/)插件运行，安装成功后添加新脚本即可开始使用。
___
Version 1.1
1. 增加浏览历史功能,记录浏览过的帖子。
>![history](https://raw.githubusercontent.com/RaMui/keylolTool/master/img/07.png)
2. 使用indexedDB存储浏览过的帖子的基本信息(如标题、作者等)。
3. 优化蒸汽兑换功能部分的代码，使用ES6风格重构。
4. 项目名称更换为keylolTool。

---

Version 1.2.1

1.bug fix。

2.为浏览历史添加分页功能。