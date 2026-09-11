//Start - Kendo Window //
var eregModal = {
    open: function (windowId) {
        var center = $("#" + windowId).data("windowCenter");

        var dialog = $("#" + windowId).data("kendoWindow");

        if (center === undefined || center) {
            dialog.center();
        }

        dialog.open();
    },

    content: function (windowId, content) {
        var dialog = $("#" + windowId).data("kendoWindow");
        if (content !== undefined) {
            dialog.content(content);
        } else {
            dialog.content();
        }
    },

    close: function (windowId) {
        var dialog = $("#" + windowId).data("kendoWindow");
        dialog.close();
    },

    destroy: function (windowId) {
        var dialog = $("#" + windowId).data("kendoWindow");
        dialog.destroy();
    },

    maximize: function (windowId) {
        var dialog = $("#" + windowId).data("kendoWindow");
        dialog.maximize();
    },

    minimize: function (windowId) {
        var dialog = $("#" + windowId).data("kendoWindow");
        dialog.minimize();
    },

    pin: function (windowId) {
        var dialog = $("#" + windowId).data("kendoWindow");
        dialog.minimize();
    },

    unpin: function (windowId) {
        var dialog = $("#" + windowId).data("kendoWindow");
        dialog.unpin();
    },

    refresh: function (windowId, options) {
        var dialog = $("#" + windowId).data("kendoWindow");
        if (options !== undefined) {
            dialog.refresh(options);
        } else {
            dialog.refresh();
        }
    },

    restore: function (windowId) {
        var dialog = $("#" + windowId).data("kendoWindow");
        dialog.restore();
    },

    setOptions: function (windowId, options) {
        var dialog = $("#" + windowId).data("kendoWindow");
        dialog.setOptions(options);
    },

    title: function (windowId, title) {
        var dialog = $("#" + windowId).data("kendoWindow");
        if (title !== undefined) {
            dialog.title(title);
        } else {
            return dialog.title();
        }
    },

    toggleMaximization: function (windowId) {
        var dialog = $("#" + windowId).data("kendoWindow");
        dialog.toggleMaximization();
    }
}
//End - Kendo Window //


$(document).ready(function () {
    initComboBoxes();
    initERegSelects();
    blockerOnSubmit();
});

// spinner/blocker script     
function blockerOnSubmit() {
    $(document.body).on("click", ".showBlocker", function () {
        openBlocker();
    });
}

var loading = null;

jQuery.ajaxSetup({
    beforeSend: function () {
        clearTimeout(loading);
        if (!loading) loading = setTimeout("openBlocker();", blockerDelay);
    },
    complete: function () {
        clearTimeout(loading);
        loading = null;
    }
});

$(document).ajaxStop(function () {
    closeBlocker();
});

function openBlocker() {
    $("#blocker").show();
}

function closeBlocker() {
    $("#blocker").hide();
}

//Start - Session Warning//
//Load jQuery First
//How frequently to check for session expiration in milliseconds
var sess_pollInterval = 6000;
//How many minutes the session is valid for
var sess_expirationMinutes;
//How many minutes before the warning prompt
var sess_warningMinutes;

var sess_intervalID;
var sess_lastActivity;
var confirmFalg = true;


function submitRequest() {

    var sessionurl = CONTEXT_PATH + "/extendservertime";
    $.ajax({
        url: sessionurl,
        type: 'post',
        dataType: 'json',
        success: function (data) {
        },
        error: function (xhr, ajaxOptions, thrownError) {
            sessTimeOutLogOut();
        }
    });

}


function initSessionMonitor(sessExpirationMinutes, sessWarningMinutes) {

    if (sessExpirationMinutes == null || sessExpirationMinutes == "" || sessExpirationMinutes == 0) {
        return;
    }
    else {
        sess_expirationMinutes = sessExpirationMinutes;
    }
    if (sessWarningMinutes == null || sessWarningMinutes == "" || sessWarningMinutes == 0) {
        return;
    }
    else {
        sess_warningMinutes = sessWarningMinutes;
    }

    sess_lastActivity = new Date();
    sessSetInterval();
    $(document).bind('submit.session', function (ed, e) {
        sessSubmit(ed, e);
    });
}

function sessSetInterval() {
    confirmFalg = true;
    sess_intervalID = setInterval('sessInterval()', sess_pollInterval);
}

function sessClearInterval() {
    confirmFalg = false;
    clearInterval(sess_intervalID);
}

