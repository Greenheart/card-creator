import { useState, useEffect } from 'react';
import { Identity } from './Types';

export type CrudContext<T> = {
    items: T[];
    update: (item: Identity & Partial<T>) => void;
    add: (item: T) => void;
    remove: (item: Identity) => void;
}

export function createtInitialCrudContext<T>(items: T[]) {
    return {
        items: items,
        update: () => {},
        add: () => {},
        remove: () => {},
    };
}

export function createItemCrud<T extends Identity> (items: T[], listener?: () => void): CrudContext<T> & {listener?: () => void} {
    return {
        items: items,
        update: function (item) {
            const currentItem = this.items.find(i => i.id === item.id);
            Object.assign(currentItem, item);
            if (this.listener) this.listener();
        },
        add: function (item) {
            this.items.push(item);
            if (this.listener) this.listener();
        },
        remove: function (item) {
            this.items = this.items.filter(i => i.id !== item.id);
            if (this.listener) this.listener();
        },
        listener: listener
    }
}

export function useItemCrud<T extends Identity>(initialItems: T[]): CrudContext<T> & {listener?: () => void} {
    const [items, setItems] = useState(
        createItemCrud<T>(initialItems)
    );
    useEffect(() => {
        if (!items.listener) {
            items.listener = () => {
                setItems(Object.assign({}, items));
            }
            setItems(Object.assign({}, items));
        }
    }, [items.listener]);
    return items;
}

export function useManager<M>(initialManager: M & {listener?: (manager: M) => void}): M & {listener?: (manager: M) => void} {
    const [manager, setManager] = useState(
        initialManager
    );
    useEffect(() => {
        if (!manager.listener) {
            manager.listener = (manager) => {
                setManager(Object.assign({}, manager));
            }
            setManager(Object.assign({}, manager));
        }
    }, [manager.listener]);
    return manager;
}