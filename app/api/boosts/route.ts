// Boost System API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BoostType, TokenType } from '@/lib/generated/prisma';

// GET: Get boosts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const brandId = searchParams.get('brandId');
    const boostId = searchParams.get('boostId');
    const boostType = searchParams.get('boostType');
    const isActive = searchParams.get('isActive');

    if (boostId) {
      const boost = await prisma.boost.findUnique({
        where: { id: boostId },
        include: {
          fromUser: {
            select: {
              id: true,
              displayName: true,
              email: true,
              currentLevel: true,
            },
          },
          toUser: {
            select: {
              id: true,
              displayName: true,
              email: true,
              currentLevel: true,
            },
          },
          fromBrand: {
            select: {
              id: true,
              name: true,
              displayName: true,
              logoUrl: true,
            },
          },
          toBrand: {
            select: {
              id: true,
              name: true,
              displayName: true,
              logoUrl: true,
            },
          },
        },
      });

      if (!boost) {
        return NextResponse.json(
          { error: 'Boost not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ boost });
    }

    // Get boosts given by user or brand
    const boostsGiven = await prisma.boost.findMany({
      where: {
        ...(userId ? { fromUserId: userId } : {}),
        ...(brandId ? { fromBrandId: brandId } : {}),
        ...(boostType ? { boostType: boostType as BoostType } : {}),
        ...(isActive !== null ? { isActive: isActive === 'true' } : {}),
      },
      include: {
        toUser: {
          select: {
            id: true,
            displayName: true,
            currentLevel: true,
          },
        },
        toBrand: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get boosts received by user or brand
    const boostsReceived = await prisma.boost.findMany({
      where: {
        ...(userId ? { toUserId: userId } : {}),
        ...(brandId ? { toBrandId: brandId } : {}),
        ...(boostType ? { boostType: boostType as BoostType } : {}),
        ...(isActive !== null ? { isActive: isActive === 'true' } : {}),
      },
      include: {
        fromUser: {
          select: {
            id: true,
            displayName: true,
            currentLevel: true,
          },
        },
        fromBrand: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ boostsGiven, boostsReceived });

  } catch (error) {
    console.error('Error fetching boosts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boosts' },
      { status: 500 }
    );
  }
}

// POST: Create a boost
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fromUserId,
      fromBrandId,
      toUserId,
      toBrandId,
      boostType,
      principalAmount,
      tokenType = TokenType.BTC,
      expiryDate,
      requiredActiveStatus = 90,
    } = body;

    // Validate source
    if (!fromUserId && !fromBrandId) {
      return NextResponse.json(
        { error: 'fromUserId or fromBrandId required' },
        { status: 400 }
      );
    }

    // Validate target based on boost type
    if (boostType === BoostType.BOOST_BRAND && !toBrandId) {
      return NextResponse.json(
        { error: 'toBrandId required for BOOST_BRAND' },
        { status: 400 }
      );
    }

    if (boostType === BoostType.BOOST_CUSTOMER && !toUserId) {
      return NextResponse.json(
        { error: 'toUserId required for BOOST_CUSTOMER' },
        { status: 400 }
      );
    }

    if (!principalAmount || principalAmount <= 0) {
      return NextResponse.json(
        { error: 'principalAmount must be greater than 0' },
        { status: 400 }
      );
    }

    // Get protocol settings for level-up timer
    const protocolSettings = await prisma.protocolSettings.findFirst();
    const levelUpTimerHours = protocolSettings?.levelUpTimerHours || 24;

    // Calculate level-up timer (24 hours from now)
    const levelUpTimer = new Date();
    levelUpTimer.setHours(levelUpTimer.getHours() + levelUpTimerHours);

    // Create boost
    const boost = await prisma.boost.create({
      data: {
        fromUserId,
        fromBrandId,
        toUserId,
        toBrandId,
        boostType,
        principalAmount,
        tokenType,
        expiryDate,
        levelUpTimer,
        requiredActiveStatus,
      },
    });

    // Update deposit boost settings if applicable
    if (fromUserId && boostType === BoostType.BOOST_BRAND && toBrandId) {
      // User boosting brand - update user's deposits
      await prisma.deposit.updateMany({
        where: {
          userId: fromUserId,
          boostSetting: BoostType.BOOST_ME, // Only update deposits set to BOOST_ME
        },
        data: {
          boostSetting: BoostType.BOOST_BRAND,
        },
      });
    }

    // Create transaction record
    const description = boostType === BoostType.BOOST_CUSTOMER
      ? `Brand boosted customer with ${principalAmount} ${tokenType}`
      : boostType === BoostType.BOOST_BRAND
      ? `Customer boosted brand with ${principalAmount} ${tokenType}`
      : boostType === BoostType.BOOST_NETWORK
      ? `Brand allocated ${principalAmount} ${tokenType} to reward pool`
      : `Self-boost with ${principalAmount} ${tokenType}`;

    await prisma.transaction.create({
      data: {
        userId: fromUserId || toUserId!,
        type: 'STAKE',
        amount: principalAmount,
        tokenType,
        description,
      },
    });

    return NextResponse.json({ boost }, { status: 201 });

  } catch (error) {
    console.error('Error creating boost:', error);
    return NextResponse.json(
      { error: 'Failed to create boost' },
      { status: 500 }
    );
  }
}

// PATCH: Update boost (change settings, deactivate, update active status)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      boostId,
      isActive,
      currentActiveStatus,
      principalAmount,
      expiryDate,
    } = body;

    if (!boostId) {
      return NextResponse.json(
        { error: 'boostId required' },
        { status: 400 }
      );
    }

    const boost = await prisma.boost.findUnique({
      where: { id: boostId },
    });

    if (!boost) {
      return NextResponse.json(
        { error: 'Boost not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      lastActiveCheck: new Date(),
    };

    if (isActive !== undefined) {
      updateData.isActive = isActive;

      // If deactivating, revert deposits to BOOST_ME
      if (!isActive && boost.fromUserId && boost.boostType === BoostType.BOOST_BRAND) {
        await prisma.deposit.updateMany({
          where: {
            userId: boost.fromUserId,
            boostSetting: BoostType.BOOST_BRAND,
          },
          data: {
            boostSetting: BoostType.BOOST_ME,
          },
        });
      }
    }

    if (currentActiveStatus !== undefined) {
      updateData.currentActiveStatus = currentActiveStatus;

      // Check if active status dropped below required threshold
      if (boost.boostType === BoostType.BOOST_CUSTOMER) {
        if (currentActiveStatus < boost.requiredActiveStatus) {
          // Reduce boost amount by half
          const newAmount = boost.principalAmount / 2;
          updateData.principalAmount = newAmount;
        } else {
          // Restore to original amount if it was previously reduced
          // (This logic would need to track original amount separately)
        }
      }
    }

    if (principalAmount !== undefined) {
      updateData.principalAmount = principalAmount;
    }

    if (expiryDate !== undefined) {
      updateData.expiryDate = expiryDate;
    }

    const updatedBoost = await prisma.boost.update({
      where: { id: boostId },
      data: updateData,
    });

    return NextResponse.json({ boost: updatedBoost });

  } catch (error) {
    console.error('Error updating boost:', error);
    return NextResponse.json(
      { error: 'Failed to update boost' },
      { status: 500 }
    );
  }
}

