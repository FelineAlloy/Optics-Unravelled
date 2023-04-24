var sectionTypes = {
    text: 1,
    example: 2,
    textHide: 3,
    exampleHide: 4,
    image: 5,
    other: 6
}

class section {
    constructor(type, id) {
        this.type = type; // determines section type
        this.id = id; // determines content
    }

    // Text section functions
    getTitle() {
        return getMsg(this.id + "_title");
    }

    getContent() {
        return getMsg(this.id + "_content");
    }
}

function loadJSON(page) {
    var client = new XMLHttpRequest();
    client.open('GET', '../lessons/' + page);
    client.send();

    client.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var jsonData = eval(this.responseText);
            for(var i = 0; i < jsonData.length; i++){
                var object = jsonData[i];
                lessonViewModel.sections.push(new section(object.type, object.id));
            }

            ko.applyBindings(lessonViewModel);
        }
    }
}

function lessonViewModel () {
    const urlParams = new URLSearchParams(window.location.search);
    this.page = urlParams.get('page');
    this.sections = [];
}

var lessonViewModel = new lessonViewModel();
loadJSON(lessonViewModel.page + '.json');