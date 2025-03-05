'use strict';

const modules = {};

async function generateModulesJson() {
    try {
        let response = await fetch('/module/');
        let text = await response.text();
        let regex = /pds(?:\.\w+)*\.js/g;
        let matches = [...text.matchAll(regex)].map(m => m[0]);
        let uniqueMatches = [...new Set(matches)].filter(f => f !== 'pds.js');
        console.log('🔥 自動找到模組:', uniqueMatches);
        return uniqueMatches;
    } catch (e) {
        console.error('模組掃描失敗', e);
        return [];
    }
}

async function loadModules() {
    let files = await generateModulesJson();
    for (let file of files) {
        try {
            let module = await import(`./${file}`);
            let name = file.replace('.js', '').replace(/pds\./g, '').replace(/\//g, '.');
            let path = name.split('.');
            let current = modules;

            while (path.length > 1) {
                let key = path.shift();
                current[key] = current[key] || {};
                current = current[key];
            }

            let instance = module.default instanceof Object ? module.default : new module.default();
            current[path[0]] = recursiveProxy(instance);

        } catch (e) {
            console.error(`🚫 載入模組 ${file} 失敗`, e);
        }
    }
}

function recursiveProxy(target) {
    return new Proxy(target, {
        get(obj, prop) {
            if (prop === 'then') return undefined; // 防止 Promise
            if (prop in obj) {
                let value = obj[prop];
                return typeof value === 'object' && value !== null ? recursiveProxy(value) : value;
            }
            console.warn(`🚫 方法 ${prop} 不存在`);
            return undefined;
        }
    });
}

function generateJSDoc(target, namespace = 'pds') {
    let doc = `/**\n * @namespace ${namespace}\n`;

    // 先掃描 Proxy 自身的屬性
    let keys = Reflect.ownKeys(target);
    for (let key of keys) {
        if (typeof target[key] === 'function') {
            doc += ` * @method ${key}\n`;
        } else if (typeof target[key] === 'object' && target[key] !== null) {
            doc += ` * @property ${key}\n`;
            doc += generateJSDoc(target[key], `${namespace}.${key}`);
        }
    }

    // 🔥 再掃描 Prototype 鏈上的方法，過濾掉 Object.prototype 的方法
    let protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(target));
    for (let key of protoKeys) {
        // 排除掉 Object.prototype 中的方法
        if (key !== 'constructor' && typeof target[key] === 'function' && !Object.prototype.hasOwnProperty.call(Object.prototype, key)) {
            doc += ` * @method ${key}\n`;
        }
    }

    doc += ' */\n';
    return doc;
}



async function initialize() {
    await loadModules();
    console.log('🔄 全部模組初始化完成:', modules);
    let proxy = recursiveProxy(modules);
    window.pds = proxy;
    //let jsDoc = generateJSDoc(modules);
    //console.log(jsDoc);
    return proxy;
}

const pds = await initialize();

export default pds;
