import prisma from './src/config/database';
import bcrypt from 'bcrypt';

async function testPassword() {
    const username = 'natansrangel@gmail.com';
    const password = 'Santos*1950';

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            console.log('User not found');
            return;
        }

        const isValid = await bcrypt.compare(password, user.password);
        console.log(`Password test for ${username}: ${isValid ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
        console.error('Error testing password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPassword();
