export function toTreeOptimized(list) {
  const map = new Map();
  const roots: any = [];

  // 第一次遍历：建立 id -> 节点的映射
  for (const item of list) {
    map.set(item.id, { ...item, children: [] });
  }

  // 第二次遍历：构建树
  for (const item of list) {
    const node: any = map.get(item.id);
    if (item.father === 0) {
      roots.push(node);
    } else {
      const parent = map.get(item.father);
      parent.children.push(node);
    }
  }

  return roots;
}
