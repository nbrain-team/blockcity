// Debug script to check user and company data
// Run in Render Shell: cd /opt/render/project/src && node debug-user.js

const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function debug() {
  try {
    console.log('\n=== ROGUE VANS COMPANY ===');
    const company = await prisma.company.findUnique({
      where: { username: 'roguevans' },
      include: {
        users: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!company) {
      console.log('❌ Rogue Vans company not found!');
      return;
    }

    console.log('Company ID:', company.id);
    console.log('Company Name:', company.name);
    console.log('Company Username:', company.username);
    console.log('Company Email:', company.email);
    console.log('Logo URL:', company.logoUrl);
    console.log('Program Name:', company.programName);
    console.log('\n=== CLIENTS ===');
    console.log('Total Clients:', company.users.length);
    
    if (company.users.length > 0) {
      console.log('\nClient Details:');
      company.users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
        console.log('   Email:', user.email);
        console.log('   Wallet:', user.walletAddress || 'N/A');
        console.log('   Dynamic ID:', user.dynamicUserId || 'N/A');
        console.log('   Company ID:', user.companyId);
        console.log('   Created:', user.createdAt);
      });
    } else {
      console.log('No clients found yet.');
    }

    console.log('\n=== ALL USERS (for debugging) ===');
    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`Total users in database: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.email}`);
      console.log('   Company ID:', user.companyId || 'NONE - NOT LINKED!');
      console.log('   Dynamic ID:', user.dynamicUserId || 'N/A');
      console.log('   Wallet:', user.walletAddress || 'N/A');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debug();

