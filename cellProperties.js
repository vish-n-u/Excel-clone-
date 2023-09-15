let allSheetsCellPropertiesMatrix = []
let activeColor = "#0384fc"
let inactiveColor = "transparent"

// console.log("29jd")
// creates a clone of all cells with the given properties (acts as a databse for each cell)
function createCellDb(){
    let arr =[]
for(let x=0;x<row;x++){
    let singleArray = []
    for(let y=0;y<col;y++){
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
        singleArray.push(obj);
        
    }
    arr.push(singleArray)
}
return arr
}
let cellPropertiesMatrix = createCellDb()
allSheetsCellPropertiesMatrix.push(cellPropertiesMatrix)

let bold = document.querySelector(".bold")
let italic = document.querySelector(".italics")
let underline = document.querySelector(".underline")
let fontFamily = document.querySelector(".font-family")
let fontSize = document.querySelector(".font-size")
let alignment = document.querySelectorAll(".alignment")
let cellFillColor = document.querySelector(".cellColorFill")
let paintColor = document.querySelector(".paintIconColor")
let cellTextColor = document.querySelector(".cellTextColor")
let fontColor = document.querySelector(".fontIconColor")
let formulaBar = document.querySelector("#formulaInput")


// provides decoded val for rows and column for eg (A3=> r=0, col= 2 ) in array
function getDecodedAddress(val){
    let address = val||document.querySelector("#addressInput").value
    let cid = address.charCodeAt(address[0]) -65
    let rid = address.substr(1,address.length)
    rid--
    return [rid,cid]
    
}

// given an address it returns the cell in the dom and the cell in the db (if no address is given takes the address from the addressbar)
function getCellAndCellInDB(address,cellMatrixId){
    let [rid,cid] = getDecodedAddress(address)
    let selectedCell = document.querySelector(`[rid='${rid}'][cid='${cid}']`)
    let matrixId = cellMatrixId>=0?cellMatrixId:currSelectedSheet
    let selectedCellMatrix = allSheetsCellPropertiesMatrix[matrixId][rid][cid]
    return [selectedCell,selectedCellMatrix]
}

bold.addEventListener("click",(e)=>{
    let [selectedCell,selectedCellMatrix] = getCellAndCellInDB()
    selectedCellMatrix.bold = !selectedCellMatrix.bold
    selectedCell.style.fontWeight = selectedCellMatrix.bold?"bold":"normal"
    styleMenuBasedOnACell()
})

italic.addEventListener("click",(e)=>{    
    let [selectedCell,selectedCellMatrix] = getCellAndCellInDB()
    selectedCellMatrix.italic = !selectedCellMatrix.italic 
    selectedCell.style.fontStyle = selectedCellMatrix.italic?"italic":"normal"
    styleMenuBasedOnACell()
    
    // selectedCell.style.backgroundColor ="red"
})
underline.addEventListener("click",(e)=>{    
    let [selectedCell,selectedCellMatrix] = getCellAndCellInDB()
    selectedCellMatrix.underline = !selectedCellMatrix.underline 
    selectedCell.style.textDecoration = selectedCellMatrix.underline?"underline":"none"
    styleMenuBasedOnACell()
    
    // selectedCell.style.backgroundColor ="red"
})

cellFillColor.addEventListener("change",(e)=>{    
    let [selectedCell,selectedCellMatrix] = getCellAndCellInDB()
   selectedCellMatrix.fillColor = cellFillColor.value
   selectedCell.style.backgroundColor = cellFillColor.value
//    cellFillColor.value = cellFillColor.value
    styleMenuBasedOnACell()    
})

cellTextColor.addEventListener("change",(e)=>{    
    let [selectedCell,selectedCellMatrix] = getCellAndCellInDB()
   selectedCellMatrix.fontColor = cellTextColor.value
    selectedCell.style.color = cellTextColor.value
    styleMenuBasedOnACell()    
})

