let str = require('./a.js');
document.getElementById('root').innerHTML = str;
import './index.css';
import './style.less';

if (module.hot) {
    module.hot.accept('./a.js',function() {
        let str = require('./a.js');
        document.getElementById('root').innerHTML = str;
    })
}