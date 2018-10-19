# JavaScript响应式

我们看下边的代码：

```javascript
    let price = 5
    let quantity = 2
    let total = price * quantity // => 10
    price = 20
    console.log(`total is ${total}`)
```

它会打印10：

```javscript
    >> total is 10
```

我们希望price或quantity变化后total跟着更新，我们想要的是如下的结果：

```javscript
    >> total is 40
```

不巧的是，JavaScript不是响应式的，所以我们没有得到想要的结果。这时候我们就得想点办法，来达到我们的目的。

⚠️ 问题一
我们需要保存计算total的方法，以便在price或quantity发生变化时再一次调用。

✅ 解决方案
首先，我们需要一些方法来告诉我们的应用程序，“存储我将要调用的这段代码，我可能会在其他时间再次调用。”紧接着我们来执行这段代码，当price或quantity变量更新后，再次运行之前存储的代码。

我们可以创建一个记录函数来保存我们要的东西，这样我们就可以再次调用它：

```javascript
    let price = 5
    let quantity = 2
    let total = 0
    let target = null
    target = () => { total = price * quantity }
    record()
    target()
```

注意，我们在target变量中存储一个匿名函数，然后调用record函数。record的定义很简单：

```javascript
    let storge = [] // 用来存储target
    // 记录函数
    function record (){
    storge.push(target)
    }
```

我们已经保存了target（{total = price * quantity}），因此我们可以之后再运行它，这时我们可以使用一个replay函数，来运行我们所记录的所有内容。

```javascript
    function replay (){
        storge.forEach(run => run())
    }
```

这将遍历存储在storage这个数组中的所有匿名函数，并执行每个函数。

然后就会变成这样：

```javascript
    price = 20 
    console.log(total) // => 10
    replay()
    console.log(total) // => 40
```

下面是完整的代码，你可以通读以方便理解：

```javascript
    let price = 5
    let quantity = 2
    let total = 0
    let target = null
    let storge = [] // 用来存储target
    // 记录函数
    function record (){
        storge.push(target)
    }
    function replay (){
        storge.forEach(run => run())
    }
    target = () => { total = price * quantity }
    record()
    target()
    price = 20 
    console.log(total) // => 10
    replay()
    console.log(total) // => 40
```

⚠️ 问题二
我们可以根据需要，继续记录target这类的代码，但最好有一个一劳永逸的办法。

✅ 解决方案：依赖类
我们来解决这个问题的方法是将这种行为（target这种匿名函数）封装到它自己的类中，这是一个标准编程中实现观察者模式的依赖类。

因此，如果我们创建一个JavaScript类来管理我们的依赖项（使它更接近Vue的处理方式），就像这样：

```javascript
    class Dep { // 例子
        constructor () {
            this.subscribers = [] //  替代之前的storage
        }
        depend () {  //  替代之前的record
            if (target && !this.subscribers.includes(target)) {
            this.subscribers.push(target)
            }
        }
        notify () { // 替代之前的replay
            this.subscribers.forEach(sub => sub())  //  运行我们的target或观察者
        }
    }
```

注意，我们现在将匿名函数存储在subscribers中，而不是storage，record也变成了depend，使用notify来代替replay，然后就会变成这样：

```javascript
    const dep = new Dep()
    let price = 5
    let quantity = 2
    let total = 0
    let target = () => { total = price * quantity }
    dep.depend() // target添加到subscribers中
    target() // 运行并得到total
    console.log(total) // => 10
    price = 20 
    console.log(total) // => 10
    dep.notify()  // 调用subscribers里存储的target
    console.log(total) // => 40
```
改了命名，依旧可以运行，但更适合复用。唯一有点别扭的就是target的存储和调用。

⚠️ 问题三
我们会为每个变量创建一个依赖类，并且对创建匿名函数的行为进行封装，从而做到响应式。而不是像这样调用（这是上面的部分代码）：

```javascript
    target = () => { total = price * quantity }
    dep.depend()
    target()
```

我们可以改为：

```javascript
    watcher(() => {
        total = price * quantity
    })
```

✅ 解决方案: 监听函数（观察者模式）
在我们的监听函数中，我们可以做一些简单的事情：

```javascript
    function watcher(myFun) {
        target = myFun
        dep.depend()
        target()
        target = null
    }
```

正如你所看到的，watcher函数接受myFunc参数，将其赋给全局的target上，调用dep.depend()将其添加到subscribers里，之后调用并重置target。

运行下面的代码：

```javascript
    price = 20
    console.log(total)
    dep.notify()
    console.log(total)
```

输出：

```javascript
    >> 10
    >> 40
```

还有个问题没有说，为什么我们将target设置为全局变量，而不是在需要的时候将其传递到函数中。这个答案，请在后边的内容里寻找。

