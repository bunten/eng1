
// 登録した単語を保存する配列
let words = JSON.parse(
    localStorage.getItem("englishWords") || "[]"
);

// 編集中の単語番号
let editId = null;


// 単語を保存する
function saveWord() {

    const category =
        document.getElementById("category").value;

    const english =
        document.getElementById("english").value.trim();

    const japanese =
        document.getElementById("japanese").value.trim();

    const example =
        document.getElementById("example").value.trim();

    const message =
        document.getElementById("message");

    // 入力確認
    if (english === "" || japanese === "") {

        message.textContent =
            "英単語と日本語の意味を入力してください。";

        return;
    }

    // 単語データを作る
    const word = {
        id: editId === null ? Date.now() : editId,
        category: category,
        english: english,
        japanese: japanese,
        example: example
    };

    if (editId === null) {

        // 新しい単語を追加
        words.push(word);

        message.textContent = "単語を登録しました！";

    } else {

        // 既存の単語を更新
        const index = words.findIndex(
            item => item.id === editId
        );

        if (index !== -1) {
            words[index] = word;
        }

        message.textContent = "単語を更新しました！";

    }

    // データ保存
    localStorage.setItem(
        "englishWords",
        JSON.stringify(words)
    );

    // 入力欄を空にする
    document.getElementById("english").value = "";
    document.getElementById("japanese").value = "";
    document.getElementById("example").value = "";

    editId = null;

    document.getElementById("saveButton").textContent =
        "単語を登録する";

    // 画面を更新
    showWords();

    updateSummary();

}


// 単語を画面に表示する
function showWords() {

    const wordList =
        document.getElementById("wordList");

    const filter =
        document.getElementById("filterCategory").value;

    const search =
        document.getElementById("search").value
            .trim().toLowerCase();

    wordList.innerHTML = "";

    // 分類と検索条件で絞り込む
    const filteredWords = words.filter(word => {

        const categoryMatch =
            filter === "すべて" ||
            word.category === filter;

        const searchMatch =
            word.english.toLowerCase().includes(search) ||
            word.japanese.toLowerCase().includes(search);

        return categoryMatch && searchMatch;

    });

    if (filteredWords.length === 0) {

        wordList.textContent =
            "登録した単語はありません。";

        return;
    }

    // 単語カードを作る
    filteredWords.forEach(word => {

        const card = document.createElement("div");

        card.className = "word-card";

        const tag = document.createElement("span");
        tag.className = "category-tag";
        tag.textContent = word.category;

        const title = document.createElement("h3");
        title.textContent = word.english;

        const meaning = document.createElement("p");
        meaning.textContent = "意味：" + word.japanese;

        card.appendChild(tag);
        card.appendChild(title);
        card.appendChild(meaning);

        if (word.example) {

            const example = document.createElement("p");
            example.textContent = "例文：" + word.example;

            card.appendChild(example);

        }

        // 編集ボタン
        const editButton =
            document.createElement("button");

        editButton.textContent = "編集";
        editButton.className = "edit-button";

        editButton.onclick = function() {
            editWord(word.id);
        };

        // 削除ボタン
        const deleteButton =
            document.createElement("button");

        deleteButton.textContent = "削除";
        deleteButton.className = "delete-button";

        deleteButton.onclick = function() {
            deleteWord(word.id);
        };

        card.appendChild(editButton);
        card.appendChild(deleteButton);

        wordList.appendChild(card);

    });

}


// 単語を編集する
function editWord(id) {

    const word = words.find(
        item => item.id === id
    );

    if (!word) return;

    document.getElementById("category").value =
        word.category;

    document.getElementById("english").value =
        word.english;

    document.getElementById("japanese").value =
        word.japanese;

    document.getElementById("example").value =
        word.example;

    editId = id;

    document.getElementById("saveButton").textContent =
        "変更を保存する";

    document.getElementById("message").textContent =
        "単語を編集しています。";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// 単語を削除する
function deleteWord(id) {

    if (!confirm("この単語を削除しますか？")) {
        return;
    }

    words = words.filter(
        word => word.id !== id
    );

    localStorage.setItem(
        "englishWords",
        JSON.stringify(words)
    );

    showWords();

    updateSummary();

}


// 学習状況を更新する
function updateSummary() {

    document.getElementById("totalCount").textContent =
        words.length;

    const categories = new Set(
        words.map(word => word.category)
    );

    document.getElementById("categoryCount").textContent =
        categories.size;

}


// 最初に画面を表示する
showWords();

updateSummary();
