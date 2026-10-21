import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function MQTTTest() {
  const [client, setClient] = useState(null);
  const [status, setStatus] = useState("DISCONNECTED");

  useEffect(() => {
    console.log("MQTT PAGE LOADED");

    const mqttClient = mqtt.connect("ws://broker.emqx.io:8083/mqtt", {
      clientId: "web_tiramitech_" + Math.random().toString(16).slice(2),
      clean: true,
      reconnectPeriod: 1000,
    });

    mqttClient.on("connect", () => {
      console.log("MQTT CONNECTED");
      setStatus("CONNECTED");
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT ERROR", err);
      setStatus("ERROR");
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  // ===== RELAY 1 =====
  const relay1On = () => {
    console.log("RELAY 1 ON (FROM WEB)");
    if (!client) return;
    client.publish(
      "cmnd/Tiramitech_Tasmota_Salsabila_04/POWER1",
      "ON"
    );
  };

  const relay1Off = () => {
    console.log("RELAY 1 OFF (FROM WEB)");
    if (!client) return;
    client.publish(
      "cmnd/Tiramitech_Tasmota_Salsabila_04/POWER1",
      "OFF"
    );
  };

  // ===== RELAY 2 =====
  const relay2On = () => {
    console.log("RELAY 2 ON (FROM WEB)");
    if (!client) return;
    client.publish(
      "cmnd/Tiramitech_Tasmota_Salsabila_04/POWER2",
      "ON"
    );
  };

  const relay2Off = () => {
    console.log("RELAY 2 OFF (FROM WEB)");
    if (!client) return;
    client.publish(
      "cmnd/Tiramitech_Tasmota_Salsabila_04/POWER2",
      "OFF"
    );
  };


  // ===== RELAY 3 =====
  const relay3On = () => {
    console.log("RELAY 3 ON (FROM WEB)");
    if (!client) return;
    client.publish(
      "cmnd/Tiramitech_Tasmota_Salsabila_04/POWER3",
      "ON"
    );
  };

  const relay3Off = () => {
    console.log("RELAY 3 OFF (FROM WEB)");
    if (!client) return;
    client.publish(
      "cmnd/Tiramitech_Tasmota_Salsabila_04/POWER3",
      "OFF"
    );
  };


  return (
    <div style={{ padding: 40 }}>
      <h1>MQTT TEST PAGE</h1>
      <p>Status MQTT: {status}</p>

      <h3>Relay 1</h3>
      <button onClick={relay1On}>ON</button>
      <button onClick={relay1Off} style={{ marginLeft: 10 }}>
        OFF
      </button>

      <h3 style={{ marginTop: 20 }}>Relay 2</h3>
      <button onClick={relay2On}>ON</button>
      <button onClick={relay2Off} style={{ marginLeft: 10 }}>
        OFF
      </button> 

      <h3 style={{ marginTop: 20 }}>Relay 3</h3>
      <button onClick={relay3On}>ON</button>
        <button onClick={relay3Off} style={{ marginLeft: 10 }}>
          OFF
        </button>
    </div>
  );
}
