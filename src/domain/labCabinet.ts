export type LabCabinetArea = 'kueche' | 'bastelkiste' | 'zimmer' | 'bad' | 'keller' | 'anderswo'

export type QuantityStatus = 'leer' | 'wenig' | 'genug' | 'viel'

export type MaterialType =
  'lebensmittel' | 'bastelmaterial' | 'werkzeug' | 'behaelter' | 'sonstiges'

export interface LabCabinetItem {
  id: string
  profileId: string
  /** Allgemeine Bezeichnung aus dem Missionskatalog, z. B. „Lebensmittelfarbe“. */
  materialName: string
  /** Freiwillige genaue Bezeichnung, z. B. „Dr. Oetker blau“. */
  exactName?: string
  area: LabCabinetArea
  boxName?: string
  quantityStatus: QuantityStatus
  photoDataUrl?: string
  source?: 'katalog' | 'eigen'
  materialType?: MaterialType
  updatedAt: string
}
