import {enableToolbar, removeCurrentToolbar, setCurrentToolbar} from "../toolbar/setToolbar";
import {hasClosestByAttribute, hasClosestByMatchTag, hasClosestByTag} from "../util/hasClosest";
import {getEditorRange, selectIsEditor} from "../util/selection";

export const highlightToolbar = (vditor: IVditor) => {
    clearTimeout(vditor.ir.hlToolbarTimeoutId);
    vditor.ir.hlToolbarTimeoutId = window.setTimeout(() => {
        if (vditor.ir.element.getAttribute("contenteditable") === "false") {
            return;
        }
        if (!selectIsEditor(vditor.ir.element)) {
            return;
        }

        const allToolbar = ["headings", "bold", "italic", "strike", "line", "quote",
            "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"];
        removeCurrentToolbar(vditor.toolbar.elements, allToolbar);
        enableToolbar(vditor.toolbar.elements, allToolbar);

        const range = getEditorRange(vditor.ir.element);
        let typeElement = range.startContainer as HTMLElement
        if (range.startContainer.nodeType === 3) {
            typeElement = range.startContainer.parentElement;
        }
        if (typeElement.classList.contains("vditor-reset")) {
            typeElement = typeElement.childNodes[range.startOffset] as HTMLElement
        }

        const headingElement = hasClosestByTag(typeElement, "H")
        if (headingElement && headingElement.tagName.length === 2) {
            setCurrentToolbar(vditor.toolbar.elements, ["headings"]);
        }

        const quoteElement = hasClosestByMatchTag(typeElement, "BLOCKQUOTE")
        if (quoteElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["quote"]);
        }
        const aElement = hasClosestByAttribute(typeElement, "data-type", "a")
        if (aElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["link"]);
        }
        const emElement = hasClosestByAttribute(typeElement, "data-type", "em")
        if (emElement) {
            setCurrentToolbar(vditor.toolbar.elements, ["italic"]);
        }

    }, 200);
};