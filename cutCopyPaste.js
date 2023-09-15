// originalCellRow = it is the row number in the for loop which has been selected currently to be copied
// originalCellColInNum = It is the col number inside the matrix
// currOriginalCellAddress = it is the address of the cell built using row and column




let ctrlKey
let selectedCellRange =[]
let isCutBtnClick = false
let cutBtn = document.querySelector(".cut")
let copyBtn = document.querySelector(".copy")
let pasteBtn = document.querySelector(".paste")


document.addEventListener("keydown",(e)=>{
    ctrlKey = e.ctrlKey
})

document.addEventListener("keyup",(e)=>{
    ctrlKey = false
})

for(let x=0;x<row;x++){
    for(let y=0;y<col;y++){
        let cell = document.querySelector(`[rid='${x}'][cid='${y}']`)
        cell.addEventListener("click",(e)=>{
           selectedCell()
        })
    }
}


function selectedCell(){
    if(ctrlKey){
        let [selectedCell,selectedCellMatrix] = getCellAndCellInDB(addressBar.value)
        if(selectedSheetForCopyPaste){
            if(currSelectedSheet!==selectedSheetForCopyPaste) selectedCellRange = []
        }
        selectedSheetForCopyPaste = currSelectedSheet
        if(selectedCellRange.length>=2){
            
            let [selectedCell1,selectedCellMatrix1] = getCellAndCellInDB(selectedCellRange[0])
            let [selectedCell2,selectedCellMatrix2] = getCellAndCellInDB(selectedCellRange[1])
            selectedCell1.style.border = "1px solid rgb(202, 204, 204)"
            selectedCell2.style.border = "1px solid rgb(202, 204, 204)"
            selectedCellRange = []
        }
       
        selectedCellRange.push(addressBar.value)
        selectedCell.style.setProperty("border",'3px solid #039c40' ,"important") 
        
    }
    return
}


cutBtn.addEventListener("click",()=>{
    isCutBtnClick = true
    if(selectedCellRange.length==0)return
    if(selectedCellRange.length==1){
        console.log("cut 1")
        let [cellInUIToBePastedOn,cellInUIToBePastedOnMatrix] = getCellAndCellInDB(selectedCellRange[0],selectedSheetForCopyPaste)
        let emptyMatrix = returnDefaultCellValue()
        updateASingleCellValueInUI(cellInUIToBePastedOn,emptyMatrix)
        console.log("cut 2")
        return
    }
    let [selectedStartColInNum,selectedStartRow] = decodeAddress(selectedCellRange[0])
   let [selectedEndColInNum,selectedEndRow] = decodeAddress(selectedCellRange[1])
    for(let x=selectedStartRow;x<=selectedEndRow;x++){
        for(let y=selectedStartColInNum;y<=selectedEndColInNum;y++){
            let currSelectedCellAddress = String.fromCharCode(y)+x
            let [currSelectedCell,currSelectedCellInMatrx] = getCellAndCellInDB(currSelectedCellAddress,selectedSheetForCopyPaste)
            setCellInUIToDefault(currSelectedCell)
        }
    }
})

pasteBtn.addEventListener("click",(e)=>{
   if(selectedCellRange.length<1)return
   if(selectedCellRange.length==1) {
    console.log("selected one")
    onlyOneCellSelected()
    return
}
//    if(currSelectedSheet!==selectedSheetForCopyPaste){
//     return alert("You cant paste from a different sheet")
//    }
 else{  removeSelectedCellBorder()
   sortSelectedRange()
   let [selectedStartColInNum,selectedStartRow] = decodeAddress(selectedCellRange[0])
   let [selectedEndColInNum,selectedEndRow] = decodeAddress(selectedCellRange[1])
    for(let x=selectedStartRow;x<=selectedEndRow;x++){
        for(let y=selectedStartColInNum;y<=selectedEndColInNum;y++){
            let currSelectedCellAddress = String.fromCharCode(y)+x
            let [currSelectedCell,currSelectedCellInMatrx] = getCellAndCellInDB(currSelectedCellAddress,selectedSheetForCopyPaste)
            
            let  cellInUIToBePastedOnAddress = cellInUIToBePastedOn(selectedStartColInNum,selectedStartRow,x,y)
            updateCopiedCellsMatrix(cellInUIToBePastedOnAddress,currSelectedCellInMatrx)
            let [cellToBeCopiedOn,cellToBeCopiedOnInMatrix] = getCellAndCellInDB(cellInUIToBePastedOnAddress)
            if(!cellToBeCopiedOn) continue
            updateASingleCellValueInUI(cellToBeCopiedOn,cellToBeCopiedOnInMatrix)
            updateCopiedCellsChildren(cellToBeCopiedOnInMatrix,y,x,cellInUIToBePastedOnAddress,selectedStartColInNum,selectedStartRow,selectedEndColInNum,selectedEndRow)
            updateCopiedCellsFormula(cellToBeCopiedOnInMatrix,currSelectedCellAddress,selectedStartColInNum,selectedStartRow,selectedEndColInNum,selectedEndRow,cellInUIToBePastedOnAddress)
            if(isCutBtnClick){
                allSheetsCellPropertiesMatrix[selectedSheetForCopyPaste][x-1][y-65] =returnDefaultCellValue()
            }
        }
            
        }
        isCutBtnClick = false
        
    }
})


