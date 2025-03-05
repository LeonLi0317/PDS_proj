'use strict';

//import form from './pds.form.js'; // 未來模組直接import
// 可以繼續 import 更多模組
import ui from './pds.ui.js';
// 🔥 自動收集模組
const modules = { ui };
//const modules = { ui, form };

// 自動遞迴代理
function recursiveProxy(target) {
    return new Proxy(target, {
        get(obj, prop) {
            if (prop in obj) {
                const value = obj[prop];

                // 遞迴代理巢狀物件
                if (typeof value === 'object' && value !== null) {
                    return recursiveProxy(value);
                }
                return value;
            }

            // 🔥 自動檢查子模組裡面的方法
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null && prop in obj[key]) {
                    const subValue = obj[key][prop];
                    return typeof subValue === 'object' ? recursiveProxy(subValue) : subValue;
                }
            }

            console.warn(`方法 ${prop} 不存在`);
            return undefined;
        }
    });
}
console.log(modules);
// 🚨 多模組合併 (自動展開全部模組)
export default recursiveProxy(Object.assign({}, ...Object.values(modules)));
