// BitProfile API Routes

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateProfileId, validateUsername, generateProfileUrl } from '@/lib/bitprofile';

// GET: Get BitProfile by profileId or username
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const type = searchParams.get('type'); // 'user' or 'brand'

    if (!profileId && !username && !email) {
      return NextResponse.json(
        { error: 'profileId, username, or email required' },
        { status: 400 }
      );
    }

    let profile;

    if (type === 'brand' || (!type && username)) {
      // Try to find brand first
      profile = await prisma.company.findFirst({
        where: {
          OR: [
            profileId ? { profileId } : {},
            username ? { username } : {},
            email ? { email } : {},
          ].filter(obj => Object.keys(obj).length > 0),
        },
        include: {
          wallets: true,
          posts: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          products: {
            where: { isActive: true },
            take: 5,
          },
          followers: {
            take: 100,
          },
        },
      });

      if (profile) {
        return NextResponse.json({
          type: 'brand',
          profile: {
            ...profile,
            profileUrl: generateProfileUrl(profile.username || profile.profileId || ''),
          },
        });
      }
    }

    // Try to find user
    profile = await prisma.user.findFirst({
      where: {
        OR: [
          profileId ? { profileId } : {},
          email ? { email } : {},
        ].filter(obj => Object.keys(obj).length > 0),
      },
      include: {
        wallets: true,
        posts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        following: {
          take: 100,
        },
        followers: {
          take: 100,
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      type: 'user',
      profile,
    });

  } catch (error) {
    console.error('Error fetching BitProfile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST: Create or update BitProfile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      companyId,
      displayName,
      bio,
      bannerUrl,
      profilePictureUrl,
      logoUrl,
      username,
    } = body;

    if (!userId && !companyId) {
      return NextResponse.json(
        { error: 'userId or companyId required' },
        { status: 400 }
      );
    }

    // Validate username if provided
    if (username && !validateUsername(username)) {
      return NextResponse.json(
        { error: 'Invalid username format. Must be 3-30 alphanumeric characters with hyphens.' },
        { status: 400 }
      );
    }

    let profile;

    if (companyId) {
      // Update brand profile
      const existingBrand = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!existingBrand) {
        return NextResponse.json(
          { error: 'Brand not found' },
          { status: 404 }
        );
      }

      profile = await prisma.company.update({
        where: { id: companyId },
        data: {
          profileId: existingBrand.profileId || generateProfileId(),
          displayName,
          bio,
          bannerUrl,
          logoUrl,
          username,
        },
      });

      return NextResponse.json({
        type: 'brand',
        profile: {
          ...profile,
          profileUrl: generateProfileUrl(profile.username || profile.profileId || ''),
        },
      });
    } else {
      // Update user profile
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      profile = await prisma.user.update({
        where: { id: userId },
        data: {
          profileId: existingUser.profileId || generateProfileId(),
          displayName,
          bio,
          bannerUrl,
          profilePictureUrl,
        },
      });

      return NextResponse.json({
        type: 'user',
        profile,
      });
    }

  } catch (error) {
    console.error('Error updating BitProfile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// PATCH: Update TVL and metrics
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, companyId, metrics } = body;

    if (!userId && !companyId) {
      return NextResponse.json(
        { error: 'userId or companyId required' },
        { status: 400 }
      );
    }

    if (companyId) {
      const profile = await prisma.company.update({
        where: { id: companyId },
        data: metrics,
      });

      return NextResponse.json({ profile });
    } else {
      const profile = await prisma.user.update({
        where: { id: userId },
        data: metrics,
      });

      return NextResponse.json({ profile });
    }

  } catch (error) {
    console.error('Error updating metrics:', error);
    return NextResponse.json(
      { error: 'Failed to update metrics' },
      { status: 500 }
    );
  }
}

