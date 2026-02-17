(function () {
  const API = '/api/journals';

  const viewList = document.getElementById('view-list');
  const viewWrite = document.getElementById('view-write');
  const viewRead = document.getElementById('view-read');
  const journalList = document.getElementById('journal-list');
  const listLoading = document.getElementById('list-loading');
  const listEmpty = document.getElementById('list-empty');
  const journalTitle = document.getElementById('journal-title');
  const writeDate = document.getElementById('write-date');
  const readDate = document.getElementById('read-date');
  const readTitle = document.getElementById('read-title');
  const readBody = document.getElementById('read-body');
  const btnSave = document.getElementById('btn-save');
  const btnEdit = document.getElementById('btn-edit');
  const btnDelete = document.getElementById('btn-delete');
  const btnEmoji = document.getElementById('btn-emoji');
  const emojiPickerContainer = document.getElementById('emoji-picker-container');

  let quill = null;
  let currentId = null;
  let emojiPicker = null;

  function showView(name) {
    viewList.hidden = name !== 'list';
    viewWrite.hidden = name !== 'write';
    viewRead.hidden = name !== 'read';
    if (name === 'list') loadJournals();
    if (name === 'write' && !quill) initEditor();
  }

  function formatDateTime(iso) {
    const d = new Date(iso);
    const date = d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return date + ' · ' + time;
  }

  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.textContent || div.innerText || '';
  }

  async function loadJournals() {
    listLoading.hidden = false;
    listEmpty.hidden = true;
    journalList.querySelectorAll('.journal-card').forEach((el) => el.remove());
    try {
      const res = await fetch(API);
      const data = await res.json();
      listLoading.hidden = true;
      if (!data.length) {
        listEmpty.hidden = false;
        return;
      }
      data.forEach((j) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'journal-card';
        const title = j.title || 'Untitled';
        const preview = stripHtml(j.content).slice(0, 120);
        card.innerHTML = `
          <h3>${escapeHtml(title)}</h3>
          ${preview ? `<p class="preview">${escapeHtml(preview)}</p>` : ''}
          <p class="meta">${formatDateTime(j.created_at)}</p>
        `;
        // Clicking an entry goes straight to edit
        card.addEventListener('click', () => openWrite(j.id));
        journalList.appendChild(card);
      });
    } catch (err) {
      listLoading.textContent = 'Failed to load. Is the server running?';
      listLoading.hidden = false;
    }
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function initEditor() {
    quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: '#editor-toolbar',
        clipboard: { matchVisual: false },
      },
    });

    emojiPicker = emojiPickerContainer.querySelector('emoji-picker');
    if (emojiPicker && !emojiPicker._bound) {
      emojiPicker._bound = true;
      emojiPicker.addEventListener('emoji-click', (e) => {
        const range = quill.getSelection(true) || { index: quill.getLength() };
        quill.insertText(range.index, e.detail.unicode);
        quill.setSelection(range.index + e.detail.unicode.length);
        emojiPickerContainer.hidden = true;
      });
    }

    btnEmoji?.addEventListener('click', () => {
      emojiPickerContainer.hidden = !emojiPickerContainer.hidden;
    });
  }

  function openWrite(id) {
    currentId = id || null;
    viewWrite.hidden = false;
    viewList.hidden = true;
    viewRead.hidden = true;
    writeDate.textContent = id ? 'Editing' : 'New entry';
    if (btnDelete) btnDelete.hidden = !id;
    journalTitle.value = '';
    if (!quill) initEditor();
    quill.root.innerHTML = '';
    emojiPickerContainer.hidden = true;

    if (id) {
      fetch(`${API}/${id}`)
        .then((r) => r.json())
        .then((j) => {
          journalTitle.value = j.title || '';
          quill.root.innerHTML = j.content || '';
          writeDate.textContent = formatDateTime(j.updated_at);
        })
        .catch(() => {});
    }
  }

  function deleteEntry() {
    if (!currentId) return;
    const ok = window.confirm('Delete this entry? This cannot be undone.');
    if (!ok) return;

    fetch(`${API}/${currentId}`, { method: 'DELETE' })
      .then((r) => {
        if (!r.ok && r.status !== 204) throw new Error('Delete failed');
      })
      .then(() => {
        currentId = null;
        showView('list');
      })
      .catch(() => {});
  }

  function openRead(id) {
    currentId = id;
    fetch(`${API}/${id}`)
      .then((r) => r.json())
      .then((j) => {
        readTitle.textContent = j.title || 'Untitled';
        readBody.innerHTML = j.content || '';
        readDate.textContent = formatDateTime(j.created_at);
        showView('read');
      })
      .catch(() => {});
  }

  function saveEntry() {
    const title = journalTitle.value.trim() || 'Untitled';
    const content = quill ? quill.root.innerHTML : '';

    if (currentId) {
      fetch(`${API}/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
        .then((r) => r.json())
        .then(() => {
          showView('list');
        })
        .catch(() => {});
    } else {
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
        .then((r) => r.json())
        .then(() => {
          showView('list');
        })
        .catch(() => {});
    }
  }

  document.querySelectorAll('[data-view="list"]').forEach((el) => {
    el.addEventListener('click', () => showView('list'));
  });
  document.querySelectorAll('[data-action="new"]').forEach((el) => {
    el.addEventListener('click', () => openWrite());
  });
  btnSave?.addEventListener('click', saveEntry);
  btnDelete?.addEventListener('click', deleteEntry);
  btnEdit?.addEventListener('click', () => openWrite(currentId));

  showView('list');
})();
