import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export function generateMonthlyReport(profile, logs, month, year) {
  const doc = new jsPDF()
  const monthName = format(new Date(year, month - 1), 'MMMM yyyy', { locale: fr })

  // Header
  doc.setFillColor(13, 27, 42)
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(16, 185, 129)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('PillWay', 14, 22)
  doc.setFontSize(10)
  doc.setTextColor(148, 163, 184)
  doc.text('Le bon médicament, au bon moment', 14, 32)

  // Titre rapport
  doc.setTextColor(13, 27, 42)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(`Rapport mensuel — ${monthName}`, 14, 58)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Patient : ${profile.full_name || profile.email}`, 14, 68)
  doc.text(`Généré le : ${format(new Date(), 'dd/MM/yyyy')}`, 14, 75)

  // Statistiques globales
  const totalPrises = logs.length
  const prises = logs.filter(l => l.status === 'taken').length
  const manquees = logs.filter(l => l.status === 'missed').length
  const ignorees = logs.filter(l => l.status === 'skipped').length
  const taux = totalPrises > 0 ? Math.round((prises / totalPrises) * 100) : 0

  autoTable(doc, {
    startY: 85,
    head: [['Statistique', 'Valeur']],
    body: [
      ['Total de prises prévues', totalPrises],
      ['Prises effectuées', `${prises} (${taux}%)`],
      ['Prises manquées', manquees],
      ['Prises ignorées', ignorees],
    ],
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 10, cellPadding: 4 },
  })

  // Tableau détaillé
  const tableData = logs.map(l => [
    format(new Date(l.scheduled_at), 'dd/MM HH:mm'),
    l.medications?.name || '—',
    l.medications?.dosage || '—',
    {
      taken: 'Prise',
      missed: 'Manquée',
      skipped: 'Ignorée',
      pending: 'En attente',
    }[l.status] || l.status,
    l.taken_at ? format(new Date(l.taken_at), 'HH:mm') : '—',
  ])

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Date & heure', 'Médicament', 'Dosage', 'Statut', 'Prise à']],
    body: tableData,
    headStyles: { fillColor: [13, 27, 42], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 9, cellPadding: 3 },
  })

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(`PillWay · Rapport confidentiel · Page ${i}/${pageCount}`, 14, 290)
  }

  return doc
}
