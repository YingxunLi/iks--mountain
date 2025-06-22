// 页面切换
const pages = Array.from(document.querySelectorAll('.page'));
function showPage(name) {
  pages.forEach(p => p.classList.remove('active'));
  const page = document.querySelector('.page-' + name.replace('.', '-'));
  if (page) page.classList.add('active');
}

// 按钮切换页面
document.querySelectorAll('.btn[data-next]').forEach(btn => {
  btn.addEventListener('click', e => {
    const next = btn.getAttribute('data-next');
    showPage(next);
    // 特殊页面进入时重置
    if (next === '3') playPage3();
    if (next === '4') setupPage4();
  });
});

// 1.3/1.4 拖拽交互
function setupDragAnim(pageClass, videoSelector) {
  const page = document.querySelector(pageClass);
  if (!page) return;
  const imgs = page.querySelectorAll('.draggable');
  const video = page.querySelector(videoSelector);
  let dragging = [false, false];
  let startX = [0, 0];
  let curX = [0, 0];
  let initPos = [0, 0];
  imgs.forEach((img, idx) => {
    img.onmousedown = e => {
      dragging[idx] = true;
      startX[idx] = e.clientX;
      initPos[idx] = img.offsetLeft;
      document.body.style.userSelect = 'none';
    };
    document.addEventListener('mousemove', e => {
      if (!dragging[idx]) return;
      let dx = e.clientX - startX[idx];
      curX[idx] = initPos[idx] + dx;
      img.style.transform = `translateX(${dx}px)`;
      // 检查两图距离
      const other = imgs[1 - idx];
      const rect1 = img.getBoundingClientRect();
      const rect2 = other.getBoundingClientRect();
      if (Math.abs(rect1.right - rect2.left) < 40 || Math.abs(rect2.right - rect1.left) < 40) {
        // 播放动画
        video.style.display = 'block';
        video.currentTime = 0;
        video.play();
        imgs.forEach(i => i.style.visibility = 'hidden');
        setTimeout(() => {
          video.pause();
          video.currentTime = video.duration - 0.1;
        }, video.duration * 1000);
      }
    });
    document.addEventListener('mouseup', e => {
      if (dragging[idx]) {
        dragging[idx] = false;
        img.style.transform = '';
        document.body.style.userSelect = '';
      }
    });
  });
}
setupDragAnim('.page-1-3', 'video.webm-anim');
setupDragAnim('.page-1-4', 'video.webm-anim');

// 2.2/2.3/2.4 选择图片播放动画
function setupSelectable(pageClass, videoSrc, btnNextSelector) {
  const page = document.querySelector(pageClass);
  if (!page) return;
  const imgs = page.querySelectorAll('.selectable');
  const video = page.querySelector('video.webm-anim');
  const btn = page.querySelector(btnNextSelector);
  imgs.forEach((img, idx) => {
    img.addEventListener('click', () => {
      imgs.forEach((im, i) => {
        if (i !== idx) im.classList.add('inactive');
      });
      video.currentTime = 0;
      video.play();
      video.onended = () => {
        btn.style.display = '';
        video.onended = null;
      };
    });
  });
}
setupSelectable('.page-2-2', 'assets/2.1.mp4', '.btn[data-next="2-3"]');
setupSelectable('.page-2-3', 'assets/2.3.mp4', '.btn[data-next="2-4"]');
setupSelectable('.page-2-4', 'assets/2.4.mp4', '.btn[data-next="3"]');

// 3 动画播放完切换到glb模型
function playPage3() {
  const page = document.querySelector('.page-3');
  const video = page.querySelector('video.webm-anim');
  const glb = page.querySelector('.glb-viewer');
  const btn = page.querySelector('.btn[data-next="4"]');
  glb.style.display = 'none';
  btn.style.display = 'none';
  video.currentTime = 0;
  video.style.display = '';
  video.play();
  video.onended = () => {
    video.style.display = 'none';
    glb.style.display = '';
    btn.style.display = '';
    video.onended = null;
  };
}

// 4 随机光圈、点击播放动画、显示信息
function setupPage4() {
  const page = document.querySelector('.page-4');
  const circles = page.querySelectorAll('.circle');
  const infoAnim = page.querySelector('.info-anim');
  const infoBox = page.querySelector('.info-box');
  const btnClose = page.querySelector('.btn-close');
  // 随机放置光圈
  circles.forEach(c => {
    c.style.left = (10 + Math.random() * 70) + 'vw';
    c.style.top = (15 + Math.random() * 60) + 'vh';
    c.style.display = '';
  });
  infoAnim.style.display = 'none';
  infoBox.style.display = 'none';
  btnClose.style.display = 'none';
  // 光圈点击
  circles.forEach((c, idx) => {
    c.onclick = () => {
      // 播放不同动画
      infoAnim.src = `assets/4.${idx+1}.mp4`;
      infoAnim.style.display = '';
      infoAnim.currentTime = 0;
      infoAnim.play();
      infoBox.style.display = 'none';
      btnClose.style.display = '';
      // 信息内容可根据idx切换
      infoBox.querySelector('.small-title').textContent = 'Climate';
      infoBox.querySelector('.main-title').textContent = 'Wet & Erosive';
      infoBox.querySelector('.text').textContent = 'Heavy rainfall contributes to deep valleys and sharp ridges.';
      infoAnim.onended = () => {
        infoBox.style.display = '';
        infoAnim.onended = null;
      };
    };
  });
  // 关闭按钮
  btnClose.onclick = () => {
    infoAnim.pause();
    infoAnim.style.display = 'none';
    infoBox.style.display = 'none';
    btnClose.style.display = 'none';
  };
}

// 初始化显示第一页
showPage('1-1');
