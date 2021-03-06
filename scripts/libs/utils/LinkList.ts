export type LinkListNode<T> = { key: number; data: T; next: LinkListNode<T> };
export class LinkList<T> {
  private pool: LinkListNode<T>[];
  private _head: LinkListNode<T>;
  private _tail: LinkListNode<T>;
  constructor() {
    this._head = this._tail = null;
    this.pool = [];
  }
  private spawn_node(key: number, data: T): LinkListNode<T> {
    let node: LinkListNode<T> = this.pool.pop();
    if (node) {
      node.key = key;
      node.data = data;
      node.next = null;
    } else {
      node = { key: key, data: data, next: null };
    }
    return node;
  }
  get head(): LinkListNode<T> {
    return this._head;
  }
  get tail(): LinkListNode<T> {
    return this._tail;
  }
  append(key: number, data: T): number {
    let node: LinkListNode<T> = this.spawn_node(key, data);
    if (this._tail) {
      this._tail.next = node;
      this._tail = node;
    } else {
      this._head = this._tail = node;
    }
    return node.key;
  }
  remove(key: number): LinkListNode<T> {
    if (!key) {
      return null;
    }
    if (!this._head) {
      return null;
    }
    let prev: LinkListNode<T>;
    let curr: LinkListNode<T> = this._head;
    while (curr && curr.key != key) {
      prev = curr;
      curr = curr.next;
    }
    if (!curr) {
      return null;
    }
    if (!prev) {
      this._head = curr.next;
      if (!curr.next) {
        this._tail = null;
      }
    } else {
      prev.next = curr.next;
      if (!curr.next) {
        this._tail = prev;
      }
    }
    this.pool.push(curr);
    return curr;
  }
}
