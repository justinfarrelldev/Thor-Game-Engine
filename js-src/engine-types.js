//Holds important classes for the engine, such as the GameFiles and File types
//NOT included in game builds
class GameFiles {
    constructor() {
        this.files = [];
    }
    //Pushes a file to the Game Files array
    AddFile(file) {
        this.files.push(file);
    }
    //Takes a file out of the Game Files array
    RemoveFile(file) {
        for (let i = 0; i < this.files.length; i++) {
            if (file === this.files[i]) {
                this.files.splice(i);
                break;
            }
        }
    }
}
class GameFile {
    constructor(fileName, relFilePath) {
        this.fileName = fileName;
        this.relFilePath = relFilePath;
        this.contents;
        this.type = "";
    }
}
//Verbose to avoid redefinition
class HTMLFileElement {
    constructor(elementName, attribs, contents) {
        this.innerHTML = contents;
        this.elementName = elementName;
        this.attributes = attribs;
        this.contents = "<" + elementName + " " + attribs + ">" + this.innerHTML + "</"
            + elementName + ">";
    }
    ChangeInnerHTML(innerHTML) {
        this.innerHTML = innerHTML;
        this.contents = "<" + this.elementName + " " + this.attributes + ">" + this.innerHTML + "</"
            + this.elementName + ">";
    }
    ToString() {
        return this.contents;
    }
}
class HTMLFile extends GameFile {
    /**
     *Creates a HTML file. Add attributes as one continuous string
     */
    constructor(fileName, relFilePath) {
        super(fileName, relFilePath);
    }
    MakeElement(element, attribs, contents) {
        return new HTMLFileElement(element, attribs, contents);
    }
    //Nests an element within an element
    NestElement(parentElement, childElement) {
        parentElement.ChangeInnerHTML(childElement.ToString());
        return parentElement;
    }
    AddElement(element, attribs, contents) {
        this.contents += "<" + element + " " + attribs + ">" + contents + "</"
            + element + ">";
    }
    ToGameFile() {
        let file = new GameFile(this.fileName, this.relFilePath);
        file.contents = this.contents;
        return file;
    }
}
class UserScript {
    constructor(name) {
        if (name != null) {
            this.name = name;
        }
        else {
            this.name = "UserScript" + UserScripts.length.toString();
        }
        this.executionOrder = UserScripts.length;
        this.index = UserScripts.length;
        this.text = CodeMirrorDefaultCode;
        $(document).ready(() => {
            let mid = Math.round($('#Window2Dropdown li').length);
            $('#Window2Dropdown li:nth-child(' + mid + ')').after('<li class = "DropdownItem2" onclick = "ChangeUserScript(' + this.index + ')">' + this.name + '</li>');
        });
        UserScripts.push(this);
    }
}
class ImageFileIcon {
    constructor(name) {
        this.name = name;
        var ext = name.split('.').pop();
        let el = document.createElement('div');
        el.style.height = '33%';
        el.style.margin = '2%';
        el.style.marginBottom = '5%';
        el.style.display = 'inline-block';
        var behavior = this.DetermineBehavior(ext);
        if (behavior == 'img') {
            let img = document.createElement('img');
            img.src = '/upload/resources/' + name;
            img.style.width = 'auto';
            img.style.height = '100%';
            img.style.margin = '1%';
            img.style.marginBottom = '0%';
            img.style.marginRight = '2%';
            img.style.textAlign = 'center';
            img.alt = name;
            img.title = name;
            el.appendChild(img);
        }
        else if (behavior == 'text') {
            let head = document.createElement('h1');
            head.style.margin = '0px';
            head.style.padding = '0px';
            head.innerHTML = '📄';
            el.appendChild(head);
        }
        let text = document.createElement('p');
        text.style.width = '8%';
        text.style.height = '5%';
        text.style.marginTop = '0%';
        text.style.fontFamily = 'monospace, sans-serif';
        text.style.fontSize = '14px';
        text.style.whiteSpace = 'initial';
        text.style.position = 'absolute';
        text.style.wordBreak = 'break-all';
        text.innerHTML = name;
        el.appendChild(text);
        document.getElementById('File_Explorer').appendChild(el);
    }
    DetermineBehavior(extension) {
        extension = extension.toLowerCase();
        switch (extension) {
            case 'png':
                return 'img';
            case 'txt':
                return 'text';
            case 'jpg':
                return 'img';
            case 'tif':
                return 'img';
            case 'tiff':
                return 'img';
            case 'gif':
                return 'img';
            default:
                console.log('Returning with text from default');
                return 'text';
        }
    }
}
class EngineWindow {
    constructor(title, preset, sectionMembers1) {
        this.title = title;
        this.preset = preset;
        this.sectionMembers1 = sectionMembers1;
        let head = document.createElement('h1');
        head.innerHTML = title;
        head.style.fontFamily = 'monospace, sans-serif';
        let el = document.createElement('div');
        this.div = el;
        this.div.style.backgroundColor = 'white';
        this.div.style.border = '1px solid gray';
        this.div.style.position = 'absolute';
        this.div.style.bottom = '25%';
        this.div.style.width = '45%';
        this.div.style.left = '25%';
        this.div.style.zIndex = '11';
        this.div.style.height = '50%';
        this.div.appendChild(head);
        document.body.appendChild(this.div);
        this.CreatePreset(preset);
    }
    CreatePreset(preset) {
        switch (preset) {
            case 0:
                let element = document.createElement('div');
                element.style.width = '50%';
                element.style.border = '1px solid black';
                element.style.height = '72%';
                element.style.marginBottom = '3%';
                element.style.marginLeft = '3%';
                for (let i = 0; i < this.sectionMembers1.length; i++) {
                    let but = document.createElement('button');
                    element.appendChild(but);
                    but.style.width = '100%';
                    but.innerHTML = this.sectionMembers1[i];
                }
                this.div.appendChild(element);
                break;
        }
    }
}
//# sourceMappingURL=engine-types.js.map