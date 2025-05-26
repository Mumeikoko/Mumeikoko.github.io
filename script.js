// 載入儲存的網址資料
document.addEventListener('DOMContentLoaded', () => {
    loadEntries();
});

// 新增網址按鈕事件監聽器
document.getElementById('addUrlButton').addEventListener('click', () => {
    addUrl();
});

// 允許按 Enter 鍵新增網址
document.getElementById('urlInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addUrl();
    }
});

function addUrl() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();

    if (url) {
        const today = new Date();
        const dateString = `${today.getMonth() + 1}/${today.getDate()}`;

        const newEntry = {
            url: url,
            date: dateString,
            clicked: false,
            comment: ''
        };

        // 從 localStorage 載入現有資料
        const entries = JSON.parse(localStorage.getItem('lotteryEntries') || '[]');

        // 將新項目添加到最前面
        entries.unshift(newEntry);

        // 儲存回 localStorage
        saveEntries(entries);

        // 清空輸入框
        urlInput.value = '';

        // 重新渲染列表
        renderEntries(entries);
    }
}

function saveEntries(entries) {
    localStorage.setItem('lotteryEntries', JSON.stringify(entries));
}

function loadEntries() {
    const entries = JSON.parse(localStorage.getItem('lotteryEntries') || '[]');
    renderEntries(entries);
}

function renderEntries(entries) {
    const entriesContainer = document.getElementById('entriesContainer');
    entriesContainer.innerHTML = ''; // 清空現有內容

    // 按日期分組
    const groupedEntries = entries.reduce((acc, entry) => {
        (acc[entry.date] = acc[entry.date] || []).push(entry);
        return acc;
    }, {});

    // 按日期排序 (新到舊)
    const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
        // 簡單的日期比較，實際應用可能需要更精確的日期解析
        const [monthA, dayA] = a.split('/').map(Number);
        const [monthB, dayB] = b.split('/').map(Number);
        if (monthA !== monthB) return monthB - monthA;
        return dayB - dayA;
    });

    sortedDates.forEach(date => {
        const dateGroupDiv = document.createElement('div');
        dateGroupDiv.classList.add('date-group');

        const dateHeader = document.createElement('h2');
        dateHeader.classList.add('date-header');
        dateHeader.textContent = date;
        dateGroupDiv.appendChild(dateHeader);

        groupedEntries[date].forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('url-entry');

            const urlLink = document.createElement('a');
            urlLink.classList.add('url-link');
            if (entry.clicked) {
                urlLink.classList.add('clicked');
            }
            urlLink.textContent = entry.url;
            urlLink.href = entry.url;
            urlLink.target = '_blank'; // 在新分頁開啟
            urlLink.addEventListener('click', (event) => {
                // event.preventDefault(); // 阻止預設連結行為，如果需要
                markAsClicked(entry.url, date);
            });
            entryDiv.appendChild(urlLink);

            if (entry.clicked) {
                const checkmark = document.createElement('span');
                checkmark.classList.add('checkmark');
                checkmark.textContent = ' ✔';
                entryDiv.appendChild(checkmark);
            }

            // 留言框 (目前對所有使用者可見，且資料未儲存)
            const commentInput = document.createElement('textarea');
            commentInput.classList.add('comment-box');
            commentInput.placeholder = '管理員留言...';
            commentInput.value = entry.comment;
            // 注意：這裡的留言功能僅為前端顯示，輸入的內容不會被保存
            // 真正的管理員留言功能需要後端實現
            entryDiv.appendChild(commentInput);

            dateGroupDiv.appendChild(entryDiv);
        });

        entriesContainer.appendChild(dateGroupDiv);
    });
}

function markAsClicked(url, date) {
    const entries = JSON.parse(localStorage.getItem('lotteryEntries') || '[]');
    const entryIndex = entries.findIndex(entry => entry.url === url && entry.date === date);
    if (entryIndex !== -1) {
        entries[entryIndex].clicked = true;
        saveEntries(entries);
        renderEntries(entries);
    }
}
