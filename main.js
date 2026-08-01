let currentPhotos = []; 
let currentModalIndex = 0; 

// スマホメニューの開閉機能
function toggleMenu() {
    document.querySelector('.sidebar').classList.toggle('open');
    document.getElementById('hamburger').classList.toggle('open');
}

// リンクを押したあとにメニューを自動で閉じる機能
function closeMenu() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.getElementById('hamburger');
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        hamburger.classList.remove('open');
    }
}

// ロゴを押した時にトップ画像に戻す機能
function showTopPage() {
    const contentGrid = document.getElementById('content-grid');
    contentGrid.className = ''; 
    contentGrid.innerHTML = `
        <div class="top-main-visual">
            <img src="images/top.jpg" alt="Top Image">
        </div>
    `;
    closeMenu(); 
}

// 別のHTMLファイル（写真リストなど）を読み込む機能
function loadSection(fileName) {
    const contentGrid = document.getElementById('content-grid');
    const loading = document.getElementById('loading');

    loading.style.display = 'block';
    contentGrid.innerHTML = '';
    contentGrid.className = '';

    fetch(fileName)
        .then(response => {
            if (!response.ok) throw new Error('通信エラー');
            return response.text();
        })
        .then(html => {
            contentGrid.innerHTML = html;
            loading.style.display = 'none';
        })
        .catch(error => {
            // ★エラー時のメッセージを分かりやすくしました
            contentGrid.innerHTML = '<p style="color: red;">【読み込みエラー】<br>ファイルを直接ダブルクリックして開いている場合、セキュリティ制限で写真を表示できません。<br>VS Codeの「Live Server」を使用するか、サーバーにアップロードして確認してください。</p>';
            loading.style.display = 'none';
        })
        .finally(() => {
            closeMenu(); // 読み込み後メニューを閉じる
        });
}

// 写真をクリックした時の処理
function openModal(clickedImg) {
    const container = clickedImg.closest('.grid');
    const images = Array.from(container.querySelectorAll('img'));
    
    currentPhotos = images.map(img => img.src);
    currentModalIndex = images.indexOf(clickedImg);
    
    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-img');
    
    modalImg.src = currentPhotos[currentModalIndex];
    modal.style.display = 'block';
}

// 前後の写真に切り替える
function changePhoto(step, event) {
    event.stopPropagation();
    currentModalIndex += step; 
    
    if (currentModalIndex >= currentPhotos.length) {
        currentModalIndex = 0;
    } else if (currentModalIndex < 0) {
        currentModalIndex = currentPhotos.length - 1;
    }
    
    document.getElementById('modal-img').src = currentPhotos[currentModalIndex];
}

// 拡大画面を閉じる
function closeModal(event, forceClose = false) {
    if (!forceClose && event.target.id === 'modal-img') return;
    document.getElementById('photo-modal').style.display = 'none';
}