// DELETE: Cancel/remove a boost
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boostId = searchParams.get('boostId');

    if (!boostId) {
      return NextResponse.json(
        { error: 'boostId required' },
        { status: 400 }
      );
    }

    const boost = await prisma.boost.findUnique({
      where: { id: boostId },
    });

    if (!boost) {
      return NextResponse.json(
        { error: 'Boost not found' },
        { status: 404 }
      );
    }

    // If brand boosting customer, check if expired
    if (boost.boostType === BoostType.BOOST_CUSTOMER && boost.expiryDate) {
      const now = new Date();
      const isExpired = now >= boost.expiryDate;

      if (isExpired) {
        // Principal stays with brand, defaults to BOOST_ME
        // No transfer needed, just delete boost record
      } else {
        return NextResponse.json(
          { error: 'Cannot cancel boost before expiry date' },
          { status: 400 }
        );
      }
    }

    // Revert deposits if user was boosting brand
    if (boost.fromUserId && boost.boostType === BoostType.BOOST_BRAND) {
      await prisma.deposit.updateMany({
        where: {
          userId: boost.fromUserId,
          boostSetting: BoostType.BOOST_BRAND,
        },
        data: {
          boostSetting: BoostType.BOOST_ME,
        },
      });
    }

    await prisma.boost.delete({
      where: { id: boostId },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting boost:', error);
    return NextResponse.json(
      { error: 'Failed to delete boost' },
      { status: 500 }
    );
  }
}

