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
                    <div class="card board-item" sort="${item.sort}" mSeq="${item.mSeq}">
                        <div class="card-inner">
                            <div class="card-front">${item.name}</div>
                            <div class="card-back">
                                ${this.RenderSubMenu(item.mSeq, data["subboard-list"])}
                            </div>
                        </div>
                    </div>
                </div>
            `).join(''));

        this.BindEvents();

        if (this.#AllowSort) this.InitSortable();
    }

    RenderSubMenu(mSeq, subboardList) {
        let subList = subboardList.filter(sub => sub.mSeq === mSeq);
        return subList.map(sub => `
            <div class="sub-item">${sub.name}</div>
        `).join('');
    }

    BindEvents() {
        let self = this;

        $('#board').on('click', '.card', function (e) {
            e.stopPropagation(); // 防止冒泡

            let $card = $(this);
            let mSeq = $card.attr("mSeq");

            if (self.#activeCard && self.#activeCard[0] !== $card[0]) {
                self.ResetCard(self.#activeCard);
            }

            if (!$card.hasClass("flipped")) {
                $card.addClass("flipped");
                self.#activeCard = $card;

                self.#flipTimer = setTimeout(() => {
                    self.ResetCard($card);
                }, 5000);
            }
        });

        $('#board').on('click', '.sub-item', function (e) {
            e.stopPropagation(); // 防止冒泡
            console.log("👉 點選小卡:", $(this).text());
            clearTimeout(self.#flipTimer);
        });

        $(document).on("click", () => {
            if (self.#activeCard) self.ResetCard(self.#activeCard);
        });
    }

    ResetCard($card) {
        $card.removeClass("flipped");
        this.#activeCard = null;
        clearTimeout(this.#flipTimer);
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
                if (evt.originalEvent) navigator.vibrate?.(50);
            },
            onEnd: (evt) => {
                $(evt.item).addClass("drag-finish");

                setTimeout(() => {
                    $(evt.item).removeClass("drag-finish");
                }, 300);

                $("#board .board-item").each((index, item) => {
                    $(item).attr("sort", index + 1);
                });
            }
        });
    }
}
