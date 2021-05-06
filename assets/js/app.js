// clear on refresh
document.getElementById("os").selectedIndex = 1
document.getElementById('command').value = ""

function search(){
    var path = "tldr/pages/"
    var subfolders = document.getElementById("os").value
    var command = (document.getElementById("command").value)
                    .toLowerCase()
                    .trim()
                    .replace(/  */g, '-')

    var url = path + subfolders + "/" + command + ".md"

    localStorage.setItem("command", command)

    fetch(url)
    .then((resp)=>{
        if (resp.status != "404"){
            get(url)                    
        }else{
            document.getElementById('content').innerHTML = marked("# Not Found")
        }
    })
}

function get(url){
    fetch(url)
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
    if (event.keyCode === 13) {
        event.preventDefault()
        document.getElementById("search_btn").click()
    }
})