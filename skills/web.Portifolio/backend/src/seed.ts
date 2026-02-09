import prisma from './config/database';
import bcrypt from 'bcrypt';

async function seed() {
    console.log('🌱 Starting database seed...');

    try {
        // Create admin user
        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

        const admin = await prisma.user.upsert({
            where: { username: process.env.ADMIN_USERNAME || 'admin' },
            update: {
                password: adminPassword,
            },
            create: {
                username: process.env.ADMIN_USERNAME || 'admin',
                password: adminPassword,
            },
        });

        console.log('✅ Admin user created:', admin.username);

        // Create sample projects
        const project1 = await prisma.project.create({
            data: {
                title: 'Sales Dashboard Analysis',
                description: 'Comprehensive sales performance analysis using Power BI. This dashboard provides insights into revenue trends, top-performing products, and regional sales distribution.',
                tags: ['Power BI', 'SQL', 'Data Visualization'],
            },
        });

        const project2 = await prisma.project.create({
            data: {
                title: 'Customer Segmentation Study',
                description: 'Python-based customer segmentation analysis using K-means clustering. Identified 5 distinct customer segments based on purchasing behavior and demographics.',
                tags: ['Python', 'Machine Learning', 'Pandas'],
            },
        });

        const project3 = await prisma.project.create({
            data: {
                title: 'Financial Reporting Automation',
                description: 'Automated monthly financial reporting system using Excel and Python. Reduced report generation time by 80%.',
                tags: ['Excel', 'Python', 'Automation'],
            },
        });

        console.log('✅ Sample projects created');
        console.log(`   - ${project1.title}`);
        console.log(`   - ${project2.title}`);
        console.log(`   - ${project3.title}`);

        console.log('\n🎉 Database seeded successfully!');
        console.log(`\n📝 Admin credentials:`);
        console.log(`   Username: ${admin.username}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

    } catch (error) {
        console.error('❌ Seed error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seed();
