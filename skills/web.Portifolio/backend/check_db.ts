import prisma from './src/config/database';

async function checkUser() {
    try {
        const users = await prisma.user.findMany();
        console.log('--- Database Users ---');
        console.log(users.map(u => ({ id: u.id, username: u.username })));
        console.log('----------------------');
    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