function onlyOneCellSelected() { 
    removeSelectedCellBorder()
    console.log("here nao")
    let [copyFromCell,copyFromCellMatrix] = getCellAndCellInDB(selectedCellRange[0],selectedSheetForCopyPaste)
    let [copyToCell,copyToCellMatrix] = getCellAndCellInDB(addressBar.value)
    console.log("reached here 2")
    
        // updateASingleCellValueInUI(copyFromCell,copyToCellMatrix) // to remo
        updateCopiedCellsMatrix(addressBar.value, copyFromCellMatrix)
        updateASingleCellValueInUI(copyToCell,copyFromCellMatrix)
        let [col,row] = decodeAddress(selectedCellRange[0])
        let [copyToCol,copyToRow] = decodeAddress(addressBar.value)
         allSheetsCellPropertiesMatrix[currSelectedSheet][copyToRow-1][copyToCol-65].children 
         allSheetsCellPropertiesMatrix[currSelectedSheet][copyToRow-1][copyToCol-65].formula = ""
        if(isCutBtnClick){
            allSheetsCellPropertiesMatrix[selectedSheetForCopyPaste][row-1][col-65] = returnDefaultCellValue()
        
        isCutBtnClick = false
        }
        selectedCellRange=[]

        
    
}


function updateCopiedCellsFormula(copiedCellInMatrix,currSelectedCellAddress,startCol,startRow,endCol,endRow,cellInUIToBePastedOnAddress){
    if(!copiedCellInMatrix.formula)return
    let formulasParents = changeFormulaToIncludeOnlyParentAddresses(copiedCellInMatrix.formula)
    let areParentsInRange = true
    formulasParents.forEach((parentAddress)=>{
        let [parentCellCol,parentCellRow] = decodeAddress(parentAddress)
        if(parentCellCol<startCol||parentCellCol>endCol||parentCellRow<startRow||parentCellRow>endRow){
            copiedCellInMatrix.formula = ""
            areParentsInRange =false
            return
        }
    })
    if(!areParentsInRange) return
    else{
        let formulaArray = copiedCellInMatrix.formula.split(/\s*([\+\-\*/()/])\s*/).filter(Boolean);
        let newFormulaString=""
        for(let x =0;x<formulaArray.length;x++){
            if(formulaArray[x]==")"||formulaArray[x]=="("||formulaArray[x]=="+"||formulaArray[x]=="-"||formulaArray[x]=="*"||formulaArray[x]=="/"||!isNaN(formulaArray[x]-1) ){
                newFormulaString+=formulaArray[x]
            }
            else{
                let [copiedCellAddressCol,copiedCellAddressRow] = decodeAddress(cellInUIToBePastedOnAddress)
                let [parentCol,parentRow] = decodeAddress(formulaArray[x])
                let [currCellAddressCol,currCellAddressRow] = decodeAddress(currSelectedCellAddress)
                let colDiff = currCellAddressCol-parentCol
                let rowDiff = currCellAddressRow-parentRow
                let newAddress = String.fromCharCode(copiedCellAddressCol-colDiff)+(copiedCellAddressRow-rowDiff)
                if(newAddress.charCodeAt(0)>90||newAddress.charCodeAt(0)<65||Number(newAddress.slice(1,newAddress.length))>100||Number(newAddress.slice(1,newAddress.length))<0)
                {
                    copiedCellInMatrix.formula=""
                    return
                }
                newFormulaString+=newAddress
            }

        }
        copiedCellInMatrix.formula = newFormulaString

    }
}

function updateCopiedCellsChildren(copiedCellInMatrix,currSelectedCellColInNum,currSelectedRow,cellInUIToBePastedOnAddress,startCol,startRow,endCol,endRow)
{
    if(!copiedCellInMatrix.children||copiedCellInMatrix.children.length==0)return
    for(let x=0;x<copiedCellInMatrix.children.length;x++){
    let [childCellCol,childCellRow] = decodeAddress(copiedCellInMatrix.children[x])
    if(childCellCol<startCol||childCellCol>endCol||childCellRow<startRow||childCellRow>endRow){
        copiedCellInMatrix.children.splice(x,1)
        x--
    }
    let colDiff =childCellCol-currSelectedCellColInNum
    let rowDiff = childCellRow-currSelectedRow
    let newCellInUIToBePastedOnCol = String.fromCharCode(cellInUIToBePastedOnAddress.charCodeAt(0)+Number(colDiff))
    let newCellInUIToBePastedOnRow = Number(cellInUIToBePastedOnAddress.slice(1,cellInUIToBePastedOnAddress.length))+Number(rowDiff)
    if(newCellInUIToBePastedOnCol.charCodeAt(0)>90||newCellInUIToBePastedOnCol.charCodeAt(0)<65||newCellInUIToBePastedOnRow>100||newCellInUIToBePastedOnRow<1){
        copiedCellInMatrix.children.splice(x,1)
        continue
    }
    let newCellAddress = newCellInUIToBePastedOnCol+newCellInUIToBePastedOnRow
    copiedCellInMatrix.children[x] = newCellAddress
    }
}


