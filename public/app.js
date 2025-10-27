/**
 * 加载并渲染电影列表。
 */
async function loadMovies() {
  const list = document.getElementById('movies-list');
  const msg = document.getElementById('message');
  try {
    msg.textContent = '加载中…';
    const res = await fetch('/api/movies');
    if (!res.ok) throw new Error('获取电影失败');
    const data = await res.json();
    list.innerHTML = '';
    data.forEach((m) => {
      const li = document.createElement('li');
      li.textContent = `${m.title} (${m.year})`;
      list.appendChild(li);
    });
    msg.textContent = data.length ? `共 ${data.length} 部电影` : '暂无数据';
    msg.className = 'message';
  } catch (err) {
    msg.textContent = '加载失败';
    msg.className = 'message bad';
  }
}

/**
 * 处理表单提交，调用后端新增 API。
 */
async function handleAddMovie(event) {
  event.preventDefault();
  const titleInput = document.getElementById('title');
  const yearInput = document.getElementById('year');
  const msg = document.getElementById('message');

  const title = String(titleInput.value || '').trim();
  const year = Number(yearInput.value);

  if (!title || !Number.isInteger(year)) {
    msg.textContent = '请输入有效的标题与年份（整数）';
    msg.className = 'message bad';
    return;
  }

  try {
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, year })
    });
    if (!res.ok) {
      throw new Error('创建失败');
    }
    titleInput.value = '';
    yearInput.value = '';
    msg.textContent = '添加成功';
    msg.className = 'message success';
    await loadMovies();
  } catch (err) {
    msg.textContent = '添加失败';
    msg.className = 'message bad';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('movie-form').addEventListener('submit', handleAddMovie);
  loadMovies();
});

