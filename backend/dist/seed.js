"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding Areas...');
    await prisma.area.createMany({
        data: [
            {
                id: 'hindmata',
                name: 'Hindmata (Ward F/S)',
                ward: 'Hindmata',
                zone: 'Island City Mumbai',
                description: 'Central transit hub prone to river swelling and rapid urban runoff.',
                waterDepthCm: 85,
                rainfallMmHr: 112,
                drainageCapacityPct: 99,
                timeToCriticalMins: 5,
                status: 'CRITICAL',
                centerLat: 19.0163,
                centerLng: 72.8427,
            },
            {
                id: 'andheri',
                name: 'Andheri Subway (Ward K/W)',
                ward: 'Andheri',
                zone: 'Western Suburbs',
                description: 'Subway tunnel resulting in high-velocity flash runoff into catchments.',
                waterDepthCm: 110,
                rainfallMmHr: 95,
                drainageCapacityPct: 92,
                timeToCriticalMins: 15,
                status: 'WARNING',
                centerLat: 19.1197,
                centerLng: 72.8466,
            },
            {
                id: 'kurla',
                name: 'Kurla Mithi River',
                ward: 'Kurla L Ward',
                zone: 'Eastern Suburbs',
                description: 'Major transit hub with river causing localized waterlogging.',
                waterDepthCm: 65,
                rainfallMmHr: 75,
                drainageCapacityPct: 86,
                timeToCriticalMins: 35,
                status: 'WARNING',
                centerLat: 19.0728,
                centerLng: 72.8796,
            }
        ],
        skipDuplicates: true,
    });
    console.log('Seeding Sensors...');
    await prisma.sensor.createMany({
        data: [
            {
                id: 'S-01',
                type: 'depth',
                status: 'active',
                value: 12,
                unit: 'cm',
                lat: 19.0163,
                lng: 72.8427,
                batteryPct: 94,
            },
            {
                id: 'S-02',
                type: 'flow',
                status: 'active',
                value: 1.4,
                unit: 'm³/s',
                lat: 19.1197,
                lng: 72.8466,
                batteryPct: 88,
            },
            {
                id: 'S-03',
                type: 'rain_gauge',
                status: 'active',
                value: 45,
                unit: 'mm/h',
                lat: 19.0728,
                lng: 72.8796,
                batteryPct: 99,
            },
        ],
        skipDuplicates: true,
    });
    console.log('Seeding complete!');
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
