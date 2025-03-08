export default new class Board {
    #AllowSort = false;
    #flipTimer = null;
    #activeCard = null;

    constructor() { }

    get AllowSort() { return this.#AllowSort; }
    set AllowSort(value) { this.#AllowSort = value; }

    Init() {
        $.get("fakedata/boarddata.json", (data) => {
            if (!$('.container').length) {
                $(document.body).prepend(`
                    <div class="container">
                        <div class="board-title">${data["board-title"]}</div>
                        <div class="row g-4" id="board"></div>
                    </div>
                `);
            }
            this.RenderMenu(data);
        }).fail((error) => console.error("資料讀取失敗", error));

        // 📌 監聽螢幕大小變化
        window.addEventListener("resize", () => this.UpdateGrid());
        this.UpdateGrid(); // 初始化時先執行一次
    }

    RenderMenu(data) {
        $('#board').html(data["mboard-list"]
            .map(item => `
                <div class="board-block">
                    <div class="board-item" sort="${item.sort}">${item.name}</div>
                </div>
            `).join(''));

        this.UpdateGrid(); // 重新渲染排版

        if (this.#AllowSort) this.InitSortable();
    }

    UpdateGrid() {
        let width = $(window).width();
        let height = $(window).height();
        $(".board-block").removeClass("col-12 col-6 col-4");
        $(".board-block").each((index, item) => {
            let totalItems = $(".board-block").length;
            
            //針對ipad air格式特別加邏輯，模擬出來的長寬比例怪怪的
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

    InitSortable() {
        console.log("🚨 綁定 SortableJS");

        new Sortable(document.getElementById('board'), {
            animation: 150,
            delay: 300,
            delayOnTouchOnly: false,
            touchStartThreshold: 2,
            draggable: ".board-block",
            scroll: true,
            scrollSensitivity: 100,
            scrollSpeed: 20,
            onStart: (evt) => {
                if (evt.originalEvent) navigator.vibrate?.(50);
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

                let sortedData = $("#board .board-item").map(function () {
                    return { menuname: $(this).text(), sort: $(this).attr("sort") };
                }).get();

                console.log("🔄 更新排序 JSON:", JSON.stringify(sortedData));
            }
        });
    }
}