// makes sure that the selectedRange is sorted based on its column/row
function sortSelectedRange(){
    let [startCol,startRow] = getDecodedAddress(selectedCellRange[0])
    let [endCol,endRow] = getDecodedAddress(selectedCellRange[1])
    if(startCol>endCol){ 
        selectedCellRange.reverse()
    return}
    else {
        if(endRow<startRow){
            { selectedCellRange.reverse()
                return}
        }
}
}


function updateASingleCellValueInUI(cellInUIToBePastedOn,copiedCellMatrix){
    console.log("cellInUIToBePastedOn",cellInUIToBePastedOn,copiedCellMatrix)
    cellInUIToBePastedOn.innerText = copiedCellMatrix.value
    cellInUIToBePastedOn.style.backgroundColor = copiedCellMatrix.fillColor;
    cellInUIToBePastedOn.style.color = copiedCellMatrix.fontColor
    cellInUIToBePastedOn.style.fontWeight = copiedCellMatrix.bold?"bold":"normal"
    cellInUIToBePastedOn.style.fontStyle = copiedCellMatrix.italic?"italic":"normal"
    cellInUIToBePastedOn.style.textDecoration = copiedCellMatrix.underline?"underline":"none"
    cellInUIToBePastedOn.style.fontFamily = copiedCellMatrix.fontFamily
    cellInUIToBePastedOn.style.fontSize =  copiedCellMatrix.fontSize+"px"
    cellInUIToBePastedOn.style.textAlign = copiedCellMatrix.alignment
}




function decodeAddress(address){
    let col = address.slice(0,1).charCodeAt(0)
    let row = address.slice(1,address.length)
    return [col,row]
    

}


function cellInUIToBePastedOn(selectedStartColInNum,selectedStartRow,x,y){
    let [cellToBePastedOnCol,cellInUIToBePastedOnRow] = decodeAddress(addressBar.value)
            cellToBePastedOnCol = cellToBePastedOnCol+(y-selectedStartColInNum) 
            cellInUIToBePastedOnRow = Number(cellInUIToBePastedOnRow)+Number(x-selectedStartRow)
            return  String.fromCharCode(cellToBePastedOnCol)+cellInUIToBePastedOnRow

}


function  updateCopiedCellsMatrix(cellInUIToBePastedOnAddress,cellInMatrix){
    console.log("cellInUIToBePastedOnAddress",cellInUIToBePastedOnAddress)
    let [rid,cid] = getDecodedAddress(cellInUIToBePastedOnAddress)
    allSheetsCellPropertiesMatrix[currSelectedSheet][rid][cid] = JSON.parse(JSON.stringify(cellInMatrix))
    console.log(allSheetsCellPropertiesMatrix[currSelectedSheet][rid][cid])
}

function removeSelectedCellBorder(){
    console.log("caaled 1")
    if(selectedCellRange.length==1){
        console.log("called here")
        let [selectedCell1,selectedCellMatrix1] = getCellAndCellInDB(selectedCellRange[0],selectedSheetForCopyPaste)
        selectedCell1.style.border = "1px solid rgb(202, 204, 204)"
        return
    }
    let [selectedCell1,selectedCellMatrix1] = getCellAndCellInDB(selectedCellRange[0],selectedSheetForCopyPaste)
    let [selectedCell2,selectedCellMatrix2] = getCellAndCellInDB(selectedCellRange[1],selectedSheetForCopyPaste)
    selectedCell1.style.border = "1px solid rgb(202, 204, 204)"
    selectedCell2.style.border = "1px solid rgb(202, 204, 204)"
}


function returnDefaultCellValue(){
    let obj={
        // address:String.fromCharCode(x+65)+(y+1),
        bold:false,
        underline:false,
        italic:false,
        alignment:"left",
        fillColor:"#fcfcfc",
        fontColor:"#000000",
        fontFamily:null,
        fontSize:"16",
        value:"",
        formula:""
    }
    return obj
}


function setCellInUIToDefault(currSelectedCell){
    currSelectedCell.innerText=""
    currSelectedCell.style.backgroundColor="white"

    
}