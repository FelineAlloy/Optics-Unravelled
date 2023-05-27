class entry {
    constructor(id, elem) {
        this.id = id;
        this.elem = elem;
    }

    getLocaleName() {
        return getMsg(this.id);
    }

    getURL(page) {
        var url = "/lesson?page=";
        if(page.length)
            url += page;
        else
            url += this.id;
        
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
            new entry("fermatPrinciple", ["refractionLaws", "reflexionLaws", "opticalPrism"]),
            new entry("sphericalDiopter", ["objectFocus", "imageFocus", "transverseGrowth", "planeDiopter"]),
            //new entry("lenses", []),
            //new entry("instruments", ["magnifyingGlass", "microscope", "telescope"])
        ]),
        new tab("Exercices", false, [

        ])
    ];
}

var navViewModel = new navViewModel();
ko.applyBindings(navViewModel);