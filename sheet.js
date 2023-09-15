const sheet = document.querySelector(".sheet-folder-container")
let sheetIcon = document.querySelector(".sheet-icon")
let sheetFolder = document.querySelectorAll(".sheet-folder")
let selectedSheetForCopyPaste
sheetIcon.addEventListener("click",()=>
sheetIconClick()
)


function sheetIconClick(backendSheetData){
   
    let newSheet =  document.createElement("div")
    let prevSelectedSheet = document.getElementById(`sheet-${currSelectedSheet}`)
    newSheet.setAttribute("class","sheet-folder")
    newSheet.setAttribute("id",`sheet-${allSheetsCellPropertiesMatrix.length}`)
    newSheet.innerText = `Sheet ${allSheetsCellPropertiesMatrix.length+1}`
    
    sheet.appendChild(newSheet)
    let arr = backendSheetData||createCellDb()
    allSheetsCellPropertiesMatrix.push(arr)
    sheetFolder = document.querySelectorAll(".sheet-folder")
    currSelectedSheet = allSheetsCellPropertiesMatrix.length-1
    updateCurrSheet(prevSelectedSheet)
    updateAllCells(currSelectedSheet)
    newSheet.addEventListener("mousedown",(e)=>{
     if(e.button==0) sheetOnClick(e)
     else if(e.button==1) removeSheet(e)
 })

 }

sheetFolder.forEach((element)=>element.addEventListener("mousedown",(e)=>{
    if(e.button==0) sheetOnClick(e)
    else if(e.button=2) removeSheet(e)

}))

function sheetOnClick(e){
    let [currCel,currCellInMatrix] = getCellAndCellInDB()
    currCellInMatrix.value = currCel.innerText
    let prevSelectedSheet = document.getElementById(`sheet-${currSelectedSheet}`)
    
    const id = e.target.getAttribute("id");
    let sheetId = id.split("-")[1]
    currSelectedSheet = sheetId  // the sheet variable created in grid.js
    updateCurrSheet(prevSelectedSheet)
    updateAllCells(sheetId)
    formulaBar.value = ""
    firstCell.click()
}


function updateAllCells(id){
    for(let x =0;x<row;x++){
        for(let y =0;y<col;y++){
            let selectedCellMatrix = allSheetsCellPropertiesMatrix[id][x][y];
            let cell = document.querySelector(`[rid='${x}'][cid='${y}']`)
            cell.innerText = selectedCellMatrix.value
            cell.style.fontWeight = selectedCellMatrix.bold?"bold":"normal"
            cell.style.textDecoration = selectedCellMatrix.underline?"underline":"none"
            cell.style.fontStyle=selectedCellMatrix.italic?"italic":"normal"
            cell.style.textAlign=selectedCellMatrix.alignment
            cell.style.backgroundColor=selectedCellMatrix.fillColor
            cell.style.color=selectedCellMatrix.fontColor
            cell.style.fontFamily=selectedCellMatrix.fontFamily
            cell.style.fontSize=selectedCellMatrix.fontSize+"px"
           if(currSelectedSheet!==selectedSheetForCopyPaste) cell.style.border = "1px solid #afb0b3"
        
    }
}
}


function updateCurrSheet(prevSelectedSheet,currentSheet){
    let currSheet  =document.getElementById(`sheet-${currentSheet||currSelectedSheet}`)
   if(prevSelectedSheet) {prevSelectedSheet.style.backgroundColor="transparent" 
    prevSelectedSheet.style.color = "black"
}// if prevSelectedSheet exists
    currSheet.style.backgroundColor="#2c97f6"
    currSheet.style.color = "white" //
    
}

function removeSheet(e){
    const id = e.target.getAttribute("id").split("-")[1];
    //  let currClickedSheet = id.split("-")[1]
    let currSheetOnDom = document.getElementById(`sheet-${id}`)
    let response = confirm("Are you sure you want to remove this Sheet?")
    if(!response) return
    let nextAvailableSheet 
      if(currSelectedSheet==id){
        nextAvailableSheet = nextUndeletedCell(id)
         if(nextAvailableSheet==-1) { 
            alert("You need to have atleast one sheet")
            return
            }
        }
        allSheetsCellPropertiesMatrix[id] = []
        currSheetOnDom.remove() // removes the sheet from DOM
        if(nextAvailableSheet||nextAvailableSheet==0)currSelectedSheet = nextAvailableSheet
        if(nextAvailableSheet||nextAvailableSheet==0)updateCurrSheet("",nextAvailableSheet)
        updateAllCells(currSelectedSheet)
    
}


// it will first check all the previous sheetdbs to check if one of them is not empty and select that
// else it will go forward and check the same , if all sheetdbs are empty throws an alert
function nextUndeletedCell(id){
    let closestNextLeftArr =""
    let closestNextRightArr=""
    for(let x =0;x<allSheetsCellPropertiesMatrix.length;x++){
        if(allSheetsCellPropertiesMatrix[x].length>0){
            if(x<id) closestNextLeftArr = x
            if(x>id){
                closestNextRightArr = x
                break
            }
        }
    }
    if(closestNextLeftArr!=="") return closestNextLeftArr
    if(closestNextRightArr!=="") return closestNextRightArr
    else return -1

}