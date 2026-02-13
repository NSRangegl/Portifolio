import prisma from './src/config/database';

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { username: true }
        });
        console.log('Current users in DB:', users);
    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
