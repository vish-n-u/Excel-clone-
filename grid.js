let row = 100 // it denotes the numbers, but since it is used to locate a grid in its row
let col = 26
let currSelectedSheet = 0

let addressColContainer = document.querySelector(".cols-container")
let addressBar = document.querySelector("#addressInput")

// CREATES ALL THE CELLS
for(let x=0;x<100;x++){  
    let newAddressCol = document.createElement("div")
    newAddressCol.setAttribute("class","address-col")
newAddressCol.innerText = x+1
    addressColContainer.appendChild(newAddressCol)
}


let addressRowContainer = document.querySelector(".address-row-container")

//Adds alphabets to the columns
for(let x=0;x<26;x++){
    let newAddressRow = document.createElement("div")
    newAddressRow.setAttribute("class","address-row")
    let char = x+97
    newAddressRow.innerText = String.fromCharCode(char).toUpperCase()
    addressRowContainer.appendChild(newAddressRow)
}
let cellsContainer = document.querySelector(".cells-container")
// adds number to the rows
for(let x=0;x<100;x++){
    let rowContainer = document.createElement("div")
    rowContainer.setAttribute("class","row-container")
    for(let y=0;y<26;y++){
    let newCells = document.createElement("div")
    newCells.setAttribute("class","cells")
    newCells.setAttribute("contenteditable","true")
    newCells.setAttribute("rid",x)
    newCells.setAttribute("cid",y)
    newCells.setAttribute("spellcheck",false)
    addCellIdInAddressBar(newCells,x,y)
    rowContainer.appendChild(newCells)
}
cellsContainer.appendChild(rowContainer)
}

function addCellIdInAddressBar(cell,x,y){   
    cell.addEventListener("click",((e)=>{
        let rowChar =String.fromCharCode(y+97).toUpperCase()
        let colNum = x+1
        addressBar.value = rowChar+colNum
    }))
}

// initially the first cell (A1) should be clicked!

let firstCell = document.querySelector("[rid='0'][cid='0']")
firstCell.click()
// firstCell.style.border = "1px solid rgb(98, 97, 96)"

