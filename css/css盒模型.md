### css盒模型分为两种

1. w3c标准盒模

    > 在标准盒模型中，width指content的高度

2. IE盒模型

    > 在IE的盒模型中，width表示content + padding + border这三部分的宽度

如果想要切换盒模型，可以借助css3的box-sizing属性，它的默认属性是content-box。

```javascript
    box-sizing: content-box;    //W3C盒模型
    box-sizing: border-box;     //IE盒模型
```