// Render Shell Script: Create Rogue Vans Company
// Run this in Render Shell: cd /opt/render/project/src && node create-rogue-vans-render.js

const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function createRogueVans() {
  try {
    console.log('🔍 Checking if Rogue Vans already exists...');
    
    const existing = await prisma.company.findUnique({
      where: { username: 'roguevans' }
    });

    if (existing) {
      console.log('✅ Rogue Vans company already exists!');
      console.log('\n📋 Company Details:');
      console.log('   ID:', existing.id);
      console.log('   Name:', existing.name);
      console.log('   Email:', existing.email);
      console.log('   Username:', existing.username);
      console.log('\n🔐 Login Credentials:');
      console.log('   Username: roguevans');
      console.log('   Password: 123456');
      console.log('   Login URL: https://blockcity.onrender.com/company/login');
      console.log('\n🌐 Public Invite Page:');
      console.log('   https://blockcity.onrender.com/company/roguevans');
      await prisma.$disconnect();
      return;
    }

    console.log('📝 Creating Rogue Vans company...');
    
    const company = await prisma.company.create({
      data: {
        name: 'Rogue Vans',
        email: 'me@chrisjsnook.com',
        username: 'roguevans',
        rewardRate: 0.01,
        programName: 'Rogue Vans Rewards Program',
        programDetails: `Welcome to the Rogue Vans Rewards Program!

We're excited to have you join our exclusive rewards community. As a valued customer of Rogue Vans, you'll earn Bitcoin rewards on every purchase you make.

How it works:
• Connect your crypto wallet to get started
• Earn 1% Bitcoin rewards on all purchases
• Watch your rewards grow over time
• Redeem or stake your Bitcoin anytime

Thank you for choosing Rogue Vans. Let's hit the road together!`,
        logoUrl: '/RogueVehicleCo_AlternateLogo_Black.png',
        isActive: true,
      },
    });

    console.log('\n✅ SUCCESS! Rogue Vans company created!');
    console.log('\n📋 Company Details:');
    console.log('   ID:', company.id);
    console.log('   Name:', company.name);
    console.log('   Email:', company.email);
    console.log('   Username:', company.username);
    console.log('   Reward Rate:', (company.rewardRate * 100) + '%');
    console.log('\n🔐 Login Credentials:');
    console.log('   Username: roguevans');
    console.log('   Password: 123456');
    console.log('   Login URL: https://blockcity.onrender.com/company/login');
    console.log('\n🌐 Public Invite Page:');
    console.log('   https://blockcity.onrender.com/company/roguevans');
    console.log('\n📝 Next Steps:');
    console.log('   1. Login at: https://blockcity.onrender.com/company/login');
    console.log('   2. Share invite page: https://blockcity.onrender.com/company/roguevans');
    console.log('   3. Track clients in your company dashboard');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createRogueVans();


