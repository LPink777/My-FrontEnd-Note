## 绑定规则

1. 默认绑定：

    > 独立函数调用
    
    如果使用严格模式（ strict mode ），那么全局对象将无法使用默认绑定，因此 this 会绑定到 undefined
    
2. 隐式绑定

    > 调用位置是否有上下文对象，如果有，会绑定到这个上下文对象

3. 显示绑定

    > call apply    

4. new 绑定

    > 使用 new 来调用函数，或者说发生构造函数调用时，这个新对象会绑定到函数调用的 this 
    
#### 优先级

new 绑定 > 显示绑定 > 隐式绑定 > 默认绑定

## 判断this

1. 函数是否在 new 中调用（ new 绑定）？如果是的话 this 绑定的是新创建的对象。

        var bar = new foo()    

2. 函数是否通过 call 、 apply （显式绑定）或者硬绑定调用？如果是的话， this 绑定的是指定的对象。

        var bar = foo.call(obj2)

3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话， this 绑定的是那个上下文对象。

        var bar = obj1.foo()

4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined ，否则绑定到全局对象。

        var bar = foo()


## 补充

* array.forEach( callback, thisArg ) thisArg 是 callback 函数中的 this 关键字可引用的对象

* setInterval和setTimeout中传入函数时，函数中的this会指向window对象;**但如果使用的是箭头函数，则this指向继承自父作用域**

    ```javascript
        function foo() {
            setTimeout(function(){
                console.log(this);
            }, 100);
        }
        var obj = {
            a:2
        };
        foo.call( obj )   //{a:2}
    ```

* Array.prototype.slice.call() 把调用方法的参数截取出来(将函数的实际参数转换成数组的方法)

    ```javascript
    function (a,b,c,d){
    var arg = Array.prototype.slice.call(arguments,1)
        console.log(arg)
    }
    test('a','b','c','d')   //['b','c','d']
    ```
* Object.prototype.toString.call() **判断某个对象值属于哪种内置类型**

    ```javascript
    var arr = [];
    console.log(Object.prototype.toString.call(arr))  //"[object Array]"
    ```
    
## this分析

当前函数执行的主体(谁执行的函数this就是谁)

函数外的this是window

**this是谁和他在哪定义的以及在哪执行的没有任何关系**

### 在js非严格模式下

1. 自执行函数中的this一般都是window
2. 给元素的某个事件绑定方法，当事件触发执行对应的方法的时候，方法中的this一般都是当前操作的元素本身
3. 当方法执行的时候，看看方法名前面时候有**点**，点前的是谁this就是谁，没有就是window


### 在js严格模式下（`use strict`)

1. 在严格模式下，如果执行主体不明确，this指向undefined
