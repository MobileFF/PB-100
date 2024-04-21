const escapeTable = [
    ["\\\\","\\BS","＼"],
    ["\\E-","\\EM","ｪ"],
    ["\\E+","\\EX","ｴ"],
    ["\\@","\\CI","○"],
    ["\\SM","\\SG","∑"],
    ["\\^","\\TR","△"],
    ["\\*","\\CR","×"],
    ["\\:","\\DV","÷"],
    ["{","\\LA","←"],
    ["|","\\DA","↓"],
    ["}","\\RA","→"],
    ["\\YN","\\\\","￥"],
    ["\\.","\\DT","・"],
    ["\\#","\\BX","■"],
    //["^","\\UA","↑"],
    // for PBPrinter
    ["\\>=","\\GE","≧"],
    ["\\<=","\\LE","≦"],
    ["\\<>","\\NE","≠"],
    [">=",">=","≧"],
    ["<=","<=","≦"],
    ["<>","<>","≠"],
    ["\\PI","\\PI","π"],
    ["\\DG","\\DG","°"],
    ["\\SP","\\SP","♠"],
    ["\\HT","\\HT","♥"],
    ["\\DI","\\DI","♦"],
    ["\\CL","\\CL","♣"],
    ["\\MU","\\MU","μ"],
    ["\\OM","\\OM","Ω"],
    ["\\SQ","\\SQ","□"],
    // CASutil : "THEN$" → PB-Sim : "THEN $"
    ["THEN$","THEN $","THEN $"],
]
const escapeInString = [
    ["^","\\UA","↑"],
]

document.getElementById("exe").addEventListener("click",event => {
    const mode = document.getElementById("to_pbsim")
    let from = 0
    let to = 1
    let prt = 2
    if (mode.checked) {
        console.log("mode:casutil to pbsim")
    } else {
        from = 1
        to = 0
        console.log("mode:pbsim to casutil")
    }
    const source_from = document.getElementById("source_from").value
    // console.log(source_from)
    let source_to = new String(source_from)
    let source_prt = new String(source_from)
    for(const e of escapeTable) {
        let regexp = new RegExp(
            e[from]
                .replace(/\\/gi,"\\\\")
                .replace(/\./gi,"\\.")
                .replace(/\^/gi,"\\^")
                .replace(/\|/gi,"\\|")
                .replace(/\$/gi,"\\$")
                .replace(/\+/gi,"\\+")
                .replace(/\*/gi,"\\*"),"gi")
                
        console.log(regexp)
        source_to = source_to.replace(regexp,e[to])
        source_prt = source_prt.replace(regexp,e[prt])
        //console.log(source_to)
    }

    let pos1 = 0
    let pos2 = 0
    let quote = false
    let literal = ""
    for(let i=0;i<source_to.length;i++) {
        if(source_to.charAt(i)=='"') {
            quote = !quote
            if (quote) {
                pos1 = i
                continue
            } else {
                console.log(literal)
                let before_length = literal.length
                pos2 = i
                for(const e of escapeInString) {
                    let regexp = new RegExp(
                        e[from]
                            .replace(/\\/gi,"\\\\")
                            .replace(/\./gi,"\\.")
                            .replace(/\^/gi,"\\^")
                            .replace(/\|/gi,"\\|")
                            .replace(/\$/gi,"\\$")
                            .replace(/\+/gi,"\\+")
                            .replace(/\*/gi,"\\*"),"gi")
                    literal = literal.replace(regexp,e[to])
                }
                console.log(">>"+literal)
                let after_length = literal.length
                let offset = after_length - before_length
                console.log("offset:"+offset)
                source_to = source_to.substring(0,pos1+1)+literal+source_to.substring(pos2)
                literal = ""
                i = i + offset
                // console.log(source_to)
            }
        }
        if (quote) {
            literal += source_to.charAt(i)
        }
    }

    console.log(source_prt.replace(/</gi,"&lt;"))
    document.getElementById("source_to").textContent = source_to
    document.getElementById("source_to").disabled = false
    document.getElementById("printer_image").innerHTML = source_prt.replace(/</gi,"&lt;")
})

document.getElementById("download").addEventListener("click",event => {
    let content = document.getElementById("source_to").textContent 
    let blob = new Blob([ content ], { "type" : "text/plain" })
    document.getElementById("download").href = window.URL.createObjectURL(blob);
})
