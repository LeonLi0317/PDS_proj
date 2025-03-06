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

    async Init() {
        try {
            const data = await $.ajax({
                method: 'get',
                url: 'fakedata/boarddata.json'
            });

            console.log("載入資料:", data);

            this.RenderContainer(data);
            this.RenderMenu(data);

        } catch (error) {
            console.error("載入失敗:", error);
        }
    }

    RenderContainer(data) {
        const hasContainer = $(document).find('div').hasClass('container');
        if (!hasContainer) {
            $(document.body).prepend(`
                <div class="container">
                    <div class="board-title">${data["board-title"]}</div>
                    <div class="row" id="board"></div>
                </div>
            `);
        }
        const board = data["board-list"]
            .map(item => `
                <div class="col-md-4">
                    <div class="board-item" sort="${item.sort}">${item.name}</div>
                </div>
            `).join('');
        $('#board').html(board);
    }

    RenderMenu(data) {
        if (typeof this.#AllowSort === 'boolean' && this.#AllowSort) {
            console.log("啟用排序功能");

            let isLongPress = false;  
            let pressTimer = null;  

            $(document).on("touchstart", "#board .board-item", function (e) {
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    console.log("長按啟動");

                    $("#board").sortable({
                        start(event, ui) {
                            console.log("sortable start");
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
                        delay: 1000, 
                        distance: 2,
                        forcePlaceholderSize: true,
                        tolerance: "pointer",
                        scroll: true,
                        scrollSensitivity: 50,
                        scrollSpeed: 15,
                    });
                }, 800);
            }).on("touchend", "#board .board-item", function (e) {
                clearTimeout(pressTimer);
                if (isLongPress) {
                    $("#board").sortable("destroy");
                    console.log("關閉拖曳");
                }
                isLongPress = false; 
            });
        }
    }
}
