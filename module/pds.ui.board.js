'use strict';

export default new class Board {
    #AllowSort = false;

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

        //排序功能
        if (typeof this.#AllowSort === 'boolean' && this.#AllowSort) {
            $("#board").sortable({
                start(event, ui) {
                    ui.placeholder.height(ui.item.height()); // 讓占位符有正確高度
                },
                stop(event, ui) {
                    console.count("拖拉結束");

                    // 重新根據當前順序更新 sort 屬性
                    $("#board .board-item").each(function (index) {
                        $(this).attr("sort", index + 1);
                    });

                    // 將新的排序資料轉為 JSON
                    let sortedData = $("#board .board-item").map(function () {
                        return { menuname: $(this).text(), sort: $(this).attr("sort") };
                    }).get();

                    console.log("更新排序 JSON:", JSON.stringify(sortedData));
                },
                delay: 1000, // 長按 1 秒啟動拖曳
                distance: 2, // 滑動距離大於 5px 才啟用拖曳
                forcePlaceholderSize: true,
                tolerance: "pointer",
                start: function (event, ui) {
                    if (navigator.vibrate) {
                        navigator.vibrate(50); // 啟動震動
                    }
                    ui.placeholder.height(ui.item.height());
                }
            });
        }
    }
}
