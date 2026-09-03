# Datenschutz- und App-Store-Grundlage

Stand: 2026-09-03. Dieses Dokument hält die verbindlichen Produktentscheidungen für eine spätere
Veröffentlichung fest. Es ersetzt vor der Einreichung keine Prüfung der dann aktuellen
Apple-Vorgaben.

## Ziel und Angebot

- Primäre Zielgruppe: Kinder von 9 bis 11 Jahren; Apple-Kinderkategorie 9–11.
- Erstes Veröffentlichungsgebiet: Schweiz.
- Sprachen: Deutsch (Standard), Englisch, Französisch, Italienisch und Spanisch.
- Geschäftsmodell: kostenloser Einstieg mit zehn vollständigen Missionen (zwei je Kategorie),
  danach einmalig ungefähr CHF 1 als nicht verbrauchbarer In-App-Kauf. Kein Abo, keine Werbung.
- Die bestehende private Familien-Webversion bleibt während der Entwicklung vollständig nutzbar;
  die Bezahlschranke wird erst in der späteren nativen App-Store-Verpackung umgesetzt.

## Daten und Privatsphäre

Crazy Lab speichert Profile, Geburtstage, Tagebuch, Fotos, kurze Videos, Listen, Bewertungen und
eigene Missionen lokal auf dem jeweiligen Gerät. Es gibt derzeit keine Benutzerkonten, Werbung,
Analyse, Tracking oder automatische Cloud-Übertragung. Ein externer Backup-Export und ein
Missionslink entstehen nur nach bewusster Aktion. Der Missionslink enthält keine Profil-ID,
Namen, Fotos oder Tagebuchdaten.

Für die öffentliche Kinder-App gelten zusätzlich:

- externe Links, Missionsfreigabe, Notfall-Backup, Käufe und Wiederherstellen von Käufen liegen
  hinter einer Elternschranke;
- eine verständliche Kindererklärung und die vollständige Datenschutzerklärung sind in der App
  sowie auf einer öffentlichen Support-Seite erreichbar;
- Fotos und Videos verlassen das Gerät nicht, solange Eltern nicht bewusst die Teilen-Funktion
  des Betriebssystems verwenden;
- es werden keine Drittanbieter-Werbe-, Analyse- oder Tracking-Bibliotheken eingebaut;
- Löschen eines Profils und aller zugehörigen Daten wird vor Veröffentlichung angeboten.

## Inhalte und Marken

Der „Blutige Kuschelbär“ bleibt als nicht-grafisches, humorvoll-gruseliges Maskottchen in der App.
Er wird in öffentlichen Screenshots und im App-Symbol nicht hervorgehoben. Die Altersangaben im
App Store werden ehrlich beantwortet; die endgültige Freigabe entscheidet Apple.

PLAYMOBIL ist eine fremde Marke. Obwohl die Familie Originalfiguren besitzt, könnte eine bezahlte
App eine offizielle Verbindung vermuten lassen. Deshalb verwendet die öffentliche Redaktion den
neutralen Begriff „Spielfiguren“. Interne stabile technische IDs bleiben unverändert, damit keine
gespeicherten Daten beschädigt werden.

## Vor der App-Store-Einreichung noch erforderlich

- Apple-Developer-Konto und öffentliche verantwortliche Kontaktadresse festlegen.
- Öffentliche Datenschutz- und Support-URL bereitstellen.
- Native Verpackung, StoreKit-Kauf und Kaufwiederherstellung umsetzen.
- Elternschranke, vollständiges Löschen und altersgerechte Einwilligungen umsetzen.
- App-Privacy-Angaben, Altersfragebogen und Metadaten anhand des fertigen Builds ausfüllen.
- TestFlight-, Geräte-, Barrierefreiheits- und Store-Review durchführen.
