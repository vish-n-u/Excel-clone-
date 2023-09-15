// adds a blur event listener to each cell
for (let x=0;x<row;x++){
    for(let y=0;y<col;y++){
         let cells = document.querySelector(`[rid='${x}'][cid='${y}']`);
        cells.addEventListener("blur",(e)=>{
            
            let [selectedCell,selectedCellMatrix] = getCellAndCellInDB()
            selectedCellMatrix.value = cells.innerText
            depthFirstUpdate(selectedCellMatrix)
        })
        cells.addEventListener("click",()=>{
            if(lastExitedCellAdd){
                let [lastCell,lastCellInMatrix] = getCellAndCellInDB(lastExitedCellAdd)
            lastCell.style.border= "1px solid #afb0b3"
            lastExitedCellAdd =""
            }
        })
    }
}

// on enter ensures the formula is executed and the cellis updated, ensures if a cycle is formed to let the user know
formulaBar.addEventListener("keydown", ((e)=>{
    let address = document.querySelector("#addressInput").value

    if(e.code=="Enter"){
        let [currSelectedCell,currSelectedCellMatrix] = getCellAndCellInDB()
        
        if(!formulaBar.value){
            removeParents(currSelectedCellMatrix.formula,address)
            currSelectedCellMatrix.formula=""
            currSelectedCellMatrix.value = currSelectedCell.innerText
            return
        }
        let getParentsFromFormula = changeFormulaToIncludeOnlyParentAddresses(formulaBar.value)
        if(getParentsFromFormula.includes(address)){
            alert("Formula cannot contain its own cellId")
            return
        }
        let ans = formulaBreakDownAndFindIfCycleExists(currSelectedCellMatrix) // return an array if cycle is formed [true,[all the addresses of the cell in the cycle]]
        if(ans?.[0]){
          let response =  confirm("cycle will be formed.Do you want to trace it?")
            ans[1].push(address) // to start the cycle from the addree
            ans[1].unshift(address) // to end the cycle on the address
            if(response) highlightTheCellsThatFormACycle(ans[1])
            return
        }
        // if no cycle is formed ensues the db as well as the cell in dom is updated
        let val = returnFormulaAnswer(formulaBar.value,true)
        currSelectedCell.innerText = val;
        currSelectedCellMatrix.value =val
        currSelectedCellMatrix.formula = formulaBar.value
        if(currSelectedCellMatrix.children){
            depthFirstUpdate(currSelectedCellMatrix)
        }
    }

}))

// when provided with a valid formula it will return its result
/* PARAMETERS: formula -a valid formula either from formulabar or the on stored in cells db
              : addValues :- if true then adds the current cell's (in adress bar) address to
              each of the cell's children from the formula 
              
              example : current cell address = "A5"
              FORMULA: (C1+10+C3)
              in DB : C1.children.push(A5) // C1 = cellPropertyMatrix[2][0]
                    : C3.children.push(A5) // C3 = cellPropertyMatrix[2][2]
*/
/* RETURN : number */
function returnFormulaAnswer(formula,addValues){
let address = document.querySelector("#addressInput").value
    let val
    let arr = formula.split(/([()+\-*/])/).filter(Boolean);
    arr.shift()
    arr.pop()
for(let x =0;x<arr.length;x++){
 let valueWithinFormula 
    if(arr[x]!="+"&&arr[x]!="-"&&arr[x]!="*"&&arr[x]!="/"){
        if(Number(arr[x])) valueWithinFormula =Number(arr[x])
        else{            
            let [selectedCell,selectedCellMatrix] = getCellAndCellInDB(arr[x])
            valueWithinFormula = selectedCellMatrix.value
          if(addValues)  selectedCellMatrix.children = selectedCellMatrix.children?[...selectedCellMatrix.children,address]:[address]
        }
        if(!val) val=Number(valueWithinFormula)
        else{
            switch(arr[x-1]){
                case "+":
                    val+=Number(valueWithinFormula)
                    break;
                case "-":
                    val-=Number(valueWithinFormula)
                    break;
                case "*":
                    val*=Number(valueWithinFormula)
                    break;
                case "/":
                    val/=Number(valueWithinFormula)
                    val = val.toFixed(2)
                    break;
            }
        }
    }
    }
    return val
}

// updates value of all the children cells of the provided cell in a graph dfs algorithm 
function depthFirstUpdate(selectedCellMatrix){
    if(!selectedCellMatrix.children) return
    else{
        let arr = selectedCellMatrix.children
        for(let x =0;x<arr.length;x++){
            let [currCell,currCellMatrix] =getCellAndCellInDB(arr[x]) 
            if(currCellMatrix.formula){
            let updatedCellValue = returnFormulaAnswer(currCellMatrix.formula,false)
            currCell.innerText = updatedCellValue
            currCellMatrix.value = updatedCellValue
            }
            depthFirstUpdate(currCellMatrix)
        }
    }
}

// finds if a cycle exists in the given cell

/*
PARAMETERS  : selectedCellMatrix:- the cell from the db 
            : cells :- the cells from the formula youwant to compare against
*/
function findIfCycleExists(selectedCellMatrix,cells){    
    if(!selectedCellMatrix.children) return
    else { 
        let arr = selectedCellMatrix.children
        for(let x =0;x<arr.length;x++){
            if(cells.includes(arr[x])) return [true,[arr[x]]]
            let [currCell,currSelectedCellMatrix] = getCellAndCellInDB(arr[x])
           let ans = findIfCycleExists(currSelectedCellMatrix,cells)
           if(ans?.[0]) {
                ans[1].push(arr[x])
                return ans
           }
            
        }
    }

}

// gets the cells(addresses) of the cells from formula and calls the findIfCycleExists function

function formulaBreakDownAndFindIfCycleExists(selectedCellMatrix){
    let arr = formulaBar.value.split(/\s*([\+\-\*/()/])\s*/).filter(Boolean);
let ans = findIfCycleExists(selectedCellMatrix,arr)
return ans
}

// it highlights the cells that form a cycle
// PARAMETER: cells :- consist of an array of cell addresses that is to be highlighted
// eg:- ["A1,B2,C3,D4,A1"]
function highlightTheCellsThatFormACycle(cells){
    cells = cells.reverse()
    let arr =[]
    // highlights and removes highlights of the cell
    /**
     * 
     * @param {*} index : the index of the cell that you want tohighlight or remove highlight of
     * @param {*} shouldAdd :- if add, then adds a bgColor to cells, if remove, then removes the
     *                          bgColor from cells  
     */
    /*
        RETURNS : nothing, but at the end provides a confirm which can restart the whole
                highlighting process
    */
    function addAndRemoveHighLightsUsingSetTimeout(index,shouldAdd){
        // let shouldAdd = shouldAdd
        setTimeout(()=>{
            if(index==cells.length) return
            if(index===cells.length-1){
                arr[index].style.backgroundColor = shouldAdd=="add"?"orange":"transparent"
                if(shouldAdd=="remove"){
                    let response = confirm("cycle will be formed.Do you want to trace it?")
                    if(response){
                        addAndRemoveHighLightsUsingSetTimeout(0,"add")
                        return
                    }
                    else{
                        return
                    }
                }
                addAndRemoveHighLightsUsingSetTimeout(0,"remove")
                
            }
            else {
                arr[index].style.backgroundColor = shouldAdd=="add"?"blue":"transparent"
               shouldAdd=="add"? addAndRemoveHighLightsUsingSetTimeout(index+1,"add"):addAndRemoveHighLightsUsingSetTimeout(index+1,"remove")
            }
        },900)
    }
    for(let x =0;x<cells.length;x++){
        let [currCell,currCellsMatrix] = getCellAndCellInDB(cells[x])
        // currCell.style.backgroundColor ="blue"
        arr.push(currCell)
    }
    addAndRemoveHighLightsUsingSetTimeout(0,"add")

}

function removeParents(formula,address){
    let arr = changeFormulaToIncludeOnlyParentAddresses(formula)
   for(let x =0;x<arr.length;x++){
        let [currCell,currCellMatrix] = getCellAndCellInDB(arr[x])
        let indexToDelete = currCellMatrix.children.findIndex(element=>element===address)
        currCellMatrix.children.splice(indexToDelete,1)
        if(currCellMatrix.children.length==0) delete currCellMatrix.children
    
   }

}



function changeFormulaToIncludeOnlyParentAddresses(formula){
    let newArr = []
    let arr = formula.split(/\s*([\+\-\*/()/])\s*/).filter(Boolean);

    for(let x =0;x<arr.length;x++){
        if(arr[x]==")"||arr[x]=="("||arr[x]=="+"||arr[x]=="-"||arr[x]=="*"||arr[x]=="/"||!isNaN(arr[x]-1) ) continue
        else newArr.push(arr[x])
    }
    return newArr
}