⚠️ 问题四
我们有一个Dep class，但我们真正想要的是每个变量都有它自己的依赖类，我们把每个属性都放到一个对象里。

```javascript
    let data = { price: 5, quantity: 2 }
```

假设一下，我们的每个属性（price和quantity）都有自己的依赖类。

运行下面的代码：

```javascript
    watcher(() => {
        total = data.price * data.quantity
    })
```

因为data.price值被访问，我希望price属性的依赖类将我们存储在target中的匿名函数，通过调用dep.depend()将其推到它的订阅者（用来存储target）数组中。

同理，因为data.quantity被访问，我同样希望quantity属性的依赖类将这个存储在target中的匿名函数推入其订阅者（用来存储target）数组中。

如果我有另一个匿名函数，里边只是data.price被访问，我希望只是将其推送到price属性的依赖类中。

我们需要在price更新的时候，来调用dep.notify()，我们想要的结果就是这样的：

```javascript
    console.log(total) // >> 10
    price = 20 // 此时，需要调用price上的notify()
    console.log(total) // >> 40
```

我们需要一些方法来连接data里的属性（如price或quantity），所以当它被访问时，我们可以将target保存到我们的订阅者数组中，当它被改变时，运行我们存储在订阅者数组中的函数。

✅ 解决方案: Object.defineProperty()
我们需要了解下ES5中的Object.defineProperty()函数。它可以为属性定义getter和setter函数。让我们看一下它的基本用法：

```javascript
    let data = { price: 5, quantity: 2 }
    Object.defineProperty(data, 'price', {
        get() {
            console.log(`I was accessed`)
        },
        set(newVal) {
            console.log(`I was changed`);
        }
    })
    data.price // 调用get() >> I was accessed
    data.price = 20 // 调用set() >> I was changed
```

如你所见，控制台有两行输出，但是，它实际上并没有get或set任何值，因为我们的用法并不合理。我们现在将其恢复，get()方法返回一个值，set()方法更新一个值，我们添加一个变量internalValue来存储我们当前的price。

```javascript
    let data = { price: 5, quantity: 2 }
    let internalValue = data.price // 初始的值
    Object.defineProperty(data, 'price', {
        get() {
            console.log(`Getting price: ${internalValue}`)
            return internalValue
        },
        set(newVal) {
            console.log(`Setting price to: ${newVal}`);
            internalValue = newVal
        }
    })
    total = data.price * data.quantity  // 调用get() >> Getting price: 5
    data.price = 20 // 调用set()  >> Setting price to: 20
```

当我们的get和set正常工作时，控制台输出的结果也不会出现其他可能。

所以，当我们获取和设置值时，我们就可以得到我们想要的通知。通过一些递归，我们可以为data内的所有属性运行Object.defineProperty。这时候就可以用到Object.keys(data)，像这样：

```javascript
    let data = { price: 5, quantity: 2 }
    Object.keys(data).forEach(key => {
        let internalValue = data[key]
        Object.defineProperty(data, key, {
            get() {
                console.log(`Getting ${key}: ${internalValue}`)
                return internalValue
            },
            set(newVal) {
                console.log(`Setting ${key} to: ${newVal}`);
                internalValue = newVal
            }
        })
    })
    total = data.price * data.quantity
    data.price = 20
```

现在每个属性都有了get和set，控制台的输出很好的证实了这一点。

```javascript
    Getting price: 5
    Getting quantity: 2
    Setting price to: 20
    🛠 结合这两个想法
    total = data.price * data.quantity
```

当这段代码运行并获取price值时，我们希望price记住这个匿名函数（target）。这样，如果price发生变化或者被赋新值时，它就会重新触发这个函数，因为它知道这一行依赖于它。你可以这样理解。

Get =>记住这个匿名函数，当我们的值发生变化时，我们会再次运行它。

Set =>运行保存的匿名函数，我们的值发生改变。

或者就我们的Dep Class而言

访问price (get) => 调用dep.depend()以保存当前target

修改price (set) => 用price调用dep.notify(), 重新运行全部的targets

让我们结合这两个想法，然后看看我们的最终代码：

```javascript
    let data = { price: 5, quantity: 2 }
    let target = null
    class Dep {
        constructor () {
            this.subscribers = []
        }
        depend () {
            if (target && !this.subscribers.includes(target)) {
            this.subscribers.push(target) 
            }
        }
        notify () {
            this.subscribers.forEach(sub => sub())
        }
    }
    Object.keys(data).forEach(key => {
        let internalValue = data[key]

        const dep = new Dep()

        Object.defineProperty(data, key, {
            get() {
                dep.depend()
                return internalValue
            },
            set(newVal) {
                internalValue = newVal
                dep.notify()
            }
        })
    })
    function watcher(myFun) {
        target = myFun
        target()
        target = null
    }
    watcher(() => {
        data.total = data.price * data.quantity
    })
```


