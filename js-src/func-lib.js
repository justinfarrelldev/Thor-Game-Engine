//This is the function library for Thor. 
//It is used for common functions and to make syntax simple. 
let AddElem = (type, innerHTML) => {
    let el = document.createElement(type);
    el.innerHTML = innerHTML;
    document.body.appendChild(el);
};
//# sourceMappingURL=func-lib.js.map