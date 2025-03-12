'use strict';
export default new class Board {
    constructor() {}
    /**
     * @param {Object} object - 物件
     * @param {boolean} [object.sortable=true] - 是否啟用拖曳排序，預設為true
     * @param {Object} object.data - 設定的資料
     */
    buildMenu(object) {
        let sortable = object.sortable ?? true;
        if (object.data == null) {
            $.get("data/boarddata.json", (data) => {
                if (!$('.board_container').length) {
                    $(document.body).prepend(`
                    <div class="board_container">
                        <div class="board-title">${data["board-title"]}</div>
                        <div class="row g-4" id="board"></div>
                    </div>
                `);
                }
                RenderMenu(data, sortable);
            }).fail((error) => console.error("資料讀取失敗", error));
        } else {
            console.log("獲取Menu資料失敗");
        }

        //監聽螢幕變化
        window.addEventListener("resize", () => ResizeMenu());
        //this.ResizeMenu(); // 初始化時先執行一次
    }
}
function RenderMenu(data, sortable) {
    console.log(data);
    $('#board').html(data["mboard-list"]
        .map(item => `
            <div class="board-block">
                <div class="board-item" mSeq="${item.mSeq}" sort="${item.sort}"><span>${item.name}</span><div class="subboard-item"></div></div>
            </div>
        `).join('')
    );
    $('.board-block .board-item').each(function(){
        data['subboard-list'].map(item=>{
            if($(this).attr('mseq')==item.mSeq){
                $(this).find('.subboard-item').append(`<div subSeq="${item.subSeq}" mSeq="${item.mSeq}" sort="${item.sort}"  >${item.name}</div>`)
                console.log($(this).attr('mseq'))
                return;
            }
        })
    });

    
    ResizeMenu();
    if (sortable) InitSortable();
    InitClickEvent(); // 加入點擊展開功能
}

function InitClickEvent() {
    $('.subboard-item').unbind();
    $(".board-item").on("click", function () {
        let $this = $(this);
        let isActive = $this.hasClass("active");
        $(".board-item").removeClass("active");
        if (!isActive) {
            //$this.find('.subboard-item').prop('hidden','');
            $this.addClass("active");
        };
    });
    
}

function ResizeMenu() {
    let width = $(window).width();
    let height = $(window).height();
    var elem = $(".board-block");
    elem.each(function () {
        $(this).attr("class", $(this).attr("class").replace(/\bcol-\d+\b/g, "").trim());
    });
    elem.each((index, item) => {
        let totalItems = elem.length;
        //針對部分行動裝置特別加邏輯
        if(height==1517 && width == 1137){
            // ipad pro直式
            $(item).addClass("col-6");
        } else
        if(height==944 && width == 656){
            // ipad air直式
            $(item).addClass("col-6");
        } else
        if(height==656 && width == 944){
            // ipad air橫式
            $(item).addClass("col-4");
        } else
        if(height==375 && width == 667){
            // iphone se 橫式
            $(item).addClass("col-6");
        } else
        if(height==2622 && width == 1206){
            // iphone 16 pro 橫式
            $(item).addClass("col-6");
        } else
        if (width < 576) {
            // 手機直式
            $(item).addClass("col-12");
        } else if (width < 768) {
            // 手機橫式
            if (totalItems <= 3) {
                $(item).addClass("col-4");
            } else if (totalItems === 4) {
                $(item).addClass("col-6");
            } else if (totalItems === 5) {
                $(item).addClass(index < 3 ? "col-4" : "col-6");
            } else {
                $(item).addClass("col-4");
            }
        } else if (width < 1024) {
            // 平板直式
            $(item).addClass("col-6");
        } else {
            // 平板橫式 & 電腦
            $(item).addClass("col-4");
        }
    });
}

function InitSortable() {
    console.log("sortable enable");

    new Sortable(document.getElementById('board'), {
        animation: 150,
        delay: 300,
        touchStartThreshold: 2,
        draggable: ".board-block",
        scroll: true,
        scrollSensitivity: 100,
        scrollSpeed: 20,
        onStart: (evt) => {
            if (evt.originalEvent) navigator.vibrate(50);
        },
        onEnd: (evt) => {
            console.count("拖拉結束");

            $(evt.item).addClass("drag-finish");

            setTimeout(() => {
                $(evt.item).removeClass("drag-finish");
            }, 300);

            $("#board .board-item").each((index, item) => {
                $(item).attr("sort", index + 1);
            });
            // 重新設定排序值
            let sortedData = $("#board .board-item").map(function (index) {
                return {
                    mSeq: $(this).attr("mSeq"), // 保持 mSeq
                    sort: index + 1, // 根據目前順序重新計算 sort
                    name: $(this).text() // 保持原始名稱
                };
            }).get();
            var result = {
                "mboard-list": sortedData
            };
            console.log(JSON.stringify(result));
        }
    });
}