function sessSubmit(ed, e) {
    sessSetInterval();
    sess_lastActivity = new Date();
}

function sessPingServer() {
    submitRequest();
}

function sessLogOut() {
    window.location.href = CONTEXT_PATH + "/public/logout";
}


function sessTimeOutLogOut() {
    window.location.href = CONTEXT_PATH + SESSION_TIME_OUT_URL;
}

function sessInterval() {

    var now = new Date();
    var diff = now - sess_lastActivity;
    var diffMins = (diff / 1000 / 60);

    if (confirmFalg && diffMins >= sess_warningMinutes && sess_warningMinutes < sess_expirationMinutes) {
        //warn before expiring
        //stop the timer
        var diffSesstimeout = sess_expirationMinutes - sess_warningMinutes;
        sessClearInterval();
        $("#timeoutwarningdialog").empty();

        $("#timeoutwarningdialog").append('Your session will expire in ' + diffSesstimeout);
        $("#timeoutwarningdialog").append(' minutes as of ' + now.toLocaleString());
        $("#timeoutwarningdialog").append(', press OK to remain logged in or press SIGN OUT to log off.');
        $("#timeoutwarningdialog").append(' If you log off, any changes will be lost.');
        var logoutTimer;
        $(function () {
            $("#timeoutwarningdialog").dialog({
                resizable: false,
                height: 300,
                closeOnEscape: false,
                width: 450,
                modal: true,
                open: function (event, ui) {
                    logoutTimer = setTimeout("$('#timeoutwarningdialog').dialog('close');sessTimeOutLogOut();", (diffSesstimeout * 60000));
                },
                buttons: {
                    "OK": {
                        text: 'OK',
                        class: 'btn btn-eReg',
                        click: function () {
                            clearTimeout(logoutTimer);
                            now = new Date();
                            diff = now - sess_lastActivity;
                            diffMins = (diff / 1000 / 60);
                            if (diffMins > sess_expirationMinutes) {
                                //timed out
                                sessTimeOutLogOut();
                            }
                            else {
                                //reset inactivity timer
                                sessPingServer();
                                sessSetInterval();
                                sess_lastActivity = new Date();
                            }
                            $(this).dialog("close");
                        }
                    },
                    "SIGN OUT": {
                        text: 'SIGN OUT',
                        class: 'btn btn-eReg',
                        click: function () {
                            clearTimeout(logoutTimer);
                            sessLogOut();
                            $(this).dialog("close");
                        }
                    }
                }
            }).parent().find('.ui-dialog-titlebar-close').hide();
        });
    }
    else if (diffMins > sess_expirationMinutes) {
        sessTimeOutLogOut();
    }
}

//End - Session Warning//

