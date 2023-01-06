document.addEventListener("DOMContentLoaded", init);

async function init() {
    await writeMessageToDevice('6e400001-b5a3-f393-e0a9-e50e24dcca9e', 'hello world pc');
}

async function writeMessageToDevice(uuid, message) {
    let button = document.querySelector(".btn-default");
    button.addEventListener('click', async function(event) {
        // Replace 'heart_rate' with the UUID of the service you want to access.
        navigator.bluetooth.requestDevice({acceptAllDevices: true, optionalServices: [uuid]})
            .then(device => {
                // Human-readable name of the device.
                console.log(device.name);

                // Attempts to connect to remote GATT Server.
                return device.gatt.connect();
            })
            .then(server => server.getPrimaryService(uuid))
            .then(service => service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'))
            .then(async characteristic => {
                // Write data to the device.
                // In this example, we create a typed array containing the byte value 1.
                // This could be replaced with any data you want to send to the device.

                for (let i = 0; i < 10000; i++) {
                    const data = new Uint8Array(message.split('').map(c => c.charCodeAt(0)));
                    await characteristic.writeValue(data);
                }

            })
            .then(_ => {
                console.log('Data has been sent to the device.');
            })
            .catch(error => {
                console.error(error);
            });
    });
}