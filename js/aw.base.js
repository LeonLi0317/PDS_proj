// AW.BASE.js
'use strict';

// 確保 AW 類別已經被定義
if (typeof AW === 'undefined') {
    throw new Error('AW is not defined. Please include AW.js before AW.BASE.js');
}

/*AW.BASE = class extends AW{
    constructor() {
        super();
    }
    C(){
        return 'this is fn(C).';
    }
}*/

// 將 AW.BASE 類別賦值給 window.AW.BASE
//window.AW.BASE = new AW.BASE();
