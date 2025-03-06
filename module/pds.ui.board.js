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
            let isDragging = false;  // 用來追蹤是否開始拖曳
            let startTouchX, startTouchY, startTouchTime;

            // 觸控事件與滑鼠事件獨立處理，避免干擾
            $("#board .board-item").on("touchstart mousedown", function (e) {
                if (e.type === "touchstart" || e.which === 1) { // 只響應觸控與左鍵
                    // 記錄初始觸控位置和時間
                    if (e.type === "touchstart") {
                        startTouchX = e.originalEvent.touches[0].pageX;
                        startTouchY = e.originalEvent.touches[0].pageY;
                        startTouchTime = Date.now();
                    }

                    // 電腦端啟用拖曳，手機端長按啟用
                    if (e.type === "touchstart") {
                        timer = setTimeout(() => {
                            // 判斷是否拖曳
                            const moveX = Math.abs(e.originalEvent.touches[0].pageX - startTouchX);
                            const moveY = Math.abs(e.originalEvent.touches[0].pageY - startTouchY);

                            if (moveX > 10 || moveY > 10) {  // 如果移動超過一定距離，則視為拖曳
                                console.log('震動');
                                navigator.vibrate?.(200); // 震動提示
                                $("#board").sortable("enable"); // 啟用拖曳
                                console.log('開啟拖曳');
                                isDragging = true;
                                $(this).trigger("mousedown"); // 重新觸發拖曳事件
                            }
                        }, 1000); // 長按 1 秒後啟用
                    } else {
                        // 電腦端直接啟用拖曳
                        $("#board").sortable("enable");
                    }
                }
            }).on("touchend mouseup mouseleave", function () {
                clearTimeout(timer);
                if (!isDragging) {
                    // 如果沒有進行拖曳則讓頁面可以滾動
                    $(document).off("touchmove", preventTouchMove);
                }
                $("#board").sortable("disable"); // 離開時關閉拖曳
                isDragging = false;
            });

            // 防止滑動的觸控事件
            function preventTouchMove(e) {
                if (isDragging) {
                    e.preventDefault(); // 防止滑動
                }
            }

            // 監控拖曳過程，當接近邊界時觸發滾動
            $(document).on('touchmove', function (e) {
                if (isDragging) {
                    let touch = e.originalEvent.touches[0];
                    let scrollThreshold = 30; // 設定滾動邊界距離

                    // 判斷是否接近上邊界
                    if (touch.pageY < scrollThreshold) {
                        window.scrollBy(0, -10); // 滾動頁面向上
                    }
                    // 判斷是否接近下邊界
                    else if (touch.pageY > window.innerHeight - scrollThreshold) {
                        window.scrollBy(0, 10); // 滾動頁面向下
                    }
                }
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
