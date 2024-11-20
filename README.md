| **Projektbezeichnung** | MBot-Controller                                 |
|-------------------------|------------------------------------------------|
| **Projektteam**         | Tobias Haas, Patrick Thor, Stefan Rautner      |
| **Erstellt am**         | 27.05.2024                                     |
| **Letzte Änderung am**  | 08.06.2024                                     |
| **Status**              | Fertig                                         |
| **Aktuelle Version**    | 1.4                                            |


 

# Änderungsverlauf

| Nr. | Datum      | Version | Geänderte Kapitel  | Art der Änderung | Autor          |
|-----|------------|---------|--------------------|------------------|----------------|
| 1   | 27.05.2024 | 1.0     | Alle               | Erstellung       | Stefan Rautner |
| 2   | 28.05.2024 | 1.1     | 5.1, 5.2           | Ergänzung        | Stefan Rautner |
| 3   | 05.06.2024 | 1.2     | 5                  | Ergänzung        | Stefan Rautner |
| 4   | 07.06.2024 | 1.3     | 1, 2, 3, 4, 5      | Ergänzung        | Stefan Rautner |
| 5   | 08.06.2024 | 1.4     | 5, 6, 7, 8         | Ergänzung        | Stefan Rautner |


# Inhalt

1. [Allgemeines / Projektübersicht](#1-allgemeines--projektübersicht)<br>
   1.1 [Projektbeschreibung](#11-projektbeschreibung)<br>
   1.2 [Projektteam und Schnittstellen](#12-projektteam-und-schnittstellen)

2. [Funktionale Anforderungen](#2-funktionale-anforderungen)<br>
   2.1 [Use Cases](#21-use-cases)<br>
   2.1.1 [Download Webapp](#211-download-webapp)<br>
   2.1.2 [Download MBot-Script](#212-download-mbot-script)<br>
   2.1.3 [Download & Start Zwischenserver](#213-download--start-zwischenserver)<br>
   2.1.4 [Steuerung des MBot](#214-steuerung-des-mbot)<br>
   2.1.5 [LineFollower](#215-linefollower)<br>
   2.1.6 [SuicidePrevention](#216-suicideprevention)<br>
   2.1.7 [Ambientebeleuchtung](#217-ambientebeleuchtung)<br>
   2.1.8 [DinoGame](#218-dinogame)

3. [Nichtfunktionale Anforderungen](#3-nichtfunktionale-anforderungen)

4. [Projektplanung](#4-projektplanung)<br>
   4.1 [Variantenbildung](#41-variantenbildung)<br>
   4.2 [Machbarkeitsstudie](#42-machbarkeitsstudie)<br>
   4.3 [Allgemeine Planungsinformationen](#43-allgemeine-planungsinformationen)<br>
   4.4 [Projektumfeldanalyse](#44-projektumfeldanalyse)

5. [Softwarearchitektur](#5-softwarearchitektur)<br>
   5.1 [Aktivitätsdiagramme](#51-aktivitätsdiagramme)<br>
   5.1.1 [MBot suchen & verbinden](#511-mbot-suchen--verbinden)<br>
   5.1.2 [Daten an den MBot senden & Sensordaten vom MBot erhalten](#512-daten-an-den-mbot-senden--sensordaten-vom-mbot-erhalten)<br>
   5.1.3 [Von dem MBot trennen](#513-von-dem-mbot-trennen)<br>
   5.1.4 [Webapp schließen](#514-webapp-schließen)<br>
   5.2 [Sequenzdiagramme](#52-sequenzdiagramme)<br>
   5.2.1 [Sequenzdiagramm MBot verbinden](#521-sequenzdiagramm-mbot-verbinden)<br>
   5.2.2 [Sequenzdiagramm Daten senden](#522-sequenzdiagramm-daten-senden)<br>
   5.2.3 [Sequenzdiagramm Disconnect](#523-sequenzdiagramm-disconnect)<br>
   5.2.4 [Sequenzdiagramm Close](#524-sequenzdiagramm-close)<br>
   5.3 [Komponentendiagramme](#53-komponentendiagramme)<br>
   5.4 [Verteilungsdiagramme](#54-verteilungsdiagramme)<br>
   5.5 [Softwarekomponenten / Programme](#55-softwarekomponenten--programme)<br>
   5.5.1 [SW Programme](#551-sw-programme)<br>
   5.5.2 [SW Komponenten](#552-sw-komponenten)

6. [Projektdurchführung](#6-projektdurchführung)<br>
   6.1 [Sprint 1](#61-sprint-1)<br>
   6.1.1 [Sprintplanung](#611-sprintplanung)<br>
   6.1.2 [Sprint Demo](#612-sprint-demo)<br>
   6.1.3 [Sprint Retrospektive](#613-sprint-retrospektive)<br>
   6.1.4 [Sprint Zusammenfassung](#614-sprint-zusammenfassung)<br>
   6.2 [Sprint 2](#62-sprint-2)<br>
   6.2.1 [Sprintplanung](#621-sprintplanung)<br>
   6.2.2 [Sprint Demo](#622-sprint-demo)<br>
   6.2.3 [Sprint Retrospektive](#623-sprint-retrospektive)<br>
   6.2.4 [Sprint Zusammenfassung](#624-sprint-zusammenfassung)<br>
   6.3 [Sprint 3](#63-sprint-3)<br>
   6.3.1 [Sprintplanung](#631-sprintplanung)<br>
   6.3.2 [Sprint Demo](#632-sprint-demo)<br>
   6.3.3 [Sprint Retrospektive](#633-sprint-retrospektive)<br>
   6.3.4 [Sprint Zusammenfassung](#634-sprint-zusammenfassung)<br>
   6.4 [Sprint 4](#64-sprint-4)<br>
   6.4.1 [Sprintplanung](#641-sprintplanung)<br>
   6.4.2 [Sprint Demo](#642-sprint-demo)<br>
   6.4.3 [Sprint Retrospektive](#643-sprint-retrospektive)<br>
   6.4.4 [Sprint Zusammenfassung](#644-sprint-zusammenfassung)<br>
   6.5 [Sprint 5](#65-sprint-5)<br>
   6.5.1 [Sprintplanung](#651-sprintplanung)<br>
   6.5.2 [Sprint Demo](#652-sprint-demo)<br>
   6.5.3 [Sprint Retrospektive](#653-sprint-retrospektive)<br>
   6.5.4 [Sprint Zusammenfassung](#654-sprint-zusammenfassung)

7. [Installation / Software deployment](#7-installation--software-deployment)

8. [Projektabschluss](#8-projektabschluss)<br>
   8.1 [Projektzusammenfassung](#81-projektzusammenfassung)<br>
   8.2 [Attachments](#82-attachments)



# 1. Allgemeines / Projektübersicht
## 1.1 Projektbeschreibung
Das Projekt zielt darauf ab, eine Anwendung zur Fernsteuerung eines MBot2s zu entwickeln, die sowohl auf Computern als auch auf mobilen Geräten (Handys, Tablets, …) funktioniert. Der MBot2 ist mit diversen Sensoren und Aktoren ausgestattet und wird über MicroPython programmiert. Die Anwendung ermöglicht die automatische Netzwerkverbindung, zeigt Sensordaten an und erlaubt das Verarbeiten von Steuerbefehlen wie Bewegungsrichtung und Geschwindigkeit. Ein Sicherheitsmodus verhindert Kollisionen und einen Linienfolgemodus zum automatischen Folgen einer Linie. Das Projekt wird dem agilen Projektmanagement SCRUM durchgeführt. Die Projektlaufzeit ist vom 10. Januar 2024 bis zum 12. Juni 2024.

## 1.2 Projektteam und Schnittstellen
| Rolle(n)           | Name             | Telefon | E-Mail                              | Team    |
|--------------------|------------------|---------|-------------------------------------|---------|
| Frontend Developer | Tobias Haas      | Privat  | Tobias.haas@htl-saalfelden.at       | Group05 |
| 3D-Designer        | Patrick Thor     | Privat  | Patrick.thor@htl-saalfelden.at      | Group05 |
| Backend Developer  | Stefan Rautner   | Privat  | Stefan.rautner@htl-saalfelden.at    | Group05 |

# 2. Funktionale Anforderungen
## 2.1 Use Cases
### 2.1.1 Download Webapp
 
- Akteur: Benutzer<br>
- Vorbedingung: Benutzer muss funktionierenden Internetzugang und Zugang zur Webapp haben<br>
- Beschreibung: Der Benutzer drückt auf den „Download“-Button auf der Webapp (Home-Screen, relativ weit unten) und der Download startet automatisch, nachdem dieser Abgeschlossen ist, muss der User in dem erscheinenden Dialog (rechts oben am Bildschirm) auf „Installieren“ klicken um die Webapp zu Installieren.<br>
- Ergebnis: Die Webapp ist wie eine native App auf dem Gerät des Users installiert und kann ohne Internetzugriff verwendet werden (für die Steuerung des MBot muss aber trotzdem eine Internetverbindung hergestellt werden).

### 2.1.2 Download MBot-Script
 
- Akteur: Benutzer<br>
- Vorbedingung: Benutzer muss funktionierenden Internetzugang und Zugang zur Webapp haben.<br>
- Beschreibung: Der Benutzer drückt in dem Text auf das markierte „HIER (Home-Screen, ganz unten), danach startet der Download automatisch.<br>
- Ergebnis: Das MBot-Skript ist heruntergeladen und kann jetzt vom Benutzer weiter entwickelt/verwendet werden.

### 2.1.3 Download & Start Zwischenserver
 
- Akteur: Benutzer<br>
- Vorbedingung: Benutzer muss funktionierenden Internetzugang und Zugang zur Webapp haben.<br>
- Beschreibung: Der Benutzer öffnet den Tab „Controller“ in der Navigationsleiste der Webapp, dadurch wird der Zwischenserver (falls das aufrufende Gerät ein PC ist, wenn nicht, dann erscheint ein Dialog) automatisch heruntergeladen. Der Zwischenserver muss danach vom Benutzer manuell ausgeführt werden. Der Zwischenserver lädt sich automatisch die benötigten Module herunter und installiert diese, sodass der Zwischenserver funktionsfähig ist.<br>
- Ergebnis: Der Zwischenserver ist gestartet und wartet auf Befehle von Webapp und MBot.

### 2.1.4 Steuerung des MBot
 
- Akteur: Benutzer<br>
- Vorbedingung: Benutzer muss funktionierenden Internetzugang und Zugang zur Webapp haben, außerdem muss Python installiert sein.<br>
- Beschreibung: Der Benutzer öffnet den Tab „Controller“ in der Navigationsleiste, danach muss der heruntergeladene Zwischenserver gestartet werden und die Checkbox „Zwischenserver gestartet“ angekreuzt werden. Jetzt muss der gewünschte MBot ausgewählt werden, danach kann man diesen Steuern.<br>
- Ergebnis: Der Benutzer kann den MBot mit Hilfe des Zwischenservers über die Webapp steuern.

### 2.1.5 LineFollower
 
- Akteur: Benutzer<br>
- Vorbedingung: Benutzer muss funktionierenden Internetzugang und Zugang zur Webapp haben und mit einem MBot verbunden sein.<br>
- Beschreibung: Der Benutzer kreuzt die Checkbox „LineFollower“ an, dadurch wird von dem System die Steuerung übernommen.<br>
- Ergebnis: Der Benutzer hat die Funktione LineFollower auf dem MBot gestartet.

### 2.1.6 SuicidePrevention
 
- Akteur: Benutzer<br>
- Vorbedingung: Benutzer muss funktionierenden Internetzugang und Zugang zur Webapp haben und mit einem MBot verbunden sein.<br>
- Beschreibung: Der Benutzer kreuzt die Checkbox „SuicidePrevention“ an, dadurch stoppt der MBot automatisch vor Hindernissen.<br>
- Ergebnis: Der Benutzer hat die SuicidePrevention auf dem MBot gestartet.

### 2.1.7 Ambientebeleuchtung
 
- Akteur: Benutzer<br>
- Vorbedingung: Benutzer muss funktionierenden Internetzugang und Zugang zur Webapp haben und mit einem MBot verbunden sein.<br>
- Beschreibung: Der Benutzer kreuzt wählt in den 5 ColorPickern (unten bei Steuerungen Mitte) die jeweils gewünschte Farbe aus.<br>
- Ergebnis: Wenn der MBot stillsteht, ändern sich die Farben der 5 LEDs automatisch nach den Benutzereingaben.

### 2.1.8 DinoGame
 
- Akteur: Benutzer<br>
- Vorbedingung: Benutzer muss funktionierenden Internetzugang und Zugang zur Webapp haben.<br>
- Beschreibung: Der Benutzer öffnet in der Navigationsleiste den Tab „Dino-Game“ und kann dort eine abgespeckte Version des originalen Dino-Games von Google spielen.<br>
- Ergebnis: Der Benutzer kann das Dino-Game spielen.

# 3. Nichtfunktionale Anforderungen
Benutzer benötigt einen PC<br>
Benutzer benötigt einen Browser<br>
Benutzer benötigt eine funktionierende Internetverbindung

Verwendetes Betriebssystem: Windows 11 64-bit<br>
Verwendete IDEs: PyCharm Version 2024.1.1 & Mblock Version 5.4.3

# 4. Projektplanung
Webapp in den Sprachen HTML, CSS & JS<br>
Zwischenserver in der Sprache Python<br>
MBot in der Sprache Micropython<br>
Unterstützung für alle Geräte & Betriebssysteme (benötigt aber PC für Zwischenserver)


## 4.1 Variantenbildung
Mit einem Zwischenserver in Spring-Boot (verworfen, weil größeres Framework).<br>
In einem Docker-Container (verworfen, schwerer zu bedienen).<br>
Mit einem Zwischenserver in Python (ausgeführt, benötigt nur Python, installiert Module automatisch, sehr benutzerfreundlich).<br>
Ohne Zwischenserver durch WebSocket (verworfen, MBot keine WebSocket Unterstützung)<br>
Ohne Zwischenserver durch UDP (verworfen, UDP im Web nicht möglich)<br>
Ohne Zwischenserver durch TCP (verworfen, TCP im Web nicht möglich)

## 4.2 Machbarkeitsstudie
Zwischenserver in Python (Unterstützung für WebSockets und UDP & TCP im lokalen Netzwerk)<br>
MBot mit UDP & TCP Sockets verbinden (UDP wegen Broadcast, TCP weil sicherer)

## 4.3 Allgemeine Planungsinformationen
Aufteilung:<br>
Tobias Haas: grafische Oberfläche & Dino-Game<br>
Patrick Thor: 3D-Model erstellen & anzeigen<br>
Stefan Rautner: Programmierung, GitHub & Dokumentation

## 4.4 Projektumfeldanalyse
Es gibt schon vergleichbare Produkte auf dem Markt (in Form einer Fernsteuerung für einen Roboter) aber noch nicht für den MBot2. Es wird aber in nächster Zukunft mehrere geben, da die anderen Gruppen in unserer Klasse den gleichen Projektauftrag erhalten haben. Die Stakeholder des Projekts sind unsere Professoren Herr Falkensteiner & Herr Eigner.

# 5. Softwarearchitektur
Komponenten: Webapp, Zwischenserver & MBot<br>
Verteiltes System, das auf einem Gerät die von GitHub-Pages gehostete Webapp besucht, auf dem gleichen oder anderen PC muss der Zwischenserver gehostet werden (wird von der Webapp auto gedownloaded), wenn die Steuerung über ein Mobilgerät erfolgt, dann Zwischenserver auf PC und Webapp-Aufruf auf Mobilgerät und MBot Skript local auf dem MBot.<br>
Die Webapp und der MBot kommunizieren über den Zwischenserver miteinander.<br>
Der Zwischenserver erstellt einen UDP-Socket der nach der Broadcastnachricht des MBot sucht.<br>
Die Webapp gibt dem Zwischenserver den Befehl nach MBot-Broadcastnachrichten zu suchen.<br>
Wenn die Broadcastnachricht des MBot gefunden wurde, dann verbindet sich der Zwischenserver durch einen TCP-Socket mit dem MBot für durchgehende Kommunikation.

## 5.1 Aktivitätsdiagramme
### 5.1.1 MBot suchen & verbinden
Webapp sendet Befehl zum MBots suchen, Zwischenserver sucht über den UDP-Socket nach der Broadcastnachricht „MBot2-Group05_4AHINF“. Alle gefundenen MBots werden an die Webapp zurückgegeben, dort wählt der Benutzer einen MBot aus. Die Adresse des MBot wird automatisch an den Zwischenserver gesendet und dieser verbindet sich dadurch automatisch mit dem TCP-Socket des MBot. Dieser schließt danach den UDP-Socket.

### 5.1.2 Daten an den MBot senden & Sensordaten vom MBot erhalten
Webapp sendet Steuerbefehl an Zwischenserver, dieser leitet den Befehl an den MBot weiter. Dort werden die Daten verarbeitet (SuicidePrevention, Ambientebeleuchtung, …) und die Sensordaten ausgelesen. Die Sensordaten werden dann an den Zwischenserver gesendet, dieser Sendet die Daten dann an die Webapp weiter. Dort werden die Sensordaten verarbeitet und dem Benutzer angezeigt.

### 5.1.3 Von dem MBot Trennen
Die Webapp sendet den Disconnect Befehl an den Zwischenserver, dieser sendet darauf den „Disconnect“-Befehl an den MBot und schließt die Verbindung zum TCP-Socket. Der MBot „restartet“ dadurch sein Skript und bereitet sich für die nächste Verbindung vor.

### 5.1.4 Webapp schließen
Der Benutzer schließt die Webapp, dadurch sendet wird der „Close“-Befehl an den Zwischenserver gesendet. Der Zwischenserver sendet darauf den „Disconnect“-Befehl an den MBot und trennt den TCP-Socket & schließt den WebSocket. Der MBot „restartet“ dadurch sein Skript und bereitet sich für die nächste Verbindung vor.

## 5.2 Sequenzdiagramme
### 5.2.1 Sequenzdiagramm MBot Verbinden
Die Webapp sendet einen Search Befehl an den MBot, dieser sucht dann über einen UDP-Socket nach dem Broadcast „MBot2-Group05_4AHINF“ und gibt dann die gefundenen MBots zurück. Dort wird dann ein MBot ausgewählt und dessen Adresse an den Zwischenserver gesendet. Der Zwischenserver verbindet sich jetzt über diese Adresse mit dem TCP-Socket des MBot.

### 5.2.2 Sequenzdiagramm Daten Senden
Die WebApp verarbeitet Benutzerdaten und sendet diese dann an den Zwischenserver weiter, dieser sendet die Daten sofort über den TCP-Socket an den MBot weiter. Der MBot verarbeitet die erhaltenen Daten (stellt dadurch die Ambientebeleuchtung, SuicidePrevention, … ein), liest die Sensordaten aus und sendet diese dann zurück an den Zwischenserver. Der Zwischenserver sendet diese Daten dann über den WebSocket an die Webapp weiter. Dieser Kreislauf wiederholt sich automatisch unendlich, bis der Benutzer den MBot trennt oder die Webapp schließt.

### 5.2.3 Sequenzdiagramm Disconnect
Der Benutzer sendet den „Disconnect“-Befehl an den Zwischenserver, dieser sendet dann eine „Disconnect“-Nachricht an den MBot und schließt die TCP-Socket Verbindung zum MBot. Der MBot startet dann sein Skript neu.

### 5.2.4 Sequenzdiagramm Close
Der Benutzer sendet den „Close“-Befehl an den Zwischenserver, dieser sendet dann eine „disconnect“-Nachricht an den MBot und schließt die TCP-Socket Verbindung zum MBot und den WebSocket. Der MBot startet dann sein Skript neu.

## 5.3 Komponentendiagramme
```mermaid
graph TD
    A[<<component>> mBot]
    B[<<component>> Zwischenserver]
    C[<<component>> WebApp]

    A -->|Sendet Sensordaten| B
    B -->|Leitet Sensordaten weiter| C
    C -->|Sendet Befehle| B
    B -->|Leitet Befehlsdaten weiter| A

    B -->|Hört auf Broadcast von mBot| A
    B -->|Sendet mögliche mBots zu mBot| A

    A:::mbot
    B:::zwischenserver
    C:::webapp

    style A fill:#fff,stroke:#000,stroke-width:1px
    style B fill:#fff,stroke:#000,stroke-width:1px
    style C fill:#fff,stroke:#000,stroke-width:1px
```
 
## 5.4 Verteilungsdiagramme
```mermaid
graph TD
    subgraph WebApp
        A[Benutzereingabe]
        B[Verarbeitet Sensordaten]
        C[Sendet Befehle]
        A --> B --> C
    end

    subgraph Zwischenserver
        D[System Zwischenserver]
    end

    subgraph MBot
        E[Sendet Sensordaten]
        F[Empfängt und verarbeitet Befehlsdaten]
        E --> F
    end

    C -->|WebSocket: 0.0.0.0:5431| D
    D -->|UDP: 255.255.255.255:4900| E
    D -->|TCP: 10.10.x.x:5431| F
```

## 5.5 Softwarekomponenten / Programme
### 5.5.1 SW Programme
PyCharm, Version: 2024.1.1<br>
MBlock, Version 5.4.3

### 5.5.2 SW Komponenten
Hyper Text Markup Language<br>
Version: HTML 5.2<br>
Hersteller: Sir Timothy John Berners-Lee, World Wide Web Consortium (W3C) & Web Hypertext Application Technology Working Group (WHATWG)<br>
Downloadlink: Kein Download möglich (nur in IDEs)<br>
[Lizenz](https://www.w3.org/2011/03/html-license-options.html) 

Cascading Style Sheets<br>
Version: CSS 3<br>
Hersteller: Hakon Wium Lie & World Wide Web Consortium (W3C)<br>
Downloadlink: Kein Download möglich (nur in IDEs)<br>
[Lizenz](https://www.w3.org/copyright/document-license-2023/)

Javascript (ofizieller Name: ECMA Script)<br>
Version: ECMAScript 2023<br>
Hersteller: Oracle<br>
Downloadlink: Kein Download möglich (nur in IDEs)<br>
[Lizenz](https://docs.oracle.com/cd/E19957-01/816-6152-10/copyrt.html)

Python 3.12<br>
Version: 3.12.3<br>
Hersteller: Python Software Foundation (Guido van Rossum)<br>
[Downloadlink](https://www.microsoft.com/store/productId/9NCVDN91XZQP?ocid=pdpshare)<br>
[Lizenz](https://docs.python.org/3/license.html) 

# 6. Projektdurchführung
## 6.1 Sprint 1
### 6.1.1 Sprintplanung
Dauer: 07.02.2024 – 28.02.2024<br>

Ausgewählte User Stories:<br>

Bearbeiter: Stefan Rautner<br>
ID: 6<br>
Name: Automatische Verbindung zum WLAN nachdem MBot eingeschalten wurde<br>

Bearbeiter: Stefan Rautner<br>
ID: 7<br>
Name: Steuerung des MBot vom Client über den Zwischenserver eingeschalten wurde

Bearbeiter: Stefan Rautner<br>
ID: 8<br>
Name: Verbindung der Webapp mit dem MBot über den Zwischenserver
eingeschalten wurde

Bearbeiter: Stefan Rautner<br>
ID: 9<br>
Name: Webapp automatisch mit Zwischenserver verbinden
eingeschalten wurde

Bearbeiter: Stefan Rautner<br>
ID: 10<br>
Name: Implementierung eines LineFollower für den MBot eingeschalten wurde

Bearbeiter: Stefan Rautner<br>
ID: 2<br>
Name: Implementierung einer SuicidePrevention für den MBot
wurde

Bearbeiter: Tobias Haas<br>
ID: 3<br>
Name: Webapp mit mobilen Geräten kompatible machen
eingeschalten wurde

Anzahl geplante Story points: 120<br>
Geschaffte Story points: 45

### 6.1.2 Sprint Demo
Die Eingabemethoden: WASD, Pfeil-Tasten, Touch & Controller sind implementiert worden und funktionieren.<br>
Die Verbindung vom MBot zum WLAN funktioniert.<br>
Implementierung der Steuerung des MBot wurde begonnen, aber nicht abgeschlossen.<br>
Implementierung der Verbindung des MBot wurde begonnen, aber nicht abgeschlossen.<br>
Die Webapp verbindet sich automatisch mit dem Zwischenserver.<br>
Der LineFollower wurde nicht implementiert.<br>
Implementierung der SuicidePrevention wurde begonnen, aber nicht abgeschlossen.<br>
Es wurde begonnen, eine Unterstützung der Webapp für mobile Geräte zu erstellen.

### 6.1.3 Sprint Retrospektive
Da es der Erste Sprint war, hatten wir noch keine Erfahrung, wie viel wir in einem Sprint machen können.<br>
Ich (Stefan Rautner) habe mich in diesem Sprint überschätzt und bin dadurch nur mit ca. 50% meiner Aufgaben fertig geworden.<br>
Das Abschließen der User Story von Tobias Haas ist rein technisch nicht möglich, weil die Grafische Oberfläche im Verlauf der zukünftigen Sprints immer wieder aktualisiert werden wird.

### 6.1.4 Sprint Zusammenfassung
Grundsätzlich ist der Sprint gut gelaufen, aber ich (Stefan Rautner) habe mich sehr übernommen.<br>
Es wurden keine neuen User Stories hinzugefügt.<br>
Es wurden ebenfalls keine User Stories entfernt.
 
Auf Basis dieser Sprint Velocity ist das Projekt früher als erwartet fertig.<br>
Die Durchschnittliche Sprint Velocity beträgt 45.

## 6.2 Sprint 2
### 6.2.1 Sprintplanung
Dauer: 29.02.2024 – 20.03.2024

Ausgewählt User Stories: 

Bearbeiter: Stefan Rautner<br>
ID: 11<br>
Name: MBot mit der Zeit immer schneller fahren lassen

Bearbeiter: Stefan Rautner<br>
ID: 12<br>
Name: Client zeigen, dass MBot mit WLAN verbunden ist

Bearbeiter: Patrick Thor & Stefan Rautner<br>
ID: 13<br>
Name: Ausrichtung des MBot durch 3D-Model mit dessen Gyrodaten auf dem Client anzeigen

Bearbeiter: Tobias Haas<br>
ID: 14<br>
Name: Grafische Oberfläche für die Webapp

Anzahl geplanter User Stories: 31<br>
Geschaffte Story Points: 21

### 6.2.2 Sprint Demo
Der MBot beschleunigt jetzt je länger eine Taste gedrückt wird oder je weiter der Stick des Controllers in eine Richtung gedrückt wird.<br>
Dem Client wird jetzt angezeigt, dass der MBot mit dem WLAN verbunden ist.<br>
Die Webapp beinhält jetzt ein 3D-Model welches abhängig von den Gyrodaten des MBot geupdatet wird.<br>
Die Grafische Oberfläche der Webapp wurde verbessert.

### 6.2.3 Sprint Retrospektive
In diesem Sprint war die Planung der User Stories deutlich besser.<br>
Die User Story von Tobias Haas konnte wie im Letzten Sprint bereits beschrieben nicht abgeschlossen werden, weil die Grafisch Oberfläche in folgenden Sprints sicher noch geändert wird.

### 6.2.4 Sprint Zusammenfassung
Diesmal ist der Sprint besser ausgefallen und wir haben fast alle Arbeitspakete erfolgreich erledigen können.<br>
Es wurde 2 neue Anforderungen hinzugefügt:
- Anzeigen der Farben unter den RGB-Sensoren des MBot während aktivem LineFollower.
- Die 3D-Anzeige des MBots aufgrund seiner Gyrodaten verändern.
Es wurden keine User Stories entfernt.
 
 
Auf Basis dieser Sprint Velocity ist das Projekt später als erwartet fertig.<br>
Die Durchschnittliche Sprint Velocity beträgt jetzt 33.

## 6.3 Sprint 3
### 6.3.1 Sprintplanung
Dauer: 21.03.2024 – 17.04.2024

Ausgewählt User Stories: 

Bearbeiter: Stefan Rautner<br>
ID: 23<br>
Name: Ausführung des Zwischenservers

Bearbeiter: Stefan Rautner<br>
ID: 4<br>
Name: Daten der 4 RGB-Sensoren bei aktiviertem LineFollower an den Client senden

Bearbeiter: Stefan Rautner<br>
ID: 5<br>
Name: Geschwindigkeit des MBot durch dessen Beschleunigungssensors an den Client senden

Bearbeiter: Tobias Haas<br>
ID: 14<br>
Name: Grafische Oberfläche für die Webapp

Anzahl geplanter User Stories: 41<br>
Geschaffte Story Points: 31

### 6.3.2 Sprint Demo
Der Zwischenserver ist jetzt ausführbereit und hat alle benötigten Funktionen für unseren Anwendungsfall.<br>
Die 4 RGB-Sensoren werden jetzt bei aktivem LineFollower ausgelesen und auf der Webapp angezeigt.<br>
Die Geschwindigkeit des MBot wird jetzt ausgelesen und auf der Webapp dargestellt.<br>
Die Grafische Oberfläche der Webapp wurde weiter verbessert.

### 6.3.3 Sprint Retrospektive
In diesem Sprint war die Planung der User Stories relativ gleich wie im Letzten.<br>
Die User Story von Tobias Haas ist wie in den letzten zwei Sprints beschrieben nicht abschließbar, weil die Grafisch Oberfläche in folgenden Sprints sicher noch geändert wird.<br>

### 6.3.4 Sprint Zusammenfassung
Diesmal ist der Sprint besser ausgefallen und wir haben fast alle Arbeitspakete erfolgreich erledigt.<br>
Es wurden keine weiteren User Stories hinzugefügt.<br>
Es wurden die User Stories „Firebase“ entfernt.
 
Auf Basis dieser Sprint Velocity wird das Projekt ca. zum Abgabezeitpunkt fertig.<br>
Die Durchschnittliche Sprint Velocity beträgt jetzt 32,33.

## 6.4 Sprint 4
### 6.4.1 Sprintplanung
Dauer: 18.04.2024 – 15.05.2024

Ausgewählt User Stories: 

Bearbeiter: Stefan Rautner<br>
ID: 20<br>
Name: Ambientebeleuchtung auf MBot durch Client einstellen & einschalten

Bearbeiter: Stefan Rautner<br>
ID: 21<br>
Name: Liniendiagramm mit den Daten der Beschleunigungssensors erstellen

Bearbeiter: Stefan Rautner<br>
ID: 22<br>
Name: Liniendiagramm mit den Daten des Ultraschallsensors erstellen

Bearbeiter: Tobias Haas<br>
ID: 24<br>
Name: Dino-Game implementieren, dass vom Client gespielt werden kann

Anzahl geplanter User Stories: 27<br>
Geschaffte Story Points: 27

### 6.4.2 Sprint Demo
Die Ambientebeleuchtung kann jetzt vom User ausgewählt und geändert werden.<br>
Ebenfalls gibt es jetzt Liniendiagramme um die Daten des Beschleunigungssensors & des Ultraschallsensors (Zeitraum: 5 Sekunden, Abstände zwischen Datenpunkten: 500ms).<br>
Der User kann jetzt das Google Chrome Dino-Game auf der Webapp spielen.

### 6.4.3 Sprint Retrospektive
In diesem Sprint war die Planung der User Stories relativ gleich wie in den Letzten zwei.<br>
Die User Story von Tobias Haas ist wie in den letzten Sprints bereits erwähnt nicht abschließbar, weil die grafisch Oberfläche in folgenden Sprints sicher noch geändert wird.

### 6.4.4 Sprint Zusammenfassung
Diesmal ist der Sprint sehr gut ausgefallen.<br>
Wir haben alle Arbeitspakete erfolgreich abgeschlossen.<br>
Es wurden keine weiteren User Stories hinzugefügt.<br>
Er wurden keine User Stories entfernt.
 
Auf Basis dieser Sprint Velocity wird das Projekt ca. zum Abgabezeitpunkt fertig.<br>
Die Durchschnittliche Sprint Velocity beträgt jetzt 31.

## 6.5 Sprint 5
### 6.5.1 Sprintplanung
Dauer: 16.05.2024 – 12.06.2024

Ausgewählt User Stories: 

Bearbeiter: Tobias Haas<br>
ID: 15<br>
Name: Webapp anschaulich & benutzerfreundlich gestalten

Bearbeiter: Stefan Rautner<br>
ID: 16<br>
Name: MBot Skript ändern, sodass Reset möglich ist

Bearbeiter: Stefan Rautner<br>
ID: 17<br>
Name: Verbindung zu Zwischenserver ändern

Bearbeiter: Stefan Rautner<br>
ID: 18<br>
Name: Dokumentation neu erstellen

Bearbeiter: Stefan Rautner<br>
ID: 25<br>
Name: LineFollower fertig machen

Bearbeiter: Stefan Rautner<br>
ID: 26<br>
Name: Endpräsentation erstellen

Anzahl geplanter User Stories: 77<br>
Geschaffte Story Points: 77

### 6.5.2 Sprint Demo
Die Grafische Oberfläche der Webapp wurde in diesem Sprint endgültig fertig gestellt.<br>
Ebenfalls wurde das Skript des MBot geändert, sodass dieser (wenn er getrennt wird) das Programm neu startet.<br>
Ebenfalls wurde die Verbindung zum Zwischenserver geändert und die Unterstützung für Mobilegeräte hinzugefügt.<br>
Zu guter Letzt wurde die Dokumentation des gesamten Dokuments (Projektdokumentation & 5 Sprintpräsentationen) neu aufgesetzt, der LineFollower fertig implementiert und das MBot Skript neu aufgesetzt.

### 6.5.3 Sprint Retrospektive
In diesem Sprint war die Planung der User Stories relativ gleich wie in den Letzten drei.<br>
Die User Story von Tobias Haas ist wie in den Letzten Sprints angegeben jetzt fertig geworden, weil jetzt keine Erneuerungen mehr dazu kommen.

### 6.5.4 Sprint Zusammenfassung
Diesmal ist der Sprint sehr gut ausgefallen.<br>
Wir haben alle verbleibenden Arbeitspakete erfolgreich abgeschlossen.<br>
Es wurden die User Stories „Dokumentation neu erstellen“, „Endpräsentation erstellen“ und „MBot Skript neu aufsetzen“ hinzugefügt.<br>
Es wurden keine User Stories entfernt. 
 
Auf Basis dieser Sprint Velocity wird das Projekt genau zum Abgabepunkt fertig.<br>
Die Durchschnittliche Sprint Velocity beträgt jetzt 40,2.

# 7. Installation / Software deployment
Windows Store öffnen > Python 3.12 suchen > installieren<br>
JetBrains Website öffnen > PyCharm suchen > herunterladen > .exe ausführen<br>
Visual Studio Website öffnen > VS-Code suchen > herunterladen > .exe ausführen

# 8. Projektabschluss
## 8.1 Projektzusammenfassung
Prinzipiell lief das Projekt gut. Manchmal war die Produktivität eher gering, aber es wurde trotz allem das Projekt erfolgreich fertig gestellt.<br>
Die Arbeitsaufteilung im Team war ehrlich gesagt eher mangelhaft, hauptsächlich aufgrund des Engagements einzelner Teammitglieder.

## 8.2 Attachments
Sprint-Review Präsentationen & die Projektbeschreibung sind in dem Zip-Ordner "Dokumente" zu finden
