(() => {
    const cont = document.querySelector('[data-container]')
    const cyphrKey = document.querySelector('[data-key]')
    const message = document.querySelector('[data-input]')
    const output = document.querySelector('[data-output]')
    const cyphrOutput = document.querySelector('[data-cyphr-output]')
    const outputCard = document.querySelector('[data-output-card]')
    const btnCyphr = document.querySelector('[data-cyphr]')
    const btnCopy = document.querySelector('[data-copy]')
    const tableCont = document.querySelector('[data-table]')
    const tableContSec = document.querySelector('[data-table-sec]')
    const cyphrOrder = document.querySelector('[data-cyphr-order]')
    const tableOrder = document.querySelector('[data-table-order]')

    // disable button if input is empty or key is empty
    const disableBtn = () => {
        btnCyphr.disabled = message.value.length === 0 || cyphrKey.value.length === 0
    }
    disableBtn()
    message.addEventListener('input', disableBtn)
    cyphrKey.addEventListener('input', disableBtn)

    // onClick cypher button
    btnCyphr.addEventListener('click', () => {
        let k = cyphrKey.value.trim()
        const strKSorted = k.split('').sort().join('');
        cyphrOrder.innerHTML = ""
        tableOrder.innerHTML = ""
        tableCont.innerHTML = ''
        tableContSec.innerHTML = ''
        encode(message.value, cyphrKey.value)
        if (k !== strKSorted) {
            tableOrder.innerHTML += `<option>${k}</option>`
            tableOrder.innerHTML += `<option>${strKSorted}</option>`
            cyphrOrder.innerHTML += `<option>${k}</option>`
            cyphrOrder.innerHTML += `<option>${strKSorted}</option>`

        } else {
            tableOrder.innerHTML += `<option>${k}</option>`
            cyphrOrder.innerHTML += `<option>${k}</option>`
        }
    })

    cyphrOrder.addEventListener('change', (e) => {
        let order = cyphrOrder.value.toString()
        encode(message.value, order)
    })

    // hash map func
    const createHashMap = (rows, key) => {
        const h = {}
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                if (h[key[j]]) {
                    h[key[j]] += rows[i][j]
                } else {
                    h[key[j]] = rows[i][j]
                }
            }
        }
        return h
    }

    const outputEncode = (key, hashMap) => {
        let encodedText = [];
        const columnsNum = key.length
        for (let ch of key) {
            encodedText.push(hashMap[ch]);
        }

        // join the encoded text with spaces
        encodedText = encodedText.join('');
        encodedText = [...encodedText].map((d, i) => (i) % columnsNum == 0 ? ' ' + d : d).join('').trim()

        // output
        output.innerHTML = encodedText
        output.classList.remove('d-none')
        cyphrOutput.innerHTML = encodedText
    }
    function encode(text, key) {
        // throw error if key is not a number
        if (isNaN(cyphrKey.value.trim()) || isNaN(key.trim())) {
            alert('For now we support only numbers as key')
            return
        }

        // alert if key or cyphrKey length is less than 3
        if (cyphrKey.value.trim().length < 2 || key.trim().length < 2) {
            alert('Key must be at least 2 characters long')
            return
        }

        // alert if message is less than 4 characters
        if (message.value.trim().length < 4) {
            alert('Message must be at least 4 characters long')
            return
        }

        outputCard.classList.remove('d-none')
        output.classList.add('d-none')
        btnCyphr.disabled = true

        const strKey = key.toString();

        let columnsNum = key.toString().length;
        text = text.replace(/[^a-zA-Z]/g, '');
        text = text.toUpperCase();

        let rows = [];
        let r = [];
        for (let i = 0; i < text.length; i++) {
            if (r.length < columnsNum) {
                r.push(text[i])
            } else {
                rows.push(r)
                r = []
                r.push(text[i])
            }
        }
        if (r.length > 0) {
            let x = "x".toLocaleUpperCase().repeat(columnsNum - r.length).split('')
            r.push(...x)
            rows.push(r)
        }

        const hashMap = createHashMap(rows, strKey)

        // call createTable function to create the table
        createStepsTable(rows, strKey)

        // on table order change
        tableOrder.value = strKey
        tableOrder.addEventListener('change', () => {
            let order = tableOrder.value.toString()
            let tableRows = []
            for (let ch of order) {
                for (let i = 0; i < hashMap[ch].length; i++) {
                    let row = tableRows[i]
                    if (row) {
                        row.push(hashMap[ch][i])
                    } else {
                        row = [hashMap[ch][i]]
                        tableRows.push(row)
                    }
                    tableRows.splice(i, 1, row)
                }
            }
            createStepsTable(tableRows, order, true)
            let h = createHashMap(tableRows, order)
            outputEncode(order, h)
        })

        //output encode
        outputEncode(strKey, hashMap)
    }

    function createStepsTable(rows, strKey, second = false) {
        const table = document.createElement('table')
        table.classList.add('table')
        table.classList.add('table-bordered')

        // create table header
        const thead = document.createElement('thead')
        const theadRow = document.createElement('tr')
        thead.appendChild(theadRow)

        // create table body
        const tbody = document.createElement('tbody')


        for (const k of strKey) {
            const th = document.createElement('th')
            th.innerHTML = k
            theadRow.appendChild(th)
        }

        for (let i = 0; i < rows.length; i++) {
            let tableRow = document.createElement('tr')
            for (let j = 0; j < rows[i].length; j++) {
                let tableData = document.createElement('td')
                tableData.innerHTML = rows[i][j]
                tableRow.appendChild(tableData)
            }
            tbody.appendChild(tableRow)
        }
        table.appendChild(thead)
        table.appendChild(tbody)

        const copyTableBtn = document.createElement('button')
        copyTableBtn.classList.add('btn')
        copyTableBtn.classList.add('btn-info')
        copyTableBtn.classList.add('rounded-pill')
        copyTableBtn.classList.add('py-2')
        copyTableBtn.innerHTML = 'Copy table'

        const div = document.createElement('div')
        const p = document.createElement('p')
        p.classList.add('text-muted')
        p.classList.add('fs-6')
        p.classList.add('fw-bold')
        p.classList.add('my-2')



        div.classList.add('my-2')
        div.classList.add('text-end')
        div.appendChild(copyTableBtn)
        if (second) {
            tableContSec.innerHTML = ''
            p.innerHTML = 'Step 2'
            tableContSec.appendChild(p)
            tableContSec.appendChild(div)
            tableContSec.appendChild(table)
        } else {
            tableCont.innerHTML = ''
            p.innerHTML = 'Step 1'
            tableCont.appendChild(p)
            tableCont.appendChild(div)
            tableCont.appendChild(table)
        }

        // copy table to clipboard on click
        copyTableBtn.addEventListener('click', () => {
            const tbl = copyTableBtn.parentElement.nextElementSibling
            // create a Range object
            var range = document.createRange()
            range.selectNode(tbl)
            window.getSelection().addRange(range)
            document.execCommand('copy')

            copyTableBtn.innerHTML = 'Copied! 📋'
            copyTableBtn.classList.remove('btn-info')
            copyTableBtn.classList.add('btn-success')
            copyTableBtn.disabled = true
            setTimeout(() => {
                window.getSelection().removeAllRanges()
                copyTableBtn.innerHTML = 'Copy table'
                copyTableBtn.classList.remove('btn-success')
                copyTableBtn.classList.add('btn-info')
                copyTableBtn.disabled = false
            }, 2000)
        })
    }

    btnCopy.addEventListener('click', () => {
        copyToClipboard(cyphrOutput.value)
        btnCopy.innerHTML = 'Copied! 📋'
        btnCopy.classList.remove('btn-info')
        btnCopy.classList.add('btn-success')
        btnCopy.disabled = true
        setTimeout(() => {
            btnCopy.innerHTML = 'Copy cyphr'
            btnCopy.classList.remove('btn-success')
            btnCopy.classList.add('btn-info')
            btnCopy.disabled = false
        }, 2000)
    })

    // copy to clipboard function using navigator.clipboard
    function copyToClipboard(copy) {
        navigator.clipboard.writeText(copy)
    }
})();
