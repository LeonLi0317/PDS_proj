(function ($) {
    $.fn.TextBox = function (object) {
        this.each(function () {
            let $element = $(this);
            let textbox = new TextBox();
            textbox.BuildTexBox($element, object);
        });
        return this;
    };
    $.fn.NumericTextBox = function (object) {
        this.each(function () {
            let $element = $(this);
            let numericTextBox = new NumericTextBox();
            numericTextBox.BuildNumericTextBox($element, object);
        });
        return this;
    };
    $.fn.DropDownList = function (object) {
        this.each(function () {
            let $element = $(this);
            let dropDownList = new DropDownList();
            dropDownList.BuildDropDownList($element, object);
        });
        return this;
    }
    $.fn.CheckBox = function (object) {
        this.each(function () {
            let $element = $(this);
            let checkbox = new CheckBox();
            checkbox.BuildCheckBox($element, object);
        });
        return this;
    }
    $.fn.DatePicker = function (object) {
        this.each(function () {
            let $element = $(this);
            let datepicker = new DatePicker();
            datepicker.BuildDatePicker($element, object);
        });
        return this;
    }
    $.fn.TimePicker = function (object) {
        this.each(function () {
            let $element = $(this);
            let timepicker = new TimePicker();
            timepicker.BuildTimePicker($element, object);
        });
        return this;
    }
    $.fn.DateTimePicker = function (object) {
        this.each(function () {
            let $element = $(this);
            let type = object.type;

            switch (type) {
                case 'timepicker':
                    let timepicker = new TimePicker();
                    timepicker.BuildTimePicker($element, object);
                    break;
                case 'datetimepicker':
                    let datetimepicker = new DateTimePicker();
                    datetimepicker.BuildDateTimePicker($element, object);
                    break;
                default:
                    let datepicker = new DatePicker();
                    datepicker.BuildDatePicker($element, object);
            }
        });
        return this;
    };

    $.fn.TextArea = function (object) {
        this.each(function () {
            let $element = $(this);
            let textarea = new TextArea();
            textarea.BuildTextArea($element, object);
        });
        return this;
    }
    //$.fn.TreeView = function (object) {
    //    this.each(function () {
    //        let $element = $(this);
    //        let treeview = new TreeView();
    //        treeview.BuildTreeView($element, object);
    //    });
    //    return this;
    //}

})(jQuery);

class BaseObject {
    constructor() {

    }

    Value;
    Placeholder;
    Enable;
    BindProperty(object) {
        this.Value = object.value;
        this.Placeholder = object.placeholder;
        this.Enable = true;
    }
}