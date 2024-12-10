export function setupModal(onSave) {
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const form = document.getElementById('nodeForm');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const cancelBtn = document.getElementById('cancelBtn');

  let currentNodeId = null;

  function showModal(node) {
    currentNodeId = node.id;
    titleInput.value = node.group.children[1].userData.title || '';
    descriptionInput.value = node.group.userData.description || '';
    modal.classList.add('active');
    overlay.classList.add('active');
  }

  function hideModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    currentNodeId = null;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentNodeId) {
      onSave({
        nodeId: currentNodeId,
        title: titleInput.value,
        description: descriptionInput.value
      });
    }
    hideModal();
  });

  cancelBtn.addEventListener('click', hideModal);
  overlay.addEventListener('click', hideModal);

  return {
    showModal,
    hideModal
  };
}