// EReg ComboBox and Select/DropDownList
function initWidget(target, options, widgetType) {
    var widgetOptions = {
        minLength: 0, autoBind: true, placeholder: "Please input",
        dataSource: getWidgetDataSource(options.category, options.params),
        dataTextField: "value", dataValueField: "code", filter: "contains",
        filtering: getFilter
    };

    if (options.placeholder) widgetOptions.placeholder = options.placeholder;

    var widget;
    if (options.childtype) {
        widget = options.childtype == 'select' ? 'kendoDropDownList' : 'kendoComboBox';
    } else {
        widget = widgetType == 'select' ? 'kendoDropDownList' : 'kendoComboBox';
    }

    if (options.category == "countries" && options.child && (options.child).indexOf('state') != -1) {

        if (options.defaultValue) {
            widgetOptions.dataBound = function (e) {
                if (!this.value()) this.value(options.defaultValue);
                refreshChildDataSource(options.child, this.value(), widget);
            }
        }

        widgetOptions.change = function (e) {
            var data = this.dataSource.data();
            var hasStates;
            var statesRequired;
            var postalCodeRequired;

            for (var d in data) {
                if (data[d].code == this.value()) {
                    hasStates = data[d].hasStates;
                    statesRequired = data[d].statesRequired;
                    postalCodeRequired = data[d].postalCodeRequired;
                    break;
                }
            }

            if (!hasStates || hasStates == "Y") {
                e.preventDefault();
                $("#" + options.child).data(widget).value(null);
                $("#" + options.child + "txt").hide();
                $("#" + options.child + "txt").val(null);
                $("#" + options.child).closest('.k-widget').show();
                refreshChildDataSource(options.child, this.value(), widget);
                if (!this.value()) $("#" + options.child).data(widget).value(null);

                $("#" + options.child + "txt").trigger("change", {value: ""});

                if (hasStates && statesRequired == "Y") {
                    $('.' + options.child + 'Label').addClass('required');

                } else {
                    $('.' + options.child + 'Label').removeClass('required');
                }
            } else {
                $("#" + options.child).data(widget).value(null);
                $("#" + options.child).closest('.k-widget').hide();
                $("#" + options.child + "txt").val(null);

                $("#" + options.child).data(widget).trigger("change", {value: ""});
                $("#" + options.child + "txt").trigger("change", {value: ""});

                $("#" + options.child + "txt").show();

                if (statesRequired == "Y") {
                    $('.' + options.child + 'Label').addClass('required');
                }
                else {
                    $('.' + options.child + 'Label').removeClass('required');
                }
            }
            if (!postalCodeRequired || postalCodeRequired == "Y") {
                $('.' + options.child + 'PostalCodeLabel').addClass('required');
            } else {
                $('.' + options.child + 'PostalCodeLabel').removeClass('required');
            }
        }

        var wdgtObj;
        if (widgetType == 'select') {
            wdgtObj = initDropDownList(target, widgetOptions);
        } else {
            wdgtObj = initComboBox(target, widgetOptions);
        }

        wdgtObj.dataSource.fetch(function () {
            if (options.defaultValue) {
                var dsData = this.data();
                var hasStates;
                var statesRequired;
                var postalCodeRequired;
                for (var d in dsData) {
                    if (dsData[d].code == options.defaultValue) {
                        hasStates = dsData[d].hasStates;
                        statesRequired = dsData[d].statesRequired;
                        postalCodeRequired = dsData[d].postalCodeRequired;
                        break;
                    }
                }

                if (hasStates == "Y") {
                    $("#" + options.child + "txt").hide();
                    $("#" + options.child).closest('.k-widget').show();
                    refreshChildDataSource(options.child, options.defaultValue, widget);
                    if (statesRequired == "Y") {
                        $('.' + options.child + 'Label').addClass('required');
                    } else {
                        $('.' + options.child + 'Label').removeClass('required');
                    }

                } else {
                    $("#" + options.child).data(widget).value(null);
                    $("#" + options.child).closest('.k-widget').hide();
                    $("#" + options.child).data(widget).trigger("change", {value: ""});
                    $("#" + options.child + "txt").show();

                    if (statesRequired == "Y") {
                        $('.' + options.child + 'Label').addClass('required');
                    } else {
                        $('.' + options.child + 'Label').removeClass('required');
                    }
                }
                if (postalCodeRequired == "Y") {
                    $('.' + options.child + 'PostalCodeLabel').addClass('required');
                } else {
                    $('.' + options.child + 'PostalCodeLabel').removeClass('required');
                }
            }
        });
    } else {
        if (options.defaultValue && options.child) {
            widgetOptions.change = function (e) {
                e.preventDefault();
                if (!this.value()) this.value(options.defaultValue);
                refreshChildDataSource(options.child, this.value(), widget);
                $("#" + options.child).data(widget).value(null);
            };
            widgetOptions.dataBound = function (e) {
                if (!this.value()) this.value(options.defaultValue);
                refreshChildDataSource(options.child, this.value(), widget);
            }
        } else if (options.child) {
            widgetOptions.change = function (e) {
                e.preventDefault();
                if (options.child == "peopleSoftId") {
                    refreshChildDataSourceForTextBox(options.child, this.value(), widget);
                }
                else {
                    refreshChildDataSource(options.child, this.value(), widget);
                    $("#" + options.child).data(widget).value(null);
                }
            }
        } else if (options.defaultValue) {
            widgetOptions.value = options.defaultValue;
            widgetOptions.change = function (e) {
                if (!this.value()) this.value(options.defaultValue);
            }
        }

        if (widgetType == 'select') {
            initDropDownList(target, widgetOptions);
        } else {
            initComboBox(target, widgetOptions);
        }
    }

    if (options.display) $(target).closest('.k-widget').hide();
}

function initDropDownList(target, options) {
    delete options.filter;
    delete options.filtering;
    options.optionLabel = options.placeholder;
    var ddl = $(target).kendoDropDownList(options).data('kendoDropDownList');
    return ddl;
}

var comboBoxValid;

