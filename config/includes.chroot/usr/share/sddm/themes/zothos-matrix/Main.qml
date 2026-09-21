import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15
import SddmComponents 2.0

Rectangle {
    id: root
    width: 1920
    height: 1080
    color: "#04060b"

    Image {
        id: bgImage
        anchors.fill: parent
        source: config.background || "/usr/share/backgrounds/zothos/zoth-gold-master.png"
        fillMode: Image.PreserveAspectCrop
        opacity: 0.85
    }

    Rectangle {
        anchors.fill: parent
        color: Qt.rgba(4/255, 6/255, 11/255, 0.55)
    }

    // Top Header Status Bar
    RowLayout {
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margin: 24
        spacing: 16

        Text {
            text: "🜂 ZOTHOS SOVEREIGN OS // KDE PLASMA 6"
            color: "#00ff9d"
            font.family: "JetBrains Mono"
            font.pixelSize: 14
            font.bold: true
        }

        Item { Layout.fillWidth: true }

        Text {
            id: timeLabel
            text: Qt.formatDateTime(new Date(), "ddd dd MMM  hh:mm:ss")
            color: "#ffd700"
            font.family: "JetBrains Mono"
            font.pixelSize: 14
            font.bold: true
            Timer {
                interval: 1000
                running: true
                repeat: true
                onTriggered: timeLabel.text = Qt.formatDateTime(new Date(), "ddd dd MMM  hh:mm:ss")
            }
        }
    }

    // Center Login Card
    Rectangle {
        id: loginCard
        width: 420
        height: 480
        anchors.centerIn: parent
        color: Qt.rgba(6/255, 10/255, 18/255, 0.94)
        border.color: "#00ff9d"
        border.width: 1.5
        radius: 18

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 32
            spacing: 20

            // 3D Golden Azoth Emblem Avatar
            Image {
                id: avatar
                Layout.alignment: Qt.AlignHCenter
                Layout.preferredWidth: 104
                Layout.preferredHeight: 104
                source: config.logo || "/usr/share/icons/hicolor/512x512/apps/zoth-studio.png"
                fillMode: Image.PreserveAspectFit
            }

            Text {
                Layout.alignment: Qt.AlignHCenter
                text: "NEO // SOVEREIGN ARCHITECT"
                color: "#f1f5f9"
                font.family: "JetBrains Mono"
                font.pixelSize: 13
                font.bold: true
            }

            TextBox {
                id: passwordInput
                Layout.fillWidth: true
                echoMode: TextInput.Password
                font.family: "JetBrains Mono"
                font.pixelSize: 12
                textColor: "#ffffff"
                borderColor: "#00ff9d"
                focus: true

                Keys.onPressed: {
                    if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                        sddm.login("neo", passwordInput.text, sessionCombo.currentIndex)
                    }
                }
            }

            ComboBox {
                id: sessionCombo
                Layout.fillWidth: true
                model: sessionModel
                index: sessionModel.lastIndex
                font.family: "JetBrains Mono"
                font.pixelSize: 11
            }

            Button {
                Layout.fillWidth: true
                text: "AUTHENTICATE RING-0"
                onClicked: sddm.login("neo", passwordInput.text, sessionCombo.currentIndex)
            }
        }
    }
}
