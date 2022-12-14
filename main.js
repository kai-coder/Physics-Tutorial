var canvas_dom = document.getElementsByClassName("sketch")
for (i = 0; i < canvas_dom.length; i++){
    canvas_dom[i].addEventListener("touchmove",   function(event) {event.preventDefault()})
    canvas_dom[i].addEventListener("touchcancel", function(event) {event.preventDefault()})
}
document.getElementById("tableButton").onclick = function(){
    if (document.getElementById("tableContents").style.display == "block"){
        document.getElementById("tableContents").style.display = "none";
    } else{
        document.getElementById("tableContents").style.display = "block";
    }
};

const codeBlocks = document.body.getElementsByTagName("code");
const txts = [["from", "import", "self", "function", "class", "displayDensity", "in", "range", "this", 'new'],
             ["if", "elif", "else", "return", "for"], 
             ["PVector"], 
             ["len", "circle", "mag", "sqrt", "copy", "normalize", "strokeWeight", "add", "mult", "stroke", 
             "background", "fill", "sub", "__init__", "pixelDensity", "set", "resizeCanvas", "random", "append", "dist", "cos",
            "sin", "createVector"], 
             ["setup", "draw"], 
             ["mouseX", "mouseY", "height", "width"]]
var codeBlockContents = [];
for (i = 0; i < codeBlocks.length; i++){
    codeBlockContents.push(codeBlocks[i].innerHTML.trim().trimEnd()
    .split(/([A-Z]\w|\n|\(|\)|:|\.|\/\/|~|`|-|\#|\^|\*)/g))
}

for (i = 0; i < codeBlockContents.length; i++){
    comment = false
    var tabSize = 0;
    inside = false;
    codeBlocks[i].innerHTML = "";
    contents = codeBlockContents[i];
    contents = contents.filter(function(x) {
        return x != '';
    });
    intUp = false
    for (j = 0; j < contents.length; j++){
        char = contents[j]
        charCheck = char
        charCheck = charCheck.trim().trimEnd()
        var span = document.createElement('span');
        if (charCheck != "\n" && charCheck != "\^") {
        if (!isNaN(charCheck)){
            if (intUp){
                span.classList.add('intUp')
                intUp = false
            }else{
                span.classList.add('int')
            }
        }
        if(charCheck == ":"){
            inside = true
        }
        if (charCheck == "\t"){
            char = " ".repeat(4)
        }
        if ((j == 0 || contents[j - 1].match(/[~|`|\n]/i))) {
            comment = false
        }
        if(charCheck == "//"){
            comment = true
        }
        if (comment){
            span.classList.add("comment")
        }else{
            for (k = 0; k < txts.length; k++){
            for (l = 0; l < txts[k].length; l++){
                if (charCheck == txts[k][l]){
                span.classList.add("style" + String(k + 1));
                }
            }
            }
        }
        span.innerHTML += char;
        codeBlocks[i].appendChild(span);
        
        }else if (charCheck == "^"){
        intUp = true
        }else{
        span.innerHTML = "\n"
        codeBlocks[i].appendChild(span);
        }
    }
}

const codeHolders = document.body.getElementsByClassName("codeHolder");
for (i = 0; i < codeHolders.length; i++){
    btns = codeHolders[i].getElementsByTagName("button")
    codes = codeHolders[i].getElementsByTagName("code")
    for (j = 0; j < btns.length; j++){
        const codeTarget = codes[j]
        const btn = btns[j]
        const codeHolder = codeHolders[i]
        btns[j].addEventListener("click", function(){
            for (hide = 0; hide < codes.length; hide++){
                codes[hide].style.display = "none";
            }
            for (hide = 0; hide < codes.length; hide++){
                btns[hide].style.background = "#B1CD79";
            }
            codeTarget.style.display = "block";
            btn.style.background = "rgb(244, 248, 236)";
            window.scrollTo(0, codeHolder.offsetTop);
        });
    }
}