function initComboBox(target, options) {
    var combobox = $(target).kendoComboBox(options).data("kendoComboBox");
    combobox.wrapper.find(".k-select").hide().closest(".k-dropdown-wrap").addClass("hideArrow");
    combobox.input.on("focus", function () {
        combobox.open();
        $(combobox.element).closest('span.k-widget').find('.errorMessage').remove();
    });
    combobox.bind("open", function (e) {
        comboBoxValid = false;
    });
    combobox.bind("select", function (e) {
        comboBoxValid = true;
    });
    combobox.input.on("blur", function (e) {
        if (!comboBoxValid || (combobox.value() && combobox.selectedIndex == -1)) {
            combobox.value('');
            $('<span class="errorMessage">Please select a valid option.</span>').appendTo($(combobox.element).closest('span.k-widget')).delay(5000).fadeOut(300, function () {
                $(this).remove();
            });
        }
    });
    return combobox;
}


function getFilter(e) {
    e.preventDefault();
    var filter = {logic: "or", filters: [{field: "alwaysShow", operator: "eq", value: "true"}]};
    var input = this.text().trim();
    if (input) {
        var andFilter = {logic: "and", filters: []};
        var filterStrings = input.split(" ");
        for (var i in filterStrings) {
            var filterString = filterStrings[i];
            if (filterString) {
                andFilter.filters.push({field: "value", operator: "contains", value: filterString});
            }
        }
        filter.filters.push(andFilter);
    } else {
        filter = {};
    }
    this.dataSource.filter(filter);
}

function refreshChildDataSource(childId, params, widget) {
    var child = $('#' + childId);
    child.data(widget).setDataSource(getWidgetDataSource(child.data('category'), params));
    child.data(widget).value(child.data(widget).defaultValue);
}

function refreshChildDataSourceForTextBox(childId, params, widget) {
    var child = $('#' + childId);
    var dataSource = getWidgetDataSource("orgPeopleSoftId", params);
    dataSource.fetch(function () {
        var data = dataSource.data();
        $('#' + childId).val(data[0].value);
    });
    var orgId=$('#'+childId).data('organizationval');
    params=params+"-"+orgId;
    var dataSourcecustname=getWidgetDataSource("orgcustomername",params);
    dataSourcecustname.fetch(function () {
    var dataname = dataSourcecustname.data();
    var stringstr=dataname[0].value;
    var strArr=stringstr.split('+');
    $('#sscustomerId').val(dataname[0].code);
    $('#sscustomerName').val(strArr[0]);
    $('#sscustomerAdd').val(strArr[1]);
    $('#customerDets').show();
    });

}

function getWidgetDataSource(category, params) {
    var url;
    if (category == "loadcountries") {
        url = (CONTEXT_PATH + "/testPrep/loadCountries");
    } else if (category == "orgPeopleSoftId" || category == "orgcustomername") {
        var url = category == "countries" ? (CONTEXT_PATH + "/countries/getcountries") : (CONTEXT_PATH + "/reference/data?_c=" + category + "&params=" + (params ? params : ""));
        var dataSource = new kendo.data.DataSource({
            type: "json",
            contentType: "application/json; charset=utf-8",
            transport: {read: {url: url}}
        });
        console.log(dataSource);
        return dataSource;
    } else {
        url = category == "countries" ? (CONTEXT_PATH + "/countries/getcountries") : (CONTEXT_PATH + "/reference/data?_c=" + category + "&params=" + (params ? params : ""));
    }
    return new kendo.data.DataSource({
        type: "json",
        contentType: "application/json; charset=utf-8",
        transport: {read: {url: url}}
    });
}

function initComboBoxes() {
    $(".eregComboBox").each(function () {
        initWidget(this, {
            category: $(this).data("category"),
            placeholder: $(this).data("placeholder"),
            display: $(this).data("display"),
            child: $(this).data("child"),
            params: $(this).data("params"),
            defaultValue: $(this).data("defaultValue"),
            childtype: $(this).data("childtype")
        });
    });
}

function initERegSelects() {
    $(".eregSelect").each(function () {
        initWidget(this, {
            category: $(this).data("category"),
            placeholder: $(this).data("placeholder"),
            child: $(this).data("child"),
            params: $(this).data("params"),
            defaultValue: $(this).data("defaultValue"),
            childtype: $(this).data("childtype")
        }, 'select');
    });
}

jQuery.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

// case insensitive contains check.
jQuery.expr[":"].containsi = jQuery.expr.createPseudo(function (arg) {
    return function (elem) {
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});