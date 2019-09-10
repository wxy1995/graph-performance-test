let data = {
  nodes: [],
  edges: [],
  groups: []
};

const NODES_COUNT = 1339;
const EDGES_COUNT = 1000; // 8706;
const GROUPS_COUNT = 600;

for (let i = 1; i <= NODES_COUNT; i++) {
  data.nodes.push({
    id: `n-${i}`,
  });
}

for (let i = 1; i <= GROUPS_COUNT; i++) {
  data.groups.push({
    id: `g-${i}`,
  });
}

for (let i = 0; i < GROUPS_COUNT; i++) {
  data.nodes[i * 2].parent = data.groups[i].id;
  data.nodes[i * 2 + 1].parent = data.groups[i].id;
}

for (let i = 1; i <= EDGES_COUNT; i++) {
  data.edges.push({
    source: data.nodes[Math.floor(Math.random() * NODES_COUNT)].id,
    target: data.nodes[Math.floor(Math.random() * NODES_COUNT)].id,
  });
}
