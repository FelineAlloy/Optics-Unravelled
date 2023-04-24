class entry {
    constructor(id, elem) {
        this.id = id;
        this.elem = elem;
    }

    getLocaleName() {
        return getMsg(this.id);
    }

    getURL(page) {
        var url = "/lesson.html?page=" + this.id;
        if(page.length)
        {
            url += "#" + getMsg(page);
        }
        
        return url;
    }
};

class tab {
    constructor(name, selected, content) {
        this.name = name;
        this.content = content;
        this.selected = ko.observable(selected);
    }

    getLocaleName() {
        return getMsg(this.name);
    }
};

function navViewModel () {
    this.tabs = [
        new tab("Lessons", true, [
            new entry("introduction", ["natureOfLight", "fermatPrinciple"]),
            new entry("sphericalDioptr", ["conjgatePoints", "objectFocus"])
        ]),
        new tab("Exercices", false, [

        ])
    ];
}

var navViewModel = new navViewModel();
ko.applyBindings(navViewModel);