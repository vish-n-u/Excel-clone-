let  downloadElem = document.getElementById('download');
downloadElem.addEventListener(("click"),()=>{
    saveTemplateAsFile("shhet1",allSheetsCellPropertiesMatrix[currSelectedSheet])
})

function  saveTemplateAsFile  (filename, dataObjToWrite) {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "application/json" });
    const link = document.createElement("a");

    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove()
};



let uploadElem = document.getElementById('upload')
    uploadElem.addEventListener('click', function() {
        let inputVal = document.createElement("input")
        inputVal.setAttribute("type","file")
        inputVal.click()
        
        inputVal.addEventListener("change",()=>{
            var fr=new FileReader();
            let files = inputVal.files
            let filesObj = files[0]
            fr.readAsText(filesObj)
            fr.addEventListener("load",(e)=>{
                sheetIconClick(JSON.parse(fr.result))
            })
        }) 
        
        })