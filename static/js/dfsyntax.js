function charIsLetter(c) {
    return ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'));
}

function stringIsKeyword(s) {
    return (
        (s == 'if') ||
        (s == 'do') ||
        (s == 'while') ||
        (s == 'for') ||
        (s == 'return') ||
        (s == 'break') ||
        (s == 'goto') ||
        (s == 'switch') ||
        (s == 'case') ||
        (s == 'int') ||
        (s == 'char') ||
        (s == 'unsigned') ||
        (s == 'signed') ||
        (s == 'long') ||
        (s == 'short')
    );
}

function textToHTML(text) {
    var outerHTML = '';

    outerHTML += '<span>';

    // Tokenizer (Lexer)
    var i = 0;
    while (i < text.length) {
        switch (text[i]) {
            case 'A':case 'B':case 'C':case 'D':case 'E':case 'F':case 'G':
            case 'H':case 'I':case 'J':case 'K':case 'L':case 'M':case 'N':
            case 'O':case 'P':case 'Q':case 'R':case 'S':case 'T':case 'U':
            case 'V':case 'W':case 'X':case 'Y':case 'Z':
            case 'a':case 'b':case 'c':case 'd':case 'e':case 'f':case 'g':
            case 'h':case 'i':case 'j':case 'k':case 'l':case 'm':case 'n':
            case 'o':case 'p':case 'q':case 'r':case 's':case 't':case 'u':
            case 'v':case 'w':case 'x':case 'y':case 'z':
            {
                var start = i;
                var len = 1;

                while (start + len < text.length && charIsLetter(text[start + len])) {
                    len++;
                }
                i += len;

                var s = text.substring(start, start + len);
                if (stringIsKeyword(s)) {
                    outerHTML += '</span>';
                    outerHTML += '<span class="dfsyntax-keyword">';
                    outerHTML += s;
                    outerHTML += '</span>';
                    outerHTML += '<span>';
                } else {
                    outerHTML += s;
                }
            } break;

            case '"':
            {
                var start = i;
                var len = 1;
                while (start + len < text.length &&
                    (text[start + len] != '"' || (text[start + len] == '"' && text[start + len - 1] == '\\'))) {
                    len++;
                }
                len++;
                i += len;

                var s = text.substring(start, start + len);
                outerHTML += '</span>';
                outerHTML += '<span class="dfsyntax-string">';
                outerHTML += s;
                outerHTML += '</span>';
                outerHTML += '<span>';
            } break;

            case '\'':
            {
                var start = i;
                var len = 1;
                while (start + len < text.length &&
                    (text[start + len] != '\'' || (text[start + len] == '\'' && text[start + len - 1] == '\\'))) {
                    len++;
                }
                len++;
                i += len;

                var s = text.substring(start, start + len);
                outerHTML += '</span>';
                outerHTML += '<span class="dfsyntax-string">';
                outerHTML += s;
                outerHTML += '</span>';
                outerHTML += '<span>';
            } break;
            
            case ' ':
            {
                outerHTML += '&nbsp;';
                i++;
            } break;

            default:
            {
                outerHTML += text[i];
                i++;
            } break;
        }
    }

    outerHTML += '</span>';

    return outerHTML;
}

function getLineText(children) {
    var text = '';

    for (var i = 0; i < children.length; i++) {
        var node = children[i];
        text += node.innerText;
    }

    return text;
}

exports.aceInitInnerdocbodyHead = function(hook_name, args, cb) {
	args.iframeHTML.push('<link rel="stylesheet" type="text/css" href="/static/plugins/ep_dfsyntax/static/css/dfsyntax.css"/>');
    return cb();
};

exports.acePostWriteDomLineHTML = function(hook_name, args, cb) {
    var text = '';
    for (var i = 0; i < args.node.children.length; i++) {
        var node = args.node.children[i];

        if (node.tagName == 'BR') {
            continue;
        } else if (node.tagName == 'SPAN') {
            text = getLineText(args.node.children);
            var html = textToHTML(text);
            args.node.innerHTML = html;
            break;
        } else {
            // Unhandled
        }
    }

    return cb();
};