fontFamily.addEventListener("change",(e)=>{
    let [selectedCell,selectedCellMatrix] = getCellAndCellInDB()
    let val = fontFamily.value
     selectedCellMatrix.fontFamily = val
     selectedCell.style.fontFamily =val
     fontFamily.value = val
     
    
})

fontSize.addEventListener("change",(e)=>{
    let [selectedCell,selectedCellMatrix] = getCellAndCellInDB()
    let val = fontSize.value
     selectedCellMatrix.fontSize = val
     selectedCell.style.fontSize =val+"px"  
})

alignment.forEach((element,index)=>{
    element.addEventListener("click",(e)=>{
        let [selectedCell,selectedCellMatrix] = getCellAndCellInDB()
        if(index==0){
            selectedCellMatrix.alignment = "left"
            selectedCell.style.textAlign = "left"
        }
        else if(index==1){
            selectedCellMatrix.alignment = "center"
            selectedCell.style.textAlign = "center"
        }
        else{
            selectedCellMatrix.alignment = "right"
            selectedCell.style.textAlign = "right"
        }
        styleMenuBasedOnACell()
    })
    
})




// styles each individual option in menu  based on a cell & its properties stored in the db
function styleMenuBasedOnACell(){
    let [selectedCell,selectedCellMatrix] = getCellAndCellInDB()
   bold.style.backgroundColor = selectedCellMatrix.bold?activeColor:inactiveColor
   bold.style.color = selectedCellMatrix.bold?"white":"black"
   italic.style.backgroundColor = selectedCellMatrix.italic?activeColor:inactiveColor
   italic.style.color = selectedCellMatrix.italic?"white":"black"
    underline.style.backgroundColor = selectedCellMatrix.underline?activeColor:inactiveColor
    underline.style.color = selectedCellMatrix.underline?"white":"black"
    paintColor.style.color = selectedCellMatrix.fillColor
    fontColor.style.color = selectedCellMatrix.fontColor
    fontFamily.value = selectedCellMatrix.fontFamily==null?"monospace":selectedCellMatrix.fontFamily
    fontSize.value = selectedCellMatrix.fontSize
    alignment.forEach((element,index)=>{
        if(index==0){
            alignment[0].style.backgroundColor = selectedCellMatrix.alignment=="left"? activeColor:inactiveColor
            alignment[0].style.color = selectedCellMatrix.alignment=="left"? "white":"black"
        }
        else if(index==1){ 
            alignment[1].style.backgroundColor = selectedCellMatrix.alignment=="center"? activeColor:inactiveColor
            alignment[1].style.color = selectedCellMatrix.alignment=="center"? "white":"black"
    }
        else {
            alignment[2].style.backgroundColor = selectedCellMatrix.alignment=="right"? activeColor:inactiveColor
            alignment[2].style.color = selectedCellMatrix.alignment=="right"? "white":"black"
        }
    })  
    formulaBar.value = selectedCellMatrix.formula
}




// calls the styleMenuBasedOnACell function when a cell is clicked
cellsContainer.addEventListener("click",(e)=>{
     styleMenuBasedOnACell()
})

let lastExitedCellAdd 
document.addEventListener('click', function(event) {
    const gridActionsContainer = document.querySelector('.grid-actions-container');
    
    // Check if the clicked element is outside of grid-actions-container
    if (!gridActionsContainer.contains(event.target)) {
        if(lastExitedCellAdd==addressBar.value) return
        else{
            let [lastCell,lastCellInMatrix] = getCellAndCellInDB(lastExitedCellAdd)
            lastCell.style.border= "2px solid #afb0b3"
        }
        lastExitedCellAdd = addressBar.value
       let [currCell,currCellInMatrix] = getCellAndCellInDB()
       currCell.style.border = '2px solid rgb(98, 97, 96)'
       currCell.style.borderRadius= '3px'
       console.log("hewr")
    }
  });