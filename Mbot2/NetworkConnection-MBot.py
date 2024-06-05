# Autor: Stefan Rautner
# imports
import _thread
import json
import time
import cyberpi
import network
import usocket


class MBotController:
    # Konstruktor (Sockets initialisieren)
    def __init__(self):
        self.UDP_socket = usocket.socket(usocket.AF_INET, usocket.SOCK_DGRAM)
        self.TCP_socket = usocket.socket(usocket.AF_INET, usocket.SOCK_STREAM)
        self.suicidePreventionThread = _thread.start_new_thread(self.suicidePreventionCheck, ())
        self.suicidePrevention = False
        self.suicideActivated = False

    # "Main" der Klasse
    def start(self):
        try:
            # Benutzer zum Starten auffordern
            cyberpi.console.print("Press A to start")
            while not cyberpi.controller.is_press('a'):
                pass
            cyberpi.console.clear()
            cyberpi.led.on(0, 0, 255)

            # WLAN-Verbindung herstellen
            wifi = network.WLAN(network.STA_IF)
            try:
                wifi.active(True)
                wifi.connect('htljoh-public', 'joh12345')
            except Exception as exception:
                cyberpi.console.clear()
                cyberpi.console.print("Error at initializing Connection to WLAN: " + str(exception))
                cyberpi.led.on(255, 0, 0)
                return None

            # Netzwerk-Variablen initialisieren
            host = ""
            port = 5431

            # Auf Verbindung mit Netzwerk warten
            try:
                while not wifi.isconnected():
                    cyberpi.console.clear()
                    cyberpi.console.print("Getting IP-Address")
                    time.sleep(1)
                cyberpi.led.on(0, 255, 0)
                host = wifi.ifconfig()[0]
                cyberpi.console.clear()
                cyberpi.console.print(host)
                time.sleep(1)
            except Exception as exception:
                cyberpi.console.clear()
                cyberpi.console.print("Error connecting to the network: " + str(exception))
                cyberpi.led.on(255, 0, 0)
                return None

            # TCP-Server erstellen (max. 1 Verbindung)
            try:
                self.TCP_socket.bind((host, port))
                self.TCP_socket.listen(1)
                self.TCP_socket.settimeout(0.1)
            except Exception as exception:
                cyberpi.console.clear()
                cyberpi.console.print("Error creating TCP-Server: " + str(exception))
                cyberpi.led.on(255, 0, 0)
                return None

            # UDP Socket erstellen
            try:
                # UDP-Socket erstellen
                self.UDP_socket.bind((host, port))
            except Exception as exception:
                cyberpi.console.clear()
                cyberpi.console.print("Error creating UDP-Server: " + str(exception))
                cyberpi.led.on(255, 0, 0)
                return None

            # Broadcast senden-Funktion aufrufen
            self.handle_connections()
        except Exception as exception:
            cyberpi.console.clear()
            cyberpi.console.print("Error:", str(exception))
            cyberpi.led.on(255, 0, 0)
            return None

    def suicidePreventionCheck(self):
        while True:
            try:
                if cyberpi.ultrasonic2.get(index=1) <= 20 and self.suicidePrevention:
                    cyberpi.mbot2.turn(180)
                    self.suicideActivated = True
                    time.sleep(4)
                else:
                    self.suicideActivated = False
            except Exception as exception:
                cyberpi.console.clear()
                cyberpi.console.print("Error in SuicidePrevention:", str(exception))
                cyberpi.led.on(255, 0, 0)

    # Funktion um die Verbindung eines Clients mit dem TCP-Socket über den Broadcast des UDP-Sockets herzustellen
    def handle_connections(self):
        while True:
            try:
                # Broadcast senden
                self.UDP_socket.sendto(b"MBot2-Group5_4AHINF", ("255.255.255.255", 1900))

                # Auf Verbindung warten
                connection, address = self.TCP_socket.accept()

                # Wenn Verbindung gefunden/erhalten
                if connection:
                    self.TCP_socket = connection
                    cyberpi.console.clear()
                    cyberpi.console.print("Connected to Controller: ", address)
                    self.UDP_socket.close()
                    self.handle_messages()
                    self.__init__()
                    self.start()
            except OSError:
                time.sleep(1)
            except Exception as exception:
                cyberpi.console.clear()
                cyberpi.console.print("Error at connecting to Client: " + str(exception))
                cyberpi.led.on(255, 0, 0)
                return None

    # Funktion, um TCP-Socket auf eingehende Nachrichten abhören
    def handle_messages(self):
        while True:
            try:
                # Auf Nachricht warten
                message = self.TCP_socket.recv(4096).decode('utf-8')
                if message:
                    # Nachricht verarbeiten-Funktion aufrufen
                    closed = self.handle_message(message, self)
                    if closed:
                        self.TCP_socket.close()
                        cyberpi.console.clear()
                        cyberpi.console.print("Disconnected")
                        time.sleep(5)
                        cyberpi.console.clear()
                        break
                    else:
                        self.send_message(self)
                else:
                    cyberpi.console.print("No message received")
            except OSError:
                cyberpi.console.clear()
                cyberpi.console.print("No message received")
            except Exception as exception:
                cyberpi.console.clear()
                cyberpi.console.print("Error:", str(exception))
                cyberpi.led.on(255, 0, 0)
                return None

    # Statische Funktion zum Verarbeiten der vom TCP-Socket empfangenen Daten
    @staticmethod
    def handle_message(received_message, self):
        try:
            # True returnen, wenn Client sich getrennt hat
            if received_message == "Disconnect":
                return True
            else:
                # Variablen aus JSON extrahieren
                data = json.loads(received_message)

                # Variablen für die Motorengeschwindigkeit
                left = data.get("links", 0)
                right = data.get("rechts", 0)

                # Variablen für die Ambientebeleuchtung
                leftLED = data.get("leftLED", "000000")
                middleLeftLED = data.get("leftMiddleLED", "000000")
                middleLED = data.get("middleLED", "000000")
                middleRightLED = data.get("rightMiddleLED", "000000")
                rightLED = data.get("rightLED", "000000")

                # Variable für die SuicidePrevention
                self.suicidePrevention = data.get("suicidePrevention", False)

                # Motoren Geschwindigkeit setzen
                cyberpi.mbot2.drive_power(left, -right)

                # Farben der Heckleuchte setzen
                if left == 0 and right == 0:
                    # Ambientebeleuchtung
                    cyberpi.led.on(int("0x" + leftLED[:2], 16), int("0x" + leftLED[2:4], 16), int("0x" + leftLED[4:6], 16), id=1)
                    cyberpi.led.on(int("0x" + middleLeftLED[:2], 16), int("0x" + middleLeftLED[2:4], 16), int("0x" + middleLeftLED[:4], 16), id=2)
                    cyberpi.led.on(int("0x" + middleLED[:2], 16), int("0x" + middleLED[2:4], 16), int("0x" + middleLED[4:6], 16), id=3)
                    cyberpi.led.on(int("0x" + middleRightLED[:2], 16), int("0x" + middleRightLED[2:4], 16), int("0x" + middleRightLED[4:6], 16), id=4)
                    cyberpi.led.on(int("0x" + rightLED[:2], 16), int("0x" + rightLED[2:4], 16), int("0x" + rightLED[4:6], 16), id=5)
                elif left == right and right > 0:
                    # Vorwärts fahren
                    cyberpi.led.on(255, 0, 0, id=1)
                    cyberpi.led.on(255, 255, 255, id=2)
                    cyberpi.led.on(255, 255, 255, id=3)
                    cyberpi.led.on(255, 255, 255, id=4)
                    cyberpi.led.on(255, 0, 0, id=5)
                elif left == right and right < 0:
                    # Rückwärts fahren
                    cyberpi.led.on(255, 255, 255, id=1)
                    cyberpi.led.on(255, 0, 0, id=2)
                    cyberpi.led.on(255, 0, 0, id=3)
                    cyberpi.led.on(255, 0, 0, id=4)
                    cyberpi.led.on(255, 255, 255, id=5)
                    cyberpi.audio.add_vol(100)
                    cyberpi.audio.play_tone(1000, 0.3)
                elif right < left:
                    # Rechts blinken
                    cyberpi.led.on(255, 0, 0, id=1)
                    cyberpi.led.on(255, 255, 255, id=2)
                    cyberpi.led.on(255, 255, 255, id=3)
                    cyberpi.led.on(255, 255, 255, id=4)
                    cyberpi.led.on(255, 255, 0, id=5)
                    time.sleep(0.05)
                    cyberpi.led.off(id=5)
                elif left < right:
                    # Links blinken
                    cyberpi.led.on(255, 255, 0, id=1)
                    cyberpi.led.on(255, 255, 255, id=2)
                    cyberpi.led.on(255, 255, 255, id=3)
                    cyberpi.led.on(255, 255, 255, id=4)
                    cyberpi.led.on(255, 0, 0, id=5)
                    time.sleep(0.05)
                    cyberpi.led.off(id=1)
        except Exception as exception:
            cyberpi.console.clear()
            cyberpi.console.print("Error processing message:", str(exception))
            cyberpi.led.on(255, 0, 0)
            return None
        return False

    # Statische Funktion, um Daten über den TCP-Socket zurückzusenden
    @staticmethod
    def send_message(self):
        try:
            # String aus den ausgelesenen Sensordaten erstellen
            response_data = {
                # Daten des Gyrosensors (Vorwärts & Rückwärts), x-Achse
                "gyroscopePitch": cyberpi.get_pitch(),
                # Daten des Gyrosensors (Links & Rechts), z-Achse
                "gyroscopeYaw": cyberpi.get_yaw(),
                # Daten des Gyrossensors (Oben & Unten), y-Achse
                "gyroscopeRoll": cyberpi.get_roll(),
                # Daten des Beschleunigungsmessers
                "accelerometer": cyberpi.get_acc("y"),
                # Daten des RGB-Sensors(Lichtsensors), Links
                "rgbSensorLeft": cyberpi.quad_rgb_sensor.get_color(4, index=1),
                # Daten des RGB-Sensors(Lichtsensors), Mitte Links
                "rgbSensorMiddleLeft": cyberpi.quad_rgb_sensor.get_color(3, index=1),
                # Daten des RGB-Sensors(Lichtsensors), Mitte Rechts
                "rgbSensorMiddleRight": cyberpi.quad_rgb_sensor.get_color(2, index=1),
                # Daten des RGB-Sensors(Lichtsensors), Rechts
                "rgbSensorRight": cyberpi.quad_rgb_sensor.get_color(1, index=1),
                # Daten des Ultraschallsensors
                "ultrasonicSensor": cyberpi.ultrasonic2.get(index=1),
                # SuicidePrevention Aktiviert
                "suicideActivated": self.suicideActivated
            }
            # String zu JSON wandeln
            response = json.dumps(response_data)
            if response:
                # JSON-String über TCP-Socket zurücksenden
                self.TCP_socket.send(response.encode('utf-8'))
                cyberpi.console.clear()
                cyberpi.console.print("Message sent to Controller")
        except Exception as exception:
            cyberpi.console.clear()
            cyberpi.console.print("Error at sending message: ", str(exception))
            cyberpi.led.on(255, 0, 0)
            return None


# Main des Scripts
if __name__ == "main1":
    # Controller Klasse initialisieren
    controller = MBotController()
    # Controller Klasse-Funktion starten
    controller.start()
