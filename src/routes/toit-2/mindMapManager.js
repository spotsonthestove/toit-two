import * as THREE from 'three';
import { createNode } from './node.js';
import { createConnection } from './connection.js';

export class MindMapManager {
  constructor(scene) {
    this.scene = scene;
    this.nodes = new Map();
    this.connections = new Set();
    this.nextId = 1;

    this.createInitialNode();
  }

  createInitialNode() {
    const centerNode = this.createNode({
      title: 'Central Concept',
      position: new THREE.Vector3(0, 0, 0),
      type: 'concept'
    });
  }

  createNode({ title, position, type = 'note', parentId = null }) {
    const id = this.nextId++;
    const node = createNode({ id, title, position, type });
    
    this.nodes.set(id, node);
    this.scene.add(node.group);

    if (parentId !== null) {
      const parentNode = this.nodes.get(parentId);
      if (parentNode) {
        const connection = createConnection(parentNode, node);
        this.connections.add(connection);
        this.scene.add(connection.line);
        
        // Store parent-child relationship
        node.parentId = parentId;
        node.connection = connection;
      }
    }

    return node;
  }

  deleteNode(id) {
    const node = this.nodes.get(id);
    if (!node) return;

    // Remove connections
    this.connections.forEach(connection => {
      if (connection.startNode === node || connection.endNode === node) {
        this.scene.remove(connection.line);
        this.connections.delete(connection);
      }
    });

    // Remove node
    this.scene.remove(node.group);
    this.nodes.delete(id);

    // Update drag controls if needed
    if (this.onNodesChanged) {
      this.onNodesChanged();
    }
  }

  updateNode(id, data) {
    const node = this.nodes.get(id);
    if (node) {
      if (data.title) {
        node.updateLabel(data.title);
        node.group.children[1].userData.title = data.title;
      }
      if (data.description) {
        node.group.userData.description = data.description;
      }
    }
  }

  updateNodePosition(id, position) {
    const node = this.nodes.get(id);
    if (node) {
      node.group.position.copy(position);
      this.updateConnections();
    }
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  getDraggableObjects() {
    return [...this.nodes.values()].map(node => node.group);
  }

  updateConnections() {
    this.connections.forEach(connection => {
      connection.update();
    });
  }

  getNodeRelationships(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) return { parent: null, children: [] };

    const parent = node.parentId ? this.nodes.get(node.parentId) : null;
    const children = [...this.nodes.values()].filter(n => n.parentId === nodeId);

    return {
      parent,
      children
    };
  }

  setOnNodesChanged(callback) {
    this.onNodesChanged = callback;
  }
}