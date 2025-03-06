export default new class Board {
    #AllowSort = false;

    constructor() {}

    get AllowSort() { return this.#AllowSort; }
    set AllowSort(value) { this.#AllowSort = value; }

    Init() {
        $.get("fakedata/boarddata.json", (data) => {
            if (!$('.container').length) {
                $(document.body).prepend(`
                    <div class="container">
                        <div class="board-title">${data["board-title"]}</div>
                        <div class="row" id="board"></div>
                    </div>
                `);
            }
            this.RenderMenu(data);
        }).fail((error) => console.error("資料讀取失敗", error));
    }

    RenderMenu(data) {
        $('#board').html(data["mboard-list"]
            .map(item => `
                <div class="col-md-4 board-block">
                    <div class="board-item" sort="${item.sort}">${item.name}</div>
                </div>
            `).join(''));

        if (this.#AllowSort) this.InitSortable();
    }

    InitSortable() {
        console.log("🚨 綁定 SortableJS");

        new Sortable(document.getElementById('board'), {
            animation: 150,
            delay: 300,
            delayOnTouchOnly: true,
            touchStartThreshold: 2,
            draggable: ".board-block",
            scroll: true,
            scrollSensitivity: 100,
            scrollSpeed: 20,
            onStart: (evt) => {
                if (evt.originalEvent) navigator.vibrate?.(50); // 🎯 確保互動後震動
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

        $('#board .board-item').on("touchstart", () => console.log("👉 開始觸控"));
    }
}
