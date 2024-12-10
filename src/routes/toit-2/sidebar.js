export function setupSidebar(mindMapManager) {
  const form = document.getElementById('nodeForm');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const deleteBtn = document.getElementById('deleteBtn');
  const relationshipsContainer = document.getElementById('nodeRelationships');
  
  let currentNodeId = null;

  function showSidebar(node) {
    currentNodeId = node.id;
    titleInput.value = node.group.children[1].userData.title || '';
    descriptionInput.value = node.group.userData.description || '';
    deleteBtn.style.display = node.type === 'concept' ? 'none' : 'block';
    updateRelationshipsView(node.id);
  }

  function updateRelationshipsView(nodeId) {
    const { parent, children } = mindMapManager.getNodeRelationships(nodeId);
    
    let html = '<ul class="node-list">';
    
    if (parent) {
      html += `<li class="parent">Parent: ${parent.group.children[1].userData.title}</li>`;
    }
    
    if (children.length > 0) {
      html += '<li>Children:</li>';
      children.forEach(child => {
        html += `<li class="child">${child.group.children[1].userData.title}</li>`;
      });
    }
    
    html += '</ul>';
    relationshipsContainer.innerHTML = html;
  }

  function hideSidebar() {
    currentNodeId = null;
    form.reset();
    relationshipsContainer.innerHTML = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentNodeId) {
      mindMapManager.updateNode(currentNodeId, {
        title: titleInput.value,
        description: descriptionInput.value
      });
      updateRelationshipsView(currentNodeId);
    }
  });

  deleteBtn.addEventListener('click', () => {
    if (currentNodeId) {
      mindMapManager.deleteNode(currentNodeId);
      hideSidebar();
    }
  });

  return { showSidebar, hideSidebar };
}