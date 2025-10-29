// Script to create Rogue Vans company in the database
const { PrismaClient } = require('./lib/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if Rogue Vans already exists
    const existing = await prisma.company.findUnique({
      where: { username: 'roguevans' }
    });

    if (existing) {
      console.log('Rogue Vans company already exists!');
      console.log('Company ID:', existing.id);
      console.log('Public invite page: http://localhost:3000/company/roguevans');
      return;
    }

    // Create Rogue Vans company
    const rogueVans = await prisma.company.create({
      data: {
        name: 'Rogue Vans',
        email: 'me@chrisjsnook.com',
        username: 'roguevans',
        rewardRate: 0.01, // 1% rewards
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

    console.log('✅ Rogue Vans company created successfully!');
    console.log('\nCompany Details:');
    console.log('- ID:', rogueVans.id);
    console.log('- Name:', rogueVans.name);
    console.log('- Email:', rogueVans.email);
    console.log('- Username:', rogueVans.username);
    console.log('- Reward Rate:', rogueVans.rewardRate * 100 + '%');
    console.log('\nLogin Credentials:');
    console.log('- Username: roguevans');
    console.log('- Password: 123456');
    console.log('\nPublic Invite Page:');
    console.log('- Local: http://localhost:3000/company/roguevans');
    console.log('- Production: https://your-domain.com/company/roguevans');
  } catch (error) {
    console.error('Error creating Rogue Vans company:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();

