import dgram from 'dgram';

const MagickPacket = (MacAddress) => {
    if (MacAddress != null) {
        // Normalize the MAC address by removing ':' and '-'
        let normalizedMac = MacAddress.replace(/[:-]/g, '');
        
        // Ensure the MAC address is exactly 12 characters long
        if (normalizedMac.length !== 12) {
            throw new Error('Invalid MAC address format');
        }

        let packet = new Uint8Array(102);
        let macAddress = new Uint8Array(6);

        // Convert the normalized MAC address into bytes
        for (let i = 0; i < 6; i++) {
            macAddress[i] = parseInt(normalizedMac.substr(i * 2, 2), 16);
        }

        // Fill the packet with the magic packet structure
        for (let i = 0; i < 6; i++) {
            packet[i] = 0xFF;
        }
        for (let i = 1; i <= 16; i++) {
            for (let j = 0; j < 6; j++) {
                packet[i * 6 + j] = macAddress[j];
            }
        }

        return packet;
    }
}


const SendMagickPacket = (packet, broadcastAddress = '255.255.255.255', port = 9) => {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');

        client.on('error', (err) => {
            client.close();
            reject(err);
        });

        client.send(packet, 0, packet.length, port, broadcastAddress, (err) => {
            client.close();
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

const CheckDeviceStatus = (ipAddress) => {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');

        client.on('error', (err) => {
            client.close();
            reject(err);
        });

        client.on('message', (msg) => {
            client.close();
            resolve(true);
        });

        client.send('status', 0, 6, 9, ipAddress, (err) => {
            if (err) {
                client.close();
                reject(err);
            }
        });
    });
}


export { MagickPacket, SendMagickPacket, CheckDeviceStatus };