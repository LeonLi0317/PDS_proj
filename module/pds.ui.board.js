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
                    $(document.body).prepend(`
                        <div class="container">
                            <div class="board-title">${data["board-title"]}</div>
                            <div class="row" id="board"></div>
                        </div>
                    `);
                }

                this.RenderMenu(data);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async RenderMenu(data) {
        const board = data["board-list"]
            .map(item => `
                <div class="col-md-4 board-block">
                    <div class="board-item" sort="${item.sort}">${item.name}</div>
                </div>
            `).join('');

        $('#board').html(board);

        if (this.#AllowSort) {
            console.log("🚨 綁定 SortableJS");

            const boardElement = document.getElementById('board');

            let sortable = new Sortable(boardElement, {
                animation: 150,
                delay: 300,
                delayOnTouchOnly: true,
                touchStartThreshold: 2,
                draggable: ".board-block",
                onEnd: function (evt) {
                    console.count("拖拉結束");
            
                    $("#board .board-item").each(function (index) {
                        $(this).attr("sort", index + 1);
                    });
            
                    let sortedData = $("#board .board-item").map(function () {
                        return { menuname: $(this).text(), sort: $(this).attr("sort") };
                    }).get();
            
                    console.log("🔄 更新排序 JSON:", JSON.stringify(sortedData));
                }
            });

            $('#board .board-item').on("touchstart", function (e) {
                console.log("👉 開始觸控");
            });

            $(document).on("touchend", function () {
                console.log("🔓 解除 sortable");
            });
        }
    }
}
