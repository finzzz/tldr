document.getElementById('command').value = "" // clear on refresh

async function fetchIndex(){
    // clear
    document.getElementById("osBtnDiv").innerHTML = ""
    document.getElementById("content").innerHTML = ""
    localStorage.setItem("commandOS", JSON.stringify([]))

    var command = (document.getElementById("command").value)
                    .toLowerCase()
                    .trim()
                    .replace(/  */g, '-')
    
    localStorage.setItem("command", command)
    await fetch('./index.json').then(response => {
        return response.json();
    }).then(data => {
        for(i=0;i<data.commands.length;i++){
          if(data.commands[i].name == command){
            localStorage.setItem("command", command)
            localStorage.setItem("commandOS", JSON.stringify(data.commands[i].platform))
          }
        }
    });

    var commandOS = await JSON.parse(localStorage.getItem("commandOS"))
    if (commandOS.length > 0){
        for (i=0;i<commandOS.length;i++){
            var btn = document.createElement('button')
            btn.setAttribute("class","osBtn")
            btn.setAttribute("onclick","get(\""+commandOS[i]+"\")")
            btn.innerHTML = commandOS[i]
            document.getElementById("osBtnDiv").appendChild(btn)
        }

        get(commandOS[0])
    } else {
        var na = document.createElement('p')
        na.innerHTML = "--- not found ---"
        document.getElementById("osBtnDiv").appendChild(na)
    }
}

function get(os){
    var command = localStorage.getItem("command")
    fetch("tldr/pages/" + os + "/" + command + ".md")
    .then((resp)=>{return resp.text()})
    .then((text)=>{
        document.getElementById('content').innerHTML = marked(text)
        document.querySelectorAll('code').forEach((block) => { 
            hljs.configure({
                tabReplace: '    ',
                languages: ["bash", "shell"],
            })
            hljs.highlightBlock(block) 
        })
    })
    
}

function getSavedValue(v){
    if (!localStorage.getItem(v)) {
        return ""
    }
    return localStorage.getItem(v)
}

function changeContent(id){
    document.getElementById(id).innerHTML = getSavedValue(id)
}

// trigger on enter
document.getElementById("command")
.addEventListener("keyup", function(event) {
    if (event.defaultPrevented) {return}
    if (event.code == "Enter") {document.getElementById("search_btn").click()}
})