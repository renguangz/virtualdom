import render from "./render";

const zip = (xs, ys) => {
  const zipped = [];
  for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
};

const diffAttr = (oldAttrs, newAttrs) => {
  const patches = [];

  // set new attributes
  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node) => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  // remove old attributes
  for (const k of Object.keys(oldAttrs)) {
    if (!(k in newAttrs)) {
      patches.push(($node) => {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }

  return ($node) => {
    for (const patch of patches) {
      patch($node);
    }
  };
};

const diffChildren = (oldVirtualChildren, newVirtualChildren) => {
  const childPatches = [];
  for (const [oldVirtualChild, newVirtualChild] of zip(
    oldVirtualChildren,
    newVirtualChildren,
  )) {
    childPatches.push(diff(oldVirtualChild, newVirtualChild));
  }

  const additionalPatches = [];
  for (const additionalVirtualChild of newVirtualChildren.slice(
    oldVirtualChildren.length,
  )) {
    additionalPatches.push(($node) => {
      $node.appendChild(render(additionalVirtualChild));
      return $node;
    });
  }

  return ($parent) => {
    for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
      patch(child);
    }

    for (const patch of additionalPatches) {
      patch($parent);
    }
    return $parent;
  };
};

const diff = (virtualOldNode, virtualNewNode) => {
  if (virtualNewNode === undefined) {
    return ($node) => {
      $node.remove();
      return undefined;
    };
  }

  if (
    typeof virtualOldNode === "string" ||
    typeof virtualNewNode === "string"
  ) {
    if (virtualOldNode !== virtualNewNode) {
      return ($node) => {
        const $newNode = render(virtualNewNode);
        $node.replaceWith($newNode);
        return $newNode;
      };
    }
  }

  if (virtualOldNode.tagName !== virtualNewNode.tagName) {
    return ($node) => {
      const $newNode = render(virtualNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const patchAttrs = diffAttr(virtualOldNode.attrs, virtualNewNode.attrs);
  const patchChildren = diffChildren(
    virtualOldNode.children,
    virtualNewNode.children,
  );

  return ($node) => {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };
};

export default diff;
