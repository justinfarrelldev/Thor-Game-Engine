//Holds important classes for the engine, such as the GameFiles and File types
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
//# sourceMappingURL=engine-types.js.map