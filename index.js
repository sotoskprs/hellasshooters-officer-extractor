const officersEntireTab = document.getElementById("tab3")

let atOfficers = false

// Define our mutations observer
const mutationObserver = new MutationObserver(function (mutations) {
    if (officersEntireTab) {
        atOfficers = true

        console.log("Here are the officers!");

        delay(1000).then(() => {
            const officersTable = document.getElementById("clubOfficersTable")
            const officersTitlebar = document.getElementById("clubOfficersAndRequests").querySelector(".portlet-title")
            const officerRows = officersTable.querySelectorAll("tbody tr")

            const copyButton = document.createElement('button')
            copyButton.setAttribute('id', 'kprs-copy-data-btn')

            console.log(officersTitlebar);

            if (!officersTitlebar.querySelector("#kprs-copy-data-btn")) {
                officersTitlebar.append(copyButton)
                copyButton.innerText = 'Copy officers'
                copyButton.style.float = 'right'
                copyButton.setAttribute("onclick", "document.getElementById('kprs-modal-parent').style.display = 'flex'")
            }

            const stracturedData = extractData(officerRows)
            // console.log(stracturedData);

            if (!document.getElementById("kprs-officers-data-table")) {
                const dataTable = document.createElement("table")
                dataTable.setAttribute("id", "kprs-officers-data-table")

                document.getElementById("kprs-modal-inner").append(dataTable)
            }
            const dataTable = document.getElementById("kprs-officers-data-table")
            displayData(stracturedData, dataTable)

            // console.log("officersTable", officersTable);
        })
    } else {
        atOfficers = false
    }
});


/**
 * 
 * @param {NodeList} nodeList - The list of nodes that contains the officers
 * @returns {Array.{}}
 */
function extractData(nodeList) {
    return [...nodeList].map((el) => {
        let tempData = [...el.querySelectorAll("td")][1].innerHTML.trim().replace("&nbsp;", " ")

        const dataParts = tempData.split("(")

        return {
            name: dataParts[0].trim(),
            club: `(${dataParts[1]}`.trim()
        }
    })
}


/**
 * Display the data to a Table
 * @param {Array} HTMLcollection 
 * @param {Node} el
 */
function displayData(HTMLcollection, el) {

    console.log("displayData")

    if (!el.childNodes.length) {
        const officersTbody = el.appendChild(document.createElement("tbody"))

        let csvData = ''

        // Construct the table rows
        HTMLcollection.map((officer) => {
            // officersTbody.innerHTML += tableRow(officer)
            csvData += `${officer.name}\t${officer.club}\r\n`
        })

        // <hr>
        officersTbody.parentNode.parentNode.innerHTML += `
        <textarea rows="10" cols="100">${csvData}</textarea>`
    }

    // document.getElementById("kprs-modal-parent").style.display = "flex"
}


/**
 * Constructs data table rows
 * @param {Object} officer 
 */
function tableRow(officer) {
    return `
    <tr>
        <td>${officer.name}</td>
        <td>${officer.club}</td>
    </tr>`
}


// Add HTML stracture
function createBaseHTML() {
    const modalParent = document.createElement("div")
    const modalInner = document.createElement("div")
    const closeModal = document.createElement("button")

    modalParent.setAttribute("id", "kprs-modal-parent")
    modalInner.setAttribute("id", "kprs-modal-inner")
    closeModal.setAttribute("id", "kprs-modal-close-btn")
    closeModal.setAttribute("onclick", "document.getElementById('kprs-modal-parent').style.display = 'none'")


    document.body.append(modalParent)
    modalParent.append(modalInner)
    modalInner.append(closeModal)
    closeModal.innerHTML = `x`

    modalParent.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,0.7);
    z-index: 10000;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: scroll;`

    modalInner.style.cssText = `
    position: relative;
    padding: 50px;
    display: flex;
    background: white;
    flex-direction: column;`

    closeModal.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 0px 6px 3px;
    font-size: 24px;
    cursor: pointer;
    line-height: 24px
    `

    // closeModal.onclick = () => {
    //     modalParent.style.display = 'none'
    // }

    // modalParent.onclick = (event) => {
    // event.stopPropagation()
    // event.cancelBubble = true 
    // console.log("overlay clicked")
    // modalParent.style.display = 'none'
    // }

    return true
}


(function () {
    createBaseHTML()

    mutationObserver.observe(officersEntireTab, {
        attributes: true
    })
})();


/**
 * 
 * @param {Number} time 
 * @returns {Promise}
 */
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}