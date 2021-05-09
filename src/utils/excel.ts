import XLSX, { WorkSheet, BookType } from 'xlsx'

function autoWidth(ws: WorkSheet, data: any[][]) {
  /* set worksheet max width per col*/
  const colWidth = data.map(row =>
    row.map(val => {
      /* if null/undefined*/
      if (val == null) {
        return { wch: 10 }
      } else if (val.toString().charCodeAt(0) > 255) {
        /* if chinese*/
        return { wch: val.toString().length * 2 }
      }
      return { wch: val.toString().length }
    })
  )
  /* start in the first row*/
  const result = colWidth[0]
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j].wch < colWidth[i][j].wch) {
        result[j].wch = colWidth[i][j].wch
      }
    }
  }
  ws['!cols'] = result
}

function jsonToArray(key: any[], jsonData: any[]) {
  return jsonData.map(v =>
    key.map(j => {
      return v[j]
    })
  )
}

type ExportJsonToExcelType = {
  data: any[]
  key: string[]
  title: string
  filename: string
  isAutoWidth?: boolean
  bookType?: BookType
}

export const exportJsonToExcel = ({
  data,
  key,
  title,
  filename,
  isAutoWidth,
  bookType
}: ExportJsonToExcelType) => {
  const wb = XLSX.utils.book_new()
  data.unshift(title)
  const ws = XLSX.utils.json_to_sheet(data, { header: key, skipHeader: true })
  if (isAutoWidth) {
    const arr = jsonToArray(key, data)
    autoWidth(ws, arr)
  }
  XLSX.utils.book_append_sheet(wb, ws, filename)
  XLSX.writeFile(wb, filename + '.' + bookType, {
    bookType
  })
}
