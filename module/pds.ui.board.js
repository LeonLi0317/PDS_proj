'use strict';

export default new class Board {
    #AllowSort = true;

    constructor() { }

    get AllowSort() {
        return this.#AllowSort;
    }

    set AllowSort(value) {
        this.#AllowSort = value;
    }

    Init() {
        try {
            $.get("fakedata/boarddata.json", (data) => {
                const hasContainer = $(document).find('div').hasClass('container');

                if (!hasContainer) {
                    // 產生標題
                    $(document.body).prepend(`
                        <div class="container">
                            <div class="board-title">${data["board-title"]}</div>
                            <div class="row" id="board"></div>
                        </div>
                    `);
                }

                // 產生畫面按鈕
                this.RenderMenu(data);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async RenderMenu(data) {
        const board = data["board-list"]
            .map(item => `
                <div class="col-md-4">
                    <div class="board-item" sort="${item.sort}">${item.name}</div>
                </div>
            `).join('');

        $('#board').html(board); // 一次性塞入畫面

        if (typeof this.#AllowSort === 'boolean' && this.#AllowSort) {
            let timer;

            $("#board .board-item").on("touchstart mousedown", function (e) {
                if (e.type === "touchstart" || e.which === 1) { // 只響應觸控與左鍵
                    timer = setTimeout(() => {
                        navigator.vibrate?.(200); // 震動提示
                        $("#board").sortable("enable"); // 啟用拖曳
                        $(this).trigger("mousedown"); // 重新觸發拖曳事件
                    }, 1000); // 長按 1 秒後啟用
                }
            }).on("touchend mouseup mouseleave", function () {
                clearTimeout(timer);
                $("#board").sortable("disable"); // 離開時關閉拖曳
            });

            $("#board").sortable({
                start(event, ui) {
                    ui.placeholder.height(ui.item.height());
                },
                stop(event, ui) {
                    console.count("拖拉結束");

                    $("#board .board-item").each(function (index) {
                        $(this).attr("sort", index + 1);
                    });

                    let sortedData = $("#board .board-item").map(function () {
                        return { menuname: $(this).text(), sort: $(this).attr("sort") };
                    }).get();

                    console.log("更新排序 JSON:", JSON.stringify(sortedData));
                },
                forcePlaceholderSize: true,
                tolerance: "pointer"
            });

            // 初始禁用拖曳，需長按後啟用
            $("#board").sortable("disable");
        }
    }
}
