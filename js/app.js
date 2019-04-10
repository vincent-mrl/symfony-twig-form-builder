$(document).ready(function(){
    // Vars
    var outputDefaultText = $('#output pre').html();

    // Handle form submit
    $('form').submit(function(e){
        e.preventDefault();

        // Code
        var formClassCode = $('#textarea-input').val();
        outputTwigFormFromFormClass(formClassCode);

        return false;
    });

    // Copy to clipboard
    document.getElementById("copy-to-clipboard").addEventListener("click", function() {
        copyToClipboard(document.getElementById("copyTarget"));
    });

    // Reset the tool
    $('#erase-php-class').click(function(){
        $('#textarea-input').val('');
        $('#output pre').html(outputDefaultText);
        $('#copy-to-clipboard').hide();
        $('#colNumberPerRow1').prop("checked", true);
        $('#responsiveBreakpoint2').prop("checked", true);
    });
});

/* Function */
function outputTwigFormFromFormClass(formClassCode){
    var myTwigForm = '';
    var arrayOfLines = formClassCode.split('\n');

    myTwigForm += '{{ form_start(form) }}\n';

    $.each(arrayOfLines, function(index, textareaLine) {
        var parts = textareaLine.split("->add('");
        var formFieldToAdd = '';
        var colPerRow = $("input[name='colNumberPerRow']:checked"). val();
        var responsiveBreakpoint = $("input[name='responsiveBreakpoint']:checked"). val();

        if(typeof(parts[1]) !== 'undefined' && typeof(parts[1].split("',")[0]) !== 'undefined'){
            formFieldToAdd = parts[1].split("',")[0];

            myTwigForm += wrapInputAccordingColType(formFieldToAdd, colPerRow, responsiveBreakpoint);
        }
    });

    myTwigForm += '{{ form_end(form) }}\n';

    $('#output pre').text(myTwigForm);

    $('#copy-to-clipboard').fadeIn();
}

function wrapInputAccordingColType (formField, colPerRow = "1", responsiveBreakpoint = "md"){
    var colClassName = 'col-';

    // Set breakpoint
    if(responsiveBreakpoint !== ''){
        colClassName += responsiveBreakpoint + '-';
    }

    // Set col size
    if(colPerRow === "1"){
        colClassName += '12';
    }else if(colPerRow === "2"){
        colClassName += '6';
    }else{
        colClassName += '4';
    }
    return '<div class="'+ colClassName +'">\n{{ form_row(form.' + formField +') }}\n</div>\n\n';
}

function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}
