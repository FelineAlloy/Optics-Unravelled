// Code adapted from https://github.com/ricktu288/ray-optics

class ObjBar {
	constructor(elem) {
		/* elem - The html element the inputs will be populated to */
		this.elem = elem;
	}

	/*
	 * Each member function of this class will take a parameter func - function for when a value changes.
	 * parameters of func:
	 * obj - The scene object whose value changed.
	 * value - The new value.
	 */

	createNumber(label, min, max, step, value, func, hideSlider) {
		var nobr = document.createElement("span");
		nobr.className = "obj-bar-nobr";

		var p_name = document.createElement("span");
		p_name.innerHTML = label + "&nbsp;";
		nobr.appendChild(p_name);

		var objOption_text = document.createElement("input");
		objOption_text.type = "text";
		if (value == Infinity) {
			objOption_text.value = "inf";
		} else if (value == -Infinity) {
			objOption_text.value = "-inf";
		} else {
			// Round to 6 decimal places
			objOption_text.value = Math.round(value * 1000000) / 1000000;
		}
		objOption_text.className = "obj-bar-editable obj-bar-number";
		nobr.appendChild(objOption_text);

		var objOption_range = document.createElement("input");
		objOption_range.type = "range";
		objOption_range.min = min;
		objOption_range.max = max;
		objOption_range.step = step;
		objOption_range.value = value;
		objOption_range.className = "form-range";
		if (hideSlider) {
			objOption_range.style.display = "none";
		}
		nobr.appendChild(objOption_range);

		this.elem.appendChild(nobr);

		var space = document.createTextNode(" ");
		this.elem.appendChild(space);

		const setOption = this.setOption;

		objOption_range.oninput = function () {
			objOption_text.value = objOption_range.value;
			setOption(function (obj) {
				func(obj, objOption_range.value * 1);
			});
		};

		objOption_range.onmouseup = function () {
			this.blur();
		};

		objOption_range.ontouchend = function () {
			this.blur();
			setOption(function (obj) {
				func(obj, objOption_range.value * 1);
			});
		};
		objOption_text.onchange = function () {
			if (objOption_text.value.toLowerCase().startsWith("inf")) {
				var value = Infinity;
			} else if (objOption_text.value.toLowerCase().startsWith("-inf")) {
				var value = -Infinity;
			} else {
				var value = objOption_text.value * 1;
			}
			objOption_range.value = value;
			setOption(function (obj) {
				func(obj, value);
			});
		};
		objOption_text.onkeydown = function (e) {
			e.cancelBubble = true;
			if (e.stopPropagation) e.stopPropagation();
		};
		objOption_text.onclick = function (e) {
			this.select();
		};
	}

	createBoolean(label, value, func) {
		var nobr = document.createElement("span");
		nobr.className = "obj-bar-nobr";

		var p_name = document.createElement("span");
		p_name.innerHTML = label + "&nbsp;";
		nobr.appendChild(p_name);

		var wrapper = document.createElement("span");
		wrapper.className = "form-switch";

		var objOption_checkbox = document.createElement("input");
		objOption_checkbox.className = "form-check-input";
		objOption_checkbox.type = "checkbox";
		objOption_checkbox.checked = value;

		wrapper.appendChild(objOption_checkbox);
		nobr.appendChild(wrapper);
		this.elem.appendChild(nobr);
		var space = document.createTextNode(" ");
		this.elem.appendChild(space);

		const setOption = this.setOption;

		objOption_checkbox.onchange = function () {
			this.blur();
			setOption(function (obj) {
				func(obj, objOption_checkbox.checked);
			});
		};
	}

	/*
	 * Do the callback function that set the option.
	 * Whether it is for all objects or just the selected one depends on the "Apply to all" checkbox.
	 * func - The function to call.
	 */
	setOption(func) {
		if (!document.getElementById("apply_to_all").checked) {
			func(selected.obj);
		} else {
			for (let i = 0; i < objects.length; i++) {
				if (objects[i].type == selected.obj.type) {
					func(objects[i]);
				}
			}
			for (let i = 0; i < rays.length; i++) {
				if (rays[i].type == selected.obj.type) {
					func(rays[i]);
				}
			}
		}
		updateSimulation();
	}
}
