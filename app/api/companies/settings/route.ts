import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        username: true,
        programName: true,
        programDetails: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, name, username, programName, programDetails, logoUrl, primaryColor, secondaryColor, fontFamily } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Validate username format (alphanumeric and dashes only)
    if (username && !/^[a-zA-Z0-9-]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and dashes' },
        { status: 400 }
      );
    }

    // Check if username is already taken by another company
    if (username) {
      const existingCompany = await prisma.company.findFirst({
        where: {
          username,
          NOT: { id: companyId },
        },
      });

      if (existingCompany) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name,
        username,
        programName,
        programDetails,
        logoUrl,
        primaryColor,
        secondaryColor,
        fontFamily,
      },
      select: {
        id: true,
        name: true,
        username: true,
        programName: true,
        programDetails: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company settings:', error);
    return NextResponse.json(
      { error: 'Failed to update company settings' },
      { status: 500 }
    );
  }
}

