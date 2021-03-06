## CSRF的防御方法

1.验证 HTTP Referer 字段

根据 HTTP 协议，在 HTTP 头中有一个字段叫 Referer，它记录了该 HTTP 请求的来源地址。可以通过验证
Referer的值来判断是否遭遇到了黑客的攻击。
但是这种方法并非万无一失，然而，这种方法并非万无一失。Referer 的值是由浏览器提供的，虽然 HTTP 协
议上有明确的要求，但是每个浏览器对于 Referer 的具体实现可能有差别，并不能保证浏览器自身没有安全漏
洞。使用验证 Referer 值的方法，就是把安全性都依赖于第三方（即浏览器）来保障，从理论上来讲，这样并
不安全。事实上，对于某些浏览器，比如 IE6 或 FF2，目前已经有一些方法可以篡改 Referer 值。

2.在请求地址中token

并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 token 或者 token 内容不正确，则认为可
能是 CSRF 攻击而拒绝该请求。
这种方法的相对于检查Referer来说要安全一些，但是需要在每一个请求中都添加token，相对来说比较麻烦。

3.在HTTP头中自定义属性并验证

这种方法也是使用token进行验证，和上一种方法不同的是，这里并不是把token加入到http请求之中，而是把它
放到http头中自定义的属性里。
然而这种方法的局限性非常大。XMLHttpRequest 请求通常用于 Ajax 方法中对于页面局部的异步刷新，并非所
有的请求都适合用这个类来发起，而且通过该类请求得到的页面不能被浏览器所记录下，从而进行前进，后退，刷
新，收藏等操作，给用户带来不便。