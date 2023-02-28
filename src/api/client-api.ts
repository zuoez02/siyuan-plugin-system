import { ISettingTab } from "../types";

function insertBefore(positionEl: Element, el: Element) {
    return positionEl.insertAdjacentElement('beforebegin', el)
}

function insertAfter(positionEl: Element, el: Element) {
    return positionEl.insertAdjacentElement('afterend', el)
}

export function addToolbarLeft(el: Element) {
    const title = document.getElementById('toolbar')?.getElementsByClassName('fn__ellipsis');
    if (!title) {
        return;
    }
    insertBefore(title[0], el);
}

export function addToolbarRight(el: Element) {
    const title = document.getElementById('toolbar')?.getElementsByClassName('fn__ellipsis');
    if (!title) {
        return;
    }
    insertAfter(title[0], el);
}


export function addSettingTab(settingTab: ISettingTab) {